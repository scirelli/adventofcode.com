var input = `cpy a d
cpy 7 c
cpy 362 b
inc d
dec b
jnz b -2
dec c
jnz c -5
cpy d a
jnz 0 0
cpy a b
cpy 0 a
cpy 2 c
jnz b 2
jnz 1 6
dec b
dec c
jnz c -4
inc a
jnz 1 -7
cpy 2 b
jnz c 2
jnz 1 4
dec b
dec c
jnz 1 -4
jnz 0 0
out b
jnz a -19
jnz 1 -21`,
code = input
        .split('\n')
        .map((i)=>{
            return i.split(' ');
        });

//10 > x < 300 
for(var i=0, registers; i<10000; i++){
    registers = {a:i, b:0, c:0, d:0};
    if(computer(code, registers)){
        console.log(registers.a);
    }
}

function computer(code, registers){
    const OPERATION = 0,
        OPER_REG1 = 1,
        OPER_REG2 = 2;

    var pc = 0,
        instructionCount = code.length,
        instruction, operation, operReg1, operReg2, tglInstruction,
        output = 0, counter = 0;
    
    while(pc >= 0 && pc < instructionCount){
        instruction = code[pc];
        operation = instruction[OPERATION] 
        operReg1 = instruction[OPER_REG1];
        operReg2 = instruction[OPER_REG2];

        switch(operation){
        case 'cpy':
            if(isNaN(parseInt(operReg1))){
                operReg1 = registers[operReg1];
            }else{
                operReg1 = parseInt(operReg1);
            }
            if(registers[operReg2] !== undefined){
                registers[operReg2] = operReg1;
            }
            pc++;
            break;
        case 'inc':
            if(registers[operReg1] !== undefined){
                registers[operReg1] += 1;
            }
            pc++;
            break;
        case 'dec':
            if(registers[operReg1] !== undefined){
                registers[operReg1] -= 1;
            }
            pc++;
            break;
        case 'jnz':
            if(isNaN(parseInt(operReg1))){
                operReg1 = registers[operReg1];
            }else{
                operReg1 = parseInt(operReg1);
            }
            if(isNaN(parseInt(operReg2))){
                operReg2 = registers[operReg2];
            }else{
                operReg2 = parseInt(operReg2);
            }

            if(operReg1){
                var tmp = pc;
                pc += operReg2;
                if(pc > instructionCount){
                    pc = tmp;
                    pc++;
                }
            }else{
                pc++;
            }
            break;
        case 'tgl':
            if(isNaN(parseInt(operReg1))){
                operReg1 = registers[operReg1];
            }else{
                operReg1 = parseInt(operReg1);
            }

            tglInstructionIndex = operReg1 + pc;
            instruction = code[tglInstructionIndex];
            if(instruction){
                operation = instruction[OPERATION] 
                operReg1 = instruction[OPER_REG1];
                operReg2 = instruction[OPER_REG2];

                switch(operation){
                case 'inc':
                    code[tglInstructionIndex] = ['dec', operReg1];
                    break;
                case 'dec':
                case 'tgl':
                    code[tglInstructionIndex] = ['inc', operReg1];
                    break;
                case 'jnz':
                    code[tglInstructionIndex] = ['cpy', operReg1, operReg2];
                    break;
                case 'cpy':
                    code[tglInstructionIndex] = ['jnz', operReg1, operReg2];
                    break;
                default:
                    throw new Error('Bad tgl instruction');
                }
            }
            pc++;
            break;
        case 'out':
            if(isNaN(parseInt(operReg1))){
                operReg1 = registers[operReg1];
            }else{
                operReg1 = parseInt(operReg1);
            }

            output = parseInt(operReg1);
            if(output !== (counter & 1)) {
                return false;
            }
            if( ++counter >= 32 ){
                return true;
            }

            pc++;
            break;
        default:
            throw new Error('Bad instruction');
        }
    }

    return false;
}
