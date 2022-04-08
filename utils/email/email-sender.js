const transporter = require("./transporter.js").transporter;
const username = require("./transporter.js").username;

/* 
Mail Details:
{
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
  }
*/
function sendEmail(mailOptions) {
  mailOptions.from = username;
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;

// todo: add HTML-emails!!!
