var templateRange = {
    // day: 4,
    // month: 5,
    'Usage by activity': {
        'Audio Calls': 900,
        'Messages': 400,
        'Video Calls': 700
    },
    'Usage by platform': {
        'iOS': 1000,
        'Win': 330,
        'Mac': 670
    },
    'Usage by Client version': {
        'Jabber 4.1': 1000,
        'Jabber 4.0': 260,
        'Jabber 3.9': 740
    },
    'Active user usage': {
        'Active user': 16,
        'Usage': 75
    },
    'Total usage': {
        All: 2000
    },
    'Total daily active users': {
        Users: 100
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

var cardData = [{
    title: 'Active Users',
    sum: '0.2K',
    arrow: 'up',
    increase: 10,
    percentage: '10% of total users'
}, {
    title: 'Total Jabber Usages',
    sum: '13K',
    arrow: 'up',
    increase: 10,
    percentage: '65 usgs per actice user'
}, {
    title: 'Total Messages',
    sum: '8.9K',
    arrow: 'up',
    increase: 13,
    percentage: '44.5 msgs per active user'
}, {
    title: 'Total Video Calls',
    sum: '1.5K',
    arrow: 'down',
    increase: 3,
    percentage: '7.5 calls per active user'
}, {
    title: 'Total Audio Calls',
    sum: '2.6K',
    arrow: 'up',
    increase: 7,
    percentage: '14 calls per active user'
}, {
    title: 'Service Up Time %',
    sum: '92.5%',
    arrow: 'down',
    increase: 10,
    percentage: '12 mins downtime'
}];
var _c = function(c1,c2,c3){
    return {
        c1:c1,
        c2:c2,
        c3:c3
    }
};
var GenerateTableData = function (top10, t, range1, range2){
    var r1 =  range1 || [400,600],
        r2 =range2 || [20000, 40000],
        arr = [];
    arr.push(_c(t[0], t[1], t[2]));
    for(var i in top10){
        arr.push(_c(top10[i], randomHelp.apply(this,r1), randomHelp.apply(this,r2)));
    }
    arr.sort(function(d1,d2){
        return d2.c3 - d1.c3;
    });
    return arr;
};
var DTABLE = [
    GenerateTableData(['Town Hall','Our People Talk', 'Branding Share-out','Business Policies','Quarterly Update Marketing','CFC FY19 Meeting','Earnings Report FY19','All Hands Management','Board and Partner Committee','Partner Meeting'],
        ['Meeting Name','# of Participants','Meeting Minutes']),
    GenerateTableData(['henylee','mariaaven','lauraforn','ericma','andylaws','tofuwu','mochawu','stevenadam','marywang','charlieanson'],
        ['User','# of Meetings','# of Meetings'],[200,300]),
    GenerateTableData(['San Jose, CA','San Francisco, CA','Richardson, TX','Seattle, WA','Bellevue, WA','Newark, NJ','Los Angeles, CA','San Diego, CA','Austin, TX','New York, NJ'],
        ['Location','# of Meetings','# of Meetings'],[200,300]) 
];


var DATA = generate(4, 15, 5, 15);
var MData = filerMonth(DATA);
var WData = filerWeek(DATA);
window.RAWDATA = {
    day: {
        data: DATA,
        sum: sum(DATA),
        unit: 1
    },
    week: {
        data: WData,
        sum: sum(WData),
        unit: 7
    },
    month: {
        data: MData,
        sum: sum(MData),
        unit: 31
    },
    // daySum: sum(DATA), // sum for pie chart
    // monthSum: sum(MData),
    ///weekSum: sum(WData),
    templateRange: templateRange,
    hash: hashStructor(),
    card: cardData,
    selection: { //$s
        dataUnit: ['day', 'week', 'month'],
        board1: ['Total usage', 'Usage by activity'],
        board2: ['Total daily active users', 'Usage by platform']
    },
    DTABLE: DTABLE
};