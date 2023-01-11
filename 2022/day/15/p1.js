#!/usr/bin/env node
/*
--- Day 15: Beacon Exclusion Zone ---

You feel the ground rumble again as the distress signal leads you to a large network of subterranean tunnels. You don't have time to search them all, but you don't need to: your pack contains a set of deployable sensors that you imagine were originally built to locate lost Elves.

The sensors aren't very powerful, but that's okay; your handheld device indicates that you're close enough to the source of the distress signal to use them. You pull the emergency sensor system out of your pack, hit the big button on top, and the sensors zoom off down the tunnels.

Once a sensor finds a spot it thinks will give it a good reading, it attaches itself to a hard surface and begins monitoring for the nearest signal source beacon. Sensors and beacons always exist at integer coordinates. Each sensor knows its own position and can determine the position of a beacon precisely; however, sensors can only lock on to the one beacon closest to the sensor as measured by the Manhattan distance. (There is never a tie where two beacons are the same distance to a sensor.)

It doesn't take long for the sensors to report back their positions and closest beacons (your puzzle input). For example:

Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3

So, consider the sensor at 2,18; the closest beacon to it is at -2,15. For the sensor at 9,16, the closest beacon to it is at 10,16.

Drawing sensors as S and beacons as B, the above arrangement of sensors and beacons looks like this:

               1    1    2    2
     0    5    0    5    0    5
 0 ....S.......................
 1 ......................S.....
 2 ...............S............
 3 ................SB..........
 4 ............................
 5 ............................
 6 ............................
 7 ..........S.......S.........
 8 ............................
 9 ............................
10 ....B.......................
11 ..S.........................
12 ............................
13 ............................
14 ..............S.......S.....
15 B...........................
16 ...........SB...............
17 ................S..........B
18 ....S.......................
19 ............................
20 ............S......S........
21 ............................
22 .......................B....

This isn't necessarily a comprehensive map of all beacons in the area, though. Because each sensor only identifies its closest beacon, if a sensor detects a beacon, you know there are no other beacons that close or closer to that sensor. There could still be beacons that just happen to not be the closest beacon to any sensor. Consider the sensor at 8,7:

               1    1    2    2
     0    5    0    5    0    5
-2 ..........#.................
-1 .........###................
 0 ....S...#####...............
 1 .......#######........S.....
 2 ......#########S............
 3 .....###########SB..........
 4 ....#############...........
 5 ...###############..........
 6 ..#################.........
 7 .#########S#######S#........
 8 ..#################.........
 9 ...###############..........
10 ....B############...........
11 ..S..###########............
12 ......#########.............
13 .......#######..............
14 ........#####.S.......S.....
15 B........###................
16 ..........#SB...............
17 ................S..........B
18 ....S.......................
19 ............................
20 ............S......S........
21 ............................
22 .......................B....

This sensor's closest beacon is at 2,10, and so you know there are no beacons that close or closer (in any positions marked #).

None of the detected beacons seem to be producing the distress signal, so you'll need to work out where the distress beacon is by working out where it isn't. For now, keep things simple by counting the positions where a beacon cannot possibly be along just a single row.

So, suppose you have an arrangement of beacons and sensors like in the example above and, just in the row where y=10, you'd like to count the number of positions a beacon cannot possibly exist. The coverage from all sensors near that row looks like this:

                 1    1    2    2
       0    5    0    5    0    5
 9 ...#########################...
10 ..####B######################..
11 .###S#############.###########.

In this example, in the row where y=10, there are 26 positions where a beacon cannot be present.

Consult the report from the sensors you just deployed. In the row where y=2000000, how many positions cannot contain a beacon?
*/
const Point = require('./Point.js');

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
    input = [
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

(function main(){
    //let data = example, row = 10;
    let data = input, 
        ext = extents(data),
        row = 2000000;
    console.log(ext);
    console.log(noPossibleBeacons(data, ext, row));
})();

function noPossibleBeacons(beacons, boundingRect, row) {
    let result = 0;

    ROW:
    for(let x=boundingRect[0].x,p; x<=boundingRect[1].x; x++){
        p = new Point(x, row);
        for(let b=0; b<beacons.length; b++){
            if(manhattanDistance(p, beacons[b][0]) <= beacons[b][2] && !beacons[b][1].equal(p)){
                result++;
                continue ROW;
            }
        }
    }
    return result;
}

function extents(data) {
    return data.reduce((a,v)=>{
        a[0].x = Math.min(a[0].x, v[0].x);
        a[0].y = Math.min(a[0].y, v[0].y);
        a[0].x = Math.min(a[0].x, v[1].x);
        a[0].y = Math.min(a[0].y, v[1].y);

        a[1].x = Math.max(a[1].x, v[0].x);
        a[1].y = Math.max(a[1].y, v[0].y);
        a[1].x = Math.max(a[1].x, v[1].x);
        a[1].y = Math.max(a[1].y, v[1].y);

        return a;
    }, [new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point()]);
}

function manhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y-p2.y);
}
