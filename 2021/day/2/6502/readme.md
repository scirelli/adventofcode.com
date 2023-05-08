* Running
Load up the VICE C64 emulator. Point it at the binary. 
Load the example or input disk files.
```
x64sc -autostartprgmode 1 -autostartprgdiskimage "./adventofcode.com/2021/day/2/6502/.cache/pilot_p2.prg" -verbose -autostart "./adventofcode.com/2021/day/2/6502/.cache/pilot_p2.prg"
```
Then run:
```
SYS 49152
```
Monitor Commands
```
# Make sure VICE cwd is set to the project dir.
load_labels "./adventofcode.com/2021/day/2/6502/.cache/pilot_p2.labels"
```
<br/>
There make targets to build and run the project
```
make build
# Run VICE and load binary
make
```