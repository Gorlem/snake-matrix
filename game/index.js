require('dotenv').config();

const mqtt = require('mqtt');

const { Game } = require('./Game');
const { Direction } = require('./Direction');

const ip = process.env.MQTT_IP;

const client = mqtt.connect(`mqtt://${ip}`);

client.on('error', (err) => {
    console.log(err);
})

client.on('connect', () => {
    console.log(`Connected to ${ip}`);
    client.subscribe('game/snake/direction');
    client.subscribe('game/snake/action');
});


let nextDirection = Direction.Right;

const game = new Game(8, 8);

client.on('message', (topic, payload) => {
    console.log(topic);
    if (topic === 'game/snake/direction') {
        nextDirection = Direction.fromString(payload.toString());
    }
    if (topic === 'game/snake/action' ) {
        game.action();
    }
});

console.log(game.getBoard());

setInterval(() => {
    game.move(nextDirection);
    console.log(game.getBoard());
    
    const board = game.getBoard();
    client.publish('game/snake/board', board);

    const extras = game.getExtras().flat();
    console.log(extras);
    client.publish('game/snake/extras', Buffer.from(extras));
}, 1000);