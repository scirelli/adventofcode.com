* Running
Load up the VICE C64 emulator. Point it at the binary. 
Load the example or input disk files.
```
x64sc -autostartprgmode 1 -autostartprgdiskimage "/Users/cirelli/Projects/Steve/adventofcode.com/2021/day/2/6502/.cache/pilot_p2.prg" -verbose -autostart "/Users/cirelli/Projects/Steve/adventofcode.com/2021/day/2/6502/.cache/pilot_p2.prg"
```
Then run:
```
SYS 49152
```
Monitor Commands
```
load_labels "/Users/cirelli/Projects/Steve/adventofcode.com/2021/day/2/6502/.cache/pilot_p2.labels"
```