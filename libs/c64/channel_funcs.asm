; !source "libs/zeropage.asm"
; !source "libs/os_functions.asm"
; !source "libs/char_codes.asm"

; !source "libs/buffer.asm"

!ifndef channel_funcs {channel_funcs} ; only define if undefined
!if *=channel_funcs {
!zone channel_funcs {

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
;       $02: Bad buffer length
; Affects:
;   Zeropage: FB-FD
;---------------------------------------------------------------------
!zone readLine {
READLINE_EOF = $00
ERROR_READLINE_BUF_FUL = $01
ERROR_READLINE_BAD_BUF_LENGTH = $02

readLine:
    .ADDR_BUFFER_PTR = $FB
    +m_PZP $FB                      ; Put the file object address into zp
    LDA $FD
    PHA

    LDY #BUFFER_SZ
    LDA ($FB), Y
    BEQ .error_buffer_sz            ; Buffer has to be greater than 0
    PHA                             ; back up buffer sz

    LDA $FB
    LDX $FC
    JSR buffer_getBuffer
    STA .ADDR_BUFFER_PTR
    STX .ADDR_BUFFER_PTR + 1

    LDY #$00    				    ; Init Y for indexing
	.loop
        JSR OS_READST               ; Read status byte
        BNE .eof                    ; Either EoF or read error
        JSR OS_CHRIN                ; Get a byte from file

		STA (.ADDR_BUFFER_PTR), Y	; Store a char

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
        LDX #READLINE_EOF
        JMP .end

    .error_buffer_full:
        LDX #ERROR_READLINE_BUF_FUL
        JMP .error

    .error_buffer_sz:
        LDX #ERROR_READLINE_BAD_BUF_LENGTH
        JMP .error

    .error:
        PLA
        TYA
        SEC

	.end:
        TAY
        PLA
        STA $FD
        TYA
		+m_PLZ $FB
		RTS
}

}
}
