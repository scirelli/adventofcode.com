from re import search
from itertools import combinations

def parse(line):
	name, size, used, avail, use = line.split()
	x, y = search(r'x(\d+)-y(\d+)', name).groups()
	return tuple(int(i) for i in (x, y, used[:-1], avail[:-1]))

def viable(node1, node2):
    x1, y1, used1, avail1 = node1
    x2, y2, used2, avail2 = node2
    return used1 != 0 and used1 <= avail2

def nodeString(node, emptySize, mX):
    x, y, u, a = node
    if x == mX and y == 0:
        return 'G'
    elif x == 0 and y == 0:
        return '*'
    elif u > emptySize:
        return '#'
    elif u == 0:
        return '_'
    else:
        return '.'

def part1(nodes):
    pairs = combinations(nodes, 2)
    return sum(1 for x, y in pairs if viable(x, y) or viable(y, x))

def part2(nodes):
	mX = max(x for x, y, *_ in nodes)
	mY = max(y for x, y, *_ in nodes)
	nodeDict = {(x, y):(x, y, u, a) for x, y, u, a in nodes}
	emptySize = next(a for x, y, u, a in nodes if u == 0)
	print('Called')
	for y in range(mY + 1):
		for x in range(mX + 1):
			yield nodeString(nodeDict[(x, y)], emptySize, mX)
		yield "\n"

def day22(input):
    nodes = [parse(l) for l in input]
    print(''.join(part2(nodes)))
    print(part1(nodes))

input = open("./input.txt").read()
input = [x.strip() for x in input.split("\n") if len(x.strip()) > 0]
day22(input)
