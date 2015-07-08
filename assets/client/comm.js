/*global window: false, document: false, wsrpc: false, wsRPCPort: false */
(function () {
    "use strict";

    window.addEventListener("load", function () {

        var onlineIndicator = document.createElement("div");
        onlineIndicator.style.width = "10px";
        onlineIndicator.style.height = "10px";
        onlineIndicator.style.borderRadius = "50%";
        onlineIndicator.style.backgroundColor = "#f00";
        onlineIndicator.style.position = "fixed";
        onlineIndicator.style.top = "5px";
        onlineIndicator.style.right = "5px";
        onlineIndicator.style.zIndex = "500";
        onlineIndicator.setAttribute("id", "comm-indi");

        document.body.appendChild(onlineIndicator);


        wsrpc.on("open", function () {
            onlineIndicator.style.backgroundColor = "#ffa500";
            onlineIndicator.title = "Connected to the server";
        });

        wsrpc.on("peer", function (id) {
            onlineIndicator.style.backgroundColor = "#0f0";
            onlineIndicator.title = "Peer id is " + id;
        });

        wsrpc.on("close", function (id) {
            onlineIndicator.style.backgroundColor = "#f00";
            onlineIndicator.title = "Disconnected";
        });

        wsrpc.on("error", function (id) {
        });

        // initialize WS-RPC with the published interface
        wsrpc.init(wsRPCPort, "ripple-channel");

    });
}());
