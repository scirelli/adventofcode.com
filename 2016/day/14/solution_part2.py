#!/bin/python
import hashlib

SALT = 'ihaygndm'
#SALT = 'abc'
dict = {'startIndex':0}
STRETCH_AMOUNT = 2016

def run():
	oneTimePadCount = 0
	index = 0
	prevIndex = 0
	dist = 0

	while(oneTimePadCount < 64):
		code = SALT + str(index)
		hash = getHash(code)
		hash = stretchHash(hash)
		letter = firstThreeInARow(hash)
		if(letter):
			print('\tCode: \'' + code + '\' index \'' + str(index) + '\' \'' + letter + '\' \'' + hash + '\'')
			prevIndex = index
			index += 1
			code = SALT + str(index)
			hash = getHash(code)
			dist = index - prevIndex
			while(firstFiveInARow(hash, letter) == False and dist <= 1000):
				index += 1
				dist = index - prevIndex
				code = SALT + str(index)
				hash = getHash(code)
				hash = stretchHash(hash)
			index = prevIndex
			if(dist <= 1000):
				oneTimePadCount += 1
				print('\t\t' + str(oneTimePadCount) + ' index: ' + str(index))
				cleanDict(index)
		else:
			print('\tCode: \'' + code + '\' index \'' + str(index) + '\' \'' + hash + '\'')

		index += 1

def stretchHash(hash):
	result = hash
	for i in range(0, STRETCH_AMOUNT):
		md5 = hashlib.md5()
		md5.update(result.encode('utf-8'))
		result = md5.hexdigest()
	return result

def getHash(code):
	global dict
	hash = ''

	if(code in dict):
		hash = dict[code]
	else:
		md5 = hashlib.md5()
		md5.update(code.encode('utf-8'))
		hash = md5.hexdigest()
		dict[code] = hash
		dict['startIndex'] += 1
	return hash

def cleanDict(curIndex):
	if(curIndex - dict['startIndex'] > 2000):
		for i in range(dict['startIndex'], curIndex-(2000)):
			del dict[SALT+i]
		dict['startIndex'] = curIndex-(2000)
			
	
def firstThreeInARow(hash):
	str = hash.lower()
	i = 0
	l = len(str) - 2

	while i < l:
		c1 = str[i:i+1]
		c2 = str[i+1:i+2]
		c3 = str[i+2:i+3]
		if(c1 == c2 and c2 == c3):
			return c1
		i += 1
	
	return None

def firstFiveInARow(hash, c):
	str = hash.lower()
	i = 0
	l = len(str) - 4

	while i < l:
		c1 = str[i:i+1]
		c2 = str[i+1:i+2]
		c3 = str[i+2:i+3]
		c4 = str[i+3:i+4]
		c5 = str[i+4:i+5]
		if(c1 == c and c1 == c2 and c2 == c3 and c3 == c4 and c4 == c5):
			return True
		i += 1
	
	return False

run()
