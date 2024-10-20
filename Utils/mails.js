import nodemailer from "nodemailer";

const generateOtp = () => {
  let otp = ''
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
const mailTransport = () => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });
  return transport;
}
const generateEmailTemplate=(code)=>{
  return `<!DOCTYPE html>
<html>

<head>
         <style>
                  body {
                           text-align: center;
                  }
                  table {
                           margin: auto;
                  }
         </style>
</head>

<body>
         <table width="600" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                           <td align="center" style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 16px;">
                                    <h2 style="font-weight: bold;">Verification Code</h2>
                                    <p>Your verification code is: <span style="font-weight: bold;">${code}</span></p>
                                    <p>Please enter this code to complete the verification process.</p>
                                    <p>If you did not request this code, please ignore this email.</p>
                           </td>
                  </tr>

         </table>
</body>

</html>`;
}

const generateEmailTemplatePlain=()=>{
  return`<!DOCTYPE html>
<html>

<head>
         <style>
                  body {
                           text-align: center;
                  }
                  table {
                           margin: auto;
                  }
         </style>
</head>

<body>
         <table width="600" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                           <td align="center" style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 16px; ">
                                    <h2 style="font-weight: bold;color: rgb(78, 5, 146)">Welcome User!!!</h2>
<p>Your account is verified successfully!!<span style="font-weight: bolder; font-family: Arial, sans-serif;font-size: 20px;color: #1bc274;">HAPPY CODING & LEARNING</span></p>
                                    <p>If you did not request this code, please ignore this email.</p>
                           </td>
                  </tr>

         </table>
</body>

</html>`
}
export default { mailTransport, generateOtp, generateEmailTemplate, generateEmailTemplatePlain };