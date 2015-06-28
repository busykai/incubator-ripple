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
/*global define: false, peer: false */
define(["lodash", "jquery"], function (_, $) {

    function _updateDeviceListForPlatform(platformID, currentDeviceKey) {

        var $deviceSelect = $("#device-select");

        function fillDeviceList(list) {
            $deviceSelect.children("option").remove();
            _.each(list, function (dev) {
                var deviceNode = $("<option/>", {
                    "text": dev.name,
                    "value": dev.id
                });
                $deviceSelect.append(deviceNode);
            });
            $deviceSelect.val(currentDeviceKey);
        }

        peer.getDevicesForPlatform(platformID, function (list) {
            list = list.sort(function (a, b) {
                return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
            });
            fillDeviceList(list);
        });

    }

    function _changeEmulatorEnvironment() {
        var platformId = $("#platform-select").val(),
            version = $("#version-select").val(),
            device = $("#device-select").val();

        // FIXME: this should have a callback
        peer.changeEnvironment({
                "name": platformId,
                "version": version
            }, device);
    }

    function initialize() {
        var count = 0,
            currentPlatform,
            currentDevice,
            platforms;

        function doInitialize() {
            var currentPlatformID = currentPlatform.id,
                currentPlatformVersion = currentPlatform.version,
                $platformSelect = $("#platform-select"),
                $versionSelect = $("#version-select"),
                currentDeviceKey = currentDevice.id,
                platformNode, versionNode;

            $platformSelect.children("option").remove();
            $versionSelect.children("option").remove();

            $("#platform-select").bind("change", function () {
                var newPlatform = $(this).val(),
                    newDevice = $("#device-select").val();

                $versionSelect.children("option").remove();

                _.each(platforms, function (platform) {
                    _.each(platform, function (version, versionNumber) {
                        if (newPlatform === version.id) {
                            $versionSelect.append($("<option/>", {
                                "text": versionNumber,
                                "value":  versionNumber
                            }));
                        }
                    });
                });

                _updateDeviceListForPlatform(newPlatform, newDevice);

            });


            $("#change-platform").bind("click", _changeEmulatorEnvironment);
            $("#device-select").bind("change", _changeEmulatorEnvironment);

            _.each(platforms, function (platform) {
                _.each(platform, function (version, versionNumber) {
                    platformNode = $("<option/>", {
                        "text": version.name,
                        "value":  version.id
                    });

                    if (currentPlatformID && version.id === currentPlatformID) {
                        versionNode = $("<option/>", {
                            "text": versionNumber,
                            "value": versionNumber
                        });

                        $versionSelect.append(versionNode);
                    }

                    if ($($platformSelect).children("option").val() !== version.id) {
                        $platformSelect.append(platformNode);
                    }

                });
            });
            $platformSelect.val(currentPlatformID);
            $versionSelect.val(currentPlatformVersion);

            _updateDeviceListForPlatform(currentPlatformID, currentDeviceKey);

        }

        function proceedIfDone() {
            if (count === 3) {
                doInitialize();
            }
        }

        peer.getCurrentPlatform(function (val) {
            currentPlatform = val;
            count++;
            proceedIfDone();
        });
        peer.getPlatforms(function (val) {
            platforms = val;
            count++;
            proceedIfDone();
        });
        peer.getCurrentDevice(function (val) {
            currentDevice = val;
            count++;
            proceedIfDone();
        });
    }


    return {
        panel: {
            domId: "platforms-container",
            collapsed: true,
            pane: "left"
        },
        initialize: initialize
    };
});
