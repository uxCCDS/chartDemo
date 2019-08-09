(function () {
    let COLORS = new MomentumChart.Colors('ColorWheel').scheme(10),
        STEP;

    var core = {
        toArray: function (obj) {
            return Array.prototype.slice.call(obj);
        },
        toArrayName: function (obj) {
            var arr = [];
            for(var n in obj){
                arr.push({
                    name: n,
                    value: obj[n]
                });
            }
            return arr;
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        template: function (str, obj) {
            var reg;
            for (var n in obj) {
                reg = new RegExp('\\$' + n + '\\$', 'g');
                str = str.replace(reg, obj[n]);
            }
            return str;
        },
        extendArray: function (arr, fn, caller) {
            const _returns = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                if (core.isArray(arr[i])) {
                    _returns.push(fn.apply(caller, arr[i]));
                } else {
                    _returns.push(fn.call(caller, arr[i]));
                }
            }
            return _returns;
        },
        max: function (arr) {
            var r = - Infinity;
            for (var n in arr) {
                r = arr[n] > r ? arr[n] : r;
            }
            return r;
        }
    }

    var Card = function (template, dom) {
        this.Dom = dom;
        this.template = template;
    };
    Card.prototype = {
        html: function (data) {
            return core.template(this.template, data);
        },
        htmls: function (data) {
            this.Dom.innerHTML = core.extendArray(data, this.html, this).join('');
        }
    };

    var CacheDom = function () {
        this.Current;
        this.Cache = {};
    };
    CacheDom.prototype = {
        add: function (key, board) {
            if (this.Cache[key] === undefined) {
                this.Cache[key] = board;
            }
            return this.Cache[key];
        },
        has: function (key) {
            return !!this.Cache[key];
        },
        on: function (key) {
            if (key !== this.Current) {
                this.Current && this.hide(this.Cache[this.Current]);
                this.Current = key;
                this.show(this.Cache[key]);
            }
            return this.Cache[key];
        },
        hide: function (board) {
            board.Svg._groups[0][0].style.display = 'none';
        },
        show: function (board) {
            board.Svg._groups[0][0].style.display = 'block';
        }
    };

    var BoardCtrl = function (id, config, keys, key) {
        this.ConId = id;
        this.BoardConfig = config;
        this.Range = RAWDATA.templateRange;
        this.Keys = keys || [''];
        this.CurrentKey1 = '';
        this.CurrentKey2 = key || keys[0];
        this.Cache = new CacheDom();
        this._AfterCreateFuncs = [];
    };
    BoardCtrl.prototype = {
        switch: function (key1, data, key2) {
            this.Data = data;
            if (key2) {
                this.CurrentKey2 = key2;
            }
            if (key1) {
                this.CurrentKey1 = key1;
            }
            var key = this.CurrentKey1 + this.CurrentKey2;
            if (!this.Cache.has(key)) {
                var bd = this.Cache.add(key, new MomentumChart.Board(this.ConId, this.BoardConfig, data));
                this.fireCreate(bd);
                bd.render();
            }
            this.Cache.on(key);
        },
        getRate: function () {
            if (this.CurrentKey1 === 'month') {
                return 31;
            }
            if (this.CurrentKey1 === 'week') {
                return 7
            }
            return 1;
        },
        createScale: function () {
            var scaleX = new MomentumChart.Scale('scaleLinear', {
                range: [70, 870],
                domain: [0, this.Data.length + 2]
            }).Scale;

            var scaleY = new MomentumChart.Scale('scaleLinear', {
                range: [320, 20],
                domain: [0, core.max(this.Range[this.CurrentKey2]) * this.getRate()]
            }).Scale;

            return {
                scaleX: scaleX,
                scaleY: scaleY,
                data: this.Data
            }
        },
        afterCreate: function (call) {
            this._AfterCreateFuncs.push(call);
        },
        fireCreate: function (board) {
            var config = this.createScale();
            for (var n in this._AfterCreateFuncs) {
                this._AfterCreateFuncs[n](board, config, this.CurrentKey2);
            }
        },
        generateData: function () {
            return {
                data: this.Range[this.CurrentKey2]
            }
        }
    };

    var DataCenter = function (key) {
        this.Template = RAWDATA.template;
        this.Hash = RAWDATA.hash;
        this.CurrentKey = key || 'day';
        this.HashData = RAWDATA;
        this._cache = {};
        this._cacheSum = {}
    };
    DataCenter.prototype = {
        add: function (boardctrl) {
            this._cache[boardctrl.ConId] = boardctrl;
        },
        addSum: function (boardctrl) {
            this._cacheSum[boardctrl.ConId] = boardctrl;
        },
        switch: function (id, key, key2) {
            if (key) {
                this.CurrentKey = key;
            } else {
                key = this.CurrentKey;
            }
            this._cache[id].switch(key, this.HashData[key], key2);
        },
        switchSum: function(id, key, key2){
            if (key) {
                this.CurrentKey = key;
            } else {
                key = this.CurrentKey;
            }
            this._cacheSum[id].switch(key, this.HashData[key+'Sum'], key2);
        },
        switchAll: function (key, data) {
            if (key) {
                this.CurrentKey = key;
            } else {
                key = this.CurrentKey;
            }
            for (var id in this._cache) {
                this._cache[id].switch(key, data || this.HashData[key]);
            }
            for (var id in this._cacheSum) {
                this._cacheSum[id].switch(key, data || this.HashData[key+'Sum']);
            }
        }
    };

    var generatorAxis = function (board, config) {
        var data = config.data,
            targs = [],
            len = data.length,
            step = len > 20 ? 2 : 1,
            y0 = config.scaleY.range()[0],
            y1 = config.scaleY.range()[1],
            x0 = config.scaleX.range()[0],
            x1 = config.scaleX.range()[1];
        STEP = step;
        for (var i = 1; i < len; i += step) {
            targs.push(i);
        }
        board.axis('axisBottom', {
            generator: {
                scale: config.scaleX,
                tickValues: targs,
                tickPadding: 10,
                tickSize: 0,
                y: y0,
                tickFormat: function (d) {
                    return data[d].tickeName;
                }
            },
            modify: {
                classed: {
                    'canvasAxis': true
                },
                attr: {
                    'md-static': true
                }
            }
        });
        board.axis('axisLeft', {
            generator: {
                scale: config.scaleY,
                ticks: 8,
                tickPadding: 10,
                tickSize: 0,
                x: x0,
                tickFormat: function () {
                    var v = arguments[0],
                        h = config.scaleY(v);
                    if (v !== config.scaleY.domain()[0]) {
                        var line = new MomentumChart.Line([{ x: x0, y: h }, { x: x1, y: h }], {
                            generator: {
                                x: function (d) {
                                    return d.x;
                                },
                                y: function (d) {
                                    return d.y;
                                }
                            },
                            modify: {
                                classed: {
                                    'canvasAxisIndex': true
                                },
                                attr: {
                                    'md-static': true
                                }
                            }
                        });
                        line.attach(board.Svg);
                        line.render();
                    }
                    return d3.format(",.0f").apply(d3, arguments);
                }
            },
            modify: {
                classed: {
                    'canvasAxis': true
                },
                attr: {
                    'md-static': true
                }
            }
        });
    };

    var generatorLine = function (board, config, key2) {
        var nodes = RAWDATA.templateRange[key2],
            index = 0,
            y0 = config.scaleY.range()[0],
            y1 = config.scaleY.range()[1],
            x0 = config.scaleX.range()[0],
            x1 = config.scaleX.range()[1],
            countLen = 0;
        for (var name in nodes) {
            (function (name, color, index) {
                var style = {
                    stroke: color,
                    'stroke-width': 2
                };
                board.line({
                    generator: {
                        x: function (d, i) {
                            return config.scaleX(i + 1);
                        },
                        y: function (d) {
                            return config.scaleY(d[key2][name]);
                        }
                    },
                    modify: {
                        style: style
                    }
                });

                var title = new MomentumChart.Line([{
                    x: x0 + countLen,
                    y: y0 + 40
                }, {
                    x: x0 + countLen + 14,
                    y: y0 + 40
                }], {
                        generator: {
                            x: function (d) {
                                return d.x;
                            },
                            y: function (d) {
                                return d.y;
                            }
                        },
                        modify: {
                            style: style,
                            attr: {
                                'md-static': true
                            }
                        }
                    });
                title.attach(board.Svg);
                title.render();

                var text = new MomentumChart.Text([{
                    x: x0 + countLen + 25,
                    y: y0 + 44
                }], {
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
                            },
                            attr: {
                                'md-static': true
                            }
                        }
                    });
                text.attach(board.Svg);
                text.render();

            })(name, COLORS[index].toString(), index);
            countLen += name.length * 8;
            index++;
        }
    }

    var generatorRect = function (board, config, key2) {
        var nodes = RAWDATA.templateRange[key2],
            index = 0,
            y0 = config.scaleY.range()[0],
            y1 = config.scaleY.range()[1],
            x0 = config.scaleX.range()[0],
            x1 = config.scaleX.range()[1],
            countLen = 0;
        for (var name in nodes) {
            (function (name, color, index) {
                var style = {
                    fill: color
                },
                    attr = {
                        rx: 4,
                        ry: 4
                    };
                board.rect({
                    generator: {
                        x: function (d, i) {
                            return config.scaleX(i + 1) - 12 + index * 10;
                        },
                        y: function (d) {
                            return config.scaleY(d[key2][name]);
                        },
                        h: function (d, i) {
                            return i % STEP === 0 ? y0 - config.scaleY(d[key2][name]) : 0;
                        },
                        w: 8
                    },
                    modify: {
                        style: style,
                        attr: attr
                    }
                });

                var title = new MomentumChart.Rect([{
                    x: x0 + countLen + 50 * index,
                    y: y0 + 40
                }], {
                        generator: {
                            x: function (d) {
                                return d.x;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            w: 24,
                            h: 12
                        },
                        modify: {
                            style: style,
                            attr: {
                                'md-static': true,
                                rx: 6,
                                ry: 6
                            }
                        }
                    });
                title.attach(board.Svg);
                title.render();

                var text = new MomentumChart.Text([{
                    x: x0 + countLen + 32 + 50 * index,
                    y: y0 + 50
                }], {
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
                            },
                            attr: {
                                'md-static': true
                            }
                        }
                    });
                text.attach(board.Svg);
                text.render();

            })(name, COLORS[index].toString(), index);
            countLen += name.length * 6;
            index++;
        }
    }

    var GeneratePie = function(board, config, key2) {
        var x0 = 310/2,
            y0 = 230/2;
        var xarc = board.arc(key2, {
            generator: {
                x: x0,
				y: y0,
    			innerRadius: 34,
                outerRadius: 44,
                padAngle: Math.PI/360*5,
                padRadius: 34
            },
            pie: {
                value: function(d){
                    return d.value;
                },
                sortValues: function(d1, d2) {
                return d1.value - d2.value;
                }
            },
            modify: {
              style: {
                fill: function(d, i){                    
                    return COLORS[i];
                }
              }
            }
        });
    };

    var bindDom = function (DC) {
        var K1keys = ['day', 'week', 'month'];
        var subs = document.getElementById('subTabs').getElementsByTagName('A'),
            subsCurrent = 0;
        for (var i = 0, l = subs.length; i < l; i++) {
            (function (i) {
                subs[i].addEventListener('click', function () {
                    if (i !== subsCurrent) {
                        DC.switchAll(K1keys[i]);
                        subs[subsCurrent].className = '';
                        subs[i].className = 'current';
                        subsCurrent = i;
                    }
                });
            })(i);
        }
    };

    bindSelector = function (id, hashID, bd, dc) {
        var sel = document.getElementById(id);
        sel.addEventListener('change', function () {
            dc.switch(hashID, undefined, bd.Keys[sel.value]);
        });
    };

    window.onload = function () {
        var card = new Card(document.getElementById('template_card').value, document.getElementById('card_container_display'));
        card.htmls([{
            title: 'Total Meetings',
            sum: '13K',
            arrow: 'up',
            increase: 10,
            percentage: 10
        }, {
            title: 'Total Meeting Minutes',
            sum: '109K',
            arrow: 'up',
            increase: 10,
            percentage: 10
        }, {
            title: 'Active Hosts',
            sum: '8.9K',
            arrow: 'up',
            increase: 13,
            percentage: 10
        }, {
            title: 'Active Participants',
            sum: '1.5K',
            arrow: 'down',
            increase: 3,
            percentage: 10
        }, {
            title: 'International Meetings',
            sum: '2.6K',
            arrow: 'up',
            increase: 7,
            percentage: 10
        }, {
            title: 'Service Up Time %',
            sum: '92.5%',
            arrow: 'down',
            increase: 10,
            percentage: 10
        }]);

        var DC = new DataCenter();
        var bConfig = {
            attr: {
                width: '916',
                height: '400',
                viewBox: "0 0 916 400"
            },
            style: {
                'margin': '60px 0 0 24px'
            }
        },
        pConfig = {
            attr: {
                width: '310',
                height: '230',
                viewBox: "0 0 310 230"
            }
        };
        // bar
        var b1 = new BoardCtrl('#board_bar1', bConfig, ['meetings', 'minutes'], 'meetings');
        b1.afterCreate(generatorAxis);
        b1.afterCreate(generatorLine);
        DC.add(b1);
        var b2 = new BoardCtrl('#board_bar2', bConfig, ['role', 'join', 'videoUsage'], 'role');
        b2.afterCreate(generatorAxis);
        b2.afterCreate(generatorRect);
        DC.add(b2);
        // pie
        var pie1 = new BoardCtrl('#board_pie1', pConfig, ['activity'], 'activity');
        var pie2 = new BoardCtrl('#board_pie2', pConfig, ['location'], 'location');
        var pie3 = new BoardCtrl('#board_pie3', pConfig, ['join'], 'join');
        var pie4 = new BoardCtrl('#board_pie4', pConfig, ['role'], 'role');
        pie1.afterCreate(GeneratePie);
        DC.addSum(pie1);
        pie2.afterCreate(GeneratePie);
        DC.addSum(pie2);
        pie3.afterCreate(GeneratePie);
        DC.addSum(pie3);
        pie4.afterCreate(GeneratePie);
        DC.addSum(pie4);
        DC.switchAll();
        bindDom(DC);
        bindSelector('bar1Select', '#board_bar1', b1, DC);
        bindSelector('bar2Select', '#board_bar2', b2, DC);
    };
})();