(function(gameAI){
    'use strict';
    const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg',
        CELL_WIDTH       = 16,
        CELL_HEIGHT      = 16,
        BORDER_THICKNESS = 1,
        BLACK            = 'rgb(0,0,0)',
        WHITE            = 'rgb(255,255,255)',
        GRAY             = 'rgb(128,128,128)',
        YELLOW           = 'rgb(255,255,0)',
        COLOR_WALL       = BLACK,
        COLOR_HALL       = WHITE,
        COLOR_PATH       = GRAY,
        COLOR_GOAL       = YELLOW,
        COLOR_START      = YELLOW,
        COLOR_BORDER     = BLACK,
        SPEED            = 100,
        FONT_SIZE        = 35;

    var //svg =  document.createElementNS(SVG_NAME_SPACE, "svg"),
        svg = document.querySelector('svg'),
        svgWidth = svg.getAttributeNS(null, 'width'),
        svgHeight = svg.getAttributeNS(null, 'height'),
        colCount = svgWidth/CELL_WIDTH,
        rowCount = svgHeight/CELL_HEIGHT,
        tick = gameAI.shortestPath();

    console.log('SVG dimensions: ' + svgWidth + ', ' + svgHeight);

    drawBoard(colCount, rowCount, CELL_WIDTH, CELL_HEIGHT, gameAI.startPoint, gameAI.goalPoint); 
    tick();
    move();

    function move() {
        var square = tick(),
            rect;

        console.log(square.toString());
        
        if(square.status === gameAI.GOOD){
            rect = svg.children[xyToPos(square.point.x, square.point.y)];
            rect.style.fill = COLOR_PATH;
            window.setTimeout(move, SPEED);
        }else if(square.status === gameAI.FOUND){
            drawFound();
            return;
        }else{
            window.setTimeout(move, 0);
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
    function drawBoard(colCount, rowCount, CELL_WIDTH, CELL_HEIGHT, startPoint, goalPoint){
        for(let y=0; y<rowCount; y++){
            for(let x=0, rect; x<colCount; x++){
                rect = document.createElementNS(SVG_NAME_SPACE, 'rect');
                if(gameAI.computeSquare(x,y)){
                    rect.style.fill = COLOR_WALL;
                }else if(x === startPoint.x && y === startPoint.y){
                    rect.style.fill = COLOR_START;
                }else if(x === goalPoint.x && y === goalPoint.y){
                    rect.style.fill = COLOR_GOAL;
                }else{
                    rect.style.fill = COLOR_HALL;
                }
                rect.style.strokeWidth = BORDER_THICKNESS;
                rect.style.stroke = COLOR_BORDER;
                rect.setAttributeNS(null, 'x', x*CELL_WIDTH);
                rect.setAttributeNS(null, 'y', y*CELL_HEIGHT);
                rect.setAttributeNS(null, 'width', CELL_WIDTH-(BORDER_THICKNESS));
                rect.setAttributeNS(null, 'height', CELL_HEIGHT-(BORDER_THICKNESS));
                svg.appendChild(rect);
            }
        }
    }

    function xyToPos(x, y) {
        return (y*colCount) + x;
    }
})(window.gameAI);
