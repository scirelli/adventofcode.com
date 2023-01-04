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
    constructor(value, coord = new Point(), weight = Number.MAX_SAFE_INTEGER, visited = false) {
        this.value = value;
        this.coord = coord;
        this.weight = weight;
        this.dist = Number.MAX_SAFE_INTEGER;
        this.visited = visited;
    }

    toString() {
        return JSON.stringify(this);
    }

    setDist(v) {
        this.dist = v;
        return this;
    }

    visit() {
        this.visited = true;
        return this;
    }

    static equal(p1, p2) {
        return p1.value === p2.value && p1.w === p2.w && p1.visited === p2.visited;
    }

    static sub(n1, n2) {
        return n1.value.charCodeAt(0) - n2.value.charCodeAt(0);
    }

    static compare(n1, n2) {
        return Node.sub(n1, n2);
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

    toIndex(coord) {
        return coord.x + coord.y*(this.width);
    }

    getNode(coord) {
        return this.map[this.toIndex(coord)];
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

    isValidMove(curNode, nextNode) {
        return nextNode.coord.x >=0 && nextNode.coord.x < this.areaMap.width && 
            nextNode.coord.y >= 0 && nextNode.coord.y < this.areaMap.height && 
            this.isNotToHigh(curNode, nextNode);
    }
    
    isNotToHigh(curNode, nextNode){
        return Node.sub(curNode, nextNode) >= -1;
    }

    isToHigh(curNode, nextNode){
        return !this.isNotToHigh(curNode, nextNode);
    }

    markVisited(coord) {
        this.getNode(coord).visit();
        return this;
    }

    hasBeenVisited(coord) {
        return this.getNode(coord).visited;
    }

    hasNotBeenVisited(coord) {
        return !this.hasBeenVisited(coord);
    }

    getNode(coord) {
        return this.areaMap.getNode(coord);
    }

    neighbors(node) {
        throw new Error('Not implemented');
    }
};
const Traverser = module.exports.Traverser;

module.exports.DFS = class DFS extends Traverser{
    shortestPath() {
        const validMoves = [this.getNode(this.areaMap.start)];
        let cur = null,
            dist = Number.MAX_SAFE_INTEGER, 
            nextNode = null;

        while(cur = validMoves.shift()){
            if(cur.coord.equal(this.areaMap.goal)){
                return cur.dist;
            }

            cur.visit();

            this.neighbors(cur).forEach(n=>{
                n.setDist(cur.dist + 1);
                if(!n.visited) validMoves.push(n);
            });
        }

        return dist;
    }

    neighbors(node) {
        return [
            this.getNode(this.up(node.coord)),
            this.getNode(this.down(node.coord)),
            this.getNode(this.left(node.coord)),
            this.getNode(this.right(node.coord))
        ].filter(n=>n && this.isValidMove(node, n));
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
const DFS = module.exports.DFS;

module.exports.Dijkstra = class Dijkstra extends Traverser{
    shortestPath() {
        const validMovesQ = new PriorityQueue();
        let curNode = null,
            goalNode = this.getNode(this.areaMap.goal);

        validMovesQ.insert(this.getNode(this.areaMap.start));
        while(curNode = validMovesQ.remove()){
            curNode.visit();
            if(curNode.coord.equal(goalNode)){
                return curNode.dist;
            }

            this.neighbors(curNode).forEach(nb=>{
                if(curNode.dist + 1 < nb.dist){
                    nb.dist = curNode.dist + 1;
                }
                if(!nb.visited) validMovesQ.insert(nb);
            });
        }

        return 0;
    }

    neighbors(node) {
        return [
            //up
            this.getNode(new Point(node.coord.x, node.coord.y - 1)),
            //down
            this.getNode(new Point(node.coord.x, node.coord.y + 1)),
            //left
            this.getNode(new Point(node.coord.x - 1, node.coord.y)),
            //right
            this.getNode(new Point(node.coord.x + 1, node.coord.y))
        ].filter(n=>n && this.isValidMove(node, n));
    }

};
const Dijkstra = module.exports.Dijkstra;

class PriorityQueue{
    //Cheat for now use built in sort.
    constructor(compare = (a,b)=>a.dist - b.dist){
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
