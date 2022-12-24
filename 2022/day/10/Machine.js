module.exports = class Machine{
    static CYCLE_CNT_ADD = 2
    static CYCLE_CNT_NOOP = 1

    constructor(){
        this.pc = 0;
        this.registers = {x:1};
        this.listeners = [];
    }

    register(l) {
        this.listeners.push(l);
    }

    exe(mnemonic, operands=[]) {
        if(!Array.isArray(operands)){
            operands = [operands];
        }
        switch(mnemonic) {
            case 'addx':
                this.addx(operands[0]);
                break;
            case 'noop':
                this.noop();
                break;
            default:
                throw new Error('Unknown opcode');
        }
    }

    noop() {
        this.incPC(Machine.CYCLE_CNT_NOOP);
    }

    addx(x) {
        this.incPC(Machine.CYCLE_CNT_ADD);
        this.registers.x += parseInt(x);
    }

    incPC(amt){
        for(let i=0; i<amt; i++){
            this.pc++;
            this.listeners.forEach(l=>l(this.pc, this.registers));
        }
    }

    getRegisters() {
        return this.registers;
    }

    toString() {
        return `PC: ${this.pc}\nRegisters: ${JSON.stringify(this.registers)}`;
    }
}
