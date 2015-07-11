/*global define: false, wsrpc: false */
require.config({
    baseUrl: "/ui",
    paths: {
        "lodash": "/thirdparty/lodash",
        "jquery": "/thirdparty/jquery-2.1.4.min"
    }
});

var apiPublished = false;

wsrpc.on("publish", function () {
    apiPublished = true;
});

define([
        "platform",
        "layout",
        "accelerometer",
        "information",
        "battery",
        "settings"
    ], function (platform, layout, accelerometer, information, battery,
            settings) {

    function init() {
        platform.initialize();
        layout.initialize();
        accelerometer.initialize();
        information.initialize();
        battery.initialize();
        settings.initialize();
    }

    if (apiPublished) {
        init();
    } else {
        wsrpc.on("publish", function () {
            init();
        });
    }
});
