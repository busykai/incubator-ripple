require.config({
    baseUrl: "/ui",
    paths: {
        "lodash": "/thirdparty/lodash",
        "jquery": "/thirdparty/jquery-2.1.4.min"
    }
});

define(["devices", "platform"], function (devices, platform) {
    wsrpc.on("publish", function () {
        platform.initialize();
    });
});
