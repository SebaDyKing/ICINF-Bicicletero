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

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${FRONTEND_URL}/verify?email=${toEmail}`

  const mailOptions = {
    from: `"Central de Guardias UBB" <${process.env.EMAIL_USER}>`, // Quién envía
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
        <p>Si cerraste la página, puedes volver a entrar haciendo clic aquí:</p>
        <a href="${link}" style="color: #004D99; font-weight: bold;">
          Ir a verificar mi cuenta
        </a>
      </div>
    `,
  };

  try {
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Email de verificación enviado a ${toEmail}`);
  } catch (error) {
    console.error(`Error al enviar el email a ${toEmail}:`, error);
  }
}


/**
 * @brief Envía una notificación de seguridad cuando se cambia la contraseña.
 *
 * @param {string} toEmail - Correo del destinatario.
 * @param {string} nombre - Nombre del usuario para personalizar el saludo.
 */
export async function sendPasswordChangeNotification(toEmail, nombre) {
  const mailOptions = {
    from: `"Central de Guardias UBB" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Alerta de Seguridad: Tu contraseña ha sido modificada',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #004D99;">Hola, ${nombre}</h2>
        <p>Te informamos que la contraseña asociada a tu cuenta en <strong>Bicicleteros UBB</strong> ha sido modificada recientemente.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #004D99; margin: 20px 0;">
          <p style="margin: 0;"><strong>Fecha y hora del cambio:</strong> ${new Date().toLocaleString('es-CL')}</p>
        </div>

        <p>Si realizaste este cambio, puedes ignorar este mensaje.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <p style="color: #d9534f; font-weight: bold;">
          Si NO fuiste tú quien realizó este cambio, por favor contacta a la central de guardias inmediatamente llamando al número ${process.env.TELEFONO_CENTRAL}.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notificación de cambio de contraseña enviada a ${toEmail}`);
  } catch (error) {
    console.error(`Error al enviar notificación a ${toEmail}:`, error);
  }
}
