var Tempalte = {
    // day: 4,
    // month: 5,
    // average, max, min
    'Network Health': {
        'Latency': {
            'Web Service': [250, 450, 25],
            'Conferece Service': [25, 230, 3],
            'Media Service': [5, 20, 2],
            'SIP/H323': [5, 25, 2],
            'threshold': 150
        },
        'PacketLoss': {
            'Web Service': [4, 7, 0],
            'Conferece Service': [3, 4, 0],
            'Media Service': [3, 243, 0],
            'SIP/H323': [4, 347, 0],
            'threshold': 3
        }
    },
    'Cibbectuib Time': {
        'TCP / TLS': {
            'Web Service': [4, 7, 1],
            'Conferece Service': [3, 4, 1],
            'Media Service': [3, 243, 1],
            'SIP/H323': [4, 347, 1],
            'threshold': 150
        },
        'DNS': {
            'Web Service': [5, 6, 1],
            'Conferece Service': [4, 7, 1],
            'Media Service': [4, 6, 1],
            'SIP/H323': [5, 8, 1],
            'threshold': 150
        }
    },
    'Signaling API': { // 50000
        'Request Time': {
            'Web Service': [2, 5, 0],
            'Conferece Service': [5, 8, 1],
            'Media Service': [5, 8, 1],
            'SIP/H323': [4, 6, 1],
            threshold: 30
        },
        'Response Time': {
            'Web Service': [2, 5, 1],
            'Conferece Service': [3, 7, 1],
            'Media Service': [51, 250, 1],
            'SIP/H323': [2, 6, 1],
            'threshold': 15
        }
    },
    'Streaming Quality': { // 10000000 0.75
        'Latency': {
            'Media Service': [13, 25, 1],
            'SIP/H323': [7, 12, 1],
            'threshold': 200
        },
        'Packet Loss': {
            'Media Service': [4, 5, 0],
            'SIP/H323': [3, 6, 0],
            'threshold': 8
        },
        'Jetter': {
            'Media Service': [8, 11, 2],
            'SIP/H323': [10, 14, 2],
            'threshold': 150
        },
        'Bitrate': {
            'Media Service': [10, 15, 5],
            'SIP/H323': [20, 25, 15],
        },
        'Frame Rate': {
            'Media Service': [18, 21, 15],
            'SIP/H323': [22, 25, 18],
        },
        'Resolution': {
            'Media Service': [480, 180, 120],
            'SIP/H323': [360, 160, 120],
        }
    }
};
var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var DateHelper = function (fromMonth, fromDay, toMonth, toDay) {
    this.FromMonth = fromMonth;
    this.FromDay = fromDay;
    this.ToMonth = toMonth;
    this.ToDay = toDay;
    this.init();
};
DateHelper.prototype = {
    init: function () {
        var ret = this.getDays(this.FromMonth, this.FromDay, this.ToMonth, this.ToDay);
        this.TotalDays = ret.sum;
        this.DaysBeforeMonth = ret.breaks;
        this.DayList = ret.list;
        this.TotalHours = this.TotalDays * 24;
        this.TotalMinutes = this.TotalHours * 60;
    },
    Days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    getDays: function (month1, day1, month2, day2) {
        var ds, de,
            sum = 0,
            monthDay = {},
            list = [];
        for (var i = month1, l = month2 + 1; i < l; i++) {
            ds = i === month1 ? day1 : 1;
            de = i === month2 ? day2 : this.Days[i - 1];
            monthDay[i] = sum;
            for (var j = ds; j <= de; j++) {
                list.push({
                    m: i,
                    d: j
                });
                sum++;
            }
        }
        return {
            sum: sum,
            breaks: monthDay,
            list: list
        };
    },
    index: function (m, d, h, min) {
        return (this.DaysBeforeMonth[m] + d) * 24 * 60 + h * 60 + min;
    },
    len: function (m1, d1, h1, min1, m2, d2, h2, min2) {
        return this.index(m2, d2, h2, min2) - this.index(m1, d1, h1, min1);
    },
    eachMinute: function (func, args, m1, d1, h1, min1, m2, d2, h2, min2) {
        m1 = m1 || this.FromMonth;
        d1 = d1 || this.FromDay;
        h1 = h1 || 0;
        min1 = min1 || 59;
        m2 = m2 || this.ToMonth;
        d2 = d2 || this.ToDay;
        h2 = h2 || 0;
        min2 = min2 || 59;

        var isStartMonth, isEndMonth,
            isStartDay, isEndDay,
            isStartHour, isEndHour,
            dayStart,
            dayEnd,
            hourStart,
            hourEnd,
            minStart,
            minEnd,
            ret = [];

        for (var i = m1, l = m2 + 1; i < l; i++) {
            isStartMonth = i === m1;
            isEndMonth = i === m2;
            dayStart = isStartMonth ? d1 : 1;
            dayEnd = isEndMonth ? d2 : this.Days[i - 1];
            for (var j = dayStart; j <= dayEnd; j++) {
                isStartDay = isStartMonth && j === dayStart;
                isEndDay = isEndMonth && j === dayEnd;
                hourStart = isStartDay ? h1 : 0;
                hourEnd = isEndDay ? h2 : 23;
                for (var k = hourStart; k <= hourEnd; k++) {
                    isStartHour = isStartDay && k === hourStart;
                    isEndHour = isEndDay && k === hourEnd;
                    minStart = isStartHour ? m1 : 0;
                    minEnd = isEndHour ? m2 : 59;
                    for (var m = minStart; m <= minEnd; m++) {
                        ret.push(func(args, [i, j, k, m]));
                    }
                }
            }
        }
        return ret;
    }
};

var randomHelp = function (min, max) {
    return (Math.random() * (max - min) + min) >> 0;
};


var FakeData = function (fromMonth, fromDay, toMonth, toDay) {
    this.Calender = new DateHelper(fromMonth, fromDay, toMonth, toDay);
    this.init();
};
FakeData.prototype = {
    init: function () {
        var data = {};
        for (var t in this.Tempalte) {
            data[t] = {};
            for (var p in this.Tempalte[t]) {
                data[t][p] = {};
                for (var n in this.Tempalte[t][p]) {
                    if (n !== 'threshold') {
                        data[t][p][n] = this.Calender.eachMinute(this.generate, this.Tempalte[t][p][n]);
                    } else {
                        data[t][p][n] = this.Tempalte[t][p][n];
                    }
                }
            }
        }
        this.Data = data;
    },
    Tempalte: Tempalte,
    generate: function (config) {
        //average, max, min
        var min = config[2],
            max = config[1],
            mid = config[0],
            m1 = (mid-min)/2,
            m2 = (max-mid)/2;

        if (randomHelp(0, m1+m2) < m1) {
            return randomHelp(mid, max);
        } else {
            return randomHelp(min, mid);
        }
    },
    range: function (m1, d1, h1, min1, m2, d2, h2, min2) {
        var start = this.Calender.index(m1, d1, h1, min1),
            end = this.Calender.index(m2, d2, h2, min2);
        return [start, end];
    },
    len: function (m1, d1, h1, min1, m2, d2, h2, min2) {
        return this.Calender.len(m1, d1, h1, min1, m2, d2, h2, min2);
    },
    zoom: function (data, areaLength, step) {
        var stepDataLength = data.length / areaLength * step >> 0,
            last = data.length % stepDataLength,
            len = data.length / stepDataLength >> 0,
            ret = [],
            i = 0,
            l = len - 1;
        for (; i < l; i++) {
            ret.push(this.mid(data.slice(i, i + stepDataLength)));
        }
        if (last !== 0) {
            i++;
            ret.push(this.mid(data.slice(i, i + last)));
        }
        return ret;
    },
    zoomRandom: function(data, areaLength, step, base) {
        var stepDataLength = data.length / areaLength * step >> 0,
        last = data.length % stepDataLength,
        len = data.length / stepDataLength >> 0,
        ret = [],
        i = 0,
        l = len - 1;
        for (; i < l; i++) {
            ret.push(this.randomArray(data.slice(i, i + stepDataLength),base));
        }
        if (last !== 0) {
            i++;
            ret.push(this.randomArray(data.slice(i, i + last),base));
        }
        return ret;
    },
    randomArray: function(arr, base) {
        var sum = 0,
            i = 0,
            l = arr.length,
            min = -Infinity,
            max = Infinity;
        for (; i < l; i++) {
            min = Math.min(min, arr[i]);
            max = Math.min(max, arr[i]);
            sum += arr[i];
        }
        var mid = sum / l;
        if(mid>base[1]){
            return max;
        }else if(mid<base[0]){
            return min;
        }else {
            return mid;
        }
    },
    mid: function (arr) {
        var sum = 0,
            i = 0,
            l = arr.length;
        for (; i < l; i++) {
            sum += arr[i];
        }
        return sum / l;
    }
};

window.FakeData = FakeData;