class Direction {
    static Up = new Direction('up');
    static Down = new Direction('down');
    static Left = new Direction('left');
    static Right = new Direction('right');

    // Convert the direction string to and Direction instance
    static fromString(direction) {
        if (direction === 'u') {
            return this.Up;
        } else if (direction === 'd') {
            return this.Down;
        } else if (direction === 'l') {
            return this.Left;
        } else if (direction === 'r') {
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