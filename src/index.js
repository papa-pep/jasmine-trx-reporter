/*jslint node: true */
/*global jasmine */
(function () {
    "use strict";
    if (!jasmine) {
        throw new Error("jasmine library does not exist in global namespace!");
    }
    var fs = require('fs'),
        TRX = require('node-trx'),
        TestRun = TRX.TestRun,
        UnitTest = TRX.UnitTest,
        computerName = require('os').hostname(),
        run;

    var console = jasmine.getGlobal().console,
        getTimestamp = function (date) {
            function pad(n) { return n < 10 ? '0' + n : n; }
            var currentDate = date !== undefined ? date : new Date(),
                month = currentDate.getMonth() + 1,
                day = currentDate.getDate();
            return (currentDate.getFullYear() + "-" + pad(month) + "-" + pad(day) + " " + pad(currentDate.getHours()) + ":" + pad(currentDate.getMinutes()) + ":" + pad(currentDate.getSeconds()));
        },
        reportName = '',
        browser = '',
        userName = process.env.USERNAME,
        suiteName = '',

        JasmineTrxReporter = function (reportName, outputFile, browserStr) {
            this.reportName = reportName;
            this.browser = browserStr;
            this.outputFile = browserStr + '_' + outputFile || 'Default.trx';
        };

    JasmineTrxReporter.finished_at = null; 

    JasmineTrxReporter.prototype = {
        jasmineStarted: function(suiteInfo){

        },
        suiteStarted: function (suite) {
            run = new TestRun({
                name: this.reportName,
                runUser: userName
            })
            suiteName = suite.description;
        },

        specStarted: function (spec) {
            spec.startTime = new Date();

            if (!spec.startTime) {
                spec.startTime = spec.startTime;
            }
        },

         specDone : function (spec) {
             spec.finished_at = new Date();
             var specRunTime = this.calculateRunTime(spec);
             var success = spec.failedExpectations.length === 0
             var result = {
                 test: new UnitTest({
                     name: spec.description,
                     methodName: spec.description,
                     methodCodeBase: 'protractor-jasmine',
                     methodClassName: suiteName,
                     description: spec.description + ' - ' + this.browser
                 }),
                 computerName: computerName,
                 outcome: success ? 'Passed' : 'Failed',
                 duration: specRunTime,
                 startTime: getTimestamp(spec.startTime),
                 endTime: getTimestamp(spec.finished_at)
             };
             if (success === false){
                 result.output = this.combineProperties(spec.failedExpectations, 'message');
                 result.errorMessage =  this.combineProperties(spec.failedExpectations, 'message');
                 result.errorStacktrace = this.combineProperties(spec.failedExpectations, 'stack');
             }
             run.addResult(result);
        },

         suiteDone : function (result) {

            console.log(run);
             fs.writeFileSync(this.outputFile, run.toXml());
        },
        jasmineDone: function(){
        },

        log: function (str) {
            if (console && console.log) {
                console.log(str);
            }
        },
        combineProperties: function(collection, property){
            var combined = '';
            for(var i = 0; i < collection.length; i++) {
                combined = combined + ' - ' + collection[i][property];
            }
            return combined;
        },
        calculateRunTime: function(spec){
            var specRunTime = (spec.finished_at - spec.startTime) / 1000;
            specRunTime = (isNaN(specRunTime) ? 0.001 : specRunTime);

            var newDate = new Date(null);
            var splitSeconds = specRunTime.toString().split('.');
            if (splitSeconds.length == 2) {
                newDate.setUTCSeconds(splitSeconds[0], splitSeconds[1]);
            } else {
                newDate.setUTCSeconds(splitSeconds[0]);
            }
            var dateStr = newDate.toISOString().substr(11,12);
            return dateStr;
        }
    };

    jasmine.JasmineTrxReporter = JasmineTrxReporter;
}());
