!ifndef math {math} ; only define if undefined
!if *=math {
!zone math {

;--------------------------------------------------------
; 16-bit multiply with 32-bit product
; took from 6502.org
;--------------------------------------------------------
!zone mult16 {
.multiplier      = $F7
                  ;$F8
.multiplicand    = $F9
                  ;$FA
.product         = $FB
                  ;$FC
                  ;$FD
                  ;$FE

mult16:
        LDA	#$00
		STA	.product + 2        ; clear upper bits of .product
		STA	.product + 3
		LDX	#$10                ; set binary count to 16
.shift_r:
        LSR	.multiplier + 1     ; divide .multiplier by 2; 0 -> [     ] -> C
		ROR	.multiplier         ; C-> [     ]-> C
		BCC	.rotate_r
		LDA	.product + 2        ; get upper half of .product and add .multiplicand
		CLC
		ADC	.multiplicand
		STA	.product + 2
		LDA	.product + 3
		ADC	.multiplicand + 1
.rotate_r:
        ROR                     ; rotate partial .product
		STA	.product+3
		ROR	.product+2
		ROR	.product+1
		ROR	.product
		DEX
		BNE	.shift_r

.end:
		RTS
}

}
}

; In the example we are putting the MSB to the left (Big Endian). 6502 uses Little Endian LSB is stored first.
;
; Example long hand multiplication in binary. One byte for simplicity.
;       $0F  multiplicand   15
;    x  $10  multiplier   x 16
;  --------              -----
;     $00F0  result        240
;
; Do it just like you learned in base 10 multiplication
;        %0000 1111
;     x  %0001 0000
;    --------------
;          00000000 ┆ 0
;         000000000 ┆ 1
;        0000000000 ┆ 2
;       00000000000 ┆ 3
;      000011110000 ┆ 4
;     0000000000000 ┆ 5
;    00000000000000 ┆ 6
;   000000000000000 ┆ 7
;+ 0000000000000000 ┆ 8
;------------------
;  0000000011110000
;
;
; Example 2:
;
;        %0000 1111           $0F       15
;     x  %0001 1010           $1A       26
;    --------------
;          00000000 ┆ 0
;         000011110 ┆ 1
;        0000000000 ┆ 2
;       00001111000 ┆ 3
;      000011110000 ┆ 4
;     0000000000000 ┆ 5
;    00000000000000 ┆ 6
;   000000000000000 ┆ 7
;+ 0000000000000000 ┆ 8
;------------------
;  0000000110000110         $0186     390
;        ^
;         11111         Carries (putting carries down here so they grow in each place down)
;          111
;







;┏━━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━┓
;┃ Step (X)     │     16      │     15      │     14      │     3       │     4       │     5       │     6       ┃
;┠━━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┿━━━━━━━━━━━━━┨
;┃ multiplier   │ $0101       │ $1010       │             │             │             │             │             ┃
;┠──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┨
;┃ multiplicand │ $1010       │             │             │             │             │             │             ┃
;┠──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┨
;┃ product      │ $0000 $0000 │ $0000 $0000 │             │             │             │             │             ┃
;┠──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┨
;┃     A        │ $00         │ $00         │             │             │             │             │             ┃
;┠──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┨
;┃     C        │     .       │     1,0     │             │             │             │             │             ┃
;┗━━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━┛
