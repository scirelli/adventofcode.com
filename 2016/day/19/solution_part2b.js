(function(){
    'use strict';

    var input = 3014387,
        exampleInput = 5,
        counter = 1;

        while(exampleInput > 2){
            exampleInput = Math.floor(exampleInput/2);
            counter++;
        }
        console.log(counter);
})();
