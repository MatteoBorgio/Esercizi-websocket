zr = 15;
zc = 20;
zh = 30;
zw = 30;
for (j = 0; j < zr; j++) {
    for (i = 0; i < zc; i++) {
        l = 10 + i * (zw + 3);
        t = 10 + j * (zh + 3);
        nuovo = document.createElement("div");
        nuovo.setAttribute("name", "A");
        nuovo.setAttribute("class", "oggetto");
        nuovo.setAttribute("valore", 0);
        nuovo.style.height = zh + "px";
        nuovo.style.width = zw + "px";
        nuovo.style.top = t + "px";
        nuovo.style.left = l + "px";
        document.body.appendChild(nuovo);
    }
}

let webSocket = new WebSocket(location.origin.replace(/^http/, "ws"));
let el;
let chi;

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const el = document.getElementsByName("A");

    if (data.tipo === "init") {
        for (let k = 0; k < data.griglia.length; k++) {
            if (data.griglia[k] !== null) {
                el[k].style.backgroundColor = data.griglia[k];
            }
        }
    } else {
        colore = data.position.colore;
        chi = data.position.chi;
        ti = data.position.ti;
        el[ti].style.backgroundColor = colore;
    }
    colore = data.position.colore;
    chi = data.position.chi;
    ti = data.position.ti;
    el[ti].style.backgroundColor = colore;
};

const d = document.getElementsByName("A");
for (i = 0; i < d.length; i++) {
    (function (index) {
        d[index].addEventListener("click", function () {
            let manda = {
                pos: index,
            };
            const data = JSON.stringify({ manda: manda });
            webSocket.send(data);
        });
    })(i);
}
