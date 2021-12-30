!ifndef bufferdef {bufferdef} ; only define if undefined
!if *=bufferdef {
!zone bufferdef {

; ---------------------------------------------------------------
; Struct: Buffer
;   Byte offsets (indices) for the Buffer structure.
; ---------------------------------------------------------------
BUFFER_SZ           = 0
BUFFER_PTR          = 1
BUFFER_STRUCT_SZ    = 3

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
    JSR OS_CHROUT
    INY
    DEC $FD
    BNE -

.end:
    +m_PLZ $FB
    RTS
}
}
}
