// Basic Karma configuration
module.exports = function (config) {
  config.set({
    basePath: '', // Base path of the project

    // Test frameworks used
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'), // Jasmine test launcher
      require('karma-chrome-launcher'), // Chrome Headless browser launcher
      require('karma-junit-reporter'), // JUnit report generator
      require('karma-coverage'), // Code coverage report generator
      require('karma-sonarqube-unit-reporter'), // SonarQube report generator
      require('@angular-devkit/build-angular/plugins/karma'), // Karma plugin for Angular
    ],

    client: {
      // Do not clear the Jasmine context to display results in the browser
      clearContext: false,

      jasmine: {
        random: false, // Disable random test execution
      },
    },

    // Test reporters used
    reporters: [
      'junit', // Generates a JUnit XML report for CI and reporting tools.
      'progress', // Displays a real-time progress indicator during test execution.
      // 'coverage', // Generates a code coverage report in HTML format.
      'sonarqubeUnit' // Generates a SonarQube XML report for code quality analysis.
    ],

    coverageReporter: {
      dir: '.', // Report output directory

      reporters: [
        // LCOV reporter to generate a coverage file
        { type: 'lcov', subdir: 'coverage' },
      ],
    },

    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST', // SonarQube version used
      outputFile: 'ut_report.xml', // SonarQube report output file
      useBrowserName: false, // Do not include browser name in the report
      overrideTestDescription: true, // Override test description with file name
      testPath: './src', // Base directory of the tests
      discoverTestFiles: true, // Discover test files dynamically
    },

    port: 9876, // Karma port to listen on
    colors: false, // Disable colors for better readability in CI
    logLevel: config.LOG_INFO, // Karma log level
    autoWatch: false, // Auto-watch files for changes and re-run tests
    browsers: ['ChromeHeadless'], // Browser used to run tests
    singleRun: true, // Run tests once in CI mode
  });
};
