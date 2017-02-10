(function(gameAI){
    'use strict';
    const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg',
        BORDER_THICKNESS = 1,
        BLACK            = 'rgb(0,0,0)',
        WHITE            = 'rgb(255,255,255)',
        GRAY             = 'rgb(128,128,128)',
        YELLOW           = 'rgb(247,255,0)', //'rgb(255,255,0)',
        RED              = 'rgb(255,0,0)',
        GREEN            = 'rgb(0,255,0)',
        MAGENTA          = 'rgb(255,0,255)',
        COLOR_WALL       = BLACK,
        COLOR_HALL       = WHITE,
        COLOR_PATH       = GRAY,
        COLOR_GOAL       = YELLOW,
        COLOR_START      = YELLOW,
        COLOR_BORDER     = BLACK,
        COLOR_BAD_PATH   = MAGENTA,
        COLOR_FOUND      = RED,
        SPEED            = 100,
        FONT_SIZE        = 35,
        BLINK_INTERVAL   = 500,
        REMOVE_FOUND_DELAY = 1500;

    var oReq = new XMLHttpRequest(),

        startBtn = document.querySelector('#start'),
        stopBtn = document.querySelector('#stop'),
        fasterBtn = document.querySelector('#faster'),
        slowerBtn = document.querySelector('#slower'),
        output = document.querySelector('#output'),
        startRoom = document.querySelector('#startRoom'),
        endRoom = document.querySelector('#endRoom'),
        sbAlgorithm = document.querySelector('#algorithm'),

        svg = document.querySelector('svg'),
        svgWidth = svg.getAttributeNS(null, 'width'),
        svgHeight = svg.getAttributeNS(null, 'height'),
        shouldContinue = false,
        tick, colCount, startLoc, endLoc, speed = SPEED, game,
        algorithm = 'dfs',
        path = [],
        blinkingRooms = [];
    
    //svg.currentScale = 1.5;
    oReq.addEventListener('load', function reqListener(e){
        initGame();
        initUI();
    });
    oReq.open("GET", 'input.txt');
    oReq.send();

    log('SVG dimensions: ' + svgWidth + ', ' + svgHeight);
    
    function initGame(){
        var startl, endl;

        game = new gameAI.AI.Game(oReq.response);

        game.init();

        colCount = game.getBoard().getWidth()-1; 
        drawBoard(game.getBoard(), parseInt(svgWidth), parseInt(svgHeight));
        
        startl = parseInt(startRoom.options[startRoom.selectedIndex]);
        endl = parseInt(endRoom.options[endRoom.selectedIndex]);
        if(isNaN(startl) || isNaN(endl)){
            startLoc = game.getStartLocation();
            endLoc = game.getAllControlRooms()[0].loc;
        }else{
            startLoc = game.getAllControlRooms()[startl].loc; 
            endLoc = game.getAllControlRooms()[endl].loc;
        }

        addBlinkingRoom(blinkPoint(startLoc, GREEN));
        addBlinkingRoom(blinkPoint(endLoc, RED));
        
        switch(algorithm){
        case 'dfs':
            tick = game.findShortestPathDistanceBetweenTwoPoints(startLoc, endLoc);
            break;
        case 'bfs':
            tick = game.findShortestPathDistancesBetweenAllControllRooms(startLoc);
            break;
        }

        return game;
    }

    function initUI(){
        output.textContent = '';
        log('Start: ' + startLoc.toString() + '\nEnd: ' + endLoc.toString());

        fillRoomSelectBoxes(game.getAllControlRoomsByName());

        startBtn.addEventListener('click', function start(){
            shouldContinue = true;
            move();
            startBtn.disabled = true;
        });
        stopBtn.addEventListener('click', stop);
        fasterBtn.addEventListener('click', function(){
            speed -= 50;

            if( speed <= 0 ){
                fasterBtn.disabled = true;
            }

            speed = speed < 0 ? 0 : speed;
            log('Speed: ' + speed);
        });
        slowerBtn.addEventListener('click', function(){
            speed += 50;
            fasterBtn.disabled = false;
            log('Speed: ' + speed);
        });
        sbAlgorithm.addEventListener('change', function() {
            algorithm = sbAlgorithm.options[sbAlgorithm.selectedIndex].value;
            if(shouldContinue){
                reset();
            }
            initGame();
        });

        startBtn.disabled = false;
        stopBtn.disabled = false;
    }

    function reset() {
        stop();
        stopBlinkingRooms();    
        clearPath();
        startBtn.disabled = false;
        stopBtn.disabled = false;
    }

    function clearPath(){
        path.forEach(function(room) {
            colorAPoint(room, COLOR_WALL);
        });
        path = [];
    }

    function addBlinkingRoom(room) {
        blinkingRooms.push(room);
    }
    function stopBlinkingRooms() {
        blinkingRooms.forEach(function(room) {
            room();
        });
        blinkingRooms = [];
    }

    function log(str) {
        console.log(str);
        output.textContent = str + '\n' + output.textContent;
    }

    function fillRoomSelectBoxes(allControllRoomsByName) {
        var lis = [];

        Object.getOwnPropertyNames(allControllRoomsByName).forEach(function(name) {
            if(name === '0'){
                lis.push('<option value=\"' + name + '" selected="selected">' + name + '</option>');
            }else{
                lis.push('<option value=\"' + name + '">' + name + '</option>');
            }
        });
        startRoom.innerHTML = lis.join('');
        lis = [];
        Object.getOwnPropertyNames(allControllRoomsByName).forEach(function(name) {
            if(name === '7'){
                lis.push('<option value=\"' + name + '" selected="selected">' + name + '</option>');
            }else{
                lis.push('<option value=\"' + name + '">' + name + '</option>');
            }
        });
        endRoom.innerHTML = lis.join('');
    }

    function stop(){
        shouldContinue = false;
        startBtn.disabled = false;
    }

    function move() {
        try{
            var square = tick();
        }catch(e){
            log('Nothing left!');
            log(e);
            return;
        }
        
        path.push(square.loc);

        if(square.status === gameAI.GOOD){
            colorAPoint(square.loc, COLOR_PATH);

            if(shouldContinue){
                window.setTimeout(move, speed);
            }
        }else if(square.status === gameAI.PATH_TO_LONG){
            colorAPoint(square.loc, COLOR_BAD_PATH);
            log('Path to long.');
            if(shouldContinue){
                window.setTimeout(move, speed);
            }
        }else if(square.status === gameAI.FOUND){
            var removeFound = drawFound();
            setTimeout(removeFound, REMOVE_FOUND_DELAY);
            log('Found at distance: \'' + square.pathLength + '\' units.');
            colorAPoint(square.loc, COLOR_FOUND);
            window.setTimeout(move, speed);
        }else{
            if(shouldContinue){
                window.setTimeout(move, 0);
            }
        }
    }
    
    function colorAPoint(point, color) {
        var rect = svg.children[xyToPos(point.x, point.y)];

        rect.style.fill = color;

        return rect;
    }
    
    function blinkPoint(point, onColor, delay, offColor) {
        var timeoutId = 0;

        _blinkPoint(point, onColor, delay, offColor);

        return function cancel(){
            clearTimeout(timeoutId);
            colorAPoint(point, offColor);
        };

        function _blinkPoint(point, onColor, delay, offColor){
            offColor = offColor || COLOR_HALL;
            delay = delay || BLINK_INTERVAL;
            
            colorAPoint(point, onColor);
            timeoutId = setTimeout(function() {
                blinkPoint(point, offColor, delay, onColor);    
            }, delay);
        }
    }

    function drawBoard(gameBoard, svgWidth, svgHeight){
        var colCount = gameBoard.getWidth()-1,
            rowCount = gameBoard.getHeight(),
            cellWidth = Math.ceil(svgWidth/colCount),
            cellHeight = Math.ceil(svgHeight/rowCount),
            boardPiece;

        for(let y=0; y<rowCount; y++){
            for(let x=0, rect; x<colCount; x++){
                rect = document.createElementNS(SVG_NAME_SPACE, 'rect');
                boardPiece = gameBoard.charAt(x,y);

                if(boardPiece === gameAI.Board.roomTypes.EMPTY_ROOM){
                    rect.style.fill = COLOR_HALL;
                }else if(boardPiece === gameAI.Board.roomTypes.WALL){
                    rect.style.fill = COLOR_WALL;
                }else if(!isNaN(boardPiece)){
                    rect.style.fill = COLOR_GOAL;
                }else{
                    rect.style.fill = COLOR_WALL;
                }

                rect.style.strokeWidth = BORDER_THICKNESS;
                rect.style.stroke = COLOR_BORDER;
                rect.setAttributeNS(null, 'x', x*cellWidth);
                rect.setAttributeNS(null, 'y', y*cellHeight);
                rect.setAttributeNS(null, 'width', cellWidth);
                rect.setAttributeNS(null, 'height', cellHeight);
                svg.appendChild(rect);
            }
        }
    }

    function drawFound() {
        var text = document.createElementNS(SVG_NAME_SPACE, 'text'),
            rect = document.createElementNS(SVG_NAME_SPACE, 'rect'),
            svgRect;

        text.textContent = 'FOUND!';
        text.setAttributeNS(null, 'font-family', 'Verdana');
        text.setAttributeNS(null, 'font-size', FONT_SIZE + 'px');
        text.setAttributeNS(null, 'stroke', '#00FF00');
        text.setAttributeNS(null, 'fill', '#FFFFFF');
        text.setAttributeNS(null, 'x', (svgWidth/2) - 50);
        text.setAttributeNS(null, 'y', svgHeight/2);
        svg.appendChild(text);
        
        svgRect = text.getBBox();
        rect.setAttributeNS(null, "x", svgRect.x-5);
        rect.setAttributeNS(null, "y", svgRect.y-5);
        rect.setAttributeNS(null, "width", svgRect.width + 10);
        rect.setAttributeNS(null, "height", svgRect.height + 10);
        rect.setAttributeNS(null, "fill", BLACK);

        svg.insertBefore(rect, text);

        return function remove() {
            rect.remove();
            text.remove();
        };
    }
    
    function xyToPos(x, y) {
        return (y*colCount) + x;
    }
})(window.game);
