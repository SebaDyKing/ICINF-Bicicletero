import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailMan = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendAlertEmail = async (toEmail, fecha, bicicletero, descripcion) => {
    const FRONT_URL = 'http://localhost:5173'
    const link = `${FRONT_URL}/login`
    const mailOptions = {
        from: `"Central de Guardias UBB" <${process.env.EMAIL_USER}>`,
        to: toEmail, 
        subject: 'AVISO DE SINIESTRO',
        
        
        // Cuerpo del correo
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1>AVISO DE SINIESTRO</h1>
            <p>Ha ocurrido un suceso que puede involucrar la integridad de su bicicleta.</p>
            <h1 style="color: #333; background: #f4f4f4; padding: 10px 20px; text-align: center; letter-spacing: 2px;">
            Detalles del suceso:
            </h1>
            <h2>Fecha: ${fecha}</h2>
            <h2>Bicicletero: ${bicicletero}</h2>
            <h2>Descripción: ${descripcion}</h2>
            <hr/>
            <p>Si no te ves afectado ignora este correo. Caso contrario dirigete al link de la parte de abajo solicite un guardia para asegurar el estado de su bicicleta.</p>
            <a href="${link}" style="color: #004D99; font-weight: bold;">
            Ir a página web
            </a>
        </div>
        `,
    };

    try {
        // Enviar el correo
        await mailMan.sendMail(mailOptions);
        console.log(`Alerta de enviado a ${toEmail}`);
    } catch (error) {
        console.error(`Error al enviar el email a ${toEmail}:`, error);
  }
}

export default sendAlertEmail;