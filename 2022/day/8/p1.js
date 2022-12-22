#!/usr/bin/env node
/*
--- Day 8: Treetop Tree House ---
The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

30373
25512
65332
33549
35390
Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:

The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
The top-middle 5 is visible from the top and right.
The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
The left-middle 5 is visible, but only from the right.
The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
The right-middle 3 is visible from the right.
In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

Consider your map; how many trees are visible from outside the grid?
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
        let visibleTrees = this.width * 2 + (this.height-2) * 2; //Perimeter is all visible
        for(let y=1; y<this.height-1; y++){
            for(let x=1; x<this.width-1; x++){
                console.log('Checking: ', x,y);
                if( 
                    this.isVisibleUp(x, y)    ||
                    this.isVisibleRight(x, y) ||
                    this.isVisibleDown(x, y)  ||
                    this.isVisibleLeft(x, y) 
                ){
                    console.log('visible');
                    visibleTrees++;
                }
            }
        }
        return visibleTrees;
    },
    isVisibleUp: function isVisibleUp(x, y) {
        let treeHeight = this.getTreeHeight(x, y);
        y--;
        for(; y>=0; y--){
            if(this.getTreeHeight(x, y) >= treeHeight) return false;
        }
        return true;
    },
    isVisibleDown: function isVisibleDown(x, y) {
        let treeHeight = this.getTreeHeight(x, y);
        y++;
        for(; y<this.height; y++){
            if(this.getTreeHeight(x, y) >= treeHeight) return false;
        }
        return true;
    },
    isVisibleRight: function isVisibleRight(x, y) {
        let treeHeight = this.getTreeHeight(x, y);
        x++;
        for(; x<this.width; x++){
            if(this.getTreeHeight(x, y) >= treeHeight) return false;
        }
        return true;
    },
    isVisibleLeft: function isVisibleLeft(x, y) {
        let treeHeight = this.getTreeHeight(x, y);
        x--;
        for(; x>=0; x--){
            if(this.getTreeHeight(x, y) >= treeHeight) return false;
        }
        return true;
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
