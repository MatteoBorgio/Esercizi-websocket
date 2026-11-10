const express = require("express");

const server = express()
    .use(express.static("public"))
    .listen(3000, () => console.log("Listening on 3000"));

const { Server } = require("ws");

let quale = 0;
let clients = [];
let colore_pari = "blue";
let colore_dispari = "red";

let griglia = new Array(300).fill(null);
let punti_rosso = 0;
let punti_blu = 0;
let gioco_finito = false;

const ws_server = new Server({ server });

ws_server.on("connection", (ws) => {
    console.log("New client connected!");

    quale++;
    ws.id = quale;

    ws.send(JSON.stringify({ tipo: "init", griglia: griglia }));

    ws.on("close", () => console.log("Client has disconnected!"));

    ws.on("message", function (message) {
        if (gioco_finito) return;

        const arriva = JSON.parse(message);
        i = arriva.manda.pos;

        if (griglia[i] === null) {
            let colore_attuale = ws.id % 2 === 0 ? colore_pari : colore_dispari;
            griglia[i] = colore_attuale;

            if (colore_attuale === colore_dispari) {
                punti_rosso++;
            } else {
                punti_blu++;
            }

            console.log(ws.id + " " + i);

            let position = {
                ti: i,
                colore: colore_attuale,
                chi: ws.id,
            };

            const data = JSON.stringify({ position: position });

            ws_server.clients.forEach((client) => {
                client.send(data);
            });

            if (punti_rosso >= 150) {
                gioco_finito = true;
                console.log("Ha vinto il client dispari (Rosso)!");
            } else if (punti_blu >= 150) {
                gioco_finito = true;
                console.log("Ha vinto il client pari (Blu)!");
            }
        }
    });
});
