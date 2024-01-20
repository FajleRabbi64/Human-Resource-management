const nodemailer = require("nodemailer");
const router = require("express").Router();
require("dotenv").config();

function createdNewAccount(email, displayName) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "humanresourcesystem9@gmail.com",
      pass: process.env.GMAIL,
    },
  });

  const mailOptions = {
    from: "humanresourcesystem9@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Created new account!", // Subject line
    html: `Name: <b>${displayName}</b> <br>email: <b>${email}</b>`, // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


router.post("/contactUs", async (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "humanresourcesystem9@gmail.com",
      pass: process.env.GMAIL,
    },
  });

  const mailOptions = {
    from: "mdunusali1906@gmail.com",
    to: "6rohit8@gmail.com",
    subject: "Suggestion/Message from someone!",
    html: `Name: <b>${name}</b> <br>
           Email: <b>${email}</b> <br>
          Message: ${message}`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(info);
      res.json("submitted...");
    }
  });
});

module.exports = {
  router: router,
  sendEmail: createdNewAccount,
};
