window.addEventListener('load', () => {
    let svg = d3.select("svg#game")

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            svg.append("circle")
                .attr('id', 'p' + i + j)
                .attr('cy', (i + 1) * 100)
                .attr('cx', (j + 1) * 100)
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
    mqtt.subscribe('board');
}

function MQTTconnect() {
    console.log('connecting to ' + host + ' ' + port);
    mqtt = new Paho.MQTT.Client(host, port, "", "clientjs", transport = "websockets");
    let options = {
        timeout: 3,
        onSuccess: onConnect
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options);
}

function onMessageArrived(msg) {
    if (msg.destinationName === 'board') {
        let board = msg.payloadBytes
 
        for (let i = 0; i < 8; i++) {
            let base2 = board[i].toString(2)

            for (let j = 0; j < 8 - base2.length; j++) {
                d3.select('circle#p' + i + j).attr('class', 'off');
            }
            
            for (let j = 0; j < base2.length; j++) {
                if (base2[j] == 1) {
                    d3.select('circle#p' + i + (8 - base2.length + j))
                        .attr('class', 'on');
                } else {
                    d3.select('circle#p' + i + (8 - base2.length + j))
                        .attr('class', 'off');
                }
            }
        }
        d3.select('circle#p' + board[8] + board[9]).attr('class', 'food')
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    let direction = false;
    if (e.keyCode == '38') {
        // up arrow
        direction = 'up'
    } else if (e.keyCode == '40') {
        // down arrow
        direction = 'down'
    } else if (e.keyCode == '37') {
        // left arrow
        direction = 'left'
    } else if (e.keyCode == '39') {
        // right arrow
        direction = 'right'
    }
    
    if (direction) {
        sendDirection(direction);
    }

    if (e.keyCode == '32') {
        sendAction();
    }
}

function sendDirection(direction) {
    let message = new Paho.MQTT.Message(direction);
    message.destinationName = 'direction'
    mqtt.send(message)
}

function sendAction () {
    let message = new Paho.MQTT.Message('');
    message.destinationName = 'action'
    mqtt.send(message)
}