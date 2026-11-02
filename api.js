const express= require('express');
const cors= require('cors');
require("dotenv").config();

const app= express();

// para que otros sitios / origenes puedan hacer peticiones a nuestro servidor
app.use(cors());
app.use(express.json());


const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = pool;

const PORT= 3000;


app.get("/",(req, res)=>{


     console.log("Llegó una petición GET a /");


   res.json({
    message: "Bienvenido al servidor de la aplicacion movil",
    status: "ok"
   });

});





//-------------------------LOGIN---------------------------------------
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "El email y la contraseña son obligatorios"
        });
    }

    try {
    const resultado = await pool.query(
        `SELECT id_usuario, nombre, apellido, email, rol, estado
         FROM usuarios
         WHERE email = $1 AND password = $2`,
        [email, password]
    );

    if (resultado.rows.length === 0) {
        return res.status(401).json({
            message: "Email o contraseña incorrectos"
        });
    }

    const usuario = resultado.rows[0];

    if (!usuario.estado) {
        return res.status(403).json({
            message: "Tu cuenta está inactiva"
        });
    }

    res.status(200).json({
        message: "Login exitoso",
        usuario: usuario
    });

} catch (error) {
    console.error("Error en el login:", error);

    res.status(500).json({
        message: "Error interno del servidor"
    });
}

});



//home
app.get("/consumirProductosProximaFeria", async (req, res) => {

    try {
        const resultado = await pool.query(
            `SELECT
                pr.id_producto,
                pr.id_puesto,
                pr.nombre,
                pr.descripcion,
                pr.precio,
                pr.imagen_url,
                pr.estado,
                pr.destacado,
                pu.nombre AS nombre_puesto,
                pu.categoria
            FROM productos pr
            INNER JOIN puestos pu
                ON pu.id_puesto = pr.id_puesto
            INNER JOIN inscripciones_ferias i
                ON i.id_puesto = pu.id_puesto
            INNER JOIN ferias f
                ON f.id_feria = i.id_feria
            WHERE pr.destacado = TRUE
              AND pr.estado = TRUE
              AND pu.estado = TRUE
              AND i.estado = 'aprobado'
              AND f.id_feria = (
                  SELECT id_feria
                  FROM ferias
                  WHERE fecha_fin >= CURRENT_DATE
                  ORDER BY fecha_inicio ASC
                  LIMIT 1
              )
            ORDER BY pr.id_producto DESC`
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error(
            "Error al obtener los productos destacados de la próxima feria:",
            error
        );

        return res.status(500).json({
            mensaje: "Error al obtener los productos destacados de la próxima feria."
        });
    }
});

//-------------------ADMISTRADOR-----------------------------------------
//ADMINISTRADOR - FERIAS
app.post("/insertarFeria", async (req, res) => {

 
    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        ubicacion,
        imagen_url,
        id_administrador
    } = req.body;


       console.log("pego en insertar nueva feria. Id usuario admin: ",id_administrador)
    if (!nombre || !fecha_inicio || !fecha_fin || !ubicacion || !id_administrador) {
        return res.status(400).json({
            message: "Faltan datos obligatorios para crear la feria"
        });
    }

    try {

        const resultado = await pool.query(
            `INSERT INTO ferias (
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                imagen_url,
                id_administrador
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                nombre,
                descripcion || null,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                imagen_url || null,
                id_administrador
            ]
        );

        res.status(201).json({
            message: "Feria creada correctamente",
            feria: resultado.rows[0]
        });

    } catch (error) {

        console.error("Error al crear la feria:", error);

        res.status(500).json({
            message: "Error al crear la feria"
        });

    }

});

//se trata de las proximas ferias, las que no han finalizado, para que los puesteros puedan inscribirse
app.get("/obtenerFerias", async (req, res) => {


   console.log("Pego en el endpoint obtene ferias")
   
    try {
        const resultado = await pool.query(
            `SELECT *
             FROM ferias
             WHERE fecha_fin >= CURRENT_DATE
             ORDER BY fecha_inicio ASC`
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No hay ferias próximas disponibles"
            });
        }

       res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Error al obtener proximas feria:", error);

        res.status(500).json({
            message: "Error al obtener próximas feria"
        });
    }
});

//se trata de todas las ferias, para que el administrador pueda verlas y administrarlas
app.get("/obtenerTodasLasFerias", async (req, res) => {

    console.log("Pego en el endpoint obtener todas las ferias");

    try {
        const resultado = await pool.query(
            `SELECT *
             FROM ferias
             ORDER BY fecha_inicio ASC`
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Error al obtener todas las ferias:", error);

        return res.status(500).json({
            message: "Error al obtener todas las ferias"
        });
    }
});

app.get("/obtenerSolicitudesFeria", async (req, res) => {

    const { id_feria } = req.query;

    if (!id_feria) {
        return res.status(400).json({
            message: "Falta el ID de la feria"
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT
                i.id_inscripcion,
                i.id_feria,
                i.estado,
                i.fecha_solicitud,
                i.fecha_respuesta,
                i.observaciones,

                p.id_puesto,
                p.nombre AS nombre_puesto,
                p.descripcion AS descripcion_puesto,
                p.categoria,

                COALESCE(
                    STRING_AGG(
                        DISTINCT rp.nombre,
                        ' & '
                        ORDER BY rp.nombre
                    ),
                    'Sin referente'
                ) AS nombre_referente,

                u.id_usuario,
                u.nombre AS nombre_puestero,
                u.apellido AS apellido_puestero,
                u.email

            FROM inscripciones_ferias i

            INNER JOIN puestos p
                ON p.id_puesto = i.id_puesto

            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario

            LEFT JOIN referentes_puesto rp
                ON rp.id_puesto = p.id_puesto

            WHERE i.id_feria = $1

            GROUP BY
                i.id_inscripcion,
                i.id_feria,
                i.estado,
                i.fecha_solicitud,
                i.fecha_respuesta,
                i.observaciones,
                p.id_puesto,
                p.nombre,
                p.descripcion,
                p.categoria,
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.email

            ORDER BY
                CASE
                    WHEN i.estado = 'pendiente' THEN 0
                    ELSE 1
                END,
                i.fecha_solicitud ASC`,
            [id_feria]
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Error al obtener solicitudes:", error);

        return res.status(500).json({
            message: "Error al obtener las solicitudes de la feria"
        });
    }
});

app.put("/actualizarEstadoInscripcion", async (req, res) => {
    const { id_inscripcion, estado } = req.body;

    if (!id_inscripcion || !["aprobado", "rechazado"].includes(estado)) {
        return res.status(400).json({
            mensaje: "El ID de inscripción o el estado son inválidos."
        });
    }

    try {
        const resultado = await pool.query(
            `UPDATE inscripciones_ferias
             SET estado = $1,
                 fecha_respuesta = CURRENT_TIMESTAMP
             WHERE id_inscripcion = $2
             RETURNING id_inscripcion, id_feria, id_puesto,
                       estado, fecha_solicitud, fecha_respuesta`,
            [estado, id_inscripcion]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontró la solicitud de inscripción."
            });
        }

        return res.status(200).json({
            mensaje: "Estado de la solicitud actualizado correctamente.",
            solicitud: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al actualizar la inscripción:", error);

        return res.status(500).json({
            mensaje: "Error interno al actualizar el estado de la solicitud."
        });
    }
});

app.put("/actualizarFeria/:id", async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        ubicacion,
        imagen_url,
        estado
    } = req.body;

    console.log("Pego en actualizar feria. ID:", id);

    if (
        !id ||
        !nombre ||
        !fecha_inicio ||
        !fecha_fin ||
        !ubicacion ||
        !["publicada", "eliminada"].includes(estado)
    ) {
        return res.status(400).json({
            message: "Faltan datos obligatorios o el estado es inválido."
        });
    }

    try {

        const resultado = await pool.query(
            `UPDATE ferias
             SET nombre = $1,
                 descripcion = $2,
                 fecha_inicio = $3,
                 fecha_fin = $4,
                 ubicacion = $5,
                 imagen_url = $6,
                 estado = $7
             WHERE id_feria = $8
             RETURNING *`,
            [
                nombre,
                descripcion || null,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                imagen_url || null,
                estado,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No se encontró la feria."
            });
        }

        return res.status(200).json({
            message: "Feria actualizada correctamente",
            feria: resultado.rows[0]
        });

    } catch (error) {

        console.error("Error al actualizar la feria:", error);

        return res.status(500).json({
            message: "Error al actualizar la feria"
        });

    }

});

app.put("/eliminarFeria/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `UPDATE ferias
             SET estado = 'eliminada'
             WHERE id_feria = $1
             RETURNING id_feria`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No se encontró la feria."
            });
        }

        res.status(200).json({
            message: "Feria dada de baja correctamente."
        });

    } catch (error) {
        console.error("Error al dar de baja la feria:", error);

        res.status(500).json({
            message: "Error al dar de baja la feria."
        });
    }
});

app.get("/proximaFeria", async (req, res) => {
   
    try {
        const resultado = await pool.query(
            `SELECT *
             FROM ferias
             WHERE fecha_fin >= CURRENT_DATE
             ORDER BY fecha_inicio ASC
             LIMIT 1`
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No hay ferias próximas disponibles"
            });
        }

        res.status(200).json({
            feria: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al obtener la próxima feria:", error);

        res.status(500).json({
            message: "Error al obtener la próxima feria"
        });
    }
});

app.get("/obtenerPuestosAprobadosFeria", async (req, res) => {
    const { id_feria } = req.query;

    if (!id_feria) {
        return res.status(400).json({
            mensaje: "Falta el ID de la feria."
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT
                i.id_inscripcion,
                p.id_puesto,
                p.nombre AS nombre_puesto,
                p.descripcion AS descripcion_puesto,
                p.imagen_url,
                p.categoria AS categoria,
                u.nombre AS nombre_puestero,
                u.apellido AS apellido_puestero,
                ARRAY_AGG(r.nombre ORDER BY r.id_referente)
                    FILTER (WHERE r.id_referente IS NOT NULL) AS referentes
            FROM inscripciones_ferias i
            INNER JOIN puestos p
                ON p.id_puesto = i.id_puesto
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            LEFT JOIN referentes_puesto r
                ON r.id_puesto = p.id_puesto
            WHERE i.id_feria = $1
              AND i.estado = 'aprobado'
            GROUP BY
                i.id_inscripcion,
                p.id_puesto,
                p.nombre,
                p.descripcion,
                p.imagen_url,
                p.categoria,
                u.nombre,
                u.apellido,
                i.fecha_respuesta
            ORDER BY i.fecha_respuesta DESC NULLS LAST`,
            [id_feria]
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error(
            "Error al obtener los puestos aprobados:",
            error
        );

        return res.status(500).json({
            mensaje: "Error al consultar los puestos de la feria."
        });
    }
});

//ADMINISTRADOR - USUARIOS
app.get("/obtenerTodosLosUsuarios", async (req, res) => {

    console.log("Pego en el endpoint obtener todos los usuarios");

    try {

        const resultado = await pool.query(
            `SELECT
                id_usuario,
                nombre,
                apellido,
                email,
                rol,
                estado
             FROM usuarios
             ORDER BY id_usuario ASC`
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {

        console.error("Error al obtener todos los usuarios:", error);

        return res.status(500).json({
            message: "Error al obtener todos los usuarios"
        });

    }

});

app.put("/actualizarUsuarioRolEstado", async (req, res) => {

    console.log("Pego en el endpoint actualizarUsuarioRolEstado");

    try {

        const { id_usuario, rol, estado } = req.body;

        const rolesPermitidos = [
            "administrador",
            "puestero",
            "usuario"
        ];

        // Validar datos
        if (
            !Number.isInteger(Number(id_usuario)) ||
            Number(id_usuario) <= 0 ||
            !rolesPermitidos.includes(rol) ||
            typeof estado !== "boolean"
        ) {
            return res.status(400).json({
                message: "Datos de usuario inválidos"
            });
        }

        const resultado = await pool.query(
            `UPDATE usuarios
             SET
                rol = $1,
                estado = $2
             WHERE id_usuario = $3
             RETURNING
                id_usuario,
                nombre,
                apellido,
                email,
                rol,
                estado`,
            [rol, estado, id_usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuario actualizado correctamente",
            usuario: resultado.rows[0]
        });

    } catch (error) {

        console.error("Error al actualizar usuario:", error);

        return res.status(500).json({
            message: "Error al actualizar usuario"
        });

    }

});
//--------------------------------------------------



app.put("/cambiarEstadoPuesto/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const resultado = await pool.query(
            `UPDATE puestos
             SET estado = NOT estado
             WHERE id_puesto = $1
             RETURNING id_puesto, estado`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No se encontró el puesto."
            });
        }

        return res.status(200).json({
            message: "Estado del puesto actualizado correctamente.",
            estado: resultado.rows[0].estado
        });

    } catch (error) {

        console.error("Error al cambiar el estado del puesto:", error);

        return res.status(500).json({
            message: "Error al cambiar el estado del puesto."
        });
    }
});


//----------------------PUESTERO----------------------



app.get("/MiPuesto", async (req, res) => {
    console.log("pego en la endpoint Mi puesto");

    const { id_usuario } = req.query;

    console.log("id usuario: ", id_usuario);

    try {
        const resultado = await pool.query(
            `SELECT *
             FROM Puestos
             WHERE id_usuario = $1`,
            [id_usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No hay puesto de ese usuario"
            });
        }

        const puesto = resultado.rows[0];

        const resultadoReferentes = await pool.query(
            `SELECT id_referente, id_puesto, nombre
             FROM referentes_puesto
             WHERE id_puesto = $1
             ORDER BY id_referente`,
            [puesto.id_puesto]
        );

        puesto.referentes = resultadoReferentes.rows;

        res.status(200).json({
            puesto: puesto
        });

    } catch (error) {
        console.error("Error al obtener Puesto:", error);

        res.status(500).json({
            message: "Error al obtener Puesto"
        });
    }
});


app.put("/actualizarPuesto/:id_puesto", async (req, res) => {

    const { id_puesto } = req.params;

    const {
        id_usuario,
        nombre,
        descripcion,
        categoria,
        imagen_url,
        imagen_marca,
        telefono,
        instagram,
        facebook,
        tiktok,
        otro_enlace,
        referentes
    } = req.body;

    if (!id_usuario || !nombre || !categoria || !descripcion) {
        return res.status(400).json({
            message: "Faltan datos obligatorios para actualizar el puesto"
        });
    }

    if (!Array.isArray(referentes)) {
        return res.status(400).json({
            message: "Los referentes deben enviarse como una lista"
        });
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const resultado = await client.query(
            `UPDATE puestos
             SET nombre = $1,
                 descripcion = $2,
                 categoria = $3,
                 imagen_url = $4,
                 imagen_marca = $5,
                 telefono = $6,
                 instagram = $7,
                 facebook = $8,
                 tiktok = $9,
                 otro_enlace = $10
             WHERE id_puesto = $11
               AND id_usuario = $12
             RETURNING *`,
            [
                nombre,
                descripcion,
                categoria,
                imagen_url || null,
                imagen_marca || null,
                telefono || null,
                instagram || null,
                facebook || null,
                tiktok || null,
                otro_enlace || null,
                id_puesto,
                id_usuario
            ]
        );

        if (resultado.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "No se encontró el puesto para este usuario"
            });
        }

        await client.query(
            `DELETE FROM referentes_puesto
             WHERE id_puesto = $1`,
            [id_puesto]
        );

        for (const referente of referentes) {

            if (referente && referente.trim()) {
                await client.query(
                    `INSERT INTO referentes_puesto (id_puesto, nombre)
                     VALUES ($1, $2)`,
                    [id_puesto, referente.trim()]
                );
            }

        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Puesto actualizado correctamente",
            puesto: {
                ...resultado.rows[0],
                referentes: referentes.filter(r => r && r.trim())
            }
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Error al actualizar el puesto:", error);

        res.status(500).json({
            message: "Error al actualizar el puesto"
        });

    } finally {
        client.release();
    }

});

app.get("/obtenerProductosPuesto", async (req, res) => {
    const { id_puesto } = req.query;

    if (!id_puesto) {
        return res.status(400).json({
            mensaje: "Falta el ID del puesto."
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT
                id_producto,
                id_puesto,
                nombre,
                descripcion,
                precio,
                imagen_url,
                estado,
                destacado
            FROM productos
            WHERE id_puesto = $1
              AND estado = true
            ORDER BY id_producto DESC`,
            [id_puesto]
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error(
            "Error al obtener los productos del puesto:",
            error
        );

        return res.status(500).json({
            mensaje: "Error al obtener los productos del puesto."
        });
    }
});

app.post("/insertarProducto", async (req, res) => {
    const {
        id_puesto,
        nombre,
        descripcion,
        precio,
        imagen_url,
        destacado
    } = req.body;

    if (!id_puesto || !nombre || precio === undefined || precio === null) {
        return res.status(400).json({
            mensaje: "Faltan datos obligatorios del producto."
        });
    }

    try {
        // Verificar el límite de 3 productos destacados
        if (destacado === true) {
            const resultadoDestacados = await pool.query(
                `SELECT COUNT(*) AS cantidad
                 FROM productos
                 WHERE id_puesto = $1
                   AND estado = true
                   AND destacado = true`,
                [id_puesto]
            );

            if (Number(resultadoDestacados.rows[0].cantidad) >= 3) {
                return res.status(400).json({
                    mensaje: "El puesto ya tiene 3 productos destacados."
                });
            }
        }

        const resultado = await pool.query(
            `INSERT INTO productos (
                id_puesto,
                nombre,
                descripcion,
                precio,
                imagen_url,
                destacado
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id_producto,
                id_puesto,
                nombre,
                descripcion,
                precio,
                imagen_url,
                estado,
                destacado`,
            [
                id_puesto,
                nombre.trim(),
                descripcion || null,
                precio,
                imagen_url || null,
                destacado === true
            ]
        );

        return res.status(201).json({
            mensaje: "Producto agregado correctamente.",
            producto: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al insertar el producto:", error);

        return res.status(500).json({
            mensaje: "Error al guardar el producto."
        });
    }
});








//FERIAS PARA INSCRIBIRSE E INSCRIPTO 
app.get("/obtenerFeriasDisponibles", async (req, res) => {

    console.log("Pego en el endpoint obtener ferias disponibles");

    const { id_usuario } = req.query;

    if (!id_usuario) {
        return res.status(400).json({
            message: "Falta el id del usuario puestero"
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT
                f.id_feria,
                f.nombre,
                f.descripcion,
                f.fecha_inicio,
                f.fecha_fin,
                f.ubicacion,
                f.imagen_url,
                f.estado AS estado_feria,

                p.id_puesto,

                i.id_inscripcion,
                i.estado,
                i.fecha_solicitud,
                i.fecha_respuesta,
                i.observaciones,

                CASE
                    WHEN i.id_inscripcion IS NULL THEN 'sin_inscripcion'
                    ELSE i.estado
                END AS situacion_puesto

            FROM ferias f

            JOIN puestos p
                ON p.id_usuario = $1
                AND p.estado = TRUE

            LEFT JOIN inscripciones_ferias i
                ON i.id_feria = f.id_feria
                AND i.id_puesto = p.id_puesto

            WHERE f.fecha_fin >= CURRENT_DATE

            ORDER BY f.fecha_inicio ASC`,
            [id_usuario]
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Error al obtener ferias disponibles:", error);

        return res.status(500).json({
            message: "Error al obtener ferias disponibles"
        });
    }
});



app.post("/solicitarInscripcion", async (req, res) => {

    console.log("Pego en el endpoint solicitarInscripcion");

    const { id_feria, id_puesto } = req.body;

    if (!id_feria || !id_puesto) {
        return res.status(400).json({
            message: "Faltan el ID de la feria o el ID del puesto"
        });
    }

    try {
        // Verificar que la feria exista y todavía no haya finalizado.
        const feria = await pool.query(
            `SELECT id_feria
             FROM ferias
             WHERE id_feria = $1
               AND fecha_fin >= CURRENT_DATE`,
            [id_feria]
        );

        if (feria.rows.length === 0) {
            return res.status(404).json({
                message: "La feria no existe o ya finalizó"
            });
        }

        // Verificar que el puesto exista y esté activo.
        const puesto = await pool.query(
            `SELECT id_puesto
             FROM puestos
             WHERE id_puesto = $1
               AND estado = TRUE`,
            [id_puesto]
        );

        if (puesto.rows.length === 0) {
            return res.status(404).json({
                message: "El puesto no existe o no está activo"
            });
        }

        // Evitar inscripciones duplicadas.
        const inscripcionExistente = await pool.query(
            `SELECT id_inscripcion, estado
             FROM inscripciones_ferias
             WHERE id_feria = $1
               AND id_puesto = $2`,
            [id_feria, id_puesto]
        );

        if (inscripcionExistente.rows.length > 0) {
            return res.status(409).json({
                message: "Este puesto ya tiene una inscripción para esta feria",
                estado: inscripcionExistente.rows[0].estado
            });
        }

        // Registrar la solicitud.
        const resultado = await pool.query(
            `INSERT INTO inscripciones_ferias
                (id_feria, id_puesto, estado, fecha_solicitud)
             VALUES ($1, $2, 'pendiente', CURRENT_TIMESTAMP)
             RETURNING id_inscripcion, id_feria, id_puesto,
                       estado, fecha_solicitud`,
            [id_feria, id_puesto]
        );

        return res.status(201).json({
            message: "Solicitud de inscripción enviada correctamente",
            inscripcion: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al solicitar inscripción:", error);

        return res.status(500).json({
            message: "Error al registrar la solicitud de inscripción"
        });
    }
});





app.get("/obtenerResumenAdmin", async (req, res) => {

    console.log("Pego en el endpoint obtenerResumenAdmin");

    try {

        const resultado = await pool.query(`
            SELECT
                (SELECT COUNT(*)
                 FROM ferias
                 WHERE estado = 'publicada') AS ferias_publicadas,

                (SELECT COUNT(*)
                 FROM puestos) AS puestos_registrados,

                (SELECT COUNT(*)
                 FROM usuarios) AS usuarios_registrados,

                (SELECT COUNT(*)
                 FROM inscripciones_ferias
                 WHERE estado = 'pendiente') AS solicitudes_pendientes
        `);

        return res.status(200).json(resultado.rows[0]);

    } catch (error) {

        console.error("Error al obtener resumen del administrador:", error);

        return res.status(500).json({
            message: "Error al obtener el resumen del administrador"
        });
    }
});

app.get("/obtenerProximasFerias", async (req, res) => {

    console.log("Pego en el endpoint obtenerProximasFerias");

    try {

        const resultado = await pool.query(`
            SELECT
                id_feria,
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                imagen_url,
                estado,
                id_administrador
            FROM ferias
            WHERE estado = 'publicada'
              AND fecha_inicio > NOW()
            ORDER BY fecha_inicio ASC
            LIMIT 5
        `);

        return res.status(200).json(resultado.rows);

    } catch (error) {

        console.error("Error al obtener próximas ferias:", error);

        return res.status(500).json({
            message: "Error al obtener próximas ferias"
        });
    }
});




//puestos admin wpf
app.get("/obtenerTodosLosPuestos", async (req, res) => {

    console.log("Pego en el endpoint obtener todos los puestos");

    try {

        const resultado = await pool.query(
            `SELECT
                p.id_puesto,
                p.nombre,
                p.descripcion,
                p.categoria,
                p.imagen_url,
                p.id_usuario,
                p.estado,
                p.imagen_marca,
                p.telefono,
                p.instagram,
                p.facebook,
                p.tiktok,
                p.otro_enlace,

                u.nombre AS nombre_propietario,
                u.apellido AS apellido_propietario,
                u.email,

                COUNT(pr.id_producto) AS cantidad_productos,

                CASE
                    WHEN p.estado = true THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado_texto

             FROM puestos p

             INNER JOIN usuarios u
                ON p.id_usuario = u.id_usuario

             LEFT JOIN productos pr
                ON p.id_puesto = pr.id_puesto
                AND pr.estado = true

             GROUP BY
                p.id_puesto,
                u.id_usuario

             ORDER BY p.id_puesto ASC`
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {

        console.error("Error al obtener todos los puestos:", error);

        return res.status(500).json({
            message: "Error al obtener los puestos"
        });
    }
});
//---------------------------------------------------







const comprobarConexion = async () => {

    try {

        await pool.query("SELECT 1");

        console.log("✅ Conectado correctamente a la base de datos");

    } catch (error) {

        console.error("❌ Error al conectar con la base de datos:");
        console.error(error.message);

    }

}

app.listen( PORT, async ()=>{

    console.log(`El servidor esta corriendo en el puerto: ${PORT}`);
     await comprobarConexion();

}    );