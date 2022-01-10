!ifdef OSDEFS !eof
OSDEFS = 1

OS_LINPRT   = $BDCD ; Output a number in ASCII Decimal Digits. This routine is used to output the line number for the routine above. It converts the number whose high byte is in .A and whose's low byte is in .X to a floating point number. It also calls the routine below which converts the floating point number to an ascii string
OS_GETIN    = $FFE4
OS_CHKIN    = $FFC6 ; Open a channel for input
OS_CHKOUT   = $FFC9 ; Open a channel for output
OS_CLRCHN   = $FFCC ; Clear I/O channels
OS_CHRIN    = $FFCF ; Get a character from the input channel
OS_CHROUT   = $FFD2 ; Output a character
OS_SETLFS   = $FFBA ; Set up a logical file.
OS_SETNAM   = $FFBD ; Set file name
OS_STOP     = $FFE1 ; Check if the stop key is being pressed
OS_READST   = $FFB7 ; Read status word
OS_OPEN     = $FFC0 ; Open a logical file
OS_CLOSE    = $FFC3 ; Close a logical file
OS_SETMSG   = $FF90 ; Turn on Kernal printing of messages.

OS_PROCESSOR_PORT   = $0001

DEVICE_RS_232C  = 2
DEVICE_SCREEN   = 3
DEVICE_DISK_1   = 8
DEVICE_DISK_2   = 9
