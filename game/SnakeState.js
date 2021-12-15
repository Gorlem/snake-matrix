const { State } = require('./state');
const { Direction } = require('./Direction');

class SnakeState extends State {
    constructor(game) {
        super(game);

        // The snake starts in the first row with a length of three
        this.snake = [[0, 2], [0, 1], [0, 0]];
        // Randomly places the apple
        this.moveFood();
        // Move to the right by default
        this.direction = Direction.Right;
    }

    // Store the last direction input
    move(direction) {
        this.direction = direction;
    }
    
    tick() {
        const next = [...this.snake[0]];

        // Calculate the next snake coordinates
        // If it crossed the borders, set it to the other end of the board
        if (this.direction === Direction.Right) {
            next[1] += 1;
            if (next[1] >= this.game.rows) {
                next[1] = 0;
            }
        } else if (this.direction === Direction.Left) {
            next[1] -= 1;
            if (next[1] < 0) {
                next[1] = this.game.rows - 1;
            }
        } else if (this.direction === Direction.Down) {
            next[0] += 1;
            if (next[0] >= this.game.columns) {
                next[0] = 0;
            }
        } else if (this.direction === Direction.Up) {
            next[0] -= 1;
            if (next[0] < 0) {
                next[0] = this.game.columns - 1;
            }
        } else {
            // Unknown direction
            return;
        }

        // The game is over, if the snake bites itself
        if (this.isInSnake(next)) {
            this.game.menu();
            return;
        }

        // Add the new snake coordinates to the top of the list
        this.snake.splice(0, 0, next);

        // Chooses a new food spot, if the snake is at the current food spot
        // Also doesn't remove the last snake entry, so the snake length increases by one
        if (this.isAtFood(next)) {
            this.moveFood();
        } else {
            this.snake.pop();
        }
    }

    // Choose a position which is not covered by the snake
    moveFood() {
        do {
            this.food = [this.randomInt(this.game.rows), this.randomInt(this.game.columns)];
        } while(this.isInSnake(this.food));
    }

    // Check if the position is part of the snnake
    isInSnake(position) {
        for (let part of this.snake) {
            if (part[0] === position[0] && part[1] === position[1]) {
                return true;
            }
        }

        return false;
    }

    // Check if the position is the food position
    isAtFood(position) {
        return position[0] === this.food[0] && position[1] === this.food[1];
    }

    randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Construct the compact board layout
    // Each bit corresponds to a position of the board
    getBoard() {
        const board = Array(this.game.rows).fill().map(() => 0b00000000);
        
        for (let i = 0; i < this.snake.length; i++) {
            let part = this.snake[i];
            board[part[0]] |= 0b10000000 >> part[1];
        }

        return Buffer.from(board);
    }

    // Returns the food coordinates
    getExtras() {
        return [this.food];
    }
}

exports.SnakeState = SnakeState;