#!/usr/bin/env node
/*
--- Day 8: Treetop Tree House ---
--- Part Two ---
Content with the amount of tree cover available, the Elves just need to know the best spot to build their tree house: they would like to be able to see a lot of trees.

To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

The Elves don't care about distant trees taller than those found by the rules above; the proposed tree house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

In the example above, consider the middle 5 in the second row:

30373
25512
65332
33549
35390
Looking up, its view is not blocked; it can see 1 tree (of height 3).
Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
Looking right, its view is not blocked; it can see 2 trees.
Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).
A tree's scenic score is found by multiplying together its viewing distance in each of the four directions. For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

30373
25512
65332
33549
35390
Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
Looking left, its view is not blocked; it can see 2 trees.
Looking down, its view is also not blocked; it can see 1 tree.
Looking right, its view is blocked at 2 trees (by a massive tree of height 9).
This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

Consider each tree on your map. What is the highest scenic score possible for any tree?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const forest = {
    grid: [],
    width : 0,
    height : 0,
    toIndex: function toIndex(x, y) {
        return x + y*(this.width);
    },
    getTreeHeight: function getTreeHeight(x, y) {
        return this.grid[this.toIndex(x, y)];
    },
    visibleTrees: function visibleTrees() {
        let highestScore = 0;
        for(let y=1; y<this.height-1; y++){
            for(let x=1; x<this.width-1; x++){
                console.log('Checking: ', x,y);
                highestScore = Math.max(highestScore, this.viewDistanceUp(x, y) *
                                                      this.viewDistanceRight(x, y) *
                                                      this.viewDistanceDown(x, y) *
                                                      this.viewDistanceLeft(x, y)
                );
            }
        }
        return highestScore;
    },
    viewDistanceUp: function isVisibleUp(x, y) {
        let treeHeight = this.getTreeHeight(x, y),
            viewableTrees = 0;
        y--;
        for(; y>=0; y--){
            viewableTrees++;
            if(this.getTreeHeight(x, y) >= treeHeight) break;
        }
        return viewableTrees;
    },
    viewDistanceDown: function isVisibleDown(x, y) {
        let treeHeight = this.getTreeHeight(x, y),
            viewableTrees = 0;
        y++;
        for(; y<this.height; y++){
            viewableTrees++;
            if(this.getTreeHeight(x, y) >= treeHeight) break;
        }
        return viewableTrees;
    },
    viewDistanceRight: function isVisibleRight(x, y) {
        let treeHeight = this.getTreeHeight(x, y),
            viewableTrees = 0;
        x++;
        for(; x<this.width; x++){
            viewableTrees++;
            if(this.getTreeHeight(x, y) >= treeHeight) break;
        }
        return viewableTrees;
    },
    viewDistanceLeft: function isVisibleLeft(x, y) {
        let treeHeight = this.getTreeHeight(x, y),
            viewableTrees = 0;
        x--;
        for(; x>=0; x--){
            viewableTrees++;
            if(this.getTreeHeight(x, y) >= treeHeight) break;
        }
        return viewableTrees;
    }
};

rl.on('line', (function() {
    return (line)=> {
        console.log(line);
        forest.width = line.length;
        forest.grid = forest.grid.concat(line.split('').map(Number));
        forest.height += 1;
    };
})());

rl.on('close', ()=>{
    console.log(forest);
    console.log(forest.visibleTrees());
});
