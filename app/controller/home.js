'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    let send = ctx.query.send
    const todayOneData = await ctx.service.one.getOneInfo()
    const weatherInfo = await ctx.service.one.getWeatherInfo()
    let nowDate = new Date()
    let loveDate = new Date('2016-01-01')
    let lastDay = ctx.service.one.dateDiff(nowDate, loveDate)
    let todaystr = ctx.service.one.getTodaystr()
    let data = {
      lastDay,
      todayOneData,
      ...weatherInfo,
      todaystr
    }
    if (send) {
      await app.runSchedule('../schedule/sendMail.js');
    }
    await ctx.render('/mail.html', data);
    // ctx.body = data
  }
}

module.exports = HomeController;
