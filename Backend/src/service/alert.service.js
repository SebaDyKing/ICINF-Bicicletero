import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//Se utiliza para importar credenciales de .env
dotenv.config();

//Se crea variable que se utilizara para enviar email
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

/**
 * Envía un correo de alerta de seguridad a un usuario específico.
 * * Esta función construye un correo en formato HTML con los detalles de un siniestro
 * ocurrido en un bicicletero y proporciona un enlace a la plataforma web.
 * * @async
 * @function sendAlertEmail
 * @param {string} toEmail - La dirección de correo electrónico del destinatario (el dueño de la bicicleta).
 * @param {string|Date} fecha - La fecha y hora en que ocurrió o se reportó el suceso.
 * @param {string} bicicletero - El nombre o identificador del bicicletero donde ocurrió el incidente.
 * @param {string} descripcion - Detalles descriptivos sobre el suceso o el estado de la bicicleta.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el intento de envío finaliza (ya sea con éxito o capturando un error en consola).
 * 
 */
const sendAlertEmail = async (toEmail, fecha, bicicletero, descripcion) => {
  try {
      const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
      const link = `${FRONTEND_URL}/login`
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
        // Enviar el correo
        await mailMan.sendMail(mailOptions);
        console.log(`Alerta de enviado a ${toEmail}`);
    } catch (error) {
        console.error(`Error al enviar el email a ${toEmail}:`, error);
  }
}

export default sendAlertEmail;