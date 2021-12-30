; ACME Syntax
!cpu 6510
; --- Day 2: Dive! ---
; Now, you need to figure out how to pilot this thing.
;
; It seems like the submarine can take a series of commands like forward 1, down 2, or up 3:
;
; forward X increases the horizontal position by X units.
; down X increases the depth by X units.
; up X decreases the depth by X units.
; Note that since you're on a submarine, down and up affect your depth, and so they have the opposite result of what you might expect.
;
; The submarine seems to already have a planned course (your puzzle input). You should probably figure out where it's going. For example:
;
; forward 5
; down 5
; forward 8
; up 3
; down 8
; forward 2
; Your horizontal position and depth both start at 0. The steps above would then modify them as follows:
;
; forward 5 adds 5 to your horizontal position, a total of 5.
; down 5 adds 5 to your depth, resulting in a value of 5.
; forward 8 adds 8 to your horizontal position, a total of 13.
; up 3 decreases your depth by 3, resulting in a value of 2.
; down 8 adds 8 to your depth, resulting in a value of 10.
; forward 2 adds 2 to your horizontal position, a total of 15.
; After following these instructions, you would have a horizontal position of 15 and a depth of 10. (Multiplying these together produces 150.)
;
; Calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?
; Your puzzle answer was 2036120.
;
;
; Going to simplify things:
;	- Since I know the courses all start with a different letter f, d, or u, after reading that character I will skip ahead and parse the number.
;	- Looking at the sample input and actual input the numeric values all range from 1 to 9
;	- Position and depth are unsigned.
;
; tr [:lower:] [:upper:] < input.txt | tr '\n' '\r' > input.c64.txt
; cc1541 -f 'test' -T SEQ -w ./input.c64.txt test.d64
;


;##################################
;######### Defines ################
;##################################
OS_LINPRT 			 = $BDCD	; Print ASCII decimal number. It converts the number whose high byte is in .A and whose's low byte is in .X
ADDR_PROCESSOR_PORT  = $0001
ADDR_BASIC_AREA		 = $0800	; 2048
ADDR_BASIC_ROM		 = $A000
ADDR_UPPER_RAM		 = $C000	; 49152
ADDR_CASSETTE_BUFFER = $033C	; 828
ADDR_CARTRIDGE_ROM   = $8000	; 32768


SYS_CHROUT      = $FFD2
SYS_STOP        = $FFE1
SYS_GETIN       = $FFE4


CHAR_0          = $30
CHAR_1          = $31
CHAR_9          = $39
CHAR_RETURN     = $0D
CHAR_NULL		= $00
CHAR_U			= $55
CHAR_D			= $44
CHAR_F			= $46


EOL	= CHAR_RETURN
EOF	= CHAR_NULL


DIR_NONE	= 0
DIR_UP		= 1
DIR_DOWN	= 2
DIR_FWD		= 3

DIR_C_NONE	= CHAR_NULL
DIR_C_UP	= CHAR_U
DIR_C_DOWN	= CHAR_D
DIR_C_FWD	= CHAR_F

; ############################################################
; ################### MACROS #################################
; ############################################################

;------------------------------------------------------------
; m_DINC: Increase 16-bit counters
; params:
;	.target: Address of value to increment
; Affects:
;   SR: N, Z
;------------------------------------------------------------
!macro m_DINC .target {
	INC .target
	BNE +				; "bne * + 5" would not work in zp
	INC .target + 1
+
}

;------------------------------------------------------------
; m_D2V: Convert value in A register (expected PETSCII digit)
;	to it's numeric value.
; params:
;	A: PETSCII char to convert to a number.
; Affects:
;	A
;   SR: N, Z
;------------------------------------------------------------
!macro m_D2V {
	AND #$0F	; Mask off high nible, which is $30 when it's a PETSCII digit.
}

;------------------------------------------------------------
; m_allocateStack: Allocate space on the stack.
; params:
;	.fp: Address where to store the frame pointer.
;	.count: Amount of bytes to allocate.
; Affects:
;   SR: N, Z, V, C
; Notes: References to local variables will be negative
;	offsets to the frame pointer.
;------------------------------------------------------------
!macro m_allocateStack .fp, .count {
	TSX
	STX .fp
	TXA
	SEC
	SBC #.count
	TAX
	TXS
}


!macro NOT .v {
	EOR #$FF
}


*= ADDR_UPPER_RAM


;########## Jump table ############
JMP setup
;##################################


!zone main {
	; variables
	.lineAddr !word input

setup:
	LDA #$00
	STA hpos + 0	; Init variables
	STA hpos + 1
	STA hpos + 2
	STA hpos + 3
	STA depth + 0
	STA depth + 1
	STA depth + 2
	STA depth + 3
	LDA #<input
	STA .lineAddr
	LDA #>input
	STA .lineAddr + 1

main:
		LDA .lineAddr
		LDX .lineAddr + 1
.loop:
		JSR parseLine
		BCS .end
		CMP #CHAR_F
		BNE +
		JSR forward
		JMP ++

+		CMP #CHAR_D
		BNE +
		JSR down
		JMP ++

+		CMP #CHAR_U
		BNE +
		JSR up
		JMP ++

+		JMP .error

++		LDA .lineAddr
		LDX .lineAddr + 1
		JSR nextLine
		BCS .printValues
		STA .lineAddr
		STX .lineAddr + 1
		BCC .loop

.error:
		JMP .end
.printValues
.end
	RTS
}
;---------------------------------------------------------------------
; nextLine: Advance the char pointer to the start of the next line.
; params:
;	A: Low byte of address to the start of line
;	X: High byte of address to the start of line address
; return: Pointer to start of next linen.
;	A: Low byte of address to the start of next line
;	X: High byte of address to the start of next line address
; On error:
;	C: Clear if no error or there are more lines, set if no more lines
;		are found.
;---------------------------------------------------------------------
!zone nextLine {
nextLine:
	ADDR_CHAR_PTR = $FC				; Zero-page address to store start of the line address.
	.setup:
		TAY							;Back up zero-page to stack, and store line address to zero-page
		LDA ADDR_CHAR_PTR
		PHA
		STY ADDR_CHAR_PTR
		LDA ADDR_CHAR_PTR + 1
		PHA
		STX ADDR_CHAR_PTR + 1

	.loop
		LDY #$00					; Init Y for indexing
		LDA (ADDR_CHAR_PTR), Y		; Load first char

		CMP #EOF					; If we hit a null or EOL we're at the end of the input. Bad line.
		BNE +
		SEC
		JMP .end
+		CMP #EOL
		BEQ .eeol
		+m_DINC ADDR_CHAR_PTR
		JMP .loop

	.eeol:
		+m_DINC ADDR_CHAR_PTR
		LDA ADDR_CHAR_PTR
		LDX ADDR_CHAR_PTR + 1
		CLC

	.end:
		TAY
		PLA							; Restore the values in zero-page
		STA ADDR_CHAR_PTR + 1
		PLA
		STA ADDR_CHAR_PTR
		TYA

		RTS
}



;---------------------------------------------------------------------
; parseLine: Parse the direction and number from a line.
;	If no direction or digit is found an error is signaled by a set C
;	flag, A will contain an error code.
;
;	This assumes the simplification that directions start with
;	F, D or U. And that values are between 0 and 9.
; params:
;	A: Low byte of address to the start of line
;	X: High byte of address to the start of line address
; return: The direction in A register, and the number in X register.
;	A: The direction char F, D, or U
;	X: The digit value converted to a number
; On error:
;	C: Clear if no error occurred
;	A: Error code
; Stack: two bytes
; Affects:
;	A, X, Y
; 	SR: Z, C, N, V
; Uses Zero-page: $FC, $FD. Will restore them after
;---------------------------------------------------------------------
!zone parseLine {
parseLine:
	ADDR_CHAR_PTR = $FC				; Zero-page address to store start of the line address.
	ERROR_UNKNOWN_CHAR	= 1
	ERROR_EOF			= 2
	ERROR_EOL			= 3
	.begin:
		TAY							;Back up zero-page to stack, and store line address to zero-page
		LDA ADDR_CHAR_PTR
		PHA
		STY ADDR_CHAR_PTR
		LDA ADDR_CHAR_PTR + 1
		PHA
		STX ADDR_CHAR_PTR + 1

		LDY #$00					; Init Y for indexing
		LDA (ADDR_CHAR_PTR), Y		; Load first char

		CMP #EOF					; If we hit a null or EOL we're at the end of the input. Bad line.
		BEQ .eeof
		CMP #EOL
		BEQ .eeol
									; Switch on direction char
+		CMP #CHAR_F
		BNE +
		LDY #8						; Length of "forward ", after this should be on the digit
		JMP ++

+		CMP #CHAR_D
		BNE +
		LDY #5						; Length of "down "
		JMP ++

+		CMP #CHAR_U
		BNE +
		LDY #3						; Length of "up "
		JMP ++


+									; Default unknown char
.euc	LDA #ERROR_UNKNOWN_CHAR
		STA .char
		JMP .error
.eeof	LDA #ERROR_EOF
		STA .char
		JMP .error
.eeol	LDA #ERROR_EOL
		STA .char
		JMP .error


++		STA .char
		LDA (ADDR_CHAR_PTR), Y		; Put the char in A and the value in X
		+m_D2V
		STA .value
		JMP .end

	.error:
		PLA							; Restore the values in zero-page
		STA ADDR_CHAR_PTR + 1
		PLA
		STA ADDR_CHAR_PTR

		LDA .char
		SEC
		RTS

	.end:
		PLA							; Restore the values in zero-page
		STA ADDR_CHAR_PTR + 1
		PLA
		STA ADDR_CHAR_PTR

		LDA .char
		LDX .value

		CLC
		RTS

	;----- Variables ---
	.char !byte $00
	.value !byte $00
}

;---------------------------------------------------------------
; readDigit: Keep reading characters until a digit is found,
;	If a CHAR_NULL or CHAR_RETURN is found before a digit an
;	error is signaled by a set V flag.
; params:
;	A: Low byte of address to the start of line
;	X: High byte of address to the start of line address
; return: the found digit in the A register.
; Stack: two bytes
; Affects:
;	A, X, Y
; 	SR: Z, C, N
; Uses Zero-page: $FC, $FD. Will restore them after
;---------------------------------------------------------------
.readDigit:
!zone readDigit {
	.being:
		TAY					;Back up zero-page to stack, and store line address to zero-page
		LDA $FC
		PHA
		STY $FC
		LDA $FD
		PHA
		STX $FD

		LDY $00				; Set for indexing
	.readChar:
		LDA ($FC), Y
		JSR isNumber
		BEQ .end
		CMP #CHAR_RETURN
		BEQ .error
		CMP #CHAR_NULL
		BEQ .error

		+m_DINC $FD			; Increment the address. Allowing strings to go over 255 chars
		JMP .readChar

	.error:
		LDA #CHAR_NULL
		SEC
		RTS
	.end:
		TAX
		PLA
		STA $FD
		PLA
		STA $FC
		TXA
		CLC
		RTS
}

;-------------------------
; isNumber()
;   params:
;     A: Value to check
;   return:
;     Z: set Z if numeric
;   Affected registers:
;     X, Z, C
;-------------------------
!zone isNumber {
isNumber:
    CMP #CHAR_0
    BCC +       		; <
    CMP #CHAR_9 + 1		; One more than $39 (9)
    BCS +       		; >=
    BCC ++
+   LDX #$01			; Clear the zero flag
    RTS
++  LDX #$00			; Set the zero flag
    RTS
}

;----------------------------------------------------------------
; up: Handle up course.
; params:
;	X: unsigned units to move up.
; return: Nothing
; Affects:
;	A
; 	SR: Z, C, V, N
;	Global depth variable
; Uses Zero-page: $FC
;----------------------------------------------------------------
!zone up {
up:
	STX $FC
	SEC					;CLC indicates overflow for unsigned
	LDA depth
	SBC $FC				;
	STA depth
	BCS .end
	LDA depth + 1
	SBC #$00
	STA depth + 1
	BCS .end
	LDA depth + 2
	SBC #$00
	STA depth + 2
	BCS .end
	LDA depth + 3
	SBC #$00
	STA depth + 3
.end:
		RTS
}

;--------------------------------------------------------
; down: Handle down course.
; params:
;	X: unsigned units to move down.
; return: Nothing
; Affects:
;	A
; 	SR: Z, C, V, N
;	Global depth variable
; Uses Zero-page: $FC
;--------------------------------------------------------
!zone down {
down:
	STX $FC
	CLC
	LDA depth
	ADC $FC
	STA depth
	BCC .end
	LDA depth + 1
	ADC #$00
	STA depth + 1
	BCC .end
	LDA depth + 2
	ADC #$00
	STA depth + 2
	BCC .end
	LDA depth + 3
	ADC #$00
	STA depth + 3
	.end:
		RTS
}

;--------------------------------------------------------
; .forward: Handle forward course.
; params:
;	X: unsigned units to move forward.
; return: Nothing
; Affects:
;	A
; 	SR: Z, C, V, N
;	Global hpos variable
; Uses Zero-page: $FC; Used as a temp variable.
;	TODO: Switch to using the stack instead of zp
;--------------------------------------------------------
!zone forward {
forward:
	STX $FC
	CLC
	LDA hpos
	ADC $FC
	STA hpos
	BCC .end
	LDA hpos + 1
	ADC #$00
	STA hpos + 1
	BCC .end
	LDA hpos + 2
	ADC #$00
	STA hpos + 2
	BCC .end
	LDA hpos + 3
	ADC #$00
	STA hpos + 3
	.end:
		RTS
}


; ############################################################
; ################### DATA ###################################
; ############################################################

; _______ Global Variables ______
;			   LO	  HI
hpos	!word $0000, $0000
depth	!word $0000, $0000

; ______________________
input:
	!pet "forward 5", CHAR_RETURN
	!pet "down 5"	, CHAR_RETURN
	!pet "forward 8", CHAR_RETURN
	!pet "up 3"		, CHAR_RETURN
	!pet "down 8"	, CHAR_RETURN
	!pet "forward 2", CHAR_NULL
;.input !word
; #######################
