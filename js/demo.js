var AshHelper = function () {
    this.Current = 0;
    this.LastTime = 0;
};
AshHelper.prototype = {
    add: function (time) {
        this.LastTime = time;
        this.Current += time;
        return this.Current;
    },
    now:function () {
        return this.Current;
    },
    pre: function() {
        return this.LastTime;
    }
};

var POS = {
    center: function(w,h) {
        w = w || 0;
        h = h || 0;
        return {
            x: (this.width-w)/2,
            y: (this.height-h)/2
        }
    },
    width: 1200,
    height: 600,
    rangeX:[200,1000],
    rangeY:[500,100]
};
var SCALE = {
    yd:$c.scale('scaleLinear', {
        domain: [1000,3600],
        range: [500,100]
    }).Scale,
    yb:$c.scale('scaleLinear', {
        domain: [40,200,1000,2000],
        range: [500,280,220,100]
    }).Scale,
    x:$c.scale('scaleLinear', {
        domain: [0,8],
        range: [200,1000]
    }).Scale,
    x0:$c.scale('scaleLinear', {
        domain: [0,8],
        range: [600,600]
    }).Scale,
    y0:$c.scale('scaleLinear', {
        domain: [1000,3600],
        range: [500,500]
    }).Scale
};
$c.Scale.smooth(SCALE.yd, SCALE.yb);
$c.Scale.smooth(SCALE.y0, SCALE.yb);

var DATA = {
    d1: [1000,1200,1400,1100,1000,1500,2000,3000,2800],
    d2: [1400,1600,1800,1000,2000,2500,3000,3200,3000],
    b1: [40,60,180,100,1000,1500,2000,2200,1400],
    b2: [40,60,180,100,1000,1200,1500,2000,1300],
    range: {
        d:[1000,3600],
        b:[40,200,1000,2000]
    },
    tick: {
        d: $c.Scale.breakTicks(SCALE.yb),
        b: $c.Scale.ticks(SCALE.yd)
    }
};



var COLORS = ['rgb(112,143,255)','rgb(239,76,76)','rgb(130,24,237)','rgb(20,178,168)'];
var TIME = new AshHelper();
var SCRIPT = [];
var CONFIG_BOARD = {
    attr: {
        width: POS.width,
        height: POS.height,
        viewBox: "0 0 " + POS.width + ' ' + POS.height
    }
};

var BOARDS = new function () {
    var _boards = {},
        me = this;
    this.add = function (key, board) {
        _boards[key] = board;
    };
    this.get = function (key) {
        return _boards[key];
    };
    this.svg = function (key) {
        return _boards[key].Svg.node();
    };
    this.show = function(key) {
        this.svg(key).style.display = 'block';
    };
    this.fadeIn = function(key,delay,callback){
        var node = this.svg(key);
        Ash.play([{
            dom: node,
            css: [{opacity:0,display:'block'},{opacity:1}],
            time: 20,
            delay: delay || 0
        }],1,function(){
            callback && callback();
        });
    };
    this.fadeOut = function(key,delay,callback){
        var node = this.svg(key);
        Ash.play([{
            dom: node,
            css: [{opacity:1},{opacity:0,display:'none'}],
            time: 20,
            delay: delay || 0
        }],1,function(){
            callback && callback();
        });
    };
};

var _loading = function () {
    var board = $c.board('#app', CONFIG_BOARD, {
        title: ['Momentum Charts']
    });
    BOARDS.add('_loading', board);
    board.text('title', {
        generator: {
            x: 600,
            y: 300,
            text: function (d) { return d; }
        },
        modify: {
            style: {
                stroke: '#565A5C',
                'font-size': '80px',
                'text-anchor': 'middle'
            }
        }
    });
    board.render();
    board.preload();
};

var _arc = function(timeline) {
    var _data0 = [{v:0,y:0}],
    _data1 = [{v:10,y:0},{v:5,y:1},{v:4,y:2},{v:3,y:3}],
    _data2 = [{v:5,y:0},{v:6,y:1},{v:6,y:2},{v:10,y:3}],
    _data3 = [{v:0,y:0},{v:0,y:0},{v:0,y:0},{v:0,y:0}];
    var board = $c.board('#app', CONFIG_BOARD, _data0),
        center = POS.center();
    BOARDS.add('_arc', board);
    var arc = board.arc('', {
        modify: {
            style: {
                fill: function(d, i) {
                    return COLORS[i];
                }
            }
        },
        generator: {
            outerRadius: 200,
            innerRadius: 0,
            x: center.x,
            y: center.y
        },
        pie: {
            value: (d) => {
                return d.v;
            },
            sortValues:(d1, d2) => {
                return d1.y - d2.y;
            }
        }
    });
    board.render();
    timeline.add(function(){
        BOARDS.fadeIn('_arc');
        var transition = arc.transition({ duration: 1000 }, _data1);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
    timeline.add(function(){
        var transition = arc.transition({ duration: 1000 }, _data2);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    }); 
    timeline.add(function(){
        BOARDS.fadeOut('_arc',30);
        var transition = arc.transition({ duration: 1000 }, _data3);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });

};

var _pie = function(timeline) {
    var _data0 = [{v:0,y:0}],
    _data00 = [{v:0,y:0},{v:0,y:1},{v:0,y:2},{v:0,y:3}],
    _data1 = [{v:10,y:0},{v:5,y:1},{v:4,y:2},{v:3,y:3}],
    _data2 = [{v:25,y:0},{v:6,y:1},{v:6,y:2},{v:10,y:3}],
    _data3 = [{v:0,y:0},{v:0,y:0},{v:0,y:0},{v:0,y:0}];
    var board = $c.board('#app', CONFIG_BOARD, _data00),
        center = POS.center();
    BOARDS.add('_pie', board);
    var arc = board.arc('', {
        modify: {
            style: {
                fill: function(d, i) {
                    return COLORS[i];
                }
            }
        },
        generator: {
            outerRadius: function(d) {
                return 160 - d.index * 20;
            },
            innerRadius: function(d) {
                return 160 - d.index * 20 -16;
            },
            startAngle: 0,
            endAngle: function(d) {
                return d.endAngle - d.startAngle;
            },
            x: center.x-250,
            y: center.y
        },
        pie: {
            value: (d) => {
                return d.v;
            },
            sortValues:(d1, d2) => {
                return d1.y - d2.y;
            }
        }
    });
    var arc2 = board.arc('', {
        modify: {
            style: {
                fill: function(d, i) {
                    return COLORS[i];
                }
            }
        },
        generator: {
            outerRadius: 160,
            innerRadius: 120,
            x: center.x+250,
            y: center.y
        },
        pie: {
            value: (d) => {
                return d.v;
            },
            sortValues:(d1, d2) => {
                return d1.y - d2.y;
            }
        }
    });
    board.render();
    timeline.add(function(){
        BOARDS.fadeIn('_pie');
        arc2.transition({ duration: 1000 }, _data1);
        var transition = arc.transition({ duration: 1000 }, _data1);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
    timeline.add(function(){
        arc2.transition({ duration: 1000 }, _data2);
        var transition = arc.transition({ duration: 1000 }, _data2);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    }); 
    timeline.add(function(){
        BOARDS.fadeOut('_pie',40);
        arc2.transition({ duration: 1000 }, _data3);
        var transition = arc.transition({ duration: 1000 }, _data3);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
};
var _axisTodo = {

};
var _axis = function(timeline) {
    var board = $c.board('#app', CONFIG_BOARD);
    BOARDS.add('_axis', board);
    var axisX = board.axis('x', {
        generator: {
          scale: SCALE.x0,
          y: POS.rangeY[0],
          tickSize: 0
        }
      }, 'x');
    axisX.IsStatic = false;
    var axisY;
    board.render();
    timeline.add(function(){
        BOARDS.fadeIn('_axis');
        var transition = axisX.transition({ duration: 1000 }, {
            generator: {
                scale: SCALE.x,
                y: POS.rangeY[0]
            }
        }).range;
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
    timeline.add(function(){
        axisY = board.axis('y', {
            generator: {
              scale: SCALE.y0,
              x: POS.rangeX[0],
              tickValues: DATA.tick.d,
              tickSize: 0
            }
        }, 'y');
        axisY.IsStatic = false;
        var transition = axisY.transition({ duration: 1000 }, {
            generator: {
                scale: SCALE.yd
            }
        }).range;
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
};
 
var _line = function(timeline) {
    var board = $c.board('#app', CONFIG_BOARD);
    BOARDS.add('_line', board, DATA.d1);
    var line1 = board.line('', {
        generator: {
            x: function(d,i) {
                return SCALE.x(i);
            },
            y: function(d) {
                return SCALE.yd(d);
            }
        },
        modify: {
            style: {
                stroke: COLORS[0]
            }            
        }
    });
    line1.render(DATA.d1);
    timeline.add(function(){
        BOARDS.show('_line');
        Ash.play([{
            dom: line1.Selection.node(),
            css:[{
                'stroke-dasharray':'1200px 1200px',
                'stroke-dashoffset':'1200px'
            },{
                'stroke-dasharray':'1200px 1200px',
                'stroke-dashoffset':'0px'
            }],
            time:160
        }],1,function(){
            timeline.next();
        });
    });
    timeline.add(function(){
        var transition = line1.transition({ duration: 1000 }, DATA.d2);
        transition.on('end', function(d,i){
            if(i===0){
                timeline.next();
            }
        });
    });
    timeline.add(function(){
        BOARDS.fadeOut('_line',100);
        Ash.play([{
            dom: line1.Selection.node(),
            css:[{
                'stroke-dashoffset':'0px'
            },{
                'stroke-dashoffset':'-1200px'
            }],
            time:120
        }],1,function(){
            timeline.next();
        });
    });
};

var Timeline = function () {
    this.CanStart = true;
    this.Canplay = false;
    this.Stacks = [];
};
Timeline.prototype = {
    init: function () {
        var me = this;
        this.Con = document.getElementById('app');
        this.BODY = document.getElementsByTagName('BODY')[0];
        _loading();
        _arc(this);
        _pie(this);
        _axis(this);
        _line(this);
        this.show();
        this.BODY.addEventListener('click', function(){
            me.start();
        });
    },
    show: function () {
        BOARDS.show('_loading');
    },
    start: function () {
        var me = this;
        if (this.CanStart) {
            Ash.play([{
                dom: BOARDS.svg('_loading'),
                css: [{
                    opacity: 1
                },{
                    opacity: 0
                }],
                time: TIME.add(20)
            }],1,function(){
                me.Canplay = true;
                me.next();
            });
            this.CanStart = false;
        }
    },
    add: function(func) {
        this.Stacks.push(func);
    },
    next: function() {
        if(this.Stacks.length>0){
            this.Stacks.shift()();
        }
    }
};
var TIMELINE = new Timeline();

window.onload = function () {
    TIMELINE.init();
};