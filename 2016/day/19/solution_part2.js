(function(){
    'use strict';

    var input = 3014387,
        exampleInput = 5,
        firstElf = new Node(1, 1),
        winner = null;

    createList(firstElf, input); 
    winner = playGame(firstElf);
    console.log('Winner is elf #' + winner.elfNumber);
    
    function playGame(firstElf){
        while(firstElf !== firstElf.nextElf){
            takeOpposite(firstElf);
            firstElf = firstElf.nextElf;
        }
        return firstElf;
    }
    
    function takeOpposite(node){
        var circleSize = 0,
            startNode = node,
            halfSize = 0,
            prevElf = null,
            curPos = 1;
        
        do{
            node = node.nextElf;
            circleSize++;
        }while(node != startNode);
        halfSize = Math.ceil(circleSize/2);
        console.log(halfSize);
        
        if(halfSize <= 1){
            node.addPresents(node.nextElf.presentCount);
            node.nextElf = node;
            return;
        }

        while(curPos < halfSize){
            prevElf = node;
            node = node.nextElf;
            curPos++;
        }

        startNode.addPresents(node.presentCount);
        prevElf.nextElf = node.nextElf;
    }

    function createList(head, count){
        var h = head;

        for(var i=2; i<=count; i++){
            head.nextElf = new Node(i, 1);
            head = head.nextElf;
        }
        head.nextElf = h;
        return h;
    }

    function Node(elfNumber, presentCount){
        this.elfNumber = elfNumber;
        this.presentCount = presentCount;
        this.nextElf = null;

        this.addPresents = function(presentCount){
            this.presentCount += presentCount;
        };
    }
})();
