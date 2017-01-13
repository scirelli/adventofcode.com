var input = `cpy a b
dec b
cpy a d
cpy 0 a
cpy b c
inc a
dec c
jnz c -2
dec d
jnz d -5
dec b
cpy b c
cpy c d
dec d
inc c
jnz d -2
tgl c
cpy -16 c
jnz 1 c
cpy 70 c
jnz 87 d
inc a
inc d
jnz d -2
inc c
jnz c -5`,
    exampleInput = `cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a`;

var registers = computer(input.split('\n'));
//var registers = computer(exampleInput.split('\n'));
console.log(registers.a);

function computer(code){
    const OPERATION = 0,
        OPER_REG1 = 1,
        OPER_REG2 = 2;

    var registers = {
        a:12,
        b:0,
        c:0,
        d:0
    },
    pc = 0,
    instructionCount = code.length,
    instruction, operation, operReg1, operReg2, tglInstruction;
        
    code = code.map((i)=>{
        return i.split(' ');
    });

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
        default:
            throw new Error('Bad instruction');
        }
    }

    return registers;
}
