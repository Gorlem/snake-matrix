const mqtt = require('mqtt');

const snake = require('./snake');

const client = mqtt.connect('mqtt://192.168.2.144')

client.on('error', (err) => {
    console.log(err);
})

client.on('connect', () => {
    console.log('connected');
    client.subscribe('game/snake/direction');
});


let nextDirection = 'down';

const game = new snake.Snake(8, 8);

client.on('message', (topic, payload) => {
    console.log(topic);
    if (topic == 'game/snake/direction') {
        var direction = payload.toString();
        nextDirection = direction;
    }
});

game.display();

setInterval(() => {
    game.move(nextDirection);
    game.display();

    const board = game.getBoard();
}, 1000);