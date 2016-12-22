(function(){
    'use strict';

    var input = 3014387,
        exampleInput = 5,
        counter = 1;
    
    input = input.toString(2);
    input = input.substr(1) + input.charAt(0);
    input = parseInt(input, 2);
    console.log(input);
})();
