class Snake {
    snake = [[0, 3], [0, 2], [0, 1]];
    food = [3, 3];

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
    }

    move(direction) {
        const next = [...this.snake[0]];
        if (direction === 'right') {
            next[1] += 1;
            if (next[1] >= this.rows) {
                next[1] = 0;
            }
        } else if (direction === 'left') {
            next[1] -= 1;
            if (next[1] < 0) {
                next[1] = this.rows - 1;
            }
        } else if (direction === 'down') {
            next[0] += 1;
            if (next[0] >= this.columns) {
                next[0] = 0;
            }
        } else if (direction === 'up') {
            next[0] -= 1;
            if (next[0] < 0) {
                next[0] = this.columns - 1;
            }
        }

        if (next[0] === this.snake[0][0] && next[1] === this.snake[0][1]) {
            // TODO: Error: Attempt to assign to const or readonly variable
            // Stürzt immer wieder random ab, manchmal direkt beim start
            // liegt glaube ich daran, dass der esp teilweise random 'button' geschickt hat, ist jetzt auskommentiert
            next = [...this.snake[0]];
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
            this.food = [this.randomInt(this.rows), this.randomInt(this.columns)];
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

    display() {
        let board = this.getBoard();

        console.log('---')
        for (let row of board) {
            console.log(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7]);
        }
    }

    getBoard() {
        const board = Array(this.rows).fill().map(() => Array(this.columns).fill(0));
        board[this.food[0]][this.food[1]] = 3;

        for (let i = 0; i < this.snake.length; i++) {
            let part = this.snake[i];
            board[part[0]][part[1]] = i == 0 ? 1 : 2;
        }

        return board;
    }
}

exports.Snake = Snake;