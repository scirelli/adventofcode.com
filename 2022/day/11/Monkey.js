//Note: It would have been more fun to write the simple parser.
module.exports = {
    example: [
        /*
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3
        */
        {
            items:            [79, 98],
            mod:              23,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old * 19;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 2;
                return 3;
            },
            inspectionCount: 0
        },
        /*
        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0
        */
        {
            items:            [54, 65, 75, 74],
            mod:              19,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 6;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod  === 0) return 2;
                return 0;
            },
            inspectionCount: 0
        },
        /*
        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3
        */
        {
            items:            [79, 60, 97],
            mod:              13,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old * old;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 1;
                return 3;
            },
            inspectionCount: 0
        },
        /*
        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
        */
        {
            items:            [74],
            mod:              17,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 3;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 0;
                return 1;
            },
            inspectionCount: 0
        }
    ],

    input: [
        /*
        Monkey 0:
          Starting items: 93, 54, 69, 66, 71
          Operation: new = old * 3
          Test: divisible by 7
            If true: throw to monkey 7
            If false: throw to monkey 1
        */
        {
            items:            [93, 54, 69, 66, 71],
            mod:              7,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old * 3;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 7;
                return 1;
            },
            inspectionCount: 0
        },
        /*
        Monkey 1:
          Starting items: 89, 51, 80, 66
          Operation: new = old * 17
          Test: divisible by 19
            If true: throw to monkey 5
            If false: throw to monkey 7
        */
        {
            items:            [89, 51, 80, 66],
            mod:              19,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old * 17;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 5;
                return 7;
            },
            inspectionCount: 0
        },
        /*
        Monkey 2:
          Starting items: 90, 92, 63, 91, 96, 63, 64
          Operation: new = old + 1
          Test: divisible by 13
            If true: throw to monkey 4
            If false: throw to monkey 3

        */
        {
            items:            [90, 92, 63, 91, 96, 63, 64],
            mod:              13,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 1;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 4;
                return 3;
            },
            inspectionCount: 0
        },
        /*
        Monkey 3:
          Starting items: 65, 77
          Operation: new = old + 2
          Test: divisible by 3
            If true: throw to monkey 4
            If false: throw to monkey 6
        */
        {
            items:            [65, 77],
            mod:              3,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 2;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod  === 0) return 4;
                return 6;
            },
            inspectionCount: 0
        },
        /*
        Monkey 4:
          Starting items: 76, 68, 94
          Operation: new = old * old
          Test: divisible by 2
            If true: throw to monkey 0
            If false: throw to monkey 6
        */
        {
            items:            [76, 68, 94],
            mod:              2,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old * old;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 0;
                return 6;
            },
            inspectionCount: 0
        },
        /*
        Monkey 5:
          Starting items: 86, 65, 66, 97, 73, 83
          Operation: new = old + 8
          Test: divisible by 11
            If true: throw to monkey 2
            If false: throw to monkey 3
        */
        {
            items:            [86, 65, 66, 97, 73, 83],
            mod:              11,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 8;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 2;
                return 3;
            },
            inspectionCount: 0
        },
        /*
        Monkey 6:
          Starting items: 78
          Operation: new = old + 6
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
        */
        {
            items:            [78],
            mod:              17,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 6;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 0;
                return 1;
            },
            inspectionCount: 0
        },
        /*
        Monkey 7:
          Starting items: 89, 57, 59, 61, 87, 55, 55, 88
          Operation: new = old + 7
          Test: divisible by 5
            If true: throw to monkey 2
            If false: throw to monkey 5
        */
        {
            items:            [89, 57, 59, 61, 87, 55, 55, 88],
            mod:              5,
            inspectOperation: function inspectOperation(old) {
                this.inspectionCount++;
                return old + 7;
            },
            test: function test(worryLevel) {
                if(worryLevel % this.mod === 0) return 2;
                return 5;
            },
            inspectionCount: 0
        }
    ]
};
