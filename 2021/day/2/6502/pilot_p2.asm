; ACME Syntax
!cpu 6510
; --- Day 2: Dive! ---
; --- Part Two ---
; Based on your calculations, the planned course doesn't seem to make any sense. You find the submarine manual and discover that the process is actually slightly more complicated.
;
; In addition to horizontal position and depth, you'll also need to track a third value, aim, which also starts at 0. The commands also mean something entirely different than you first thought:
;
; * down X increases your aim by X units.
; * up X decreases your aim by X units.
; * forward X does two things:
;   - It increases your horizontal position by X units.
;   - It increases your depth by your aim multiplied by X.
; Again note that since you're on a submarine, down and up do the opposite of what you might expect: "down" means aiming in the positive direction.
;
; Now, the above example does something different:
;
; - forward 5 adds 5 to your horizontal position, a total of 5. Because your aim is 0, your depth does not change.
; - down 5 adds 5 to your aim, resulting in a value of 5.
; - forward 8 adds 8 to your horizontal position, a total of 13. Because your aim is 5, your depth increases by 8*5=40.
; - up 3 decreases your aim by 3, resulting in a value of 2.
; - down 8 adds 8 to your aim, resulting in a value of 10.
; - forward 2 adds 2 to your horizontal position, a total of 15. Because your aim is 10, your depth increases by 2*10=20 to a total of 60.
; After following these new instructions, you would have a horizontal position of 15 and a depth of 60. (Multiplying these produces 900.)
;
; Using this new interpretation of the commands, calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?
;
; Your puzzle answer was 2015547716.
;
;
; Notes:
;   Over engineered this solution but I was having fun with it, trying different approaches to coding in assembly.
;   The goal being to create some library functions for AoC.
;   Also not optimizing anything.
;
;   Going to simplify things:
;       - Since I know the courses all start with a different letter f, d, or u, after reading that character I will skip ahead and parse the number.
;       - Looking at the sample input and actual input the numeric values all range from 1 to 9
;       - Position and depth are unsigned.
;
;   tr [:lower:] [:upper:] < input.txt | tr '\n' '\r' > input.c64.txt
;   cc1541 -f 'test' -T SEQ -w ./input.c64.txt test.d64
; --------------------


;##################################
;######### Defines ################
;##################################
!source "libs/memory_layout.asm"
!source "libs/zeropage.asm"
!source "libs/os_functions.asm"
!source "libs/char_codes.asm"

FLAG_NO_ERROR            = 0
FLAG_ERROR_TIMEOUT_WRITE = 1
FLAG_ERROR_TIMEOUT_READ  = 2
FLAG_ERROR_EOL           = 64
FLAG_ERROR_EOF           = 64
FLAG_ERROR_NO_DEVICE     = 128
;##################################

; ############################################################
; ################### MACROS #################################
; ############################################################
!source "libs/macros.asm"
; ############################################################


*= ADDR_UPPER_RAM
;########## Jump table ############
JMP main
;##################################


;########## Includes ##############
!source "libs/buffer.asm"
!source "libs/file.asm"
!source "libs/channel_funcs.asm"
!source "libs/math.asm"
;##################################


; ############################################################
; ################### DATA ###################################
; ############################################################
.DATA
; ################# Strings Table ############################
s1 !pet "test", CHAR_NULL
s2                                      ; End of table will always be an empty index

; _______ Global Variables ______
;			        LO	  HI
hpos        !word $0000, $0000
depth	    !word $0000, $0000
aim 	    !word $0000, $0000
lineBuffer  !pet "XXXXXXX ##", CHAR_RETURN, CHAR_NULL
reffuBenil

; Global file Def object instance
fileDefObj:
    !byte $01                                       ; fileNo
    !byte $08                                       ; deviceNo
    !byte (s2 - s1)                                 ; fileName: string struct, sz
    !word s1                                        ; ptr to string
bufferObj:
    !byte (reffuBenil-lineBuffer)                   ; lineBuffer: buffer struct, sz
    !word lineBuffer                                ; pointer to buffer
; ############################################################


.TEXT
; ############################################################
; ################### Functions ##############################
; ############################################################
;---------------------------------------------------------------------
; main: Entry point of program
;---------------------------------------------------------------------
!zone main {
main:
.setup:
	JSR initVariables
    LDA #<fileDefObj
    LDX #>fileDefObj
    JSR openFileToRead
    BCS .error

.begin
    LDA #<bufferObj
    LDX #>bufferObj

	INC ADDR_CUR_BORDER_COLOR           ; Change the border color so you can see how long (in the boarder) The frame tames
    JSR pilot
    BCS .end
	DEC ADDR_CUR_BORDER_COLOR
    JSR printResults

.error
.end
    LDA #<fileDefObj
    LDX #>fileDefObj
    JSR closeFile
    RTS
}


;---------------------------------------------------------------------
; initVariables: Init the global variables so program can be run more
;   than once.
; params: None
; Affects:
;   A,Z,N
;---------------------------------------------------------------------
!zone initVariables {
initVariables:
	LDA #$00
	STA hpos + 0	; Init variables
	STA hpos + 1
	STA hpos + 2
	STA hpos + 3
	STA depth + 0
	STA depth + 1
	STA depth + 2
	STA depth + 3
	STA aim + 0
	STA aim + 1
	STA aim + 2
	STA aim + 3
.end
    RTS
}


;---------------------------------------------------------------------
; pilot: Calls parseLine and then calculates the directions that are
;   parsed.

; params:
;	A: Low byte of address to the start of a buffer
;	X: High byte of address to the start of buffer
; On error:
;	C: Clear if no error occurred
;	A: Error code
; Stack: two bytes
; Affects:
;	A, X
; 	SR: Z, C, N, V
; Uses Zero-page: $FB, $FC. Will restore them after
;---------------------------------------------------------------------
!zone pilot {
pilot:
        +m_PZP $FB

.loop:
        LDA $FB
        LDX $FC
        JSR readLine
        BCS .readLine_finished

        LDA $FB
        LDX $FC
        JSR buffer_getBuffer
		JSR parseLine
		BCS .end

		CMP #CHAR_F
		BNE +
		JSR forward
		JMP .loop

+		CMP #CHAR_D
		BNE +
		JSR down
		JMP .loop

+		CMP #CHAR_U
		BNE +
		JSR up
		JMP .loop

+		JMP .error

.readLine_finished:
        CPX #READLINE_EOF
        BEQ .success
                                    ; Anything else is an error, just drop into error block
        ;CPX #ERROR_READLINE_BUF_FUL
        ;BEQ .error
        ;CPX #ERROR_READLINE_BAD_BUF_LENGTH
        ;BEQ .error
.error:
        SEC               ; If had done compare, carry should already be set by BEQ
        ;LDA <error code>
		JMP .end

.success
        CLC
.end
        +m_PLZ $FB
        RTS
}


;---------------------------------------------------------------------
; parseLine: Parse the direction and number from a line.
;	If no direction or digit is found an error is signaled by a set C
;	flag, A will contain an error code.
;
;	This assumes the simplification that directions start with
;	F, D or U. And that values are between 0 and 9.
;
;   Reads until a EoL or EoF/Null characters is reached.
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
; Uses Zero-page: $FB, $FC. Will restore them after
;---------------------------------------------------------------------
!zone parseLine {
parseLine:
	ADDR_CHAR_PTR = $FB				; Zero-page address to store start of the line address.
	ERROR_UNKNOWN_CHAR	= 1
	ERROR_EOF			= 2
	ERROR_EOL			= 3
	.begin:
        +m_PZP $FB                  ; Put the file object address into zp

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
        +m_PLZ $FB

		LDA .char
		LDX .value

		CLC
		RTS

	;----- Variables ---
	.char !byte $00
	.value !byte $00
}


;---------------------------------------------------------------------
; printResults: Print the horizontal pos value and the depth value
;   and the two multiplied together.
;---------------------------------------------------------------------
!zone printResults {
printResults:
.end
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
;	Global aim variable
; Uses Zero-page: $FB
;----------------------------------------------------------------
!zone up {
up:
    LDA $FB
    PHA

	STX $FB
	SEC					;CLC indicates overflow for unsigned
	LDA aim + 0
	SBC $FB				;
	STA aim + 0
	BCS .end
	LDA aim + 1
	SBC #$00
	STA aim + 1
	BCS .end
	LDA aim + 2
	SBC #$00
	STA aim + 2
	BCS .end
	LDA aim + 3
	SBC #$00
	STA aim + 3
.end:
    PLA
    STA $FB
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
;	Global aim variable
; Uses Zero-page: $FB
;--------------------------------------------------------
!zone down {
down:
    LDA $FB
    PHA

	STX $FB
	CLC
	LDA aim
	ADC $FB
	STA aim
	BCC .end
	LDA aim + 1
	ADC #$00
	STA aim + 1
	BCC .end
	LDA aim + 2
	ADC #$00
	STA aim + 2
	BCC .end
	LDA aim + 3
	ADC #$00
	STA aim + 3
.end:
    PLA
    STA $FB
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
;   Global depth variable
; Uses Zero-page: $FB; Used as a temp variable.
;	TODO: Switch to using the stack instead of zp
; Calls: mult16
;   Uses Zero-page $F7 - $FE
; On error:
;	C: Clear if no error occurred
;	A: Error code TODO: Add error codes
;--------------------------------------------------------
!zone forward {
.X = $FB
forward:
    LDA $F7
    PHA
    LDA $F8
    PHA
    LDA $F9
    PHA
    LDA $FA
    PHA
    LDA $FB
    PHA
    LDA $FC
    PHA
    LDA $FD
    PHA
    LDA $FE
    PHA

             	; hpos += x
	STX .X
	CLC
	LDA hpos
	ADC .X
	STA hpos
	BCC .depth_calc
	LDA hpos + 1
	ADC #$00
	STA hpos + 1
	BCC .depth_calc
	LDA hpos + 2
	ADC #$00
	STA hpos + 2
	BCC .depth_calc
	LDA hpos + 3
	ADC #$00
	STA hpos + 3
	BCS .overFlowErr

.depth_calc			 ; depth += aim * x
	LDA aim + 0
	STA $F7
	LDA aim + 1
	STA $F8

	LDA .X
	STA $F9
	LDA #$00
	STA $FA

	JSR mult16

	CLC
	LDA depth + 0
	ADC $FB
	STA depth + 0

	LDA depth + 1
	ADC $FC
	STA depth + 1

	LDA depth + 2
	ADC $FD
	STA depth + 2

	LDA depth + 3
	ADC $FE
	STA depth + 3
	BCC .end

.overFlowErr
.end:
    PLA
    STA $FE
    PLA
    STA $FD
    PLA
    STA $FC
    PLA
    STA $FB
    PLA
    STA $FA
    PLA
    STA $F9
    PLA
    STA $F8
    PLA
    STA $F7
    RTS
}
