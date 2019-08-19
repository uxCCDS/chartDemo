var Database = MomentumChart.Database;
var $d = RAWDATA;
var $s = $d.selection;
var _generateInit = function (s) {
    var d = {};
    for (var p in s) {
        d[p] = s[p][0];
    }
    return d;
};
var $c = new Database(_generateInit($s));

var core = {
    toArray: function (obj) {
        return Array.prototype.slice.call(obj);
    },
    toArrayName: function (obj) {
        var arr = [];
        for (var n in obj) {
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
// selection board1 board2
var BdSwitch = function (boards, selection, selectID) {
    this.SelectID = selectID;
    this.Current;
    this.Selection = selection;
    this.Boards = {};
    for (var i in boards) {
        this.Boards[$s[selection][i]] = boards[i];
    }
    this.init();
    this.bind();
}
BdSwitch.prototype = {
    init: function () {
        var me = this;
        $c.bind(this.Selection, function (data) {
            me.on(data.Data);
        });
    },
    bind: function () {
        var me = this,
            sel = document.getElementById(this.SelectID);
        sel.addEventListener('change', function () {
            $c.val(me.Selection, $s[me.Selection][sel.value]);
        });
    },
    on: function (key) {
        this.Boards[key].create();
        this.hideCurrent();
        this.show(key);
    },
    show: function (key) {
        this.Boards[key].show($d[$c.val('dataUnit')].data);
        this.Current = key;
    },
    hideCurrent: function () {
        if (this.Current) {
            this.Boards[this.Current].hide();
        }
    }
};

// 
var BD = function (id, config, selection, key2, ifTranstion) {
    this.Id = id;
    this.Config = config;
    this.Selection = selection;
    this.isCreated = false;
    this.ifRender = false;
    this.Key2 = typeof key2 === 'string' ? key2 : 'data';
    this.IfTranstion = /\#$/.test(location.href);
    this.AxisConfig = new AxisConfig(selection, 70, 320, 800, 300, 50);
    this._loads = [];
    this.Pformat2 = d3.format(".2~f");
    this.PreLoadShapes = [];
    this.PreLoadData;
    this.PreLoadName;
    this.DelayItems = {
        fill:[],
        stroke:[]
    }
};
BD.prototype = {
    getData: function () {
        return $d[$c.val('dataUnit')][this.Key2];
    },
    getPreloadData: function () {
        return $d[$c.val('dataUnit')].preload;
    },
    getPreloadDataSum: function () {
        return $d[$c.val('dataUnit')].preloadSum;
    },
    percentage: function (i, p) {
        var data = $d[$c.val('dataUnit')][this.Key2][this.Selection],
            sum = 0;
        for (var n in data) {
            sum += data[n][p];
        }

        return (this.Pformat2(data[i][p] / sum) * 100 >> 0) + '%';
    },
    onload: function (func) {
        this._loads.push(func);
    },
    fire: function () {
        for (var n in this._loads) {
            this._loads[n](this, this.Board);
        }
    },
    bind: function () {
        var me = this;
        $c.bind('dataUnit', function (data) {
            if (me.ifRender) {
                me.render($d[data.Data][me.Key2]);
            }
        });
    },
    hide: function () {
        this.Board.Svg.style('display', 'none');
        this.ifRender = false;
    },
    render: function (data) {
        if (this.ifRender) {
            if (this.IfTranstion) {
                this.Board.transition({
                    duration: 600,
                    ease: d3.easeCubicOut
                }, data);
            } else {
                this.Board.render(data);
            }
        }
    },
    _createDefs: function(Svg) {
        if(this.Defs === undefined){
            this.Defs = Svg.append('defs');
        }
        if(this._PreLoader ===  undefined){
            this._PreLoader = MomentumChart.Preload.prototype.Loaders.preloadGradient;
            var _id = this.Id.replace('#','');
            this._PreLoader.install(this.Defs, _id);
            this._PreLoaderId= this._PreLoader.getId(_id);
        }
    },
    preloadLine: function(data){
        this._createDefs(this.Board.Svg);
        var me = this;
        me.Board.render(this.getPreloadData());
        /*
        for(var i in this.PreLoadShapes){
            for(var j in this.PreLoadShapes[i].shapes){
                this.PreLoadShapes[i].shapes[j].Selection.style('stroke', 'url(#' + this._PreLoaderId + ')');
            }
        }
        */
        setTimeout(function(){
            me.Board.transition({
                duration: 600,
                ease: d3.easeCubicOut,
                delay: 0
            }, data);
        },0);

               
    },
    show: function (data) {
        this.Board.Svg.style('display', '');
        this.ifRender = true;
        if (this.PreLoadShapes.length > 0) {
            this.preload(data);
        }else{
           this.render(data); 
        }        
    },
    create: function () {
        if (!this.isCreated) {
            this.Board = new MomentumChart.Board(this.Id, this.Config, $d[$c.val('dataUnit')][this.Key2]);
            this.fire();
            this.bind();
            this.isCreated = true;
        }
    },
    preload: function(data){
        if(this.PreLoadName){
            this[this.PreLoadName](data);
        }else{
            this._preload(data);
        }
    },
    _loopStyle: function(obj, style, val){
        for(var i in obj){
            obj[i].Selection.style(style, val);
        }
    },
    _hideDelay: function(){
        this._loopStyle(this.DelayItems.stroke, 'stroke', 'rgba(0,0,0,0)');
        this._loopStyle(this.DelayItems.fill, 'fill', 'rgba(0,0,0,0)');
    },
    _preload: function (data) {
        this.Board.preload(this.PreLoadData || this.getPreloadData(), this.PreLoadShapes);
        this._hideDelay();
        var me = this;
        
        setTimeout(function(){
            me.cancelLoad();
        }, 2900);
    },
    cancelLoad: function(){
        this.Board.cancelPreload();
        this.render(this.getData());
    }
};

var AxisConfig = function (selection, x, y, xl, yl, xpadding) {
    this.Selection = selection;
    this.x = x;
    this.y = y;
    this.xl = xl;
    this.yl = yl;
    this.xp = xpadding;
};
AxisConfig.prototype = {
    realRangeX: function () {
        return [this.x, this.x + this.xl];
    },
    rangeX: function () {
        var rg = this.realRangeX();
        return [rg[0] + this.xp, rg[1] - this.xp];
    },
    rangeY: function () {
        return [this.y, this.y - this.yl];
    },
    getData: function () {
        return $d[$c.val('dataUnit')].data;
    },
    scaleY: function (key) {
        var key1 = $c.val('dataUnit'),
            key3 = key || this.Selection;
        return new MomentumChart.Scale('scaleLinear', {
            range: this.rangeY(),
            domain: [0, core.max($d.templateRange[key3]) * $d[key1].unit]
        }).Scale;
    },
    scaleX: function (d) {
        // var data = this.data();
        var l = this.getData().length;
        return new MomentumChart.Scale('scaleLinear', {
            range: this.rangeX(),
            domain: [0, l]
        }).Scale;
    },
    gx: function (d) {
        var me = this,
            data;
        if (!d || typeof d.dataConvert === 'function') {
            data = this.getData();
        } else if (d.hasOwnProperty('Data') && d.hasOwnProperty('Args')) {
            data = d.Data;
        } else {
            data = d;
        }

        var targs = [],
            len = data.length,
            step = len > 20 ? 2 : 1;
        for (var i in data) {
            if (i % step === 0) {
                targs.push(i);
            }
        }
        return {
            generator: {
                range: me.realRangeX(),
                scale: me.scaleX(),
                tickValues: targs,
                tickPadding: 10,
                tickSize: 0,
                y: me.y,
                tickFormat: function (d) {
                    return data[d].tickeName;
                }
            },
            dataConvert: function (data) {
                var rt;
                if (typeof data.dataConvert !== 'function') {
                    rt = me.gx(data);
                } else {
                    rt = data;
                }
                return rt;
            }
        }
    },
    gy: function () {
        var me = this;
        return {
            generator: {
                scale: me.scaleY(),
                ticks: 8,
                tickPadding: 10,
                tickSize: -me.xl,
                x: me.x,
                tickFormat: d3.format(",.0f")
            },
            dataConvert: function (data) {
                if (typeof data.dataConvert !== 'function') {
                    return me.gy(data);
                }
                return data;
            }
        }
    }
};

//---------------

var bindTab = function () {
    var subs = document.getElementById('subTabs').getElementsByTagName('A'),
        subsCurrent = $s.dataUnit.indexOf($c.val('dataUnit'));
    for (var i = 0, l = subs.length; i < l; i++) {
        (function (i) {
            subs[i].addEventListener('click', function () {
                if (i !== subsCurrent) {
                    $c.val('dataUnit', $s.dataUnit[i]);
                    subs[subsCurrent].className = '';
                    subs[i].className = 'current';
                    subsCurrent = i;
                }
            });
        })(i);
    }
};

var Table = function (id, template, data) {
    this.Dom = document.getElementById(id);
    this.T = template;
    this.init(data);
};
Table.prototype = {
    init: function (data) {
        var arr = [];
        arr.push('<li class="thead">');
        arr.push(this.replace(data[0]));
        arr.push('</li">');
        for (var i = 1, l = data.length; i < l; i++) {
            arr.push('<li>');
            arr.push(this.replace(data[i]));
            arr.push('</li">');
        }
        this.Dom.innerHTML = arr.join('');
    },
    replace: function (datum) {
        return core.template(this.T, datum);
    }
};

window.$Render = {
    bindTab: bindTab,
    BdSwitch: BdSwitch,
    BD: BD,
    core: core,
    Card: Card,
    Table: Table
};

