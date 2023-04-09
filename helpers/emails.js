import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  const { email, nombre, token } = datos;

  // Enviar el email  (es interno de nodemailer)
  await transport.sendMail({
    from: "mypaw.com <ehuamanttupa@stfonavi.gob.pe>",
    to: email,
    subject: "Confirma tu Cuenta en MyPaw.com",
    text: "Confirma tu Cuenta en mypaw.com",
    html: `
            <p>Hola ${nombre}, comprueba tu cuenta en mypaw.com </p>

            <p>Tu cuenta ya se encuentra lista, solo debes de confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Confirmar Cuenta</a></p>


         
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            `,
  });
};
// ${process.env.BACKEND_URL} PRODUCCION
//${process.env.BACKEND_URL}:${ process.env.PORT ?? 3000}
 
const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const { email, nombre, token } = datos;
  
    // Enviar el email  (es interno de nodemailer)
        /* Mailtrap */
    await transport.sendMail({
      from: "mypaw.com",
      to: email,
      subject: "Restablece tu password en mypaw.com",
      text: "Restablece tu password en mypaw.com",
      html: `
              <p>Hola ${nombre}, has solicitado reestablece tu password en mypaw.com </p>
  
              <p>Sigue en el siguiente enlace para generar un password nuevo:
              <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Restablecer password</a></p>

              <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
              `,
    });
  };
  // // ${process.env.BACKEND_URL} PRODUCCION 
  // ${process.env.BACKEND_URL}:${ process.env.PORT ?? 3000}
export { 
    emailRegistro,
    emailOlvidePassword
 };
