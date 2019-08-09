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
        'Europe': 20,
        'Australia': 15,
        'Other': 10
    },
    meetings: { // 50000
        'Meetings Client Video': 15000,
        'Teams Client and Device Video': 16000,
        'All Meetings': 40000
    },
    minutes: { // 10000000 0.75
        'Meetings Client Video': 2000000,
        'Teams Client and Device Video': 3000000,
        'All Meetings': 7500000
    },
    role: { // 200000
        'Host': 20000,
        'Participants': 180000
    },
    join: { // 200000
        'Could Video Device': 20000,
        'On-Premise Video Device': 24000,
        'Teams': 35000,
        'Webex Meeting Client': 180000
    },
    videoUsage: { // 200000
        'Meetings Client Video Participants': 50000,
        'Teams Client and Device Video Participants': 100000,
        'Total Participants': 180000
    }
};

var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var generate = function (month1, day1, month2, day2) {
    var ds, de, arr = [];
    for (var i = month1, l = month2 + 1; i < l; i++) {
        ds = i === month1 ? day1 : 1;
        de = i === month2 ? day2 : monthDay[i - 1];
        for (var j = ds; j <= de; j++) {
            arr.push(generateData(i, j));
        }
    }
    return arr;
};

var randomHelp = function (min, max) {
    return (Math.random() * (max - min) + min) >> 0;
};

var randomData = function (max, month, day) {
    var rate = ((month - 1) * 31 + day) / 12 / 31;
    var xBase = max * 0.4,
        // mBase = max * 0.6 * month / 12,
        // dBase = max * 0.2 * day / 31,
        rateBase = max * 0.6 * rate;
    // m = this.randomHelp(mBase * 0.9, mBase),
    // d = this.randomHelp(dBase * 0.8, dBase),
    xRate = this.randomHelp(rateBase * 0.8, rateBase);
    return (xBase + xRate) >> 0;
};

var generateData = function (month, day) {
    var o = {
        m: month,
        d: day,
        tickeName: fd(month) + '/' + fd(day)
    }, node, p, arr;
    for (var name in templateRange) {
        node = templateRange[name];
        p = {}
        for (var n in node) {
            p[n] = randomData(node[n], month, day);
        }
        o[name] = p;
    }
    return o;
};

var emptyData = function () {
    var ret = {},
        node, p;
    for (var name in templateRange) {
        node = templateRange[name];
        p = {};
        for (var n in node) {
            p[n] = 0;
        }
        ret[name] = p;
    }
    return ret;
};

var add = function (d1, d2) {
    for (var name in d1) {
        if (templateRange[name]) {
            for (var n in d1[name]) {
                d1[name][n] += d2[name][n];
            }
        }
    }
};

var hashStructor = function () {
    var obj = [],
        keys;
    for (var n in templateRange) {
        keys = [];
        for (var j in templateRange[n]) {
            keys.push(j);
        }
        obj.push(keys);
    }
    return obj;
};

var fd = function (d) {
    return d < 10 ? '0' + d : '' + d;
};

var filerMonth = function (data) {
    var m,
        d,
        ret = {};
    for (var i in data) {
        d = data[i];
        if (m !== d.m) {
            m = d.m
            ret[m] = emptyData();
            ret[m].tickeName = fd(d.m);
        }
        add(ret[m], d);
    }
    var arr = [];
    for (var x in ret) {
        arr.push(ret[x]);
    }
    return arr;
};

var filerWeek = function (data) {
    var m,
        d,
        wIndex = -1,
        ret = {};
    for (var i in data) {
        d = data[i];
        if (i % 7 === 0) {
            wIndex++;
            ret[wIndex] = emptyData();
            ret[wIndex].tickeName = d.tickeName;
        }
        add(ret[wIndex], d);
    }
    var arr = [];
    for (var x in ret) {
        arr.push(ret[x]);
    }
    return arr;
};

var toArrayName = function (obj) {
    var arr = [];
    for (var n in obj) {
        arr.push({
            name: n,
            value: obj[n]
        });
    }
    return arr;
};


var sum = function (data) {
    var o = {},
        d,
        r = {};
    for (var i in templateRange) {
        o[i] = {};
        for (var j in templateRange[i]) {
            o[i][j] = 0;
        }
    }
    for (var index = 0, l = data.length; index < l; index++) {
        d = data[index];
        for (var i1 in o) {
            for (var j1 in o[i1]) {
                o[i1][j1] += d[i1][j1];
            }
        }
    }
    for (var i in o) {
        r[i] = toArrayName(o[i]);
    }
    return r;
};

var DATA = generate(4, 15, 5, 15);
var MData = filerMonth(DATA);
var WData = filerWeek(DATA);
window.RAWDATA = {
    day: DATA,
    month: MData,
    week: WData,
    daySum: sum(DATA),
    monthSum: sum(MData),
    weekSum: sum(WData),
    templateRange: templateRange,
    hash: hashStructor()
};