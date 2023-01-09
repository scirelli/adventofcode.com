#!/usr/bin/env bash

function getPuzzleInput(){
    day=${1:-$(/bin/date +"%d")}
    year=${2:-$(/bin/date +"%Y")}

    echo "Year: $year Day: $day"
    curl "https://adventofcode.com/$year/day/$day/input" \
      -H 'authority: adventofcode.com' \
      -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
      -H 'accept-language: en-US,en;q=0.9' \
      -H 'cache-control: no-cache' \
      -H 'cookie: session=53616c7465645f5f6b0216d86239a81733aeba31f3091c84da64e6fb8e6b3303c10d13219ff1456d1b50fe916a7cb83559d8aeb5d2dea3f87419a67741c3c22b' \
      -H 'dnt: 1' \
      -H 'pragma: no-cache' \
      -H 'sec-ch-ua: "Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"' \
      -H 'sec-ch-ua-mobile: ?0' \
      -H 'sec-ch-ua-platform: "Linux"' \
      -H 'sec-fetch-dest: document' \
      -H 'sec-fetch-mode: navigate' \
      -H 'sec-fetch-site: same-origin' \
      -H 'sec-fetch-user: ?1' \
      -H 'upgrade-insecure-requests: 1' \
      -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' \
      --compressed \
      --output "$(pwd)/input.txt";
}
