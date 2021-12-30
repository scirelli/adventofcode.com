!ifndef filedef {filedef} ; only define if undefined
!if *=filedef {
!zone filedef {

; ---------------------------------------------------------------
; Struct: FileDef
;   Byte offsets (indices) for the file definition structure.
; ---------------------------------------------------------------
FILE_DEF_FILE_NO    = 0
FILE_DEF_DEVICE_NO  = FILE_DEF_FILE_NO + 1
FILE_DEF_FILE_NAME  = FILE_DEF_DEVICE_NO + 1
FILE_DEF_STRUCT_SZ  = 4

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
        JSR OS_SETLFS              ; How to Use:
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
        SBC #$01                    ; Strings objects are null terminated OS_SETNAM length needs to exclude the null
        PHA

        +m_DINC $FB                 ; Load X and Y with address of fileName
        LDY #$00
        LDA ($FB), Y                ; low byte of string
        TAX
        LDY #$01
        LDA ($FB), Y                ; high byte of string
        TAY
        PLA                         ; Load A with number of characters in file name
        JSR OS_SETNAM              ; How to Use:
                                    ; - Load the accumulator with the length of the file name.
                                    ; - Load the X index register with the low order address of the file name.
                                    ; - Load the Y index register with the high order address.
                                    ; - Call this routine.

        JSR OS_OPEN                ; How to Use:
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
        JSR OS_CHKIN               ; Use this file for input
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
    JSR OS_CLOSE               ; How to Use:
                                ; - Load the accumulator with the number of the logical file to be closed.
                                ; - Call this routine.

    JSR OS_CLRCHN
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

}
}
