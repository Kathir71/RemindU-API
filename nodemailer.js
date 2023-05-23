const nodemailer = require("nodemailer");
const mailerfunc = async(props) =>{
  const { taskString , userEmail } = props;
  const transporter = await nodemailer.createTransport({
    service: "hotmail",
    port: 587,
    auth: {
      user: "rmkathir163@outlook.com",
      pass: "therainmaker7",
    },
    secure: false,
  });
  const options = {
    from: "rmkathir163@outlook.com",
    to: userEmail,
    subject: "Reminder from RemindU",
    text: taskString,
  };
  await transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
}
module.exports = mailerfunc;
