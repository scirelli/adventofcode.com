from math import sin,cos,pi
from sys import stdout

delim = [", y=",": closest beacon is at x="]
junk = ["Sensor at x=","\n"]
class Sensor:
    def __init__(self,pos,bacon):
        self.pos = pos
        self.bacon = bacon
        self.dist = stupiddistance(pos,bacon)
    def __repr__(self): return "\npos: "+str(self.pos)+"\nbacon: "+str(self.bacon)+"\ndist: "+str(self.dist)+"\n"

def stupiddistance(a,b): return abs(a[0]-b[0]) + abs(a[1]-b[1])

def get_baconsensors(fname):
    rv = []
    poop = open(fname,"r").readlines()
    for s in delim: poop = [p.replace(s,",") for p in poop]
    for s in junk: poop = [p.replace(s,"") for p in poop]
    poop = [[int(x) for x in p.split(",")] for p in poop]
    for p in poop: rv.append(Sensor((p[0],p[1]),(p[2],p[3])))
    return rv

def get_baconspace(sensorz,y):
    rv = set()
    for sensor in sensorz:
        if abs(sensor.pos[1]-y) > sensor.dist+1: continue
        for rx in range(-sensor.dist,sensor.dist):
            x = rx + sensor.pos[0]
            if stupiddistance(sensor.pos,(x,y)) <= sensor.dist:
                rv.add(x)
    for sensor in sensorz:
        if sensor.bacon[1] == y and sensor.bacon[0] in rv: rv.remove(sensor.bacon[0])
    return rv

def is_valid(point,space):
    if point[0]<0 or point[0]>space: return False
    if point[1]<0 or point[1]>space: return False
    return True

def is_good(point,sensorz):
    for sensor in sensorz:
        if abs(sensor.pos[0]-point[0]) + abs(sensor.pos[1]-point[1]) <= sensor.dist: return False
    return True

# get the set of coordinates just outside the boundary of a sensor
def get_sensor_edges(sensor,space,sensors):
    for i in range(sensor.dist+1):
        a = (sensor.pos[0]-sensor.dist+1-i,sensor.pos[1]+sensor.dist-i)
        b = (sensor.pos[0]-sensor.dist+i,sensor.pos[1]-i-1)
        c = (sensor.pos[0]+1+i,sensor.pos[1]-sensor.dist+i)
        d = (sensor.pos[0]+sensor.dist-i,sensor.pos[1]+i+1)
        if is_valid(a,space) and is_good(a,sensors): return a
        if is_valid(b,space) and is_good(b,sensors): return b
        if is_valid(c,space) and is_good(c,sensors): return c
        if is_valid(d,space) and is_good(d,sensors): return d
    return None


sensors = get_baconsensors("input15.txt")
# Part 1
#print("Part 1:",len(get_baconspace(sensors,2000000)))

# Part 2
sensors = get_baconsensors("input15.txt")
area = 4000000
# sensors = get_baconsensors("i15.txt")
# area = 20

# SLOW METHOD: scan millions of points

# for sensor in sensors:
#     viable = get_sensor_edges(sensor,area,sensors)
#     if not viable: continue
#     print("Part 2:",viable[0]*4000000+viable[1])
#     break



# FAST METHOD: find intercepts from sensor diamonds, find the diamond edges separated by 1 block, find intersection of those edges, test only those points

# given the sensors, return a list of their y-intercepts
def get_sensor_intercepts(sensors):
    intercepts = [] # top down, bottom down, top up, bottom up
    for sensor in sensors:
        pt = ((sensor.pos[0],sensor.pos[1]-sensor.dist))
        pb = ((sensor.pos[0],sensor.pos[1]+sensor.dist))
        intercepts.append([pt[1]-pt[0],pb[1]-pb[0],pt[1]+pt[0],pb[1]+pb[0]])
    return intercepts

# given array of y-intercepts [top down, bottom down, top up, bottom up]
# returns list of intercepts where they're separated by one [upwards,downwards]
def get_nearby_intercepts(intercepts):
    upward = set()
    downward = set()
    for i in intercepts:
        for j in intercepts:
            intercept_distance = abs(i[0]-j[1])
            if intercept_distance == 2: downward.add((i[0]+j[1])//2)
            intercept_distance = abs(i[1]-j[0])
            if intercept_distance == 2: downward.add((i[1]+j[0])//2)
            intercept_distance = abs(i[2]-j[3])
            if intercept_distance == 2: upward.add((i[2]+j[3])//2)
            intercept_distance = abs(i[3]-j[2])
            if intercept_distance == 2: upward.add((i[3]+j[2])//2)
    return [list(upward),list(downward)]

# given array of up and down intercepts array [upwards,downwards], gets their intersection points
def get_intersections_from_intercepts(intercepts):
    intersection_points = set()
    for i in intercepts[0]:
        for j in intercepts[1]:
            intersection_points.add((abs(i-j)//2,(i+j)//2))
    return list(intersection_points)

# given an array of intersection points, returns the first one that is not inside bacon space and not in any sensor range
# this is not even needed for the non-test input data the input data has only one valid intersection point
def test_points(intersection_points,space,sensors):
    for p in intersection_points:
        if is_valid(p,space) and is_good(p,sensors): return p
    return None

point = test_points(get_intersections_from_intercepts(get_nearby_intercepts(get_sensor_intercepts(sensors))),area,sensors)
print("Part 2:",point[0]*4000000+point[1])

