# jasmine-trx-reporter
A jasmine reporter that outputs the TRX file format for use with Visual Studio


#### Example use:

Within the 'onPrepare' function of the protractor configuration, add the following:

     require('jasmine-trx-reporter');
     var capsPromise = browser.getCapabilities();
     capsPromise.then(function (caps) {
        var browserName = caps.caps_.browserName.toUpperCase();
        var browserVersion = caps.caps_.version;
     jasmine.getEnv().addReporter(new jasmine.JasmineTrxReporter(caps.caps_['webdriver.remote.sessionid'] + "_results.TRX", browserName + "_" + browserVersion));
 
#### The constructor for the reporter takes 2 arguments:
 JasmineTrxReporter([outputFile], [browser]);
 
 The browser string will be added to the outputFile name for compatibility with multicapabilities.
