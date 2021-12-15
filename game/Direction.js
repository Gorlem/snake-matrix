class Direction {
    static Up = new Direction('up');
    static Down = new Direction('down');
    static Left = new Direction('left');
    static Right = new Direction('right');

    static fromNumber(direction) {
        if (direction === 0) {
            return this.Up;
        } else if (direction === 1) {
            return this.Right;
        } else if (direction === 2) {
            return this.Down;
        } else if (direction === 3) {
            return this.Left;
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