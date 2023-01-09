#!/usr/bin/env node
/*
--- Day 7: No Space Left On Device ---
--- Part Two ---
Now, you're ready to choose a directory to delete.

The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.
Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const tree = {};

rl.on('line', (function() {
    let curDir = [''],
        DirInfo = {size:0};

    tree[''] = Object.create(DirInfo);

    return (input) => {
        console.log(`Received: ${input}`);
        parseLine(input);
    };

    function parseLine(line) {
        line = line.split(' ');
        switch(line[0]){
            case '$':
                parseCommand(line);
                break;
            default:
                parseFileInfo(line);
        }
    }

    function parseCommand(cmd) {
        cmd.shift();
        switch(cmd[0]){
            case 'ls': break;
            case 'cd':
                changeDirCmd(cmd);
                break;
        }
    }

    function parseFileInfo(info) {
        let cd = curDir.slice(0);
        switch(info[0]){
            case 'dir':
                cd.push(info[1])
                if(! tree[cd.join('/')]) {
                    tree[cd.join('/')] = Object.create(DirInfo);
                }else{
                    console.error('Child dir already exists', info);
                }
                break;
            default:
                tree[curDir.join('/')].size += parseInt(info[0]);
        }
    }

    function changeDirCmd(cmd) {
        let cd = curDir.slice(0);
        //.., /, <child>        
        switch(cmd[1]){
            case '/':
                curDir = [''];
                break;
            case '..':
                if(curDir.length > 1) curDir.pop();
                break;
            default:
                cd.push(cmd[1]);
                if(tree[cd.join('/')]) {
                    curDir.push(cmd[1]);
                }else{
                    console.error('Child dir does not exist', cmd);
                }
        }
    }

})());

rl.on('close', ()=>{
    const UPDATE_SZ = 30000000,
        TOTAL_DISK_SPACE = 70000000;

    console.log(tree);

    let dirSizes = dirsTotalSizes(tree);
    console.log(dirSizes);
    console.log('Root size', dirSizes['']);
    let freeSpace = TOTAL_DISK_SPACE - dirSizes['']
    console.log('Remaining disk space', freeSpace);
    let spaceNeeded = UPDATE_SZ - freeSpace;
    console.log('Free at least', spaceNeeded);

    let result = TOTAL_DISK_SPACE;
    for(let path in dirSizes){
        if(dirSizes[path] - spaceNeeded >= 0){
            result = Math.min(result, dirSizes[path]);
        }
    }
    console.log(result);
});

function dirsTotalSizes(tree) {
    let dirSizes = {};
    for(let prnt in tree){
        let sz = 0;
        for(let path in tree){
            if(path.startsWith(prnt)){
                sz += tree[path].size;
            }
        }
        dirSizes[prnt] = sz;
    }
    return dirSizes;
}
