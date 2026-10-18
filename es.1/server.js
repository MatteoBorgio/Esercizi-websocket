const express = require("express");
const PORT = 3000;

const server = express()
    .use((req, res) => res.sendFile("/index.html", { root: __dirname }))
    .listen(PORT, () => console.log("Listening on 3000"));

const { Server } = require("ws");

const ws_server = new Server({ server });

ws_server.on("connection", (ws) => {
    console.log("New client connected!");
    ws.on("close", () => console.log("Client has disconnected!"));
});
