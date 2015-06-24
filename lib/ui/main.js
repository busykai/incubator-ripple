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

define(["devices", "platform"], function (devices, platform) {
    if (apiPublished) {
        platform.initialize();
    } else {
        wsrpc.on("publish", function () {
            platform.initialize();
        });        
    }
});
