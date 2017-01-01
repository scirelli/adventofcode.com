import fileinput;
from operator import itemgetter
from re import search
from itertools import combinations

X		    = 0
Y			= 1
SIZE        = 2
USED	    = 3
AVAILABLE   = 4
USE		    = 5

def parseInput():
	nodeList = []
	for line in fileinput.input():
		fileSystem, size, used, avail, use = line.split()
		x, y= search(r'x(\d+)-y(\d+)', fileSystem).groups()
		nodeList.append(tuple([ int(x), int(y), int(size[:-1]), int(used[:-1]), int(avail[:-1]), int(use[:-1])]))

	return nodeList

def viable(node1, node2):
	used1 = node1[USED]
	avail2 = node2[AVAILABLE]
	return used1 != 0 and used1 <= avail2

# * Node A is not empty (its Used is not zero).
# * Nodes A and B are not the same node.
# * The data on node A (its Used) would fit on node B (its Avail).
def viablePairsCount(nodeList):
	pairs = combinations(nodeList, 2)
	return sum(1 for node1, node2 in pairs if viable(node1, node2) or viable(node2, node1))

data = parseInput()
#print('\n'.join([str(x) for x in data]))

print('Part1 answer: ' + str(viablePairsCount(data)))
