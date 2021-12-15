const { Buffer } = require('buffer');

// Default implementation for the different States
class State {
    constructor(game) {
        this.game = game;
    }

    tick() {
        
    }

    move(direction) {

    }

    action() {

    }

    // Returns an completly empty board by default
    getBoard() {
        const amountOfBytes = Math.ceil(this.game.rows * this.game.columns / 8);
        return Buffer.alloc(amountOfBytes);
    }

    getExtras() {
        return [];
    }
}

exports.State = State;