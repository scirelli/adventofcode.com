# 'swap position X with position Y': means that the letters at indexes X and Y (counting from 0) 
# should be swapped.
def swap(arr, x, y):
    tmp = arr[y]
    arr[y] = arr[x]
    arr[x] = tmp
    return arr

# 'swap letter X with letter Y': means that the letters X and Y should be swapped 
# (regardless of where they appear in the string).
def swapLetter(arr, x, y):
	for i, val in enumerate(arr):
		if( arr[i] == x ):
			arr[i] = y
		elif( arr[i] == y ):
			arr[i] = x
	return arr

# 'rotate right X steps': means that the whole string should be rotated; for example, one 
# right rotation would turn abcd into dabc.
def rotateRight(arr, amount):
	sz = len(arr)
	tmpList = list()
	amnt = amount % sz
    
	for i in range(sz-amnt, sz):
		tmpList += arr[i]

	right = sz - 1
	left = right - amnt
	for i in range(0, sz-amnt):
		lItem = arr[left-i]
		arr[right-i] = lItem

	for i, val in enumerate(tmpList):
		arr[i] = tmpList[i]
	
	return arr

# 'rotate left X steps': means that the whole string should be rotated; for example, one 
# right rotation would turn abcd into dabc.
def rotateLeft(arr, amount):
	sz = len(arr)
	tmpList = list()
	amnt = amount % sz
    
	for i in range(0, amnt):
		tmpList += arr[i]
	
	right = amnt
	left = 0 
	for i in range(0, sz-amnt):
		lItem = arr[right+i]
		arr[left+i] = lItem

	start = sz-amnt
	for i, val in enumerate(tmpList):
		arr[start + i] = tmpList[i]
	
	return arr

# 'rotate based on position of letter X': means that the whole string should be rotated to the
# right based on the index of letter X (counting from 0) as determined before this instruction
# does any rotations. Once the index is determined, rotate the string to the right one time,
# plus a number of times equal to that index, plus one additional time if the index was at least 4.
def rotateOnLetterX(arr, x):
	xIndex = -1
	for i, letter in enumerate(arr):
		if(letter == x):
			xIndex = i
			break;

	if(xIndex == -1): return arr

	if(xIndex==1):
		rotateLeft(arr, xIndex)
	elif(xIndex==2):
		rotateRight(arr, xIndex)
	elif(xIndex==3):
		rotateLeft(arr, xIndex-1)
	elif(xIndex==4):
		rotateLeft(arr, xIndex+1+1+1)
	elif(xIndex==5):
		rotateLeft(arr, xIndex-1-1)
	elif(xIndex==6):
		rotateLeft(arr, xIndex+1+1)
	elif(xIndex==7):
		rotateLeft(arr, xIndex-1-1-1)
	else:
		#print('<2')
		rotateLeft(arr, xIndex+1)

	return arr

# 'reverse positions X through Y': means that the span of letters at indexes X through Y
# (including the letters at X and Y) should be reversed in order.
def reverseXtoY(arr, x, y):
	tmp = arr[x:y+1]
	tmp.reverse()

	for i, val in enumerate(tmp):
		arr[x+i] = val

	return arr

# 'move position X to position Y': means that the letter which is at index X should be removed
# from the string, then inserted such that it ends up at index Y.
def move(arr, x, y):
	letterAtX = arr[x]
	for i in range(x, len(arr)-1):
		arr[i] = arr[i+1];
	arr.pop()
	arr.insert(y, letterAtX)
	return arr


def execute(inputArray, password):
	command = ''
	pword = list(password) 

	for line in inputArray:
		line = line.split()
		command = line[0] + ' ' + line[1]

		if(command == 'swap position'):
			swap(pword, int(line[2]), int(line[5]))
			#print(''.join(pword))
		elif(command == 'swap letter'):
			swapLetter(pword, line[2], line[5])
			#print(''.join(pword))
		elif(command == 'reverse positions'):
			reverseXtoY(pword, int(line[2]), int(line[4]))
			#print(''.join(pword))
		elif(command == 'rotate left'):
			rotateRight(pword, int(line[2]))
			#print(''.join(pword))
		elif(command == 'rotate right'):
			rotateLeft(pword, int(line[2]))
			#print(''.join(pword))
		elif(command == 'rotate based'):
			rotateOnLetterX(pword, line[6])
			#print(''.join(pword))
		elif(command == 'move position'):
			move(pword, int(line[5]), int(line[2]))
			#print(''.join(pword))
		else:
			print('Error unknown command!! \'' + str(line) + '\'')
	return ''.join(pword)
