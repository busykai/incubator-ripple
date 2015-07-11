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
define(['jquery'], function ($) {
    var PROXY_SETTINGS_LIST = [
            "remote",
            "local",
            "disabled"
        ],
        DEFAULT_PROXY = PROXY_SETTINGS_LIST[1], // default is local
        DEFAULT_LOCAL_PORT = 4400,
        DEFAULT_LOCAL_ROUTE = "/ripple";

    function _initialize() {
        var $select = $("#settings-xhr-proxy"),
            $localProxyRouteSetting,
            $localProxyPortSetting;

        peer.getSettings(function (settings) {
            var i = PROXY_SETTINGS_LIST.indexOf(settings.proxy);

            // default to local if unknown value is found in db
            if (i > -1) {
                $select.val(PROXY_SETTINGS_LIST[i]);
            } else {
                $select.val(DEFAULT_PROXY);
            }

            if ($select.val() === "local") {
                $localProxyPortSetting = $("#settings-xhr-proxy-local-port");
                $localProxyPortSetting
                    .val(settings.localProxyPort || DEFAULT_LOCAL_PORT)
                    .parent()
                    .parent()
                    .css("display", "table-row");

//                utils.bindAutoSaveEvent(localProxyPortSetting, function () {
//                    db.save(LOCAL_PROXY_PORT_SETTING, localProxyPortSetting.val());
//                });

                $localProxyRouteSetting = $("#settings-xhr-proxy-local-route");
                $localProxyRouteSetting
                    .val(settings.localProxyRoute || DEFAULT_LOCAL_ROUTE)
                    .parent()
                    .parent()
                    .css("display", "table-row");

//                utils.bindAutoSaveEvent(localProxyRouteSetting, function () {
//                    db.save(LOCAL_PROXY_ROUTE_SETTING, localProxyRouteSetting.val());
//                });
            }

// FIXME: figure out how to handle this
//            if (select.value === PROXY_SETTINGS_LIST.remote) {
//                jQuery("#remote-proxy-warn").css("display", "block"); // Showing warning message for "Remote" proxy
//            }
        });

        $select.on("change", function () {
            peer.saveSettingAndReload("setting-xhr-proxy-setting", $select.val());
        });

// FIXME: add dialogs
//        $("#options-menu-about").click(function () {
//            about.show();
//        });
    }

    return {
        panel: {
            domId: "settings-container",
            collapsed: true,
            pane: "right"
        },
        initialize: _initialize
    };
});
