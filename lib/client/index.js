/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
/*global wsrpc: false */
var omgwtf = ripple('omgwtf'),
    db = ripple('db'),
    xhr = ripple('xhr'),
    geo = ripple('geo'),
    fs = ripple('fs'),
    accelerometer = ripple('accelerometer'),
    platform = ripple('platform'),
    emulatorBridge = ripple('emulatorBridge'),
    devices = ripple('devices'),
    battery = ripple('batteryStatus'),
    settings = ripple('settings'),
    _console = ripple('console'),
    widgetConfig = ripple('widgetConfig'),
    deviceSettings = ripple('deviceSettings'),
    ui = ripple('ui'),
    appcache = ripple('appcache'),
    resizer = ripple('resizer'),
    _self;

function checkForRepeatReload() {
    //some pages try to break out of our iFrame, causing an infinite loop
    //This handles that scenario gracefully

    var time = new Date().getTime(),
        lastLoad = JSON.parse(window.localStorage['ripple-last-load'] || null) || {time: time, counter: 0};

    if (time - lastLoad.time < 3000) {
        if (lastLoad.counter >= 3) {
            window.onbeforeunload = function () {
                return "Looks like the page you're on is trying to break out of an iFram. To stop this behaviour, click 'stay on this page'. To continue, click 'leave this page'.";
            };
            lastLoad = {time: time, counter: 0};
        }
        else {
            lastLoad = {time: time, counter: lastLoad.counter + 1};
        }
    }
    else {
        lastLoad = {time: time, counter: 0};
    }

    window.localStorage['ripple-last-load'] = JSON.stringify(lastLoad);
}

 // TODO: Move this somewhere else, whatever, not here
function setUserAgent(prev, baton) {
    // Hackish.. but this means Chrome Extension is running, so don't POST user agent
    if (document.getElementById("tinyhippos-injected")) {
        return;
    }

    baton.take();

    var xhr = new XMLHttpRequest(),
        userAgent = devices.getCurrentDevice().userAgent,
        params;

    params = "userAgent=" + (userAgent ? escape(userAgent) : "");

    xhr.open("POST", "ripple/user-agent");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                _console.log("Setting the user agent server side failed.");
            }

            baton.pass();
        }
    };

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
}

wsrpc.on("peer", function () {
    wsrpc.publishAPI({
        api: [
            {
                function: "getCurrentPlatform",
                arguments: [],
                handler: platform.current.bind(platform)
            },
            {
                function: "getPlatforms",
                arguments: [],
                handler: platform.getList.bind(platform)
            },
            {
                function: "getCurrentDevice",
                arguments: [],
                handler: devices.getCurrentDevice.bind(devices)
            },
            {
                function: "getDevicesForPlatform",
                arguments: [{description: "platform id"}],
                handler: devices.getDevicesForPlatform.bind(devices)
            },
            {
                function: "changeEnvironment",
                arguments: [
                    {
                        description: "platform id"
                    },
                    {
                        description: "device id"
                    }
                ],
                handler: platform.changeEnvironment
            },
            {
                function: "setDeviceLayout",
                arguments: [
                    {
                        description: "layout type, either 'landscape' or 'portrait'"
                    }
                ],
                handler: resizer.changeLayoutType
            },
            {
                function: "setAccelerometerInfo",
                arguments: [
                    {
                        description: "object describing device motion"
                    }
                ],
                handler: accelerometer.setInfo
            },
            {
                function: "getAccelerometerInfo",
                arguments: [
                ],
                handler: accelerometer.getInfo
            },
            {
                function: "shakeDevice",
                arguments: [
                ],
                handler: accelerometer.shake
            },
            {
                function: "getInitialBatteryState",
                arguments: [
                ],
                handler: battery.getInitialState
            },
            {
                function: "setBatteryState",
                arguments: [
                    {
                        description: "object containing battery state information"
                    }
                ],
                handler: battery.setState
            },
            {
                function: "saveSettingAndReload",
                arguments: [
                    {
                        description: "setting name"
                    },
                    {
                        description: "setting value"
                    }
                ],
                handler: settings.saveAndReload
            },
            {
                function: "getSettings",
                arguments: [
                ],
                handler: settings.getSettings
            }
        ]
    });
});

_self = {
    boot: function (booted) {

        // TODO: this should not be here (instead, in a UI module).
        window.addEventListener("keydown", function (event) {
            var hasMetaOrAltPressed = (event.metaKey || event.ctrlKey),
                key = parseInt(event.keyCode, 10);

            if (key === 37 && hasMetaOrAltPressed) { // cmd/ctrl + left arrow
                event.preventDefault();
                emulatorBridge.window().history.back();
            }

            if (key === 39 && hasMetaOrAltPressed) { // cmd/ctrl + right arrow
                event.preventDefault();
                emulatorBridge.window().history.forward();
            }

            if (key === 82 && hasMetaOrAltPressed) { // cmd/ctrl + r
                event.preventDefault();
                emulatorBridge.window().location.reload();
            }

            if (key === 116) { // F5
                event.preventDefault();
                emulatorBridge.window().location.reload();
            }
        });

        checkForRepeatReload();

        jWorkflow.order(omgwtf.initialize, omgwtf)
             .andThen(appcache.initialize, appcache)
             .andThen(db.initialize, db)
             .andThen(xhr.initialize, xhr)
             .andThen(geo.initialize, geo)
             .andThen(fs.initialize, fs)
             .andThen(platform.initialize, platform)
             .andThen(devices.initialize, devices)
             .andThen(setUserAgent) // See TODO above function def
             .andThen(widgetConfig.initialize, widgetConfig)
             .andThen(deviceSettings.initialize, deviceSettings)
             .andThen(ui.initialize, ui)
             .start(booted);
    }
};

module.exports = _self;
