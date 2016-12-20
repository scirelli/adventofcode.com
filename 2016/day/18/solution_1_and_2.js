(function(){
/* Traps if
- Its left and center tiles are traps, but its right tile is not.
- Its center and right tiles are traps, but its left tile is not.
- Only its left tile is a trap.
- Only its right tile is a trap.
*/
const TRAP = '^',
    TILE = '.';

var input = '.^^^^^.^^.^^^.^...^..^^.^.^..^^^^^^^^^^..^...^^.^..^^^^..^^^^...^.^.^^^^^^^^....^..^^^^^^.^^^.^^^.^^',
    exampleInput = '..^^.',
    exampleInput2 = '.^^.^.^^^^',
    rowCount = [2,9,39,399999];

console.log(drawRoom(input, rowCount[3]));

function drawRoom(input, rowCount){
    var output = [input],
        len = input.length,
        tiles = 0;
    
    for(var r=0,curRow; r<rowCount; r++){
        curRow = '';
        prevRow = output[r];
        for(var col=0,left,center,right; col<len; col++){
            left   = prevRow.charAt(col-1) || '.';
            center = prevRow.charAt(col);
            right  = prevRow.charAt(col+1) || '.';

            if(left === TRAP && center === TRAP && right === TILE){
                curRow += TRAP;
            }else if(right === TRAP && center === TRAP && left === TILE){
                curRow += TRAP;
            }else if(left === TRAP && center === TILE && right === TILE){
                curRow += TRAP;
            }else if(right === TRAP && center === TILE && left === TILE){
                curRow += TRAP;
            }else{
                curRow += TILE;
                tiles++;
            }
        }
        output.push(curRow);
    }
    //console.log(output.join('\n'));
    return tiles + output[0].split('').reduce((ac,v)=>{ return ac + (v === TILE ? 1 : 0);},0);
}
})();
