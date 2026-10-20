const express = require("express");
const PORT = 3000;

const server = express()
    .use(express.static('public'))
    .listen(PORT, () => console.log("Listening on 3000"));

const { Server, WebSocket } = require("ws");

const ws_server = new Server({ server });

ws_server.on("connection", (ws) => {
    console.log("New client connected!");
    ws.on("close", () => console.log("Client has disconnected!"));
});

let activeIndex = 0;
let direction = 1;

setInterval(() => {
    const payload = JSON.stringify({ activeIndex: activeIndex });

    ws_server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });

    if (activeIndex === 4) {
        direction = -1
    } else if (activeIndex === 0) {
        direction = 1
    }

    activeIndex += direction
}, 500);
