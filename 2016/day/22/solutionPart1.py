import fileinput;

nodeList = []
for line in fileinput.input():
	words = []
	word = ''
	for c in line:
		if(c != ' ' and c != '\n'):
			word += c
		else:
			if(word != '' and word != '\n'):
				words.append(word)
			word = ''
	if(word != '' and word != '\n'):
		words.append(word)
	nodeList.append(words)

print(nodeList)
