require('dotenv').config();

const mqtt = require('mqtt');

const { Game } = require('./Game');
const { Direction } = require('./Direction');

// Connect to the mqtt Broker
const ip = process.env.MQTT_IP;
const client = mqtt.connect(`mqtt://${ip}`);

client.on('error', (err) => {
    console.log(err);
})

client.on('connect', () => {
    // Subscribe to direction and action messages
    console.log(`Connected to ${ip}`);
    client.subscribe('direction');
    client.subscribe('action');
});

const game = new Game(8, 8);

client.on('message', (topic, payload) => {
    if (topic === 'direction') {
        game.move(Direction.fromString(payload.toString()))
    }
    if (topic === 'action') {
        game.action();
    }
});

setInterval(() => {
    game.tick();
    const board = game.getBoard();
    const extras = game.getExtras().flat();
    client.publish('board', Buffer.concat([board, Buffer.from(extras)]));
}, 1000);