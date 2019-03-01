const Subscription = require('egg').Subscription;
const nodemailer = require("nodemailer"); //发送邮件的node插件
const ejs = require("ejs"); //ejs模版引擎
const fs = require("fs"); //文件读写
const path = require('path')

class SendMail extends Subscription {
  static get schedule() {
    return {
      cron: '0 5 9 * * *', // 1 分钟间隔
      type: 'all' // 指定所有的 worker 都需要执行
    }
  }
  async subscribe () {
    const { ctx, app } = this;
    const todayOneData = await ctx.service.one.getOneInfo()
    const weatherInfo = await ctx.service.one.getWeatherInfo()
    let nowDate = new Date()
    let loveDate = new Date('2016-01-01')
    let lastDay = ctx.service.one.dateDiff(nowDate, loveDate)
    let todaystr = ctx.service.one.getTodaystr()
    let HtmlData = {
      lastDay,
      todayOneData,
      ...weatherInfo,
      todaystr
    }
    const template = ejs.compile(
      fs.readFileSync(path.resolve(__dirname, "../view/email.html"), "utf8")
    )
    const html = template(HtmlData);
    let transporter = nodemailer.createTransport({
      service: app.config.userConfig.EmianService,
      port: 465,
      secureConnection: true,
      auth: app.config.userConfig.EamilAuth
    });
    let mailOptions = {
      from: app.config.userConfig.EmailFrom,
      to: app.config.userConfig.EmailTo,
      subject: app.config.userConfig.EmailSubject,
      html: html
    };
    transporter.sendMail(mailOptions, (error, info={}) => {
      if (error) {
        console.log(error);
        sendMail(HtmlData); //再次发送
      }
      console.log("邮件发送成功", info.messageId);
      console.log("静等下一次发送");
    });
  }
}
module.exports = SendMail