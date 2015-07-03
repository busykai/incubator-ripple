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
        "information"
    ], function (platform, layout, accelerometer, information) {

    function init() {
        platform.initialize();
        layout.initialize();
        accelerometer.initialize();
        information.initialize();
    }

    if (apiPublished) {
        init();
    } else {
        wsrpc.on("publish", function () {
            init();
        });
    }
});
