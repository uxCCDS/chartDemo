var templateRange = {
    // day: 4,
    // month: 5,
    activity: {
        'Video': 4,
        'Recording': 6,
        'Sharing': 8
    },
    location: {
        'Use': 100,
        'China': 30,
        'Europe':20,
        'Australia':15,
        'Other': 10
    },
    meetings: { // 50000
        'Meetings Client Video': 1000,
        'Teams Client and Device Video': 2000,
        'All Meetings': 40000
    },
    minutes: { // 10000000 0.75
        'Meetings Client Video':100000,
        'Teams Client and Device Video':200000,
        'All Meetings': 7500000
    },
    role: { // 200000
        'Host':20000,
        'Participants': 180000
    },
    join: { // 200000
        'Could Video Device': 20000,
        'On-Premise Video Device':24000,
        'Teams': 35000,
        'Webex Meeting Client': 180000
    },
    videoUsage: { // 200000
        'Meetings Client Video Participants': 50000,
        'Teams Client and Device Video Participants':100000,
        'Total Participants': 180000
    }
};

var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var generate = function(month1, day1, month2, day2) {
    var ds,de,arr = [];
    for(var i = month1, l = month2+1; i< l; i++) {
        ds = i === month1 ? day1 : 1;
        de = i === month2 ? day2 : monthDay[i-1];
        for(var j= ds; j <= de; j++) {
            arr.push(generateData(i,j));
        }
    }
    return arr;
};

var randomData = function(max, month, day) {
    return Math.random() * max * (0.5+ 0.4 * month / 12 + 0.1 * day / 31 ) >> 0;
};

var generateData = function(month, day) {
    var o = {
        m: month,
        d: day
    }, node, p, arr;
    for(var name in templateRange) {
        node = templateRange[name];
        p = {}
        for (var n in node){
            p[n] = randomData(node[n],month, day);
        }
        o[name] = p;
    }
    return o;
};

var emptyData = function() {
    var ret = {},
        node,p;
    for(var name in templateRange){
        node = templateRange[name];
        p = {};
        for(var n in node){
            p[n] = 0;
        }
        ret[name] = p;
    }
    return ret;
};

var add = function(d1, d2) {
    for(var name in d1) {
        for(var n in d1[name]) {
            d1[name][n] += d2[name][n];
        }
    }
};

var hashStructor = function() {
    var obj = [],
        keys;
    for(var n in templateRange){
        keys = [];
        for(var j in templateRange[n]){
            keys.push(j);
        }
        obj.push(keys);
    }
    return obj;
};

var filerMonth = function(data) {
    var m,
        d,
        ret={};
    for(var i in data) {
        d = data[i];
        if(m !== d.m) {
            m = d.m
            ret[m] = emptyData();
        }
        add(ret[m], data[i]);
    }
    var arr = [];
    for(var x in ret){
        arr.push(ret[x]);
    }
    return arr;
};

var filerWeek = function(data) {
    var m,
        d,
        wIndex = -1,
        ret={};
    for(var i in data) {
        d = data[i];
        if(i % 7 === 0) {
            wIndex ++;
            ret[wIndex] = emptyData();
        }
        add(ret[wIndex], data[i]);
    }
    var arr = [];
    for(var x in ret){
        arr.push(ret[x]);
    }
    return arr;
};

var DATA = generate(4,15,5,15);

window.RAWDATA = {
    data: DATA,
    month: filerMonth(DATA),
    week: filerWeek(DATA),
    templateRange: templateRange,
    hash: hashStructor()
};