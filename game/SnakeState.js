const { State } = require('./state');
const { Direction } = require('./Direction');

class SnakeState extends State {
    constructor(game) {
        super(game);

        this.snake = [[0, 2], [0, 1], [0, 0]];
        this.moveFood();
    }

    move(direction) {
        console.log(direction);
        const next = [...this.snake[0]];

        if (direction === Direction.Right) {
            next[1] += 1;
            if (next[1] >= this.game.rows) {
                next[1] = 0;
            }
        } else if (direction === Direction.Left) {
            next[1] -= 1;
            if (next[1] < 0) {
                next[1] = this.game.rows - 1;
            }
        } else if (direction === Direction.Down) {
            next[0] += 1;
            if (next[0] >= this.game.columns) {
                next[0] = 0;
            }
        } else if (direction === Direction.Up) {
            next[0] -= 1;
            if (next[0] < 0) {
                next[0] = this.game.columns - 1;
            }
        } else {
            // Unknown direction
            return;
        }

        // Wofür hab ich das nochmal gemacht? 
        if (next[0] === this.snake[0][0] && next[1] === this.snake[0][1]) {
            next = [...this.snake[0]];
        }

        // Wenn die Schlange in sich selbst läuft hat man verloren
        if (this.isInSnake(next)) {
            this.game.menu();
            return;
        }

        this.snake.splice(0, 0, next);

        if (this.isAtFood(next)) {
            this.moveFood();
        } else {
            this.snake.pop();
        }
    }

    moveFood() {
        do {
            this.food = [this.randomInt(this.game.rows), this.randomInt(this.game.columns)];
        } while(this.isInSnake(this.food));
    }

    isInSnake(position) {
        for (let part of this.snake) {
            if (part[0] === position[0] && part[1] === position[1]) {
                return true;
            }
        }

        return false;
    }

    isAtFood(position) {
        return position[0] === this.food[0] && position[1] === this.food[1];
    }

    randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getBoard() {
        const board = Array(this.game.rows).fill().map(() => 0b00000000);
        
        for (let i = 0; i < this.snake.length; i++) {
            let part = this.snake[i];
            board[part[0]] |= 0b10000000 >> part[1];
        }

        return Buffer.from(board);
    }

    getExtras() {
        return [this.food];
    }
}

exports.SnakeState = SnakeState;