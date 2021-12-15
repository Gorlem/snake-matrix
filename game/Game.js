const { LostState } = require('./LostState');
const { CountdownState } = require('./CountdownState');
const { SnakeState } = require('./SnakeState');

// Class used to delegate functions to the different State instances
class Game {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.countdown();
    }

    menu() {
        this.state = new LostState(this);
    }

    countdown() {
        this.state = new CountdownState(this);
    }

    snake() {
        this.state = new SnakeState(this);
    }

    action() {
        this.state.action();
    }

    move(direction) {
        this.state.move(direction);
    }

    tick() {
        this.state.tick();
    }

    getBoard() {
        return this.state.getBoard();
    }

    getExtras() {
        return this.state.getExtras();
    }
}

exports.Game = Game;