var input = `cpy 1 a
cpy 1 b
cpy 26 d
jnz c 2
jnz 1 5
cpy 7 c
inc d
dec c
jnz c -2
cpy a c
inc a
dec b
jnz b -2
cpy c b
dec d
jnz d -6
cpy 18 c
cpy 11 d
inc a
dec d
jnz d -2
dec c
jnz c -5`,
    exampleInput = `cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`;

computer(input.split('\n'));

function computer(code){
    const OPERATION = 0,
        OPER_REG1 = 1,
        OPER_REG2 = 2;

    var registers = {
        a:0,
        b:0,
        c:1,
        d:0
    },
    pc = 0,
    instructionCount = code.length,
    instruction, operation, operReg1, operReg2;
        
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
            registers[operReg2] = operReg1;
            pc++;
            break;
        case 'inc':
            registers[operReg1] += 1;
            pc++;
            break;
        case 'dec':
            registers[operReg1] -= 1;
            pc++;
            break;
        case 'jnz':
            if(isNaN(parseInt(operReg1))){
                operReg1 = registers[operReg1];
            }else{
                operReg1 = parseInt(operReg1);
            }
            operReg2 = parseInt(operReg2);

            if(operReg1){
                pc += operReg2;
            }else{
                pc++;
            }
            break;
        default:
            throw new Error('Bad instruction');
        }
    }

    console.log(registers.a);
}

