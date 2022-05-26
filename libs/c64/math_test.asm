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



*= ADDR_UPPER_RAM       ; Run with `SYS 49152`
;########## Jump table ############
JMP main
;##################################


;########## Includes ##############
!source "./math.asm"
;##################################


; ############################################################
; ################### DATA ###################################
; ############################################################
!zone test_cases {
test_cases:                                                 ; test cases list
; test case data structure
; multiplier, multiplicand, expected
;       Multiplier * Multiplicand = expected
;           X      *      Y       =  XY
MULTIPLIER_IDX = 0      ; byte offsets
MULTIPLICAND_IDX = 2
EXPECTED_IDX = 4
.t1
    !word $0000, $0000  ; 0 * 0
    !32   $00000000     ; = 0
.t2
    !word $0001, $0000  ; 1 * 0
    !32   $00000000     ; = 0
    !word $0101, $1010  ; 257 * 4112
    !32 $00102010       ; = 1056784
    !word $1111, $0001  ; 4369 * 1
    !32 $00001111       ; = 4369
    !word $FFFF, $0001  ; 65535 * 1
    !32 $0000FFFF       ; = 65535
    !word $FFFF, $FFFF  ; 65535 * 65535
    !32 $FFFE0001       ; = 4294836225
;----- Keep all test cases above this line---
test_cases_end:
TEST_CASE_SZ = .t2 - .t1 ; bytes
TEST_COUNT = (test_cases_end - test_cases) / TEST_CASE_SZ
}
; ############################################################

; TODO: update test running to tests as structured above.

;---------------------------------------------------------------------
; main: Entry point of program
;---------------------------------------------------------------------
!zone main {
.multiplier      = $F7                      ; Available zero page address
                  ;$F8
.multiplicand    = $F9
                  ;$FA
.product         = $FB
                  ;$FC
                  ;$FD
                  ;$FE

.testIndex !byte $00

; Does not handle more than 255 bytes of tests
main:
        LDA #$00
        STA .testIndex                      ; init testIndex for multiple runs

.loadTest:
        LDA .testIndex
        TAX
        LDA test_cases, X                   ; Load the multiplier and multiplicand bytes
        STA .multiplier
        INX
        LDA test_cases, X
        STA .multiplier + 1
        INX
        LDA test_cases, X
        STA .multiplicand
        INX
        LDA test_cases, X
        STA .multiplicand + 1
        INX                                 ; Pointing at expected
        TXA
        PHA

.runTest:
        JSR mult16

.checkTest:
        PLA
        TAX
        ;     ptr       index    byte
        LDA test_cases, X
        CMP .product + 0
        BNE .fail
        INX
        LDA test_cases, X
        CMP .product + 1
        BNE .fail
        INX
        LDA test_cases, X
        CMP .product + 2
        BNE .fail
        INX
        LDA test_cases, X
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
        LDA .testIndex
        CLC
        ADC #TEST_CASE_SZ
        CMP #(test_cases_end - test_cases)
        STA .testIndex
        BCC .loadTest

.end:
    RTS

;        ;     ptr    index    byte
;        LDA test_cases + (2 * 4) + 0
;        STA .multiplier
;        LDA test_cases + (2 * 4) + 1
;        STA .multiplier + 1
;        LDA test_cases + (2 * 4) + 2
;        STA .multiplicand
;        LDA test_cases + (2 * 4) + 3
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
