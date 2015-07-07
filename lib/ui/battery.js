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

    var batteryLevel = $("#battery-level"),
        batteryLevelLabel = $("#battery-level-label"),
        isPlugged = $("#is-plugged");

    function _getCurrentState() {
        var state = {
            level: batteryLevel.val(),
            isPlugged: isPlugged.prop("checked")
        };
        return state;
    }

    function _updateUI(state) {
        if (state) {
            batteryLevel.val(state.level);
            batteryLevelLabel.html(state.level + "&nbsp;%");
            isPlugged.prop("checked", state.isPlugged);
        }
    }

    function _processStatusChanged() {
        var state = _getCurrentState();
        peer.setBatteryState(state);
        _updateUI(state);
    }

    return {
        panel: {
            domId: "battery-status-container",
            collapsed: true,
            pane: "left"
        },

        initialize: function() {
            batteryLevel.bind("mouseup", function() {
                _processStatusChanged();
            });

            isPlugged.bind("click", function() {
                _processStatusChanged();
            });

            peer.getInitialBatteryState(function (state) {
                _updateUI(state);
            });
        }
    };
});
