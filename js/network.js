var DATA = new FakeData(7, 14, 8, 14);
var AREALEN = 1285;

var PBar = function (id, dataUrl, root) {
    this.Body = document.getElementsByTagName('BODY')[0];
    this.Root = root;
    this.Database = root.Database;
    this.DataUrl = dataUrl;
    this.IsStart = dataUrl === 'x1';
    this.Dom = document.getElementById(id);
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
    },
    f: function (t) {
        return t > 10 ? t : '0' + t;
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
        this.DayLen = AREALEN / DATA.Calender.DayList.length >> 0;
        this.LastDayIndex = DATA.Calender.DayList.length - 1;
        this.HourLen = this.DayLen / 24;
        this.MinuteLen = this.HourLen / 60;
        this.Controls = new ControlArea('timeContorlArea', this);
        this.Controls.init(this.day2X(this.LastDayIndex - 4), this.day2X(this.LastDayIndex - 3));
        this.draw();
        this.X1Min = this.day2X(0);
        this.X1Max = this.date2X(this.LastDayIndex-1, 23, 59);
        this.X2Min = this.day2X(1);
        this.X2Max = this.date2X(this.LastDayIndex, 23, 59);
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
                return DATA.zoomRandom(data, AREALEN, 5, [245, 255]);
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

window.onload = function () {
    var Progress = new ProgressCanvas('progressCanvas');
};