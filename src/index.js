'use strict';
var TRX = require('node-trx'),
    fs = require('fs'),
    os = require('os');

module.exports = function (reportName, outputFile, browserStr, groupingSuites) {
    //console.log('Adding TRX reporter: ' + reportName + ' - ' + outputFile + ' - ' + browserStr + ' - ' + groupingSuites);

    var run = {},
        computerName = os.hostname(),
        reportName = '',
        browser = browserStr,
        userName = process.env.USERNAME,
        suiteName = '';

    if (outputFile) {
        outputFile = browserStr + '_' + outputFile || 'Default.trx';
    } else {
        outputFile = null;
    }

    if (!groupingSuites) {
        groupingSuites = false;
    } else if (groupingSuites != true && groupingSuites != false) {
        groupingSuites = true;
    } else {
        groupingSuite = false;
    }
    //console.log('groupingSuites: ' + groupingSuites);

    this.jasmineStarted = function (suiteInfo) {
        //console.log('jasmineStarted: ' + suiteInfo.totalSpecsDefined + ' specs found');

        if (groupingSuites == true) {
            this.beginTestRun();
        }
    };

    this.suiteStarted = function (suite) {
        //console.log('suiteStarted: ' + suite.fullName);

        if (outputFile == null) {
            outputFile = browser + '_' + suite.description + '.trx' || 'Default.trx';
        }

        if (groupingSuites == false) {
            this.beginTestRun();
        }

        suiteName = suite.description;
    };

    this.beginTestRun = function () {
        var suiteStartTime = getTimestamp(new Date());
        run = new TRX.TestRun({
            name: reportName,
            runUser: process.env.USERNAME,
            times: {
                creation: suiteStartTime,
                queuing: suiteStartTime,
                start: suiteStartTime,
                finish: suiteStartTime
            }
        });
    }

    this.specStarted = function (spec) {
        //console.log('specStarted: ' + spec.description);

        spec.startTime = new Date();
        run.times.start = getTimestamp(spec.startTime);
        if (!spec.startTime) {
            spec.startTime = spec.startTime;
        }
    };

    this.specDone = function (spec) {
        //console.log('specDone: ' + spec.description);

        spec.finished_at = new Date();
        var specRunTime = calculateRunTime(spec);
        var success = spec.failedExpectations.length === 0
        var result = {
            test: new TRX.UnitTest({
                name: suiteName + ' - ' + spec.description + ' - ' + browser,
                methodName: spec.description,
                methodCodeBase: 'protractor-jasmine',
                methodClassName: suiteName,
                description: spec.description + ' - ' + browser
            }),
            computerName: computerName,
            outcome: success ? 'Passed' : 'Failed',
            duration: specRunTime,
            startTime: getTimestamp(spec.startTime),
            endTime: getTimestamp(spec.finished_at)
        };
        if (success === false) {
            result.output = combineProperties(spec.failedExpectations, 'message');
            result.errorMessage = combineProperties(spec.failedExpectations, 'message');
            result.errorStacktrace = combineProperties(spec.failedExpectations, 'stack');
        }
        run.addResult(result);
    };

    this.suiteDone = function (result) {
        //console.log('suiteDone: ' + result.fullName);
        if (groupingSuites == false) {
            this.writeResultFile();
            outputFile = null;
        }
    };

    this.jasmineDone = function () {
        //console.log('jasmineDone');
        if (groupingSuites == true) {
            this.writeResultFile();
        }
    };

    this.writeResultFile = function () {
        //console.log('write ' + outputFile);
        run.times.finish = getTimestamp(new Date());
        fs.writeFileSync(outputFile, run.toXml());
    }

    function getTimestamp(date) {
        function pad(n) { return n < 10 ? '0' + n : n; }
        var currentDate = date !== undefined ? date : new Date(),
            month = currentDate.getMonth() + 1,
            day = currentDate.getDate();
        return (currentDate.getFullYear() + "-" + pad(month) + "-" + pad(day) + " " + pad(currentDate.getHours()) + ":" + pad(currentDate.getMinutes()) + ":" + pad(currentDate.getSeconds()));
    }

    function calculateRunTime(spec) {
        var specRunTime = (spec.finished_at - spec.startTime) / 1000;
        specRunTime = (isNaN(specRunTime) ? 0.001 : specRunTime);

        var newDate = new Date(null);
        var splitSeconds = specRunTime.toString().split('.');
        if (splitSeconds.length == 2) {
            newDate.setUTCSeconds(splitSeconds[0], splitSeconds[1]);
        } else {
            newDate.setUTCSeconds(splitSeconds[0]);
        }
        var dateStr = newDate.toISOString().substr(11, 12);
        return dateStr;
    }

    function combineProperties(collection, property) {
        var combined = '';
        for (var i = 0; i < collection.length; i++) {
            combined = combined + ' - ' + collection[i][property];
        }
        return combined;
    }
};
