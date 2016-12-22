(function(){
var input = 3014387,
    exampleInput = 5,
    firstElf = new Node(1, 1);

    createList(firstElf, exampleInput); 
    playGame(firstElf);

    function playGame(firstElf){
        while(firstElf !== firstElf.nextElf){
            firstElf.addPresents(firstElf.nextElf.presentCount);
            firstElf.nextElf = firstElf.nextElf.nextElf;
            firstElf = firstElf.nextElf;
        }
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
