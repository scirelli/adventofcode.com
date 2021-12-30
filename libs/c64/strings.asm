!ifndef strings {strings} ; only define if undefined
!if *=strings {
!zone strings {

.CHAR_RETURN    = $0D
.CHAR_NULL      = $00
.EOL    = .CHAR_RETURN
.EOF    = .CHAR_NULL



; ---------------------------------------------------------------
; Struct: String
;   Byte offsets (indices) for the String structure.
; ---------------------------------------------------------------
STRING_LEN          = 0
STRING_PTR          = 1
STRING_STRUCT_SZ    = 3


; TODO: Create string "methods".


}
}
