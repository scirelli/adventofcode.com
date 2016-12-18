input = '''
Disc #1 has 17 positions; at time=0, it is at position 5.
Disc #2 has 19 positions; at time=0, it is at position 8.
Disc #3 has 7 positions; at time=0, it is at position 1.
Disc #4 has 13 positions; at time=0, it is at position 7.
Disc #5 has 5 positions; at time=0, it is at position 1.
Disc #6 has 3 positions; at time=0, it is at position 0.
'''

TOTAL_POSITIONS = 0
INIT_POSITION = 1
DISC_STATE = 2

discs = [
	[17, 5, 5],
	[19, 8, 8],
	[7,  1, 1],
	[13, 7, 7],
	[5,  1, 1],
	[3,  0, 0],
	[11, 0, 0] #Part 2 adds this line
]
discsExample = [
	[5, 4, 4],
	[2, 1, 1]
]

def dropBallAtTime(discs, clock):
	i = 0
	for discPos, disc in enumerate(discs):
		disc[DISC_STATE] = (disc[INIT_POSITION] + clock + discPos)% disc[TOTAL_POSITIONS]

	return discs

def willFallThrough(discs):
	for disc in discs:
		if(disc[DISC_STATE] != 0):
			return False
	return True

def runClock(discs):
	clock = 0
	winner = False
	while(winner == False):
		clock += 1
		dropBallAtTime(discs, clock)
		winner = willFallThrough(discs)
	print('Drop the ball at \'' + str(clock-1) + '\' to win.')

runClock(discs)
