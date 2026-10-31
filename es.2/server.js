const express = require("express");
const PORT = 3000;

const server = express()
    .use(express.static("public"))
    .listen(PORT, () => console.log("Listening on 3000"));

const { Server } = require("ws");

const ws_server = new Server({ server });

let client_counter = 0;
let red_counter = 0;
let blue_counter = 0;

function aggiorna_contatori() {
    const payload = JSON.stringify({
        type: "UPDATE_COUNTERS",
        red_counter: red_counter,
        blue_counter: blue_counter,
    });

    ws_server.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

ws_server.on("connection", (ws) => {
    console.log("New client connected!");

    client_counter++;
    ws.id = client_counter;
    const is_even = ws.id % 2 === 0;

    const client_data = JSON.stringify({
        type: "INIT_CLIENT",
        client_id: ws.id,
        is_even: is_even,
        red_counter: red_counter,
        blue_counter: blue_counter,
    });
    ws.send(client_data);

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if ((data.action === "CLICK_RED") & !is_even) {
                red_counter++;
                aggiorna_contatori();
            } else if ((data.action === "CLICK_BLUE") & is_even) {
                blue_counter++;
                aggiorna_contatori();
            }
        } catch (err) {
            console.log(err);
        }
    });

    ws.on("close", () => console.log("Client has disconnected!"));
});

setInterval(() => {
    const clients_data = JSON.stringify({
        type: "UPDATE_POSITIONS",
        red_position: {
            x: Math.floor(Math.random() * 400),
            y: Math.floor(Math.random() * 300),
        },
        blue_position: {
            x: Math.floor(Math.random() * 400),
            y: Math.floor(Math.random() * 300),
        },
    });

    ws_server.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(clients_data);
        }
    });
}, 2000);
