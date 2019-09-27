var DATA = new FakeData(7, 14, 8, 14);
var COLORS = {
    'Web Service': '#FF7A37',
    'Conferece Service': '#D524E5',
    'Media Service': '#0B64BF',
    'SIP_H323': '#00B8F1'
};
console.log(DATA);

var CONFIG = $c.database({
    len: 1285,
    areaLen: 636,
    padding: 135,
    whole: 771,
    range: {}
});

var PBar = function (id, dataUrl, root) {
    this.Body = document.getElementsByTagName('BODY')[0];
    this.Root = root;
    this.Database = root.Database;
    this.DataUrl = dataUrl;
    this.IsStart = dataUrl === 'x1';
    this.Dom = document.getElementById(id);
    this.BarLarge = document.getElementById(id + '2').getElementsByTagName('SPAN')[0];
    this.Bar = this.Dom.getElementsByTagName('SPAN')[0];
    this.init();
};
PBar.prototype = {
    init: function () {
        var me = this,
            startVal,
            startX,
            x1,
            x2,
            min,
            max,
            update = function (e) {
                var _val;
                if (e.pageX >= max) {
                    _val = max;
                } else if (e.pageX <= min) {
                    _val = min;
                } else {
                    _val = e.pageX;
                }
                _val = me.Root.filterX(startVal + (_val - startX));
                if (_val !== me.Database.val(me.DataUrl)) {
                    me.Database.val(me.DataUrl, _val);
                }
            },
            move = function (e) {
                update(e);
            },
            moveend = function (e) {
                update(e);
                me.Body.style.cursor = '';
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', moveend);
            },
            movestart = function (e) {
                e.stopPropagation();
                startVal = me.Database.val(me.DataUrl);
                startX = e.pageX;
                x1 = me.Database.val('x1');
                x2 = me.Database.val('x2');
                if (me.IsStart) {
                    max = x2 - x1;
                    min = max - me.Root.DayLen;
                } else {
                    min = x1 - x2;
                    max = me.Root.DayLen + min;
                }
                min = startX + min;
                max = startX + max;
                me.Body.style.cursor = 'move';
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', moveend);
            };
        this.Dom.addEventListener('mousedown', movestart);
        this.Database.bind(this.DataUrl, function (e) {
            var _date = me.Root.x2Date(e.Data);
            me.update(_date.h, _date.min);
        });
    },
    text: function (text) {
        this.Bar.innerHTML = text;
        this.BarLarge.innerHTML = text;
    },
    f: function (t) {
        return t >= 10 ? t : '0' + t;
    },
    update: function (h, m) {
        this.text(this.f(h) + ':' + this.f(m));
    }
};

var ControlArea = function (id, root) {
    this.Body = document.getElementsByTagName('BODY')[0];
    this.Database = root.Database;
    this.Root = root;
    this.Dom = document.getElementById(id);
    this.DomLarge = document.getElementById(id + '2');
    this.CurrentMove = false;
};
ControlArea.prototype = {
    init: function (x1, x2) {
        this.R = new PBar('timeContorlR', 'x2', this.Root);
        this.L = new PBar('timeContorlL', 'x1', this.Root);
        this.L.update(0, 0);
        this.R.update(0, 0);
        var me = this;
        this.Database.bind('', function (v) {
            var x1 = v.Data.x1,
                x2 = v.Data.x2;
            me.Dom.style.left = x1 + 'px';
            me.Dom.style.width = x2 - x1 + 'px';
        });
        this.Database.val('', {
            x1: x1,
            x2: x2
        });
        this.Dom.style.display = '';
        this.DomLarge.style.background = 'none';
        this.DomLarge.style.height = '1202px';
        this.DomLarge.style.top = '22px';
        this.DomLarge.style.width = CONFIG.val('areaLen') + 'px';
        this.DomLarge.style.left = CONFIG.val('padding') + 'px';
        this.DomLarge.style.display = '';
        this.initEvent();
    },
    initEvent: function () {
        var me = this,
            startX,
            x1,
            w,
            update = function (e) {
                var _val = me.Root.filterX1(x1 + e.pageX - startX);
                if (_val !== me.Database.val('x1')) {
                    me.Database.val('', {
                        x1: _val,
                        x2: _val + w
                    });
                }
            },
            move = function (e) {
                update(e);
            },
            moveend = function (e) {
                update(e);
                me.Body.style.cursor = '';
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', moveend);
            },
            movestart = function (e) {
                e.stopPropagation();
                startX = e.pageX;
                x1 = me.Database.val('x1');
                w = me.Database.val('x2') - x1;
                me.Body.style.cursor = 'move';
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', moveend);
            };
        this.Dom.addEventListener('mousedown', movestart);
    },
};

var ProgressCanvas = function (id) {
    this.Id = id;
    this.Database = $c.database({});
    this.init();
};
ProgressCanvas.prototype = {
    init: function () {
        this.DayLen = CONFIG.val('len') / DATA.Calender.DayList.length >> 0;
        this.LastDayIndex = DATA.Calender.DayList.length - 1;
        this.HourLen = this.DayLen / 24;
        this.MinuteLen = this.HourLen / 60;
        this.Controls = new ControlArea('timeContorlArea', this);
        this.Controls.init(this.day2X(this.LastDayIndex - 4), this.day2X(this.LastDayIndex - 3));
        this.draw();
        this.X1Min = this.day2X(0);
        this.X1Max = this.date2X(this.LastDayIndex - 1, 23, 59);
        this.X2Min = this.day2X(1);
        this.X2Max = this.date2X(this.LastDayIndex, 23, 59);
        var me = this;
        CONFIG.val('range', me.date());
        this.Database.bind('', function(v){
            CONFIG.val('range', me.date());
        });
    },
    filterX: function (x) {
        if (x < this.X1Min) {
            return this.X1Min;
        } else if (x > this.X2Max) {
            return this.X2Max;
        } else {
            return x;
        }
    },
    filterX1: function (x) {
        if (x < this.X1Min) {
            return this.X1Min;
        } else if (x > this.X1Max) {
            return this.X1Max;
        } else {
            return x;
        }
    },
    filterX2: function (x) {
        if (x < this.X2Min) {
            return this.X2Min;
        } else if (x > this.X2Max) {
            return this.X2Max;
        } else {
            return x;
        }
    },
    day2X: function (index) {
        return 5 + index * this.DayLen;
    },
    date2X: function (index, hour, minute) {
        return this.day2X(index) + hour * this.HourLen + minute * this.MinuteLen;
    },
    x2Date: function (x) {
        var len = x - 5,
            index = len / this.DayLen >> 0,
            x_h = len % this.DayLen,
            h = x_h / this.HourLen >> 0,
            x_m = x_h % this.HourLen,
            m = x_m / this.MinuteLen >> 0,
            obj = DATA.Calender.DayList[index];
        return {
            m: obj.m,
            d: obj.d,
            h: h,
            min: m
        };
    },
    date: function () {
        var d1 = this.x2Date(this.Database.val('x1')),
            d2 = this.x2Date(this.Database.val('x2'));
        return {
            d1: d1,
            d2: d2
        }
    },
    range: function () {
        var d = this.date(),
            d1 = d.d1,
            d2 = d.d2,
            _range = DATA.range(d1.m, d1.d, d1.h, d1.min, d2.m, d2.d, d2.h, d2.min);
        return _range;
    },
    draw: function () {
        var list = this.everyList(DATA.Calender.DayList, 3),
            textStep = this.DayLen;
        this.Board = $c.board('#' + this.Id, {
            attr: {
                width: '1290',
                height: '52',
                viewBox: "0 0 1290 52"
            },
            style: {
                background: '#F7F7F7'
            }
        }, {
            data: DATA.Data['Network Health'].Latency['Web Service'],
            list: list
        });
        this.Board.text('list', {
            generator: {
                x: function (d, i) {
                    return 5 + textStep + textStep * i * 3;
                },
                y: 36,
                text: function (d) {
                    return d.m + '/' + d.d;
                }
            },
            modify: {
                style: {
                    stroke: '#565A5C',
                    'font-size': '9px',
                    'text-anchor': 'middle'
                }
            }
        });
        var _threshold = 245,
            _threshold2 = 250,
            _threshold3 = 255;
        this.Board.rect('data', {
            dataConvert: function (data) {
                return DATA.zoomRandom(data, CONFIG.val('len'), 5, [245, 255]);
            },
            generator: {
                x: function (d, i) {
                    return 5 + 5 * i;
                },
                y: 17,
                w: 5,
                h: 6
            },
            modify: {
                style: {
                    fill: function (d) {
                        if (d > _threshold3) {
                            return '#000000';
                        } else if (d > _threshold2) {
                            return '#923830';
                        } else if (d > _threshold) {
                            return '#D93829';
                        } else {
                            return '#7FEB86';
                        }
                    }
                }
            }
        });
        this.Board.render();
    },
    everyList: function (list, step) {
        var ret = [];
        for (var i = 1, l = list.length; i < l; i += step) {
            ret.push(list[i]);
        }
        return ret;
    }
};

var Axis = function (progress) {
    this.Progress = progress;
    this.Config = {};
    this.init();
};
Axis.prototype = {
    prepare: function () {
        var d = this.Progress.date(),
            day1 = d.d1,
            day2 = d.d2,
            range = this.Progress.range(),
            rangeLen = range[1] - range[0],
            ifNotOneDay = day1.d !== day2.d,
            day2Hour = ifNotOneDay ? day2.h + 24 : day2.h;

        var len = (day2Hour - day1.h) * 60 + day2.min - day1.min,
            startP = 60,
            fisrtIndex,
            step;
        if (len > 15 * 60) {
            step = 4 * 60;
        } else if (len > 10 * 60) {
            step = 3 * 60;
        } else if (len > 6 * 60) {
            step = 2 * 60;
        } else if (len > 2 * 60) {
            step = 60;
        } else if (len > 30) {
            step = 30;
        } else if (len > 10) {
            step = 5;
        } else if (len > 5) {
            step = 2;
        } else if (len > 5) {
            step = 1;
        }
        startP = step >= 60 ? 60 : step;
        if (day1.min % startP === 0) {
            fisrtIndex = 0;
        } else {
            fisrtIndex = startP - day1.min % startP;
        }

        var _tick = fisrtIndex,
            arr = [];
        _tick += step;
        while (_tick < len) {
            arr.push({
                index: _tick,
                date: DATA.Calender.daytime(range[0] + _tick)
            });
            _tick += step;
        }

        var perIndexLen = CONFIG.val('areaLen') / (range[1] - range[0]);

        this.Config = {
            tickets: arr,
            start: range[0],
            end: range[1],
            perIndexLen: perIndexLen
        };

    },
    f: function (t) {
        return t >= 10 ? t : '0' + t;
    },
    init: function () {
        var me = this;
        me.prepare();
        this.Board = $c.board('#boardAxis', {
            attr: {
                width: CONFIG.val('whole'),
                height: '24',
                viewBox: "0 0 " + CONFIG.val('whole') + " 24"
            }
        }, {
            line: [CONFIG.val('padding'), CONFIG.val('padding') + CONFIG.val('areaLen')],
            tickets: me.Config.tickets
        });
        this.Board.line('line', {
            generator: {
                x: function (d) {
                    return d
                },
                y: 22
            },
            modify: {
                style: {
                    stroke: '#D2D5D6',
                    'stroke-width': 2
                }
            }
        });
        CONFIG.bind('areaLen', function (v) {
            me.prepare();
            me.Board.data('line', [CONFIG.val('padding'), CONFIG.val('padding') + v.Data]);
            me.Board.render();
        });

        this.Board.text('tickets', {
            generator: {
                x: function (d) {
                    return CONFIG.val('padding') + d.index * me.Config.perIndexLen >> 0;
                },
                y: 15,
                text: function (d) {
                    return me.f(d.date.h) + ':' + me.f(d.date.min);
                }
            },
            modify: {
                style: {
                    stroke: '#9B9B9B',
                    'font-size': '9px',
                    'text-anchor': 'middle'
                }
            }
        })

        this.Progress.Database.bind('', function (v) {            
            me.prepare();
            me.Board.render('tickets', me.Config.tickets);
        });

        this.Board.render();
    }
};

var DataBoard = function (id) {
    this.Id = id;
    this.DomID = 'board' + id.replace(/\t|\s|\n|\r/g, '');
    this.First = [];
    this.SourceData = DATA.Data[this.Id];
    var _prop = this.getPropNum(this.SourceData);
    this.Props = _prop.props
    this.BlockNum = _prop.num;
    this.Step = 53;
    this.Top = 20;
    this.Bottom = 50;
    this.BlockHeight = 80;
    this.Height = this.BlockNum * this.BlockHeight + this.Top + this.Bottom;    
    this.Board = $c.board('#' + this.DomID, {
        attr: {
            width: CONFIG.val('whole'),
            height: this.Height,
            viewBox: "0 0 " + CONFIG.val('whole') + " " + this.Height
        }
    }, this.filterData(this.SourceData));
    this.init();
};
DataBoard.prototype = {
    getSliceDataIndex: function() {
        var me = this,
            v = CONFIG.val('range'),
            d1 = v.d1,
            d2 = v.d2;
        return DATA.range(d1.m,d1.d,d1.h,d1.min,d2.m,d2.d,d2.h,d2.min);
    },
    filterDataLine: function (data) {
        var _ret = {},
            len = CONFIG.val('areaLen'),
            idx = this.getSliceDataIndex();
        for (var name in data) {
            if (data.hasOwnProperty(name) && name !== 'threshold') {
                if (this.First.length === 1) {
                    this.First.push(name);
                }
                _ret[name] = DATA.zoomLine(data[name].slice(idx[0],idx[1]), len, this.Step);
            }
        }
        return _ret;
    },
    filterData: function (data) {
        var i = 0, l = this.Props.length,
            name,
            padding = CONFIG.val('padding'),
            areaLen = CONFIG.val('areaLen'),
            _ret = {
                names: [],
                title: [this.Id],
                thresholds: [],
                thresholdsPositions: {},
                range: [padding, padding + areaLen]
            };
        for (var name in data) {
            if (this.First.length === 0) {
                this.First.push(name);
            }
            _ret[name] = this.filterDataLine(data[name]);
            _ret.names.push(name);
            if (data[name].threshold !== undefined) {
                _ret.thresholds.push(data[name].threshold);
                if (_ret.thresholdsPositions[name] === undefined) {
                    _ret.thresholdsPositions[name] = {};
                }
                _ret.thresholdsPositions[name] = [{
                    x: padding,
                    y: this.BlockHeight * (i * 2 + 1) / 2 + this.Top + 10
                }, {
                    x: padding + areaLen,
                    y: this.BlockHeight * (i * 2 + 1) / 2 + this.Top + 10
                }];
                i++;
            }
        }
        // console.log('--', this.Id, _ret);
        return _ret;
    },
    getPropNum: function (obj, callback) {
        var i = 0,
            ret = [];
        for (var n in obj) {
            if (obj.hasOwnProperty(n) && n !== 'threshold') {
                callback && callback(n);
                ret.push(n);
                i++;
            }
        }
        return {
            num: i,
            props: ret
        };
    },
    init: function () {
        var me = this,
            padding = CONFIG.val('padding'),
            areaLen = CONFIG.val('areaLen'),
            step = this.Step;
        this.Board.text('title', {
            generator: {
                x: 17,
                y: 11,
                text: function (d) {
                    return '▼ ' + d;
                }
            },
            modify: {
                style: {
                    stroke: '#000000',
                    'font-size': '10px'
                }
            }
        });

        this.Board.text('names', {
            generator: {
                x: 20,
                y: function (d, i) {
                    return me.BlockHeight * (i * 2 + 1) / 2 + me.Top + 10;
                },
                text: function (d) {
                    return d.replace('_', '/');
                }
            },
            modify: {
                style: {
                    stroke: '#4A4A4A',
                    'font-size': '9px'
                }
            }
        });
        this.Board.text('thresholds', {
            generator: {
                x: padding - 5,
                y: function (d, i) {
                    return me.BlockHeight * (i * 2 + 1) / 2 + me.Top + 10;
                },
                text: function (d) {
                    return d > 10 ? d + 'ms' : d + '%';
                }
            },
            modify: {
                style: {
                    stroke: '#4A4A4A',
                    'font-size': '7px',
                    'text-anchor': 'end'
                }
            }
        });

        // dynamic
        var threshold0 = this.Board.Database.val('thresholds')[0];
        this.Board.rect(this.First[0] + '/' + this.First[1], {
            generator: {
                x: function (d, i) {
                    return padding + i * step;
                },
                y: 11,
                h: 6,
                w: step
            },
            modify: {
                style: {
                    fill: function (d) {
                        return d > threshold0 ? '#D93829' : '#7FEB86';
                    }
                }
            }
        });
        for (var n in this.Props) {
            var _props = this.Props[n]
            this.drawbaselines(_props);
            this.getPropNum(this.SourceData[_props], function (name) {
                me.drawlines(_props, name, n);
            });
        }
        this.Board.render();
        this.initBind();

    },
    updateline: function() {
        var me = this;
        for (var n in this.Props) {
            var _props = this.Props[n];
            var data = me.filterDataLine(this.SourceData[_props]);
            this.getPropNum(this.SourceData[_props], function (name) {
                me.Board.render(_props+'/'+name,data[name]);
            });
        }
    },
    initBind: function() {
        var me = this;
        CONFIG.bind('range', function(v){
            me.updateline();
        });
    },
    drawlines: function (p1, p2, index) {
        var me = this,
            top = +this.Top + index * this.BlockHeight  + this.BlockHeight / 8,
            bottom = +this.Top + (+index + 1) * this.BlockHeight - this.BlockHeight / 8,
            padding = CONFIG.val('padding'),
            areaLen = CONFIG.val('areaLen');
        // console.log(bottom, top);

        var ScaleY = $c.scale('scaleLinear', {
            domain: DATA.Scale[this.Id][p1],
            range: [bottom, top]
        }).Scale;
        // console.log(this.Id, p1, p2, index);
        this.Board.line(p1 + '/' + p2, {
            generator: {
                x: function(d, i) {
                    return padding + i * me.Step;
                },
                y: function(d, i) {
                    // console.log(d, ScaleY(d));
                    return ScaleY(d);
                }
            },
            modify: {
                style: {
                    stroke : COLORS[p2]
                }
            }
        });
    },
    drawbaselines: function (name) {
        if (this.Board.Database.val('thresholdsPositions/' + name)) {
            this.Board.line('thresholdsPositions/' + name, {
                generator: {
                    x: function (d) {
                        return d.x;
                    },
                    y: function (d) {
                        return d.y;
                    }
                },
                modify: {
                    style: {
                        stroke: '#4A4A4A',
                        'stroke-dasharray': "5,2"
                    }
                }
            });
        }
    }
};

window.onload = function () {
    var progress = new ProgressCanvas('progressCanvas');
    var axis = new Axis(progress);
    var boardNetworkHealth = new this.DataBoard('Network Health');
    var boardConnectionTime = new this.DataBoard('Connection Time');
    var boardSignalingAPI = new this.DataBoard('Signaling API');
    var boardStreamingQuality = new this.DataBoard('Streaming Quality');
};