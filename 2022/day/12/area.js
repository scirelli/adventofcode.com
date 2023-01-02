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

module.exports.Node = class Node {
    constructor(value, weight = Number.MAX_SAFE_INTEGER, visited = false) {
        this.value = value;
        this.weight = weight;
        this._visited = visited;
        this.pathLength = 0;
    }

    toString() {
        return `(${this.value.toString()}, ${this.weight}, ${this._visited})`;
    }

    setPathLength(v) {
        this.pathLength = v;
        return this;
    }

    visited() {
        this._visited = true;
        return this;
    }

    equal(p) {
        return this.value === p.value && this.w === p.w && this.visited === p.visited;
    }
};
const Node = module.exports.Node;

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
                ss += this.map[this.toIndex(new Point(x, y))];
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
        this.areaMap.map = this.areaMap.map.map(v=>this.nodeFactory(v));
    }

    shortestPath() {
        throw new Error('Unimplemented method');
    }

    nodeFactory(value) {
        return new Node(value);
    }

    isValidMove(curPoint, prevPoint) {
        return curPoint.x >=0 && curPoint.x < this.areaMap.width && 
            curPoint.y >= 0 && curPoint.y < this.areaMap.height && 
            this.isNotToHigh(prevPoint, curPoint) &&
            this.hasNotBeenVisited(curPoint);
    }
    
    isNotToHigh(prevPoint, curPoint){
        return this.sub(prevPoint, curPoint) >= -1;
    }

    isToHigh(prevPoint, curPoint){
        return !this.isNotToHigh(prevPoint, curPoint);
    }

    markVisited(p) {
        this.getNode(p).visited();
        return this;
    }

    hasBeenVisited(p) {
        return this.getNode(p)._visited;
    }

    hasNotBeenVisited(p) {
        return !this.getNode(p)._visited;
    }

    getNode(p) {
        return this.areaMap.map[this.areaMap.toIndex(p)];
    }

    sub(a, b) {
        return this.getNode(a).value.charCodeAt(0) - this.getNode(b).value.charCodeAt(0);
    }

    compare(a, b) {
        return this.sub(a, b);
    }

    up(p) {
        return new Point(p.x, p.y - 1);
    }

    down(p) {
        return new Point(p.x, p.y + 1);
    }

    left(p) {
        return new Point(p.x - 1, p.y);
    }

    right(p) {
        return new Point(p.x + 1, p.y);
    }
};
const Traverser = module.exports.Traverser;

module.exports.DFS = class DFS extends Traverser{
    shortestPath() {
        const validMoves = [this.areaMap.start];
        let cur = null,
            pathLength = Number.MAX_SAFE_INTEGER, 
            nextNode = null;

        while(cur = validMoves.shift()){
            if(cur.equal(this.areaMap.goal)){
                pathLength = Math.min(this.getNode(cur).pathLength, pathLength);
                continue;
            }else{
                this.getNode(cur).visited();
            }

            nextNode = this.up(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setPathLength(this.getNode(cur).pathLength + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.left(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setPathLength(this.getNode(cur).pathLength + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.right(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setPathLength(this.getNode(cur).pathLength + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.down(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setPathLength(this.getNode(cur).pathLength + 1);
                validMoves.push(nextNode);
            }       
        }

        return pathLength;
    }
};
const DFS = module.exports.DFS;

module.exports.Dijkstra = class Dijkstra extends Traverser{
    shortestPath() {
        const validMovesQ = [this.areaMap.start],
            visited = (new Array(this.areaMap.width * this.areaMap.height)).fill(false),
            weights = (new Array(this.areaMap.width * this.areaMap.height)).fill(Number.MAX_SAFE_INTEGER);

        let cur = null;
    }
};
const Dijkstra = module.exports.Dijkstra;
