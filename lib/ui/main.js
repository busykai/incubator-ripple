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
        "devices",
        "platform",
        "layout",
        "accelerometer"
    ], function (devices, platform, layout, accelerometer) {

    function init() {
        platform.initialize();
        layout.initialize();
        accelerometer.initialize();
    }

    if (apiPublished) {
        init();
    } else {
        wsrpc.on("publish", function () {
            init();
        });
    }
});
