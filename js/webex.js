var BdSwitch = $Render.BdSwitch,
    BD = $Render.BD,
    Card = $Render.Card;
let COLORS = new MomentumChart.Colors('ColorWheel').scheme(10);
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

var gAxis = function (bd, board) {
    var confX = bd.AxisConfig.gx(),
        confY = bd.AxisConfig.gy();
    //confX.dataConvert = bc.AxisConfig.gx;
    //confY.dataConvert = bc.AxisConfig.gy;
    // 800 * 300 
    var bd = board.axis('x', confX, '');
    bd.IsStatic = false;
    board.axis('y', confY, '').IsStatic = false;
};
var gLine = function (bc, board) {
    bc.PreLoadName = 'preloadLine';
    var key3 = bc.Selection,
        nodes = RAWDATA.templateRange[key3],
        x0 = bc.AxisConfig.rangeX()[0],
        y0 = bc.AxisConfig.rangeY()[0],
        index = 0,
        countLen = 0;
    for (var name in nodes) {
        (function (name, color, countLen) {
            var style = {
                stroke: color,
                'stroke-width': 2
            };
            var lineMain = board.line({
                generator: {
                    x: function (d, i) {
                        // console.log('****', bc.AxisConfig.scaleX()(i) >> 0, bc.AxisConfig.scaleY()(d[key3][name]) >> 0);
                        return bc.AxisConfig.scaleX()(i) >> 0;
                    },
                    y: function (d) {
                        // console.log('---', d[key3][name], bc.AxisConfig.scaleY()(d[key3][name]));
                        return bc.AxisConfig.scaleY()(d[key3][name]) >> 0;
                    }
                },
                modify: {
                    style: style
                }
            });

            var lineTitle = board.line({
                dataConvert: function (data) {
                    return [{
                        x: x0 + countLen,
                        y: y0 + 40
                    }, {
                        x: x0 + countLen + 14,
                        y: y0 + 40
                    }];
                },
                generator: {
                    x: function (d, i) {
                        return d.x;
                    },
                    y: function (d, i) {
                        return d.y;
                    }
                },
                modify: {
                    style: style
                }
            });

            var _spl = {};
            _spl[lineMain.Guid] = lineMain;
            _spl[lineTitle.Guid] = lineTitle;

            bc.PreLoadShapes.push({
                shapes: _spl,
                loader: 'preloadGradient'
            });

            board.text({
                dataConvert: function (data) {
                    return [{
                        x: x0 + countLen + 25,
                        y: y0 + 44
                    }];
                },
                generator: {
                    x: function (d) {
                        return d.x;
                    },
                    y: function (d) {
                        return d.y;
                    },
                    text: name
                },
                modify: {
                    style: {
                        'font-size': '12px',
                        'fill': '#666666'
                    }
                }
            });

        })(name, COLORS[index].toString(), countLen);
        countLen += name.length * 8;
        index++;

    }
};

var gRect = function (bc, board, cStart) {
    var key3 = bc.Selection,
        nodes = RAWDATA.templateRange[key3],
        x0 = bc.AxisConfig.rangeX()[0],
        y0 = bc.AxisConfig.rangeY()[0],
        index = 0,
        countLen = 0;

    for (var name in nodes) {
        (function (name, color, countLen, index) {
            var style = {
                fill: color
            };
            var radius = [4, 4, 0, 0];
            var rectMain = board.rect({
                generator: {
                    x: function (d, i) {
                        // console.log('****', bc.AxisConfig.scaleX()(i) >> 0, bc.AxisConfig.scaleY()(d[key3][name]) >> 0);
                        return bc.AxisConfig.scaleX()(i) - 12 + index * 10;
                    },
                    y: function (d) {
                        // console.log('---', d[key3][name], bc.AxisConfig.scaleY()(d[key3][name]));
                        return bc.AxisConfig.scaleY()(d[key3][name]);
                    },
                    h: function (d, i) {
                        let step = $c.val('dataUnit') === 'day' ? 2 : 1;
                        return i % step === 0 ? y0 - bc.AxisConfig.scaleY()(d[key3][name]) : 0;
                    },
                    w: 8,
                    rx: radius,
                    ry: radius
                },
                modify: {
                    style: style
                }
            });

            var rectTitle = board.rect({
                dataConvert: function (data) {
                    return [{
                        x: x0 + countLen + 50 * index,
                        y: y0 + 40
                    }];
                },
                generator: {
                    x: function (d, i) {
                        return d.x;
                    },
                    y: function (d, i) {
                        return d.y;
                    },
                    w: 24,
                    h: 12,
                    rx: 6,
                    ry: 6
                },
                modify: {
                    style: style
                }
            });

            var _spl = {};
            _spl[rectMain.Guid] = rectMain;
            _spl[rectTitle.Guid] = rectTitle;

            bc.PreLoadShapes.push({
                shapes: _spl,
                loader: 'preloadGradient'
            });

            board.text({
                dataConvert: function (data) {
                    return [{
                        x: x0 + countLen + 32 + 50 * index,
                        y: y0 + 50
                    }];
                },
                generator: {
                    x: function (d) {
                        return d.x;
                    },
                    y: function (d) {
                        return d.y;
                    },
                    text: name
                },
                modify: {
                    style: {
                        'font-size': '12px',
                        'fill': '#666666'
                    }
                }
            });

        })(name, COLORS[cStart+index].toString(), countLen, index);
        countLen += name.length * 6;
        index++;

    }
};

var publicSort = function (d1, d2) {
    if (typeof d1 === 'number') {
        return d2 - d1;
    } else {
        return d2.value - d1.value;
    }
};

var gArc2 = function (bc, board, cStart) {
    var config = bc.Config.attr,
        w = + config.width,
        h = + config.height,
        x0 = w / 2,
        y0 = h / 2,
        R = 43,
        RLen = 8,
        RStep = RLen + 2;
    cStart = cStart || 0;
    var arc = board.arc(bc.Selection, {
        generator: {
            x: x0,
            y: y0,
            padAngle: Math.PI / 360 * 5,
            padRadius: 34,
            innerRadius: function (d, i) {
                var index = typeof i === 'number' ? i : d.index;
                return R - RLen - index * RStep;
            },
            outerRadius: function (d, i) {
                var index = typeof i === 'number' ? i : d.index;
                return R - index * RStep;
            },
            startAngle: function (d) {
                return 0;
            },
            endAngle: function (d) {
                return d.endAngle - d.startAngle;
            }

        },
        pie: {
            value: function (d) {
                return d.value;
            },
            endAngle: Math.PI * 3/2,
            sortValues: publicSort
        },
        modify: {
            style: {
                fill: function (d, i) {
                    return COLORS[cStart + i];
                }
            }
        }
    });

    var _forceRange = function (val, min, max, padding) {
        var min = min + padding,
            max = max - padding;
        if (val < min) {
            return val;
        }
        if (val > max) {
            return max;
        }
        return val;
    };

    var title = board.text(bc.Selection, {
        dataConvert: function () {
            return [bc.Selection];
        },
        generator: {
            x: 16,
            y: 24,
            text: function (d) {
                return d;
            }
        },
        modify: {
            style: {
                'font-size': '14px',
                'fill': '#171B1F'
            }
        }
    });

    var text = board.text(bc.Selection, {
        generator: {
            x: x0 - 10,
            y: function (d, i) {
                return y0 - R + i * RStep + 8;
            },
            text: function (d, i) {
                return d.name + ' ' + bc.percentage(i, 'value');
            }
        },
        modify: {
            style: {
                'font-size': '10px',
                'fill': '#666666',
                'text-anchor': 'end'
            }
        }
    });

    var rect = board.rect(bc.Selection, {
        generator: {
            x: x0 - 8,
            y: function (d, i) {
                return y0 - R + i * RStep + 4;
            },
            w: 4,
            h: 1
        },
        modify: {
            style: {
                'fill': '#666666'
            }
        }
    });

    var _spl = {};
    _spl[arc.Guid] = arc;

    bc.PreLoadShapes.push({
        shapes: _spl,
        loader: 'preloadGradient'
    });
    bc.PreLoadData = bc.getPreloadDataSum();
    bc.DelayItems.fill.push(text);
    bc.DelayItems.fill.push(rect);
}

var gArc = function (bc, board, cStart) {
    var config = bc.Config.attr,
        w = + config.width,
        h = + config.height,
        x0 = w / 2,
        y0 = h / 2;
    cStart = cStart || 0;
    var arc = board.arc(bc.Selection, {
        generator: {
            x: x0,
            y: y0,
            innerRadius: 35,
            outerRadius: 43,
            padAngle: Math.PI / 360 * 5,
            padRadius: 34
        },
        pie: {
            value: function (d) {
                return d.value;
            },
            sortValues: publicSort
        },
        modify: {
            style: {
                fill: function (d, i) {
                    return COLORS[cStart + i];
                }
            }
        }
    });

    var _forceRange = function (val, min, max, padding) {
        var min = min + padding,
            max = max - padding;
        if (val < min) {
            return val;
        }
        if (val > max) {
            return max;
        }
        return val;
    };

    var distince = 12;
    var getLineX = function (i, plus, padding, len) {
        var pos = arc.centroidRelative(i, { r: distince });
        return pos.x > pos.x0 ?
            pos.x + plus - padding - len :
            pos.x - plus + padding;
    }, getX = function (i, plus) {
        var pos = arc.centroidRelative(i, { r: distince }),
            rPlus = pos.x > pos.x0 ? 1 : -1;
        return _forceRange(pos.x + (plus || 0) * rPlus, 0, w, 10);
    }, getY = function (i, plus) {
        var pos = arc.centroidRelative(i, { r: distince });
        return _forceRange(pos.y + (plus || 0), 0, h, 10);
    }, getTextAligan = function (i) {
        var pos = arc.centroidRelative(i, { r: distince });
        //text-anchor
        return pos.x > pos.x0 ? 'start' : 'end';
    };

    var title = board.text(bc.Selection, {
        dataConvert: function () {
            return [bc.Selection];
        },
        generator: {
            x: 16,
            y: 24,
            text: function (d) {
                return d;
            }
        },
        modify: {
            style: {
                'font-size': '14px',
                'fill': '#171B1F'
            }
        }
    });

    var xPlus = 10,
        yPlus = 0;

    var text = board.text(bc.Selection, {
        generator: {
            x: function (d, i) {
                return getX(i, xPlus);
            },
            y: function (d, i) {
                return getY(i,yPlus);
            },
            text: function (d) {
                return d.name;
            }
        },
        modify: {
            style: {
                'font-size': '11px',
                'fill': '#666666',
                'text-anchor': function (d, i) {
                    return getTextAligan(i);
                }
            }
        }
    });

    var text2 = board.text(bc.Selection, {
        generator: {
            x: function (d, i) {
                return getX(i, xPlus);
            },
            y: function (d, i) {
                return getY(i, yPlus + 12);
            },
            text: function (d, i) {
                return bc.percentage(i, 'value');
            }
        },
        modify: {
            style: {
                'font-size': '11px',
                'fill': '#666666',
                'text-anchor': function (d, i) {
                    return getTextAligan(i);
                }
            }
        }
    });

    var rect = board.rect(bc.Selection, {
        generator: {
            x: function (d, i) {
                return getLineX(i, xPlus, 4, 6);
            },
            y: function (d, i) {
                return getY(i, yPlus - 4);
            },
            w: 6,
            h: 1
        },
        modify: {
            style: {
                'fill': '#666666'
            }
        }
    });

    var _spl = {};
    _spl[arc.Guid] = arc;

    bc.PreLoadShapes.push({
        shapes: _spl,
        loader: 'preloadGradient'
    });
    bc.PreLoadData = bc.getPreloadDataSum();
    bc.DelayItems.fill.push(text);
    bc.DelayItems.fill.push(text2);
    bc.DelayItems.fill.push(rect);
};

var newBoard1 = function (boardID, boardConfig, selections, selectID) {
    var keys = $s[selections],
        arr = [],
        b;
    for (var i in keys) {
        b = new BD(boardID, boardConfig, keys[i]);
        b.onload(gAxis);
        b.onload(gLine);
        arr.push(b);
    }
    s1 = new BdSwitch(arr, selections, selectID);
    s1.on(keys[0]);
};

var newBoard2 = function (boardID, boardConfig, selections, selectID) {
    var keys = $s[selections],
        arr = [],
        b;
    for (var i in keys) {
        b = new BD(boardID, boardConfig, keys[i]);
        b.onload(gAxis);
        b.onload(gRect, 5);
        arr.push(b);
    }
    s1 = new BdSwitch(arr, selections, selectID);
    s1.on(keys[0]);
};

var newPies = function (id, selection) {
    newPie('#board_pie1', 'Join Method', 0);
    newPie('#board_pie2', 'Usage by location', 3);
    newPie('#board_pie3', 'Usage by activity', 7);
};

var newPie = function (id, selection, cStart) {
    var b = new BD(id, BoardConfig.side, selection, 'sum');
    b.onload(gArc, cStart);
    b.create();
    b.show($d[$c.val('dataUnit')].sum);
};

var newArc = function () {
    var b = new BD('#board_pie4', BoardConfig.side, 'Role', 'sum');
    b.onload(gArc2);
    b.create();
    b.show($d[$c.val('dataUnit')].sum);
};

var gTable = function () {
    var _t = document.getElementById('tableline').value;
    for (var i in RAWDATA.DTABLE) {
        new $Render.Table('table' + i, _t, RAWDATA.DTABLE[i]);
    }
};

window.onload = function () {
    var card = new Card(document.getElementById('template_card').value, document.getElementById('card_container_display'));
    card.htmls(RAWDATA.card);
    newBoard1('#board_bar1', BoardConfig.large, 'board1', 'bar1Select');
    newBoard2('#board_bar2', BoardConfig.large, 'board2', 'bar2Select');
    newPies();
    newArc();
    $Render.bindTab();
    gTable();
};