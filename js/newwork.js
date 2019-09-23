var DATA = new FakeData(7, 14, 8, 14);

var ProgressCanvas = function (id) {
    this.Id = id;
    this.Database = $c.database({
        x1: 0,
        x2: 0
    });
    this.init();
};

var AREALEN = 1285;

ProgressCanvas.prototype = {
    init: function () {
        this.draw();
    },
    draw: function () {
        var list = this.everyList(DATA.Calender.DayList, 3),
            textStep = AREALEN / DATA.Calender.DayList.length >> 0;
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
            _threshold2 = 250;
        this.Board.rect('data', {
            dataConvert: function (data) {
                return DATA.zoomRandom(data, AREALEN, 5,[245,255]);
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
                        if (d > _threshold2) {
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