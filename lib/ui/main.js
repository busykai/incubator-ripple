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

define(["devices", "platform", "layout"], function (devices, platform, layout) {

    function init() {
        platform.initialize();
        layout.initialize();
    }

    if (apiPublished) {
        init();
    } else {
        wsrpc.on("publish", function () {
            init();
        });
    }
});
