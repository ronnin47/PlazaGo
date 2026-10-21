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
    console.log("pego en la endpoint proxima feria")
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