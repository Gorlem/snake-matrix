const { Buffer } = require('buffer');

const { State } = require('./State');

class LostState extends State {
    action() {
        this.game.countdown();
    }

    getBoard() {
        return Buffer.from([
            0b00000000,
            0b00100100,
            0b00100100,
            0b00000000,
            0b00000000,
            0b00111100,
            0b01000010,
            0b00000000,
        ]);
    }
}

exports.LostState = LostState;