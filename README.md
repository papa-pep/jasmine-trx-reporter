## NOTICE: THIS REPO IS NO LONGER MAINTAINED.

# jasmine-trx-reporter
A jasmine reporter that outputs the TRX file format for use with Visual Studio

#### Example use:
Within the config file add:

```var trx = require('jasmine-trx-reporter');```

Within the 'onPrepare' function of the protractor configuration, add the following:

     return browser.getCapabilities().then(function (caps) {

            var browserName = caps.caps_.browserName.toUpperCase();
            var browserVersion = caps.caps_.version;

            var jasmineTrxConfig = {
                reportName: 'my favorite test suite',
                folder: 'testResults',
                outputFile: '',
                browser: browserName + "_" + browserVersion,
                groupSuitesIntoSingleFile: false
            };

            jasmine.getEnv().addReporter(new trx(jasmineTrxConfig));
        });
 
#### The constructor for the reporter takes a configuration object as seen above:
     reportName - the name of the report embedded within the trx file
     folder - optional folder to write trx results into
     outputFile - optional file name to write results to (Ex. myResults.trx).  If not outputFile is specificed it will be named according to the suite.
     browser - optional browser information to prepend to the outputfile name for compatibility with multicapabilities
     groupSuitesIntoSingleFile - groups all results into a single file.  This should be set to false if you want to shard your tests.
 
 
##### Example package.json dependencies
       "devDependencies": {
         "protractor": "3.0.0",
         "jasmine-trx-reporter": "2.0.0"
       }
       
       
#### Workarounds:
For those who may be using jest, here is an example workaround:
````javascript
const { TestRun } = require('node-trx');
const chalk = require('chalk');
const addResult = TestRun.prototype.addResult;
TestRun.prototype.addResult = function(result) {
  if (result.errorMessage) result.errorMessage = chalk.stripColor(result.errorMessage);
  if (result.errorStacktrace) result.errorStacktrace = chalk.stripColor(result.errorStacktrace);
  if (result.output) result.output = chalk.stripColor(result.output);
  return addResult.apply(this, arguments);
};
const JasmineTrxReporter = require('jasmine-trx-reporter');
jasmine.getEnv().addReporter(new JasmineTrxReporter({
  ...
}));
````
