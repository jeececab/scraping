const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');

nightwatch_config = {
  src_folders: ['./nightwatch/tests'],
  output_folder: './nightwatch/reports',
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: false,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path
    }
  },
  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      screenshots: {
        enabled: false,
        path: ''
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless']
        }
      }
    }
  }
};

module.exports = nightwatch_config;
