// After page load add circles to svg and connect to MQTT
window.addEventListener('load', () => {
    let svg = d3.select("svg#game");

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            svg.append("circle")
                .attr('id', 'p' + i + j)
                .attr('cy', (i + 1) * 100)
                .attr('cx', (j + 1) * 100)
                .attr('r', 40)
                .attr('class', 'off');
        }
    }

    MQTTconnect();
})

// MQTT Broker
let mqtt;
let host = 'localhost';
let port = 8080;

// Connect to MQTT Broker
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

// Subscribe to MQTT topics after successful connection to MQTT Broker
function onConnect() {
    console.log('connected');
    mqtt.subscribe('board');
}

// Receive MQTT Message and Display the information
function onMessageArrived(msg) {
    if (msg.destinationName === 'board') {
        let board = msg.payloadBytes;
 
        for (let i = 0; i < 8; i++) {
            let base2 = board[i].toString(2).padStart(8, '0');
            
            // Set all fields to either on or off, depending on the bit from the message
            for (let j = 0; j < base2.length; j++) {
                if (base2[j] == 1) {
                    d3.select('circle#p' + i + j).attr('class', 'on');
                } else {
                    d3.select('circle#p' + i + j).attr('class', 'off');
                }
            }
        }

        // Add the food class to the apple
        d3.select('circle#p' + board[8] + board[9]).attr('class', 'food');
    }
}

// Event for Key Press
document.onkeydown = checkKey;
function checkKey(e) {
    let direction = false;
    // Arrow Keys
    if (e.keyCode == '38') {
        // up arrow
        direction = 0;
    } else if (e.keyCode == '39') {
        // right arrow
        direction = 1;
    } else if (e.keyCode == '40') {
        // down arrow
        direction = 2;
    } else if (e.keyCode == '37') {
        // left arrow
        direction = 3;
    }
    
    if (direction) {
        sendDirection(direction);
    }

    // Spacebar
    if (e.keyCode == '32') {
        sendAction();
    }
}

// Send direction topic
function sendDirection(direction) {
    let message = new Paho.MQTT.Message(direction);
    message.destinationName = 'direction';
    message.qos = 1;
    mqtt.send(message);
}

// Send action topic
function sendAction () {
    let message = new Paho.MQTT.Message('');
    message.destinationName = 'action';
    message.qos = 1;
    mqtt.send(message);
}