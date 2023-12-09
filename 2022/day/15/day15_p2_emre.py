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

def is_valid(point,space):
    if point[0]<0 or point[0]>space: return False
    if point[1]<0 or point[1]>space: return False
    return True

def is_good(point,sensorz):
    for sensor in sensorz:
        if abs(sensor.pos[0]-point[0]) + abs(sensor.pos[1]-point[1]) <= sensor.dist: return False
    return True

# Part 2
sensors = get_baconsensors("input.txt")
area = 4000000

# FAST METHOD: find intercepts from sensor diamonds, find the diamond edges separated by 1 block, find intersection of those edges, test only those points

# given the sensors, return a list of their y-intercepts
# (8,7)
# d = 9
def get_sensor_intercepts(sensors):
    intercepts = [] # top down, bottom down, top up, bottom up
    for sensor in sensors:
        pt = ((sensor.pos[0],sensor.pos[1]-sensor.dist)) # (8,-2)
        pb = ((sensor.pos[0],sensor.pos[1]+sensor.dist)) # (8,16)
        # Slopes are always 1 or -1, formula becomes (+/-)x + y = b
        intercepts.append([
            pt[1]-pt[0],                                 # -2 - 8 = -10
            pb[1]-pb[0],
            pt[1]+pt[0],
            pb[1]+pb[0]
        ])
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

