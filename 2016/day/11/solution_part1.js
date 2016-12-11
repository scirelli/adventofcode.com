/*  Rules
- Elevator can only carry two items.
- Elevator only moves when it has at least one item in it.
- Elevator must stop at each floor.
- Microchips can not be on a floor with generators unless the mirochip is with it's corresponding generator.
*/
var input =`The first floor contains a thulium generator, a thulium-compatible microchip, a plutonium generator, and a strontium generator.
The second floor contains a plutonium-compatible microchip and a strontium-compatible microchip.
The third floor contains a promethium generator, a promethium-compatible microchip, a ruthenium generator, and a ruthenium-compatible microchip.
The fourth floor contains nothing relevant.`;
input = input.split('\n');
/*
F4 .  .  .  .   .  .   .   .   .   .  .
F3 .  .  .  .   .  .   .  PRG PRM RG RM
F2 .  .  .  .   .  PLM SM  .   .   .  .
F1 E  TG TM PLG SG .   .   .   .   .  .
*/
var ___ = 0,
    TG  = 1,
    TM  = 2,
    PLG = 3,
    PLM = 4,
    SG  = 5,
    SM  = 6,
    PRG = 7,
    PRM = 8,
    RG  = 9,
    RM  = 10,
    TYPE_PAIRS = [0, TM, TG, PLM, PLG, SM, SG, PRM, PRG, RM, RG],
    microchips  = [TM,PLM,SM,PRM,RM],
    generators = [TG,PLG,SG,PRG,RG],
    TYPE_TO_NAME = [' . ', 'TG ', 'TM ', 'PLG', 'PLM', 'SG ', 'SM ', 'PRG', 'PRM', 'RG ', 'RM '],
    gameBoard = [
        [___,___,___,___,___,___,___,___,___,___],
        [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
        [___,___,___,___,PLM,SM ,___,___,___,___],
        [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
    ],
    game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);

var exampleInput = `The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.`;
exampleInput = '\n';
/*
F4 .  .  .  .  .  
F3 .  .  .  LG .  
F2 .  HG .  .  .  
F1 E  .  HM .  LM
*/
var HG = 1, HM = 2, LG =3, LM = 4,
    EXAMPLE_LOOK_UP = [' . ', 'HG ', 'HM ', 'LG ', 'LM ']
    EXAMPLE_TYPE_PAIRS = [0, HM, HG, LM, LG],
    exampleMicroChips = [HM,LM],
    exampleGenerators = [LG,HG],
    exampleGB = [
        [___,___,___,___],
        [___,___,LG ,___],
        [HG ,___,___,___],
        [___,HM ,___,LM ]
    ],
    exampleGame = new Game(exampleGB, exampleMicroChips, exampleGenerators, EXAMPLE_TYPE_PAIRS, EXAMPLE_LOOK_UP);
    
unitTests();
console.log(solveGameI(game));

function solveGame(game){
    var solutions = [];
    
    solve(game, 0);

    function solve(game, count){
        if(!game.isValidBoard()){
            return;
        }
        if(game.isSolution()){
            solutions.push(count);
            return;
        }

        for(var b=game.board, row, clone, r=b.length-1; r>=0; r--) {
            row = b[r];
            for(var col, c=0, cl=row.length, tmp; c<cl; c++){
                col = row[c];
                if(!game.isBlank(col)){
                    clone = game.clone();
                    tmp = clone.board[r-1][col];
                    clone.board[r-1][col] = clone.board[r][col];
                    clone.board[r][col] = tmp;
                    solve(clone, count+1);
                }
            }

            for(var col, c=row.length-1; c>=0; c--){
                col = row[c];
                if(!game.isBlank(col)){
                    clone = game.clone();
                    tmp = clone.board[r-1][col];
                    clone.board[r-1][col] = clone.board[r][col];
                    clone.board[r][col] = tmp;
                    solve(clone, count+1);
                }
            }
        }
    }

    return solutions;
}

function solveGameI(game){
    var solutions = 999,
        q = [{g:game, cnt:0}],
        g;
    
    while(g=q.shift()){
        game = g.g;
        
        if(!game.isValidBoard()){
            continue;
        }
        console.log(game.printStr());
        if(game.isSolution()){
            solutions = Math.min(solutions, g.cnt);
            continue;
        }

        for(var b=game.board, row, clone, r=b.length-1; r>0; r--) {
            row = b[r];
            for(var col, c=0, cl=row.length, tmp; c<cl; c++){
                col = row[c];
                if(!game.isBlank(col)){
                    clone = game.clone();
                    tmp = clone.board[r-1][c];
                    clone.board[r-1][c] = clone.board[r][c];
                    clone.board[r][c] = tmp;
                    g.cnt++;
                    q.push({g:clone, cnt:g.cnt});
                }
            }
        }
    }

    return solutions;
}

function Game(board, microchips, generators, typePair, nameLookup) {
    const BLANK = 0;

    this.board      = board;
    this.typePair   = typePair;
    this.nameLookup = nameLookup;
    this.microchips = microchips;
    this.generators = generators;

    this.isSolution = function() {
        var row = this.board[0];

        for(var r=1, l=this.board.length, row; r<l; r++){
            row = this.board[r];
            for(var c=0, cl=row.length, col; c<cl; c++){
                col = row[c];
                if(col !== BLANK) {
                    return false
                }
            }
        }
        return true; 
    };

    this.isValidBoard = function(){
        var isValid = true,
            self = this,
            microchips = this.microchips.reduce((ac, v)=>{ac[v] = true; return ac;}, {}),
            generators = this.generators.reduce((ac, v)=>{ac[v] = true; return ac;}, {});

        for(var rowIndex=0, rCnt=this.board.length, row, contents; rowIndex<rCnt; rowIndex++){
            row = this.board[rowIndex];
            contents = row.reduce(function(ac, item){
                if(microchips[item]){
                    ac.chips.push(item);
                }else if(generators[item]){
                    ac.gen[item] = true;
                }
                return ac;
            }, {gen:{}, chips:[]});
            
            if(Object.getOwnPropertyNames(contents.gen).length === 0 || contents.chips.length === 0){
                continue;
            }
            
            //Row contains both, microchips and generators.
            for(var chip in contents.chips){
                chip = contents.chips[chip];

                if(!contents.gen[self.typePair[chip]]){
                    return false;
                }
            }
        }

        return isValid;
    };

    this.printStr = function() {
         var str = '';

        for(var r=0, rl=this.board.length,row; r<rl; r++){
            row = this.board[r];
            for(var c=0, cl=row.length, p; c<cl; c++){
                p = row[c];
                str += this.nameLookup[p] + ' ';
            }
            str += '\n';
        }

        return str;
    };

    this.clone = function(){
        var board = [];

        for(var rowIndex=0, l=this.board.length, row; rowIndex<l; rowIndex++){
            row = this.board[rowIndex];
            board.push(row.slice(0));    
        }
        return new Game(board, this.microchips, this.generators, this.typePair, this.nameLookup);
    };

    this.copy = function(board){
        this.board = [];
        this.typePair = board.typePair;
        this.nameLookup = board.nameLookup;
        this.microchips = board.microchips;
        this.generators = board.generators;

        for(var rowIndex=0, l=board.board.length, row; rowIndex<l; rowIndex++){
            row = board.board[rowIndex];
            this.board.push(row.slice(0));    
        }

        return this;
    };

    this.isBlank = function(p) {
        return BLANK === p;
    }
}

function unitTests() {
    var ___ = 0, TG  = 1, TM  = 2, PLG = 3, PLM = 4, SG  = 5, SM  = 6, PRG = 7, PRM = 8, RG  = 9, RM  = 10,
        TYPE_PAIRS = [0, TM, TG, PLM, PLG, SM, SG, PRM, PRG, RM, RG],
        microchips  = [TM,PLM,SM,PRM,RM],
        generators = [TG,PLG,SG,PRG,RG],
        TYPE_TO_NAME = [' . ', 'TG ', 'TM ', 'PLG', 'PLM', 'SG ', 'SM ', 'PRG', 'PRM', 'RG ', 'RM '],
        gameBoard, game, result, expected,
        VALID = true,
        INVALID = false,
        tests = 0,
        failed = 0;

    test_isValidBoard();
    test_isSolution();    

    console.log(failed + '/' + tests + ' tests failed. ');
    function test_isSolution(){
        var fncName = 'isSolution';

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,___,PLM,SM ,___,___,___,___],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isSolution(), fncName, game.printStr());

        gameBoard = [
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,___,PLM,SM ,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isSolution(), fncName, game.printStr());

        gameBoard = [
            [TG ,TM ,PLG,SG ,PLM,SM ,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isSolution(), fncName, game.printStr());

        gameBoard = [
            [TG ,TM ,PLG,SG ,PLM,SM ,PRG,PRM,RG ,RM ],
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isSolution(), fncName, game.printStr());
    }

    function test_isValidBoard(){
        var fncName = 'isValidBoard';

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,___,PLM,SM ,___,___,___,___],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [TG ,___,___,___,PLM,SM ,___,___,___,___],
            [___,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());
        
        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,SG ,PLM,SM ,___,___,___,___],
            [TG ,TM ,PLG,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());
        
        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,PLG,SG ,PLM,SM ,___,___,___,___],
            [TG ,TM ,___,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,TM ,___,___,PLM,SM ,___,___,___,___],
            [TG ,___,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [TG ,TM ,PLG,SG ,PLM,SM ,PRG,PRM,RG ,RM ],
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());
        
        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,___],
            [___,___,___,___,PLM,SM ,___,___,___,RM ],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,___,RM ],
            [___,___,___,___,PLM,SM ,___,___,RG ,___],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,___,___,RG ,RM ],
            [___,___,___,___,PLM,SM ,PRG,PRM,___,___],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,___,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,RM ],
            [___,___,___,___,PLM,SM ,___,___,___,___],
            [TG ,TM ,PLG,SG ,___,___,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        gameBoard = [
            [___,TM ,___,___,___,___,___,___,___,___],
            [___,___,___,___,___,___,PRG,PRM,RG ,___],
            [TG ,___,___,___,___,___,___,___,___,RM ],
            [___,___,PLG,SG ,PLM,SM ,___,___,___,___],
        ];
        game = new Game(gameBoard, microchips, generators, TYPE_PAIRS, TYPE_TO_NAME);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());

        var HG = 1, HM = 2, LG =3, LM = 4,
            EXAMPLE_LOOK_UP = [' . ', 'HG ', 'HM ', 'LG ', 'LM ']
            EXAMPLE_TYPE_PAIRS = [0, HM, HG, LM, LG],
            exampleMicroChips = [HM,LM],
            exampleGenerators = [LG,HG],
            exampleGB = [
                [___,___,___,___],
                [___,___,LG ,___],
                [HG ,___,___,LM ],
                [___,HM ,___,___]
            ];
        game = new Game(exampleGB, exampleMicroChips, exampleGenerators, EXAMPLE_TYPE_PAIRS, EXAMPLE_LOOK_UP);
        expect(INVALID, game.isValidBoard(), fncName, game.printStr());

        exampleGB = [
            [HG ,HM ,LG ,___],
            [___,___,___,LM ],
            [___,___,___,___],
            [___,___,___,___]
        ];
        game = new Game(exampleGB, exampleMicroChips, exampleGenerators, EXAMPLE_TYPE_PAIRS, EXAMPLE_LOOK_UP);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());

        exampleGB = [
            [HG ,HM ,LG ,LM ],
            [___,___,___,___],
            [___,___,___,___],
            [___,___,___,___]
        ];
        game = new Game(exampleGB, exampleMicroChips, exampleGenerators, EXAMPLE_TYPE_PAIRS, EXAMPLE_LOOK_UP);
        expect(VALID, game.isValidBoard(), fncName, game.printStr());
    }

    function expect(expected, actual, fncName, msg) {
        tests++;
        if(expected !== actual){
            failed++;
            throw new Error('Failed:\n\tExpected \'' + fncName + '\' to return \'' + expected + '\'\n' + msg);
        }
    }
}
