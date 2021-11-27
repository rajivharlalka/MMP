var nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
require("dotenv").config();

//NodeMailer Configuration
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

let env = process.env;

var mailOptions = {
  from: env.GMAIL_EMAIL,
  to: env.SEND_TO,
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

//Puppeteer Configuration

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto("https://erp.iitkgp.ac.in/", { waitUntil: "networkidle2" });

  //Enter Email Password in field
  await page.type("input[name=user_id]", env.ERP_USERNAME);
  await page.type("input[name=password]", env.ERP_PASS);

  let question = await page.$eval("label#question", (el) => el.innerText);
  if (question === env.Q1) {
    await page.type("input[name=answer]", env.A1);
  } else if (question === env.Q2) {
    await page.type("input[name=answer]", env.A2);
  } else if (question === env.Q3) {
    await page.type("input[name=answer]", env.A3);
  }

  await page.click("input#loginFormSubmitButton", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#moduleUL > li:nth-child(1) > a");
  await page.$eval("#moduleUL > li:nth-child(1) > a", (el) => el.click());

  await page.waitForSelector(
    "#accordion > div:nth-child(9) > div.panel-heading.accordion-toggle.collapsed > h3 > a"
  );

  await page.$eval(
    "#accordion > div:nth-child(9) > div.panel-heading.accordion-toggle.collapsed > h3 > a",
    (el) => el.click()
  );

  await page.waitForSelector("#collapse16555 > div > div > a.text-default");

  await page.$eval("#collapse16555 > div > div > a.text-default", (el) =>
    el.click()
  );


  await page.screenshot({ path: "example.png" });

  await browser.close();
})();

//Send Mail Function to send Mails
function sendMail() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
// var regularMail=setInterval(sendMail, 5000);
