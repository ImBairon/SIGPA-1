import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import twilio from "twilio";

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Configuración de Nodemailer
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "TU_CORREO@gmail.com", // ⚠️ cámbialo
    pass: "TU_PASSWORD"          // ⚠️ usa contraseña de aplicación
  }
});

// ===============================
// Configuración de Twilio
// ===============================
const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");

// ===============================
// Rutas
// ===============================
app.post("/enviar-correo", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await transporter.sendMail({ from: "TU_CORREO@gmail.com", to, subject, text });
    res.status(200).send("Correo enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error enviando correo");
  }
});

app.post("/enviar-sms", async (req, res) => {
  try {
    const { to, body } = req.body;
    await client.messages.create({ body, from: "+1234567890", to }); // ⚠️ cambia el número remitente de Twilio
    res.status(200).send("SMS enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error enviando SMS");
  }
});

// ===============================
// Servidor
// ===============================
app.listen(3000, () => {
  console.log("✅ Servidor corriendo en http://localhost:3000");
});
