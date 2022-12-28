module.exports.Point = class Point{
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    equal(p) {
        return this.x === p.x && this.y === p.y;
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

    toIndex(p) {
        return p.x + p.y*(this.width);
    }

    getValue(p){
        return this.map[this.toIndex(p)];
    }

    sub(a, b) {
        return this.getValue(a).charCodeAt(0) - this.getValue(b).charCodeAt(0);
    }

    compare(a, b) {
        return this.sub(a, b);
    }
};
const Area = module.exports.Area;

module.exports.Traverser = class Traverser{
    constructor(areaMap = new Area()) {
        this.areaMap = areaMap;
    }

    shortestPath() {
        const validMoves = [this.areaMap.start];
        let visited = {}, cur,
            path = [], paths = [];

        while(cur = validMoves.shift()){
            visited[cur.toString()] = true;
            path.push(cur);
            if(cur.equal(this.areaMap.goal)){
                paths.push(path.slice(0));
                path.pop();
            }
            let c = up(cur);
            if(this.isValidMove(c)) validMoves.push(c);
            c = left(cur);
            if(this.isValidMove(c)) validMoves.push(c);
            c = right(cur);
            if(this.isValidMove(c)) validMoves.push(c);
            c = down(cur);
            if(this.isValidMove(c)) validMoves.push(c);
        }
    }

    isValidMove(c, p) {
        if(p.x >=0 && p.x < this.areaMap.width && p.y >= 0 && p.y < this.areaMap.height) {
            if(this.areaMap.sub(c, p) >= -1) 
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
