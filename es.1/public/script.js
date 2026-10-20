const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${location.host}`);

const squares = Array.from(document.querySelectorAll('.square'));

socket.onopen = () => {
    console.log('Connessione WebSocket stabilita con successo.');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const activeIndex = data.activeIndex;

    squares.forEach((square, index) => {
        if (index === activeIndex) {
            square.classList.add('active');
        } else {
            square.classList.remove('active');
        }
    });
};

socket.onclose = () => {
    console.log('Connessione WebSocket chiusa.');
};
