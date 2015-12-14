# jasmine-trx-reporter
A jasmine reporter that outputs the TRX file format for use with Visual Studio


#### Example use:

Within the 'onPrepare' function of the protractor configuration, add the following:

     return browser.getCapabilities().then(function (caps) {
            var browserName = caps.caps_.browserName.toUpperCase();
            var browserVersion = caps.caps_.version;
            jasmine.getEnv().addReporter(new trx('My favorite test suite', null, browserName + "_" + browserVersion, false));
        });
 
#### The constructor for the reporter takes 4 arguments:
 JasmineTrxReporter([reportName], [outputFile], [browser], [bGroupSuitesIntoSingleFile]);
 
 The browser string will be added to the outputFile name for compatibility with multicapabilities.  If no outputfile is specified it will be named according to the suite.
 
##### Example package.json dependencies
       "devDependencies": {
         "protractor": "3.0.0",
         "jasmine-trx-reporter": "2.0.0"
       }
