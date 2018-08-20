const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_LOGIN_CLIENT_ID);
const verifyGoogleAuth = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_LOGIN_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload['email'];
    const domain = payload['hd'];
    return domain === 'applicaster.com' ? email : false;
  } catch (err) {
    return false;
  }
};

module.exports = { verifyGoogleAuth };
