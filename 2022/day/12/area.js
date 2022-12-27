module.exports.Point = class Point{
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
};
const Point = module.exports.Point;

module.exports.Area = class Area{
    constructor() {
        this.map = [];
        this.width = 0;
        this.height = 0;
        this.start = new Point();
        this.goal = new Point();
    }

    toString() {
        let s = [];
        for(let y=0, ss=''; y<this.height; y++) {
            ss = '';
            for(let x=0; x<this.width; x++) {
                ss += this.map[this.toIndex(x, y)];
            }
            s.push(ss);
        }
        return s.join('\n');
    }

    toIndex(x, y) {
        return x + y*(this.width);
    }
};
const Area = module.exports.Area;

module.exports.Traverser = class Traverser{
    constructor(areaMap = new Area()) {
        this.areaMap = areaMap;
    }

    shortestPath() {
    }

    isValidMove(p) {
        if(p.x >=0 && p.x < this.areaMap.width && p.y >= 0 && p.y < this.areaMap.height) {
            return true;
        }
        return false;
    }

    up(p) {
        return new Point(p.x, p.y--);
    }

    down(p) {
        return new Point(p.x, p.y++);
    }

    left(p) {
        return new Point(p.x--, p.y);
    }

    right(p) {
        return new Point(p.x++, p.y);
    }
};
