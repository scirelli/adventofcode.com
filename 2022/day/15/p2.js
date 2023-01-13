#!/usr/bin/env node
/*
--- Day 15: Beacon Exclusion Zone ---
--- Part Two ---

Your handheld device indicates that the distress signal is coming from a beacon nearby. 
The distress beacon is not detected by any sensor, but the distress beacon must have x and y
coordinates each no lower than 0 and no larger than 4000000.

To isolate the distress beacon's signal, you need to determine its tuning frequency, which 
can be found by multiplying its x coordinate by 4000000 and then adding its y coordinate.

In the example above, the search space is smaller: instead, the x and y coordinates can each be at most 20. With this reduced search area, there is only a single position that could have a beacon: x=14, y=11. The tuning frequency for this distress beacon is 56000011.

Find the only possible position for the distress beacon. What is its tuning frequency?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');
const Point = require('./Point.js');

const rl = readline.createInterface({input});
const readings = [],
    beacons = {};

let argv = process.argv,
    maxXY = parseInt(argv[2]);

rl.on('line', (function() {
    return line => {
        readings.push(line.replace('Sensor at x=', '')
                .replace(' closest beacon is at x=', '')
                .replace(/y=/g, '')
                .split(':')
                .map(s=>s.split(',').map(Number))
                .map(p=>new Point(...p))
        );
    };
})());

rl.on('close', ()=>{
    readings.map(a=>{a.push(manhattanDistance(a[0], a[1])); return a;})
    readings.forEach(r=>beacons[r[1].toString()]=true);
    let ext = [new Point(0,0), new Point(maxXY, maxXY)],
        beacon = beaconLocations(readings, ext);
    console.log('Result: ' + (beacon.x*4000000 + beacon.y));
});

function beaconLocations(readings, boundingRect) {
    const SENSOR = 0,
        BEACON = 1,
        RADIUS = 2; //Sensor -> Beacon distance

    for(let sIndex=0, sensor, radius; sIndex<readings.length; sIndex++){
        sensor = readings[sIndex][SENSOR];
        radius = readings[sIndex][RADIUS] + 1;

        for(let i=radius,p; i>=-radius; i--){
            //Top half
            p = new Point(sensor.x + i, sensor.y + (radius - i));
            
            if(!inValid(p) && !withInRange(p, sIndex)) return p;

            //Bottom half
            p = new Point(sensor.x + (radius - i), sensor.y + i);
            if(!inValid(p) && !withInRange(p, sIndex)) return p;
        }
    }

    return new Point(-1,-1);

    function inValid(point){
        return point.x < 0 || point.x > boundingRect[1].x || point.y < 0 || point.y > boundingRect[1].y;
    }

    function withInRange(point, exclude){
        for(let i=0; i<readings.length; i++){
            if(i === exclude) continue;
            if(manhattanDistance(readings[i][SENSOR], point) <= readings[i][RADIUS]){
                return true;
            }
        }
        return false;
    }
}

function manhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y-p2.y);
}

/*
const example = [
        [new Point(2,  18), new Point(-2, 15)],
        [new Point(9,  16), new Point(10, 16)],
        [new Point(13, 2 ), new Point(15, 3 )],
        [new Point(12, 14), new Point(10, 16)],
        [new Point(10, 20), new Point(10, 16)],
        [new Point(14, 17), new Point(10, 16)],
        [new Point(8,  7 ), new Point(2,  10)],
        [new Point(2,  0 ), new Point(2,  10)],
        [new Point(0,  11), new Point(2,  10)],
        [new Point(20, 14), new Point(25, 17)],
        [new Point(17, 20), new Point(21, 22)],
        [new Point(16, 7 ), new Point(15, 3 )],
        [new Point(14, 3 ), new Point(15, 3 )],
        [new Point(20, 1 ), new Point(15, 3 )]
    ].map(a=>{a.push(manhattanDistance(a[0], a[1])); return a;}),
    bd = [
        [new Point(2150774, 3136587), new Point(2561642, 2914773)],
        [new Point(3983829, 2469869), new Point(3665790, 2180751)],
        [new Point(2237598, 3361), new Point(1780972, 230594)],
        [new Point(1872170, 78941), new Point(1780972, 230594)],
        [new Point(3444410, 3965835), new Point(3516124, 3802509)],
        [new Point(3231566, 690357), new Point(2765025, 1851710)],
        [new Point(3277640, 2292194), new Point(3665790, 2180751)],
        [new Point(135769,  50772), new Point(1780972, 230594)],
        [new Point(29576,   1865177), new Point(255250, 2000000)],
        [new Point(3567617, 3020368), new Point(3516124, 3802509)],
        [new Point(1774477, 148095), new Point(1780972, 230594)],
        [new Point(1807041, 359900), new Point(1780972, 230594)],
        [new Point(1699781, 420687), new Point(1780972, 230594)],
        [new Point(2867703, 3669544), new Point(3516124, 3802509)],
        [new Point(1448060, 201395), new Point(1780972, 230594)],
        [new Point(3692914, 3987880), new Point(3516124, 3802509)],
        [new Point(3536880, 3916422), new Point(3516124, 3802509)],
        [new Point(2348489, 2489095), new Point(2561642, 2914773)],
        [new Point(990761,  2771300), new Point(255250, 2000000)],
        [new Point(1608040, 280476), new Point(1780972, 230594)],
        [new Point(2206669, 1386195), new Point(2765025, 1851710)],
        [new Point(3932320, 3765626), new Point(3516124, 3802509)],
        [new Point(777553,  1030378), new Point(255250, 2000000)],
        [new Point(1844904, 279512), new Point(1780972, 230594)],
        [new Point(2003315, 204713), new Point(1780972, 230594)],
        [new Point(2858315, 2327227), new Point(2765025, 1851710)],
        [new Point(3924483, 1797070), new Point(3665790, 2180751)],
        [new Point(1572227, 3984898), new Point(1566446, 4774401)],
        [new Point(1511706, 1797308), new Point(2765025, 1851710)],
        [new Point(79663,   2162372), new Point(255250, 2000000)],
        [new Point(3791701, 2077777), new Point(3665790, 2180751)],
        [new Point(2172093, 3779847), new Point(2561642, 2914773)],
        [new Point(2950352, 2883992), new Point(2561642, 2914773)],
        [new Point(3629602, 3854760), new Point(3516124, 3802509)],
        [new Point(474030,  3469506), new Point(-452614, 3558516)]
    ].map(a=>{a.push(manhattanDistance(a[0], a[1])); return a;});
*/
