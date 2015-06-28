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
/*global peer: false, define: false */
define(['jquery'], function ($) {
    function _initializeLayout() {
        var $layoutLandscape = $("#layout-landscape"),
            $layoutPortrait = $("#layout-portrait");

        $layoutLandscape.bind("click", function () {
            peer.setDeviceLayout("landscape");
    //        event.trigger("LayoutChanged", ["landscape"], true);
            $layoutLandscape.removeClass().addClass("layout-selected");
            $layoutPortrait.removeClass().addClass("layout-not-selected");
        });

        $layoutPortrait.bind("click", function () {
            peer.setDeviceLayout("portrait");
    //        event.trigger("LayoutChanged", ["portrait"], true);
            $layoutLandscape.removeClass().addClass("layout-not-selected");
            $layoutPortrait.removeClass().addClass("layout-selected");
        });

    /* FIXME: menu button handling */
    /*
        jQuery("#" + constants.COMMON.MENU_BUTTON).bind("click", function () {
            event.trigger("HardwareKey", [1]);
        });

        jQuery("#" + constants.COMMON.BACK_BUTTON).bind("click", function () {
            event.trigger("HardwareKey", [0]);
        });
    */

        //Hide the orientation buttons that we don't need for this device
        peer.getCurrentDevice(function (currentDevice) {
            /* FIXME: get the orientation state from the app host */
    /*
            if (!layout) {
                layout = defaultOrientation || "portrait";
                layoutTypeChanged = true;
                resizer.changeLayoutType(layout);
            }

            if (!currentDevice.viewPort.landscape) {
                layoutLandscape.setAttribute("style", "display:none");
            }

            if (!currentDevice.viewPort.portrait) {
                layoutPortrait.setAttribute("style", "display:none");
            }

            if (layout && layout === "portrait") {
                layoutLandscape.setAttribute("class", "layout-not-selected");
                layoutPortrait.setAttribute("class", "layout-selected");
            }
            else if (layout && layout === "landscape") {
                layoutLandscape.setAttribute("class", "layout-selected");
                layoutPortrait.setAttribute("class", "layout-not-selected");
            }

            if (!layoutTypeChanged) {
                resizer.resize(currentDevice);
            }
    */
        });
    }

    return {
        initialize: _initializeLayout
    };
});



