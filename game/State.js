const { Buffer } = require('buffer');

class State {
    constructor(game) {
        this.game = game;
    }

    move(direction) {

    }

    action() {

    }

    getBoard() {
        const amountOfBytes = Math.ceil(this.game.rows * this.game.columns / 8);
        return Buffer.alloc(amountOfBytes);
    }

    getExtras() {
        return [];
    }
}

exports.State = State;