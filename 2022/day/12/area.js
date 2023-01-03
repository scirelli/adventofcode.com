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
    constructor(value, point = new Point(), weight = Number.MAX_SAFE_INTEGER, visited = false) {
        this.value = value;
        this.point = point;
        this.weight = weight;
        this.dist = Number.MAX_SAFE_INTEGER;
        this._visited = visited;
    }

    toString() {
        return JSON.stringify(this);
    }

    setDist(v) {
        this.dist = v;
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
    constructor(area, width, height, start, goal) {
        this.map = new Array(width*height);
        this.width = width;
        this.height = height;
        this.start = start;
        this.goal = goal;

        this.setArea(area);
    }

    setArea(area) {
        for(let y=0; y<this.height; y++){
            for(let x=0,p; x<this.width; x++){
                p = new Point(x,y);
                this.map[this.toIndex(p)] = new Node(area[this.toIndex(p)], p);
            }
        }
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

    getNode(p) {
        return this.map[this.toIndex(p)];
    }
};
const Area = module.exports.Area;

module.exports.Traverser = class Traverser{
    constructor(areaMap = new Area()) {
        this.areaMap = areaMap;
        this.getNode(this.areaMap.start).setDist(0);
    }

    shortestPath() {
        throw new Error('Unimplemented method');
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
        return this.areaMap.getNode(p);
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
            dist = Number.MAX_SAFE_INTEGER, 
            nextNode = null;

        while(cur = validMoves.shift()){
            if(cur.equal(this.areaMap.goal)){
                dist = Math.min(this.getNode(cur).dist, dist);
                continue;
            }else{
                this.getNode(cur).visited();
            }

            nextNode = this.up(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.left(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.right(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.down(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }       
        }

        return dist;
    }
};
const DFS = module.exports.DFS;

module.exports.Dijkstra = class Dijkstra extends Traverser{
    shortestPath() {
        const validMovesQ = new PriorityQueue();
        let cur = null,
            nextNode = null,
            goalNode = this.getNode(this.areaMap.goal);

        validMovesQ.insert(this.getNode(this.areaMap.start));
        while(cur = validMoves.remove()){
            cur.visited();
            if(cur.equal(goalNode)){
                dist = Math.min(this.getNode(cur.loc).dist, dist);
                continue;
            }

            nextNode = this.up(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.left(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.right(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }
            nextNode = this.down(cur);
            if(this.isValidMove(nextNode, cur)){
                this.getNode(nextNode).setDist(this.getNode(cur).dist + 1);
                validMoves.push(nextNode);
            }       
        }

        return dist;
    }

};
const Dijkstra = module.exports.Dijkstra;

class PriorityQueue{
    //Cheat for now use built in sort.
    constructor(compare = (a,b)=>a.node.weight - b.node.weight){
        this.q = [];
        this.compare = compare;
    }

    insert(i) {
        this.q.push(i);
        this.q.sort(this.compare);
        return this;
    }

    remove() {
        return this.q.shift();
    }
}
