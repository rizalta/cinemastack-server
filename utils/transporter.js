import { createTransport } from 'nodemailer';
import { google } from 'googleapis';

const createTransporter = async () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const email = process.env.GOOGLE_GMAIL;

  const OAuth2 = google.auth.OAuth2;
  const OAuth2Client = new OAuth2(
    clientId,
    clientSecret,
    'https://developer.google.com/oauthplayground',
  );

  OAuth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const accessToken = await new Promise((resolve, reject) => {
    OAuth2Client.getAccessToken((error, token) => {
      if (error) {
        reject('Failed to create Access token');
      }
      resolve(token);
    })
  });


  const transporter = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: email,
      accessToken,
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  return transporter;
} 

const sendMail = async (mailOptions) => {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}

export default sendMail;