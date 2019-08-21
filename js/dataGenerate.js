var templateRange = {
    // day: 4,
    // month: 5,
    'Usage by activity': {
        'Video': 4,
        'Recording': 6,
        'Sharing': 8
    },
    'Usage by location': {
        'Usa': 100,
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
    Role: { // 200000
        'Host': 20000,
        'Participants': 180000
    },
    'Join Method': { // 200000
        'Video Device': 24000,
        'Webex Teams': 35000,
        'Webex Meeting': 180000
    },
    videoUsage: { // 200000
        'Meetings Client Video Participants': 50000,
        'Teams Client and Device Video Participants': 100000,
        'Total Participants': 180000
    }
};

var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var countAll = function(month1, day1, month2, day2) {
    var ds, de,
        sum = 0;
    for (var i = month1, l = month2 + 1; i < l; i++) {
        ds = i === month1 ? day1 : 1;
        de = i === month2 ? day2 : monthDay[i - 1];
        for (var j = ds; j <= de; j++) {
            sum ++ ;
        }
    }
    return sum;
};

var generate = function (month1, day1, month2, day2, randomFunc) {
    var ds, de, arr = [],
        index = 0,
        sum = countAll(month1, day1, month2, day2),
        func = typeof randomFunc === 'function' ? randomFunc : randomNode;
    for (var i = month1, l = month2 + 1; i < l; i++) {
        ds = i === month1 ? day1 : 1;
        de = i === month2 ? day2 : monthDay[i - 1];
        for (var j = ds; j <= de; j++) {
            arr.push(generateData(i, j, func, index , sum));
            index++;
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

var getPercentage = function(index, total) {
    if(total<5) {
        return 0.5;
    }
};

var randomDataPencentage = function(node, month, day, index, total) {
    var p = {},
        max = - Infinity;
    for(var n in node) {
        max = Math.max(max, node[n]);
    }
    max = max * 0.5;
    for(var n in node) {
        p[n] = max;
    }
    return p;
};

var randomNode =  function(node, month, day) {
    var p = {};
    for(var n in node) {
        p[n] = randomData(node[n], month, day);
    }
    return p;
};

var generateData = function (month, day, randomFunc, index, total) {
    var o = {
        m: month,
        d: day,
        tickeName: fd(month) + '/' + fd(day)
    }, node, p;
    for (var name in templateRange) {
        node = templateRange[name];
        p = randomFunc(node, month, day, index, total);
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
            ret[wIndex] = emptyData(); //emptyData
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

var sum0 = function (data) {
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
                o[i1][j1] += 0;
            }
        }
    }
    for (var i in o) {
        r[i] = toArrayName(o[i]);
    }
    return r;
};

var cardData = [{
    title: 'Total Meetings',
    sum: '13K',
    arrow: 'up',
    increase: 10,
    percentage: 10
}, {
    title: 'Total Unique Hosts',
    sum: '109K',
    arrow: 'up',
    increase: 10,
    percentage: 10
}, {
    title: 'Total Meeting Minutes',
    sum: '8.9K',
    arrow: 'up',
    increase: 13,
    percentage: 10
}, {
    title: 'Total Participants',
    sum: '1.5K',
    arrow: 'down',
    increase: 3,
    percentage: 10
}, {
    title: 'Total Video Meetings',
    sum: '2.6K',
    arrow: 'up',
    increase: 7,
    percentage: 10
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
var PDATA = generate(4, 15, 5, 15, randomDataPencentage);

var MData = filerMonth(DATA);
var WData = filerWeek(DATA);

var MDataP = filerMonth(PDATA);
var WDataP = filerWeek(PDATA);

window.RAWDATA = {
    day: {
        data: DATA,
        preload: PDATA,
        sum: sum(DATA),
        preloadSum: sum(PDATA),
        unit: 1
    },
    week: {
        data: WData,
        preload: WDataP,
        sum: sum(WData),
        preloadSum: sum(WDataP),
        unit: 7
    },
    month: {
        data: MData,
        preload: MDataP,
        sum: sum(MData),
        preloadSum: sum(MDataP),
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
        board1: ['meetings', 'minutes'],
        board2: ['Role', 'Join Method', 'videoUsage']
    },
    DTABLE: DTABLE
};