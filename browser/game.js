window.addEventListener('load', () => {
    let svg = d3.select("svg#game")
    console.log(svg)
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            svg.append("circle")
                .attr('id', 'p' + i + j)
                .attr('cy', (i+1) * 100)
                .attr('cx', (j+1) * 100)
                .attr('r', 40)
                .attr('class', 'off')
        }
    }
    MQTTconnect();
})


let mqtt;

let reconnectTimeout = 2000;
let host = 'localhost';
let port = 8080;

function onConnect() {
    console.log('connected');

    mqtt.subscribe('game/snake/board');

}

function MQTTconnect() {
    console.log('connecting to ' + host + ' ' + port);
    mqtt = new Paho.MQTT.Client(host, port, "", "clientjs", transport="websockets");
    let options = {
        timeout: 3,
        onSuccess: onConnect
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options);
}

function onMessageArrived(msg) {
    let board = msg.payloadBytes
    let count = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(board[count] === 0) {
                d3.select('circle#p'+i+j).attr('class', 'off')
            } else if (board[count] === 2 || board[count] === 1) {
                d3.select('circle#p'+i+j).attr('class', 'on')
            } else {
                d3.select('circle#p'+i+j).attr('class', 'food')
            }
            count++;
        }
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    let direction = false;
    if (e.keyCode == '38') {
        console.log("up")
        // up arrow
        direction = 'up'
    }
    else if (e.keyCode == '40') {

        console.log("down")
        // down arrow
        direction = 'down'
    }
    else if (e.keyCode == '37') {

        console.log("left")
        // left arrow
        direction = 'left'
    }
    else if (e.keyCode == '39') {

        console.log("right")
        // right arrow
        direction = 'right'
    }
    if (direction) {
        let message = new Paho.MQTT.Message(direction);
        message.destinationName = 'game/snake/direction'
        mqtt.send(message)
    }
}

// const client = mqtt.connect(host, port)
//
// client.on('error', (err) => {
//     console.log(err);
// })
//
// client.on('connect', () => {
//     console.log('connected');
//     client.subscribe('game/snake/board');
// });
//
// client.on('message', (topic, payload) => {
//     console.log(topic);
//     if (topic == 'game/snake/board') {
//         var direction = payload.toString();
//         nextDirection = direction;
//     }
// });