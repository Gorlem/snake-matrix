const mqtt = require('mqtt');
require('dotenv').config();
const snake = require('./snake');

//const client = mqtt.connect('mqtt://192.168.2.144')
const client = mqtt.connect('mqtt://'+process.env.MQTT_IP)

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

    const board = game.getBoard().flat();
    let bits = ""
    for (let i=0; i<board.length;i++) {
        bits = bits+String( board[i] > 0 ? 1 : 0);
    }
    let buf = Buffer.from(board, 'binary');
    client.publish("game/snake/board", buf)
}, 1000);