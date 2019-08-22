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
    board.axis('x', confX, '').IsStatic = false;
    board.axis('y', confY, '').IsStatic = false;
};
var gLine = function (bc, board) {
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
            board.line({
                generator: {
                    x: function (d, i) {
                        return bc.AxisConfig.scaleX()(i) >> 0;
                    },
                    y: function (d) {
                        return bc.AxisConfig.scaleY()(d[key3][name]) >> 0;
                    }
                },
                modify: {
                    style: style
                }
            });

            board.line({
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
        countLen += name.length * 12;
        index++;

    }
};

var gRect = function (bc, board) {
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
            board.rect({
                generator: {
                    x: function (d, i) {
                        return bc.AxisConfig.scaleX()(i) - 12 + index * 10;
                    },
                    y: function (d) {
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

            board.rect({
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

        })(name, COLORS[index+3].toString(), countLen, index);
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
            endAngle: Math.PI * 3/2,
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
                'fill': '#171B1F',
                'text-transform': 'capitalize'
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

    var distince = 15;
    var getLineX = function (i, plus, padding, len) {
        var pos = arc.centroidRelative(i, { r: distince });
        return pos.x > pos.x0 ?
            pos.x + plus - padding - len :
            pos.x - plus + padding;
    }, getX = function (i, plus) {
        var pos = arc.centroidRelative(i, { r: distince }),
            rPlus = pos.x > pos.x0 ? 1 : -1;
        return _forceRange(pos.x + (plus || 0) * rPlus, 0, w, 3);
    }, getY = function (i, plus) {
        var pos = arc.centroidRelative(i, { r: distince });
        return _forceRange(pos.y + (plus || 0), 0, h, 3);
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
                'fill': '#171B1F',
                'text-transform': 'capitalize'
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
                return getY(i, yPlus);
            },
            text: function (d) {
                return d.name;
            }
        },
        modify: {
            style: {
                'font-size': '12px',
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
                'font-size': '12px',
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
                return getLineX(i, xPlus, 2, 6);
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
        b.onload(gRect);
        arr.push(b);
    }
    s1 = new BdSwitch(arr, selections, selectID);
    s1.on(keys[0]);
};

var newPies = function (id, selection) {
    newPie('#board_pie1', 'Usage by activity', 0);
    newPie('#board_pie2', 'Usage by platform', 3);
    newPie('#board_pie3', 'Usage by Client version', 7);
};

var newPie = function (id, selection, cStart) {
    var b = new BD(id, BoardConfig.side, selection, 'sum');
    b.onload(gArc, cStart);
    b.create();
    b.show($d[$c.val('dataUnit')].sum);
};

var newArc = function () {
    var b = new BD('#board_pie4', BoardConfig.side, 'Active user usage', 'sum');
    b.onload(gArc2, 3);
    b.create();
    b.show($d[$c.val('dataUnit')].sum);
};

window.onload = function () {
    var card = new Card(document.getElementById('template_card').value, document.getElementById('card_container_display'));
    card.htmls(RAWDATA.card);
    newBoard1('#board_bar1', BoardConfig.large, 'board1', 'bar1Select');
    newBoard2('#board_bar2', BoardConfig.large, 'board2', 'bar2Select');
    newPies();
    newArc();
    $Render.bindTab();
};