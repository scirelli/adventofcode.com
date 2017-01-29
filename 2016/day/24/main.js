(function(gameAI){
    'use strict';
    const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg',
        BORDER_THICKNESS = 1,
        BLACK            = 'rgb(0,0,0)',
        WHITE            = 'rgb(255,255,255)',
        GRAY             = 'rgb(128,128,128)',
        YELLOW           = 'rgb(247,255,0)', //'rgb(255,255,0)',
        COLOR_WALL       = BLACK,
        COLOR_HALL       = WHITE,
        COLOR_PATH       = GRAY,
        COLOR_GOAL       = YELLOW,
        COLOR_START      = YELLOW,
        COLOR_BORDER     = BLACK,
        SPEED            = 100,
        FONT_SIZE        = 35;

    var oReq = new XMLHttpRequest(),

        svg = document.querySelector('svg'),
        svgWidth = svg.getAttributeNS(null, 'width'),
        svgHeight = svg.getAttributeNS(null, 'height'),
        tick;
    
    //svg.currentScale = 1.5;
    oReq.addEventListener('load', function reqListener(e){
        var game = new gameAI.Game(oReq.response);
        
        drawBoard(game.getBoard(), parseInt(svgWidth), parseInt(svgHeight));
    });
    oReq.open("GET", 'input.txt');
    oReq.send();

    console.log('SVG dimensions: ' + svgWidth + ', ' + svgHeight);

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
    }
    
    function xyToPos(x, y) {
        return (y*colCount) + x;
    }
})(window.gameAI);
