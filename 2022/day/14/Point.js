module.exports = class Point {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }

    add(p) {
        return new Point(this.x + p.x, this.y + p.y);
    }

    sub(p) {
        return new Point(this.x - p.x, this.y - p.y);
    }

    copy(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}
