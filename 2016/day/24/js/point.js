if(window.game === undefined) window.game = {};

window.game.Point = (function() {
    'use strict';

    function Point(x, y){
        this.x = x || 0;
        this.y = y || 0;
        
        if(typeof x === 'object' && x.x !== undefined && x.y !== undefined){
            this.copy(x);
        }
    }

    Point.prototype = {
        copy:function(p){
            if(p.x !== undefined && p.y !== undefined){
                this.x = p.x;
                this.y = p.y;
            }

            return this;
        },
        clone:function(){
            return new Point(this);
        },
        toString:function(){
            return `(${this.x}, ${this.y})`;
        }
    };
    
    return Point;
})();
