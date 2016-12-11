var f = [
    ['t-g', 't-m', 'pl-g', 's-g'],
    ['pl-m','s-m'],
    ['pr-m', 'pr-g', 'r-m', 'r-g'],
    []]

var moves = 0
for (let i = 0; i < 3; i ++){
    moves+= 2 * f[i].length - 3
    f[i+1] = f[i+1].concat(f[i])
}

console.log(moves)


var f = [
    ['t-g', 't-m', 'pl-g', 's-g','d-g', 'd-m', 'e-g', 'e-m'],
    ['pl-m','s-m'],
    ['pr-m', 'pr-g', 'r-m', 'r-g'],
    []]

var moves = 0
for (let i = 0; i < 3; i ++){
    moves+= 2 * f[i].length - 3
    f[i+1] = f[i+1].concat(f[i])
}

console.log(moves)
