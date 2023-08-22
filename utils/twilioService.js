import twilio from "twilio";
const accountSid = "ACd880791378f5e0f1975b0049b0aa7d85"; // Reemplaza con tu Account SID de Twilio
const authToken = "b1647e53116af331a077e8d70b639a37"; // Reemplaza con tu Auth Token de Twilio

const client = twilio(accountSid, authToken);

// Función para enviar un SMS con el código de verificación
const sendVerificationCode = async (phoneNumber, verificationCode) => {
  try {
    await client.messages.create({
      body: `Tu código de verificación es: ${verificationCode}`,
      from: "+1 706 702 5303", // Reemplaza con tu número de Twilio
      to: phoneNumber,
    });
    console.log("SMS enviado con éxito.");
  } catch (error) {
    console.error("Error al enviar el SMS:", error);
  }
};

export default { sendVerificationCode };
