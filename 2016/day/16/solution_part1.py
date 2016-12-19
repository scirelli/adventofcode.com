#!/bin/python

input = '11100010111110100'
length = 272

def createB(a):
	a = a[::-1]
	b = ''
	for c in a:
		b += '1' if c == '0' else '0'
	return b

def genData(a, size):
	data = a

	while(len(data) < size):
		data = data + '0' + createB(data)
	
	return data[:size]

def genChecksum(data):
	c1 = ''
	c2 = ''
	output = ''
	i = 0
	while(i<len(data)-1):
		c1 = data[i:i+1]
		c2 = data[i+1:i+2]
		if( c1 == c2 ):
			output += '1'
		else:
			output += '0'
		i +=  2
	return output

data = genData(input, length) 
print('Data: ' + data)

checksum = genChecksum(data)

while(len(checksum)%2 == 0):
	checksum = genChecksum(checksum)

print('Checksum: ' + checksum)
