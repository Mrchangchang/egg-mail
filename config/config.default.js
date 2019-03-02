/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551426527461_6475';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    EamilAuth: {
      type: 'login',
      user: 'yanchang120@vip.qq.com',
      pass: 'vqqedlkxqyhybgce'
    },
    EmailTo: '"楠楠" <437887624@qq.com>',
    EmailSubject: '一封暖暖的邮件',
    EmianService: "QQ",
    EmailFrom: '"严畅" <yanchang120@vip.qq.com>'
  };
  // 模板渲染配置
  config.view = {
    mapping: {'.html': 'ejs'} //左边写成.html后缀，会自动渲染.html文件
  }
  return {
    ...config,
    ...userConfig,
  };
};
