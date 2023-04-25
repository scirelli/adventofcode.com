mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
cwd := $(patsubst %/,%,$(dir $(mkfile_path)))
fileName := pilot_p2

all:
	@x64sc \
		-logfile /tmp/vice.log \
		-verbose \
		-chdir $(cwd)/build \
		-8 $(cwd)/example.d64 \
		-autostartprgmode 1 \
		-autostartprgdiskimage "$(cwd)/build/$(fileName).prg" \
		+monlog \
		-monlogname /tmp/monitor.log \
		-autostart "$(cwd)/build/$(fileName).prg" 1>/dev/null 2>&1

.PHONY: build
build: $(cwd)/build/$(fileName).prg

$(cwd)/build/$(fileName).prg: $(cwd)/$(fileName).asm
	@acme \
	    --color \
		--maxerrors 99 \
		--format cbm \
		--cpu 6510 \
		-DDEBUG=1 \
		-v3 \
		--initmem 0 \
		-Wno-label-indent \
		-I $(cwd) \
		--report $(cwd)/build/$(fileName).report \
		--symbollist $(cwd)/build/$(fileName).symbols \
		--vicelabels $(cwd)/build/$(fileName).labels \
		--outfile $(cwd)/build/$(fileName).prg \
		$(cwd)/$(fileName).asm

cwd:
	@echo $(cwd)