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
            `SELECT id_usuario, nombre, email
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

        res.status(200).json({
            message: "Login exitoso",
            usuario: usuario
        });

    } catch (error) {

        console.error("Error en el login:", error.message);

        res.status(500).json({
            message: "Error interno del servidor"
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