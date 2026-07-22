const path = require('path');

const KARMA_CONSTANTS = {
  BASE_PATH: '',
  FRAMEWORKS: ['jasmine', '@angular-devkit/build-angular'],
  PORT: 9876,
  COVERAGE_DIR: './coverage/velora',
  COVERAGE_SUBDIR: '.',
  COVERAGE_THRESHOLD: 80,
  TIMEOUTS: {
    CAPTURE: 60000,
    BROWSER_DISCONNECT: 10000,
    BROWSER_NO_ACTIVITY: 60000,
  },
  BROWSER_DISCONNECT_TOLERANCE: 3,
  REPORTERS: {
    PROGRESS: 'progress',
    KJHTML: 'kjhtml',
    COVERAGE: 'coverage',
  },
  COVERAGE_REPORTER_TYPES: {
    HTML: 'html',
    TEXT_SUMMARY: 'text-summary',
    LCOV: 'lcov',
  },
  BROWSERS: {
    CHROME: 'Chrome',
  },
  JASMINE_CONFIG: {
    RANDOM: false,
    STOP_ON_SPEC_FAILURE: false,
    FAIL_FAST: false,
  },
  JASMINE_HTML_REPORTER: {
    SUPPRESS_ALL: true,
    SUPPRESS_FAILED: false,
  },
};

module.exports = function (config) {
  config.set({
    basePath: KARMA_CONSTANTS.BASE_PATH,
    frameworks: KARMA_CONSTANTS.FRAMEWORKS,
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: KARMA_CONSTANTS.JASMINE_CONFIG.RANDOM,
        stopOnSpecFailure: KARMA_CONSTANTS.JASMINE_CONFIG.STOP_ON_SPEC_FAILURE,
        failFast: KARMA_CONSTANTS.JASMINE_CONFIG.FAIL_FAST,
      },
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: KARMA_CONSTANTS.JASMINE_HTML_REPORTER.SUPPRESS_ALL,
      suppressFailed: KARMA_CONSTANTS.JASMINE_HTML_REPORTER.SUPPRESS_FAILED,
    },
    coverageReporter: {
      dir: path.join(__dirname, KARMA_CONSTANTS.COVERAGE_DIR),
      subdir: KARMA_CONSTANTS.COVERAGE_SUBDIR,
      reporters: [
        { type: KARMA_CONSTANTS.COVERAGE_REPORTER_TYPES.HTML },
        { type: KARMA_CONSTANTS.COVERAGE_REPORTER_TYPES.TEXT_SUMMARY },
        { type: KARMA_CONSTANTS.COVERAGE_REPORTER_TYPES.LCOV },
      ],
      check: {
        global: {
          statements: KARMA_CONSTANTS.COVERAGE_THRESHOLD,
          branches: KARMA_CONSTANTS.COVERAGE_THRESHOLD,
          functions: KARMA_CONSTANTS.COVERAGE_THRESHOLD,
          lines: KARMA_CONSTANTS.COVERAGE_THRESHOLD,
        },
      },
    },
    reporters: [
      KARMA_CONSTANTS.REPORTERS.PROGRESS,
      KARMA_CONSTANTS.REPORTERS.KJHTML,
      KARMA_CONSTANTS.REPORTERS.COVERAGE,
    ],
    port: KARMA_CONSTANTS.PORT,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [KARMA_CONSTANTS.BROWSERS.CHROME],
    singleRun: false,
    restartOnFileChange: true,
    captureTimeout: KARMA_CONSTANTS.TIMEOUTS.CAPTURE,
    browserDisconnectTimeout: KARMA_CONSTANTS.TIMEOUTS.BROWSER_DISCONNECT,
    browserDisconnectTolerance: KARMA_CONSTANTS.BROWSER_DISCONNECT_TOLERANCE,
    browserNoActivityTimeout: KARMA_CONSTANTS.TIMEOUTS.BROWSER_NO_ACTIVITY,
  });
};
