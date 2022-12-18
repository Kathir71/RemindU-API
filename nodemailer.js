const nodemailer = require("nodemailer");
const mailerfunc = async(props) =>{
  const { taskString } = props;
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
    to: "rmkathir7@gmail.com",
    subject: "from nodemailer",
    text: taskString,
  };
  await transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(info.response);
  });
}
console.log(mailerfunc);
module.exports = mailerfunc;
