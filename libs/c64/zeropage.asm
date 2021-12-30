!ifdef ZEROPAGE !eof
ZEROPAGE = 1

; Load address read from input file and pointer to current byte during LOAD/VERIFY from serial bus.
; End address after LOAD/VERIFY from serial bus or datasette.
; End address for SAVE to serial bus or datasette.
; Pointer to line in Color RAM to be scrolled during scrolling the screen.
ZP_LOAD_ADDR_HI = $AE
ZP_LOAD_ADDR_LO = $AF

; ######## Registers #################
; These are the unused ZP bytes when OS is active. Even though these are supposed to be unused, you should still probably back them up.
B = $02
C = $03
D = $04     ; Default: $B1AA, execution address of routine converting floating point to integer.
E = $05
F = $06     ; Default: $B391, execution address of routine converting integer to floating point.

G = $2A

H = $52

I = $B0
J = $B1

K = $BF

L = $FB
M = $FC
N = $FD
O = $FE
; #####################################
