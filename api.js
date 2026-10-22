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


app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "El email y la contraseña son obligatorios"
        });
    }

    try {
    const resultado = await pool.query(
        `SELECT id_usuario, nombre, email, rol, estado
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





//Mi puesto


app.get("/MiPuesto", async (req, res) => {
    console.log("pego en la endpoint Mi puesto")
    
    const {id_usuario} =req.query;

     console.log("id usuario: ",id_usuario)
    
    try {
        const resultado = await pool.query(
            `SELECT *
             FROM Puestos
              WHERE id_usuario=$1 `,[id_usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                message: "No hay puesto de ese usuario"
            });
        }

        res.status(200).json({
              puesto: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al obtener Puesto:", error);

        res.status(500).json({
            message: "Error al obtener  Puesto"
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