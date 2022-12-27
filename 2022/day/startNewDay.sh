#!/usr/bin/env bash

day=${1:-0}

#shellcheck source=getPuzzleInput.sh
source "./getPuzzleInput.sh"

if [[ day -eq 0 ]]; then
    echo 'Day is required'
    exit 1
fi

mkdir "$day"
cd "$day" || exit 2
getPuzzleInput "$day"
cp ../p1_template.js p1.js
chmod 744 p1.js
touch example.txt
open -a MacVim ./p1.js
