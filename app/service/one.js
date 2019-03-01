const Service = require('egg').Service;
const superagent = require('superagent') // 能够发送网络请求获取dom
const cheerio = require('cheerio'); //能够像Jquery一样方便获取DOM节点
const OneUrl = "http://wufazhuce.com/"; //ONE的web版网站
const local = 'guangdong/shenzhen'
const WeatherUrl = "https://tianqi.moji.com/weather/china/" + local;
class OneService extends Service {
  async getOneInfo() {
    function requestOne() {
      return new Promise((resolve, reject) => {
        superagent.get(OneUrl).end((err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    }
    let res = await requestOne()
    let $ = cheerio.load(res.text);
    let selectItem = $('#carousel-one .carousel-inner .item');
    let todayOne = selectItem[0]; //获取轮播图第一个页面，也就是当天更新的内容
    let todayOneData = { //保存到一个json中
      imgUrl: $(todayOne).find('.fp-one-imagen').attr('src'),
      type: $(todayOne).find('.fp-one-imagen-footer').text().replace(/(^\s*)|(\s*$)/g, ""),
      text: $(todayOne).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, "")
    };
    return todayOneData
  }
  async getWeatherInfo() {
    // 获取天气提醒
    function requestWeather() {
      return new Promise((resolve, reject) => {
        superagent.get(WeatherUrl).end((err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    }
    let res = await requestWeather()
    let threeDaysData = [];
    let weatherTip = "";
    let $ = cheerio.load(res.text);
    $(".wea_tips").each(function (i, elem) {
      weatherTip = $(elem)
        .find("em")
        .text();
    });
    $(".forecast .days").each(function (i, elem) {
      const SingleDay = $(elem).find("li");
      threeDaysData.push({
        Day: $(SingleDay[0])
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        WeatherImgUrl: $(SingleDay[1])
          .find("img")
          .attr("src"),
        WeatherText: $(SingleDay[1])
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        Temperature: $(SingleDay[2])
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        WindDirection: $(SingleDay[3])
          .find("em")
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        WindLevel: $(SingleDay[3])
          .find("b")
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        Pollution: $(SingleDay[4])
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        PollutionLevel: $(SingleDay[4])
          .find("strong")
          .attr("class")
      });
    });
    return {
      weatherTip,
      threeDaysData
    }
  }
  dateDiff(sDate1, sDate2) {
    let iDays = parseInt(Math.abs(sDate1 - sDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
    return iDays
  }
  getTodaystr () {
    let nowDate = new Date()
    let todaystr = nowDate.getFullYear()+" / " + (nowDate.getMonth() + 1) +" / " + nowDate.getDate();
    return todaystr
  }
}

module.exports = OneService