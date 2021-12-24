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
OS_LINPRT 			 = $BDCD	; Print ASCII decimal number. It converts the number whose high byte is in .A and whose's low byte is in .X
ADDR_PROCESSOR_PORT  = $0001
ADDR_BASIC_AREA		 = $0800	; 2048
ADDR_BASIC_ROM		 = $A000
ADDR_UPPER_RAM		 = $C000	; 49152
ADDR_CASSETTE_BUFFER = $033C	; 828
ADDR_CARTRIDGE_ROM   = $8000	; 32768

ZP_LOAD_ADDR_HI = $AE
ZP_LOAD_ADDR_LO = $AF

ADDR_LAST_USED_DEVICE   = $BA

SYS_GETIN   = $FFE4
SYS_CHRIN   = $FFCF ; Get a character from the input channel
SYS_CLRCHN  = $FFCC ; Clear I/O channels
SYS_SETLFS  = $FFBA ; Set up a logical file.
SYS_SETNAM  = $FFBD ; Set file name
SYS_CHROUT  = $FFD2 ; Write a char to the screen
SYS_STOP    = $FFE1 ; Check if the stop key is being pressed
SYS_READST  = $FFB7 ; Read status register
SYS_CHKIN   = $FFC6 ; Open a channel for input
SYS_OPEN    = $FFC0 ; Open a logical file
SYS_CLOSE   = $FFC3 ; Close a logical file
SYS_SETMSG  = $FF90 ; Turn on Kernal printing of messages.

FLAG_NO_ERROR            = 0
FLAG_ERROR_TIMEOUT_WRITE = 1
FLAG_ERROR_TIMEOUT_READ  = 2
FLAG_ERROR_EOL           = 64
FLAG_ERROR_EOF           = 64
FLAG_ERROR_NO_DEVICE     = 128

DEVICE_RS_232C  = 2
DEVICE_SCREEN   = 3
DEVICE_DISK_1   = 8
DEVICE_DISK_2   = 9

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

;##################################

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

!macro SEV {
    PHA             ;3
    SEC             ;2
    ADC #$FF        ;2
    PLA             ;4
}

;------------------------------------------------------------
; m_PZP: Writes an address stored in A (low byte) and X
;   (high byte) to a zero page location. Backs up zp value
;   to the stack.
;   In memory address would look liek this [A, X]
;   params:
;       A: low byte
;       X: high byte
;       .zp: zero page address
;   Affects:
;       Y: destroys Y, used as swap
;       Uses two bytes on stack. Make sure to call m_PLZ to
;       restore the zero page from the stack.
;------------------------------------------------------------
!macro m_PZP .zp {
    TAY							;Back up zero-page to stack, and store line address to zero-page
    LDA .zp
    PHA
    STY .zp
    LDA .zp + 1
    PHA
    STX .zp + 1
}

;------------------------------------------------------------
; m_PLZ: Writes an address stored on the stack by m_PZP
;   back to a zero page location.
;   Assumes the stack is setup so top value is the zero page
;   value that was pushed on with m_PZP
;   params:
;       .zp: zero page address to restore to
;   Affects:
;       Y: destroys Y, used as swap
;       Z, N
;------------------------------------------------------------
!macro m_PLZ .zp {
    TAY
    PLA
    STA .zp + 1
    PLA
    STA .zp
    TYA
}
; ############################################################


; ############################################################
; ################## Struct Definitions ######################
; ############################################################

; ---------------------------------------------------------------
; Struct: String
;   Byte offsets (indices) for the String structure.
; ---------------------------------------------------------------
STRING_LEN          = 0
STRING_PTR          = 1
STRING_STRUCT_SZ    = 3

; ---------------------------------------------------------------
; Struct: Buffer
;   Byte offsets (indices) for the Buffer structure.
; ---------------------------------------------------------------
BUFFER_SZ           = 0
BUFFER_PTR          = 1
BUFFER_STRUCT_SZ    = 3

; ---------------------------------------------------------------
; Struct: FileDef
;   Byte offsets (indices) for the file definition structure.
; ---------------------------------------------------------------
FILE_DEF_FILE_NO    = 0
FILE_DEF_DEVICE_NO  = FILE_DEF_FILE_NO + 1
FILE_DEF_FILE_NAME  = FILE_DEF_DEVICE_NO + 1
FILE_DEF_STRUCT_SZ  = 4

; ############################################################



*= ADDR_UPPER_RAM


;########## Jump table ############
JMP main
;##################################


; ############################################################
; ################### DATA ###################################
; ############################################################

; ################# Strings Table ############################
s1 !pet "test", CHAR_NULL
s2                                      ; End of table will always be an empty index

; _______ Global Variables ______
;			        LO	  HI
hpos        !word $0000, $0000
depth	    !word $0000, $0000
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
    JSR pilot
    BCS .end
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
        BCS .error

        LDA $FB
        LDX $FC
        JSR  buffer_getBuffer
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

.error:
		JMP .end

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
; openFileToRead: Setup a file for reading.
; params:
;   A, X: Address of the file object. A is low byte, X high byte.
; returns: Nothing
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 4 bytes
; Error:
;   C: Sets carry flag on error.
;   A: Error code in A
;---------------------------------------------------------------------
!zone openFileToRead{
openFileToRead:
        +m_PZP $FB                  ; Put the file object address into zp

        LDA $FB
        LDX $FB + 1
        JSR fileDef_getFileNo
        PHA                         ; file number

        LDA ADDR_LAST_USED_DEVICE   ; Get last used device number
        BNE .skip
        LDA $FB
        LDX $FB + 1
        JSR fileDef_getDeviceNo     ; device number
.skip   LDY #DEVICE_RS_232C         ; Secondary address/command number  (not sure what this means)
        TAX                         ; Set device number
        PLA                         ; Set logical file number
        JSR SYS_SETLFS              ; How to Use:
                                    ; - Load the accumulator with the logical file number.
                                    ; - Load the X index register with the device number.
                                    ; - Load the Y index register with the command.

        LDA $FB
        LDX $FB + 1
        JSR fileDef_getFileName     ; Gets string obj
        TAY
        LDA $FB
        PHA                         ; low byte of file obj
        LDA $FC
        PHA                         ; high byte of file obj
        TYA
        STA $FB                     ; low byte of string obj
        STX $FC                     ; high byte of string obj
        LDY #$00
        LDA ($FB), Y                ; String length
        SEC
        SBC #$01                    ; Strings objects are null terminated SYS_SETNAM length needs to exclude the null
        PHA

        +m_DINC $FB                 ; Load X and Y with address of fileName
        LDY #$00
        LDA ($FB), Y                ; low byte of string
        TAX
        LDY #$01
        LDA ($FB), Y                ; high byte of string
        TAY
        PLA                         ; Load A with number of characters in file name
        JSR SYS_SETNAM              ; How to Use:
                                    ; - Load the accumulator with the length of the file name.
                                    ; - Load the X index register with the low order address of the file name.
                                    ; - Load the Y index register with the high order address.
                                    ; - Call this routine.

        JSR SYS_OPEN                ; How to Use:
                                    ; - Use the SETLFS routine.
                                    ; - Use the SETNAM routine.
                                    ; - Call this routine.
                                    ; Error returns: 1,2,4,5,6,240
        BCS .error_1                ; If carry set, the file could not be opened

        ; check drive error channel here to test for
        ; FILE NOT FOUND error etc.

        PLA                         ; Restore file obj
        STA $FC
        PLA
        STA $FB

        LDX $FB + 1
        JSR fileDef_getFileNo
        TAX
        JSR SYS_CHKIN               ; Use this file for input
                                    ; How to Use:
                                    ; - OPEN the logical file (if necessary; see description above).
                                    ; - Load the X register with number of the logical file to be used.
                                    ; - Call this routine (using a JSR command).
                                    ; If error returns with carry set and accumulator set to 5. Otherwise, it stores the serial device number in 99.
                                    ; If carry is set, the operation was unsuccessful and the accumulator will contain a Kernal error-code value indicating which error occurred. Possible error codes include 3 (file was not open), 5 (device did not respond), and 6 (file was not opened for input). The RS-232 and serial status-flag locations also reflect the success of operations for those
        JMP .end

.error_1:
    PLA
    PLA
    LDA #$01
.error_default:
    +m_PLZ $FB                      ; Restore zp, assuming stack is back where it should be.
    SEC
    RTS

.end:
    +m_PLZ $FB                      ; Restore zp, assuming stack is back where it should be.
    RTS
}


;---------------------------------------------------------------------
; closeFile: Close a file and clean up
; params:
;   A, X: Address of the file object. A is low byte, X high byte.
; returns: Nothing
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 4 bytes
;---------------------------------------------------------------------
!zone closeFile {
closeFile:
    JSR fileDef_getFileNo
    JSR SYS_CLOSE               ; How to Use:
                                ; - Load the accumulator with the number of the logical file to be closed.
                                ; - Call this routine.

    JSR SYS_CLRCHN
    RTS
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


;---------------------------------------------------------------------
; readLine: Read a line of text from the current open input channel.
;   Reads characters until return, null, end of file, or buffer is full.
;   Reads max 255 characters. If more is needed call this function again.
; params:
;	A: Low byte of address to a buffer.
;	X: High byte of address to a buffer.
; return: Count of bytes read in A. C set for EoF or error, X has error
;   code. X will be 0 for eof.
; On error:
;	C: Set on error.
;      Set no more lines (EoF)
;   A: Count of bytes written to buffer.
;   X: Error code
;       $00: EoF
;       $01: Buffer full
;       $02: Bad buffer size
; Affects:
;   Zeropage: FB-FD
;---------------------------------------------------------------------
!zone readLine {
readLine:
    .ADDR_BUFFER_PTR = $FB
    +m_PZP $FB                      ; Put the file object address into zp

    LDY #BUFFER_SZ
    LDA ($FB), Y
    BEQ .error_buffer_sz            ; Buffer has to be greater than 0
    PHA                             ; back up buffer sz

    LDA $FB
    LDX $FC
    JSR buffer_getBuffer
    STA .ADDR_BUFFER_PTR
    STX .ADDR_BUFFER_PTR + 1

    LDY #$00    					; Init Y for indexing
	.loop
        JSR SYS_READST              ; Read status byte
        BNE .eof                    ; Either EoF or read error
        JSR SYS_CHRIN               ; Get a byte from file

		STA (.ADDR_BUFFER_PTR), Y		; Store a char

		CMP #EOL
		BEQ .eol

		INY
        BEQ .error_buffer_full      ; Y wrapped, it's greater than 255. Can't check vs buffer sz anymore.
        PLA                         ; pull buffer size
        STA $FD
        TYA
        CMP $FD
        BEQ .buffer_full            ; =
        BCS .error_buffer_full      ; >
        LDA $FD
        PHA
		JMP .loop                   ; If there's room in the buffer read another char


    .eof:
        LDA #CHAR_NULL
		STA (.ADDR_BUFFER_PTR), Y
		SEC
        JMP .cleanup

	.eol:
		CLC
        JMP .cleanup

    .buffer_full:
		CLC
        DEY
        ;JMP .cleanup

    .cleanup:
        PLA                         ; Clean up the stack
        INY                         ; Get the count of chars in the buffer
        TYA
        LDX $00
        JMP .end

    .error_buffer_full:
        LDX #$01
        JMP .error

    .error_buffer_sz:
        LDX #$02
        JMP .error

    .error:
        PLA
        TYA
        SEC

	.end:
		+m_PLZ $FB
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
; Uses Zero-page: $FB
;----------------------------------------------------------------
!zone up {
up:
    LDA $FB
    PHA

	STX $FB
	SEC					;CLC indicates overflow for unsigned
	LDA depth
	SBC $FB				;
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
;	Global depth variable
; Uses Zero-page: $FB
;--------------------------------------------------------
!zone down {
down:
    LDA $FB
    PHA

	STX $FB
	CLC
	LDA depth
	ADC $FB
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
; Uses Zero-page: $FB; Used as a temp variable.
;	TODO: Switch to using the stack instead of zp
;--------------------------------------------------------
!zone forward {
forward:
    LDA $FB
    PHA

	STX $FB
	CLC
	LDA hpos
	ADC $FB
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
    PLA
    STA $FB
    RTS
}


;---------------------------------------------------------------------
; fileDef_getFileNo: Get the file number from a filedef object.
; params:
;   A, X: Address of the file object. A is low byte, X high byte.
; return:
;   A: the file number
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone fileDef_getFileNo {
fileDef_getFileNo:
.begin
    +m_PZP $FB
    LDY #FILE_DEF_FILE_NO
    LDA ($FB), Y
.end
    +m_PLZ $FB
    RTS
}

;---------------------------------------------------------------------
; fileDef_getDeviceNo: Get the device number from a filedef object.
; params:
;   A, X: Address of the file object. A is low byte, X high byte.
; return:
;   A: the device number
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone fileDef_getDeviceNo {
fileDef_getDeviceNo:
.begin
    +m_PZP $FB
    LDY #FILE_DEF_DEVICE_NO
    LDA ($FB), Y
.end
    +m_PLZ $FB
    RTS
}


;---------------------------------------------------------------------
; fileDef_getFileName: Get the file name string from a filedef object.
; params:
;   A, X: Address of the file object. A is low byte, X high byte.
; return:
;   A, X: Address of the file name string
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone fileDef_getFileName {
fileDef_getFileName:
.begin
    +m_PZP $FB
    LDA #FILE_DEF_FILE_NAME
    CLC
    ADC $FB
    STA $FB
    LDA #$00
    ADC $FB + 1
    STA $FB + 1
    LDA $FB
    LDX $FB + 1

.end
    +m_PLZ $FB
    RTS
}


;---------------------------------------------------------------------
; buffer_getSize: Get the size of the buffer.
; params:
;   A, X: Address of the buffer object. A is low byte, X high byte.
; return:
;   A: buffer size, max 255 bytes
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone buffer_getSize {
.begin
    +m_PZP $FB
    LDY #BUFFER_SZ
    LDA ($FB), Y
.end
    +m_PLZ $FB
    RTS
}


;---------------------------------------------------------------------
; buffer_getBuffer: Get the underlying buffer
; params:
;   A, X: Address of the buffer object. A is low byte, X high byte.
; return:
;   A, X: Address of the buffer space.
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone buffer_getBuffer {
buffer_getBuffer:
    +m_PZP $FB
                        ; Move ptr up to the contained buffer
    CLC
    LDA $FB
    ADC #BUFFER_PTR
    STA $FB
    LDA #$00
    ADC $FC
    STA $FC
                        ; Load the buffer pointer into A and X
    LDY #$01
    LDA ($FB), Y
    TAX
    LDY #$00
    LDA ($FB), Y

.end
    +m_PLZ $FB
    RTS
}


;---------------------------------------------------------------------
; buffer_print: Print Y chars of buffer.
; params:
;   A, X: Address of the buffer object. A is low byte, X high byte.
;   Y: Number of characters to print.
; return: None
; Affects:
;   A,X,Y,Z,N
;   Zero page: FB, FC, FD
;   Stack used: 2 bytes
;---------------------------------------------------------------------
!zone buffer_print {
buffer_print:
    STY $FD
    JSR buffer_getBuffer
    +m_PZP $FB

    LDY #$00
-   LDA ($FB), Y
    JSR SYS_CHROUT
    INY
    DEC $FD
    BNE -

.end:
    +m_PLZ $FB
    RTS
}
