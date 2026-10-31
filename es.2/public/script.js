const socket = new WebSocket(`ws://${location.host}`);

const redBox = document.querySelector(".squarered");
const blueBox = document.querySelector(".squareblue");
const container = document.querySelector(".container");

container.style.position = "relative";
container.style.width = "100%";
container.style.height = "400px";

[redBox, blueBox].forEach((box) => {
    box.style.position = "absolute";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.color = "white";
    box.style.fontWeight = "bold";
    box.style.cursor = "pointer";
    box.style.userSelect = "none";
    box.innerText = "0";
});

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "INIT_CLIENT") {
        redBox.innerText = data.red_counter;
        blueBox.innerText = data.blue_counter;
    } else if (data.type === "UPDATE_POSITIONS") {
        redBox.style.left = data.red_position.x + "px";
        redBox.style.top = data.red_position.y + "px";
        blueBox.style.left = data.blue_position.x + "px";
        blueBox.style.top = data.blue_position.y + "px";
    } else if (data.type === "UPDATE_COUNTERS") {
        redBox.innerText = data.red_counter;
        blueBox.innerText = data.blue_counter;
    }
};

redBox.addEventListener("click", () => {
    socket.send(JSON.stringify({ action: "CLICK_RED" }));
});

blueBox.addEventListener("click", () => {
    socket.send(JSON.stringify({ action: "CLICK_BLUE" }));
});
