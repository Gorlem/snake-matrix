class Direction {
    static Up = new Direction('up');
    static Down = new Direction('down');
    static Left = new Direction('left');
    static Right = new Direction('right');

    static fromString(direction) {
        if (direction === 'up') {
            return this.Up;
        } else if (direction === 'down') {
            return this.Down;
        } else if (direction === 'left') {
            return this.Left;
        } else if (direction === 'right') {
            return this.Right;
        }

        return null;
    }

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `Direction.${this.name}`;
    }
}

exports.Direction = Direction;