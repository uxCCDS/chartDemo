var BoardConfig = {
    large: {
        attr: {
            width: '916',
            height: '400',
            viewBox: "0 0 916 400"
        },
        style: {
            'margin': '60px 0 0 24px'
        }
    },
    side: {
        attr: {
            width: '310',
            height: '230',
            viewBox: "0 0 310 230"
        }
    }
};

var colorLoading = function () {
    var colorsSet = new MomentumChart.Colors('12Colors'),
        rate = 20,
        max = 6,
        colors = colorsSet.scheme(12);
    var board = new MomentumChart.Board('#contain', BoardConfig.large, [2, 3, max, 3, 2, 3, max, 3, 2]);
    var rect = board.rect({
        generator: {
            x: function (d, i) {
                return 100 + i * 30;
            },
            y: function (d, i) {
                var _plus = d === max ? 1 : max - d;
                return 100 + _plus * rate;
            },
            w: 16,
            h: function (d, i) {
                return d * rate;
            },
            rx: 8,
            ry: 8
        },
        modify: {

        }
    });
    board.render();
    var nodes = rect.Selection.nodes(),
        arr = [],
        lColor = colors.concat(colors[0]),
        time = 50;

    for (var i = 0, l = lColor.length - 1; i < l; i++) {
        arr.push({
            dom: nodes,
            css: [{
                fill: lColor[i].toString()
            }, {
                fill: lColor[i + 1].toString()
            }],
            tween: 'rgbaLinear',
            time: time,
            delay: i * time
        });
    }

    var ash = new Ash.S(arr, 1, function () {

    });
    ash.repeat(Infinity);
};

var colorLoading2 = function () {
    var colorsSet = new MomentumChart.Colors('12Colors'),
        rate = 20,
        max = 6,
        colors = colorsSet.scheme(12);
    var board = new MomentumChart.Board('#contain', BoardConfig.large, [2, 3, max, 3, 2, 3, max, 3, 2]);
    var rect = board.rect({
        generator: {
            x: function (d, i) {
                return 100 + i * 30;
            },
            y: function (d, i) {
                var _plus = d === max ? 1 : max - d;
                return 100 + _plus * rate;
            },
            w: 16,
            h: function (d, i) {
                return d * rate;
            },
            rx: 8,
            ry: 8
        },
        modify: {
            style: {
                'transform-origin': function(d, i){
                    var x =100 + i * 30 + 8,
                        _plus = d === max ? 1 : max - d,
                        y = 100 + 1 * rate + 4 * rate;
                    return x+'px '+y+'px';
                }
            }
        }
    });
    board.render();
    var nodes = rect.Selection.nodes(),
        arr = [],
        time = 200;

    for (var j =0, lj=nodes.length;j<lj;j++) {
        arr.push({
            dom: nodes[j],
            css: [{
                transform: 'scale(1, 1)'
            }, {
                transform: 'scale(0.8, 0.3)'
            }],
            tween:'easeIn',
            time: 20,
            delay: j * 5
        });
        arr.push({
            dom: nodes[j],
            css: [{
                transform: 'scale(0.8, 0.3)'
            }, {
                transform: 'scale(1, 1)'
            }],
            time: 30,
            tween:'easeOut',
            delay: j * 5 + 10
        });
    }

    var ash = new Ash.S(arr, 1, function () {

    });
    ash.repeat(Infinity);
};

window.onload = function () {
    colorLoading();
    colorLoading2();
};