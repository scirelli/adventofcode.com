; ACME Syntax
!cpu 6510

;##################################
;######### Defines ################
;##################################
!source "char_codes.asm"
!source "os_defines.asm"
!source "memory_layout.asm"
!source "os_functions.asm"
;##################################



*= ADDR_UPPER_RAM
;########## Jump table ############
JMP main
;##################################


;########## Includes ##############
!source "./math.asm"
;##################################


; ############################################################
; ################### DATA ###################################
; ############################################################
test_cases:
;       Multiplier * Multiplicand
;           X  *   Y
given:
    !word $0000, $0000  ; 0 * 0 = 0
    !word $0001, $0000  ; 1 * 0 = 0
    !word $0101, $1010  ; 257 * 4112 = 1056784
    !word $1111, $0001  ; 4369 * 1 = 4369
    !word $FFFF, $0001  ; 65535 * 1 = 65535
    !word $FFFF, $FFFF  ; 65535 * 65535 = 4294836225

expected:
    !32 $00000000
    !32 $00000000
    !32 $00102010
    !32 $00001111
    !32 $0000FFFF
    !32 $FFFE0001
; ############################################################


;---------------------------------------------------------------------
; main: Entry point of program
;---------------------------------------------------------------------
!zone main {
.multiplier      = $F7
                  ;$F8
.multiplicand    = $F9
                  ;$FA
.product         = $FB
                  ;$FC
                  ;$FD
                  ;$FE
.testIndex !byte $00

main:
        LDA #((expected - given) / 4) - 1
        STA .testIndex

.loadTest:
        LDA .testIndex
        ASL
        ASL
        TAX
        LDA given, X
        STA .multiplier
        INX
        LDA given, X
        STA .multiplier + 1
        INX
        LDA given, X
        STA .multiplicand
        INX
        LDA given, X
        STA .multiplicand + 1
        JSR mult16

.checkTest:
        LDA .testIndex
        ASL
        ASL
        TAX
        ;     ptr       index    byte
        LDA expected, X
        CMP .product + 0
        BNE .fail
        INX
        LDA expected, X
        CMP .product + 1
        BNE .fail
        INX
        LDA expected, X
        CMP .product + 2
        BNE .fail
        INX
        LDA expected, X
        CMP .product + 3
        BEQ .pass

.fail:
        LDA ADDR_CHAR_COLOR
        PHA
        LDA #OS_COLOR_RED
        STA ADDR_CHAR_COLOR
        LDA #CHAR_F
        JSR OS_CHROUT
        PLA
        STA ADDR_CHAR_COLOR
        JMP .next

.pass:
        LDA ADDR_CHAR_COLOR
        PHA
        LDA #OS_COLOR_GREEN
        STA ADDR_CHAR_COLOR
        LDA #CHAR_PERIOD
        JSR OS_CHROUT
        PLA
        STA ADDR_CHAR_COLOR

.next:
        DEC .testIndex
        BPL .loadTest

.end:
    RTS

;        ;     ptr    index    byte
;        LDA given + (2 * 4) + 0
;        STA .multiplier
;        LDA given + (2 * 4) + 1
;        STA .multiplier + 1
;        LDA given + (2 * 4) + 2
;        STA .multiplicand
;        LDA given + (2 * 4) + 3
;        STA .multiplicand + 1
;        JSR mult16
;.check:
;        ;     ptr       index    byte
;        LDA expected + (2 * 4) + 0
;        CMP .product           + 0
;        BNE .fail
;        LDA expected + (2 * 4) + 1
;        CMP .product           + 1
;        BNE .fail
;        LDA expected + (2 * 4) + 2
;        CMP .product           + 2
;        BNE .fail
;        LDA expected + (2 * 4) + 3
;        CMP .product           + 3
;        BEQ .pass
}
