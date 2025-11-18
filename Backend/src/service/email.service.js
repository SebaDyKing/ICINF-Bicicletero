import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @brief Configuración del transporte de correo utilizando Nodemailer con Gmail.
 *
 * Este transporter utiliza autenticación mediante variables de entorno y desactiva
 * la verificación estricta de certificados TLS para evitar errores en entornos locales.
 */
const transporter = nodemailer.createTransport({
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
 * @brief Envía un correo electrónico con un código de verificación a un usuario.
 *
 * Esta función construye un correo en formato HTML y lo envía utilizando el transporter
 * configurado. Si ocurre un error durante el envío, lanza una excepción para que pueda
 * ser manejada por el controlador o servicio que la invoque.
 *
 * @param {string} toEmail - Dirección de correo del destinatario.
 * @param {string} code - Código de verificación de 6 dígitos.
 * @returns {Promise<void>} No retorna datos, pero lanza error si el envío falla.
 */
export async function sendVerificationEmail(toEmail, code) {
  const mailOptions = {
    from: `"PeppaCode" <${process.env.EMAIL_USER}>`, // Quién envía
    to: toEmail, // Quién recibe
    subject: 'Verifica tu cuenta', // Asunto
    
    
    // Cuerpo del correo
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>¡Bienvenido!</h2>
        <p>Gracias por registrarte en nuestra aplicación.</p>
        <p>Tu código de verificación es:</p>
        <h1 style="color: #333; background: #f4f4f4; padding: 10px 20px; text-align: center; letter-spacing: 2px;">
          ${code}
        </h1>
        <p>Por favor, ingresa este código en la aplicación para activar tu cuenta.</p>
        <hr/>
        <p>Si no te registraste, por favor ignora este email.</p>
      </div>
    `,
  };

  try {
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Email de verificación enviado exitosamente a ${toEmail}`);
  } catch (error) {
    console.error(`Error al enviar el email a ${toEmail}:`, error);
    throw new Error('Error al enviar el email de verificación');
  }
}