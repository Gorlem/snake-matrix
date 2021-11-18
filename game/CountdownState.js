const { Buffer } = require('buffer');

const { State } = require('./State');

class CountdownState extends State {
    countdown = 3;

    boards = [
        [
            0b00000000,
            0b00001000,
            0b00011000,
            0b00101000,
            0b00001000,
            0b00001000,
            0b00001000,
            0b00000000,
        ],
        [
            0b00000000,
            0b00111000,
            0b00000100,
            0b00000100,
            0b00011000,
            0b00100000,
            0b00111100,
            0b00000000,
        ],
        [
            0b00000000,
            0b00111000,
            0b00000100,
            0b00011000,
            0b00000100,
            0b00000100,
            0b00111000,
            0b00000000,
        ]   
    ]

    move(direction) {
        if (this.countdown === 0) {
            this.game.snake();
            return;
        }

        this.countdown--;
    }

    getBoard() {
        if (this.countdown === 3) {
            return this.boards[2];
        }

        return Buffer.from(this.boards[this.countdown]);
    }
}

exports.CountdownState = CountdownState;