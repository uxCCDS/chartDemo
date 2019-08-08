(function () {

    var core = {
        toArray: function (obj) {
          return Array.prototype.slice.call(obj);
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
        max: function(arr){
            var r = - Infinity;
            for(var n in arr) {
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

    var CacheDom = function(){
        this.Current;
        this.Cache = {};
    };
    CacheDom.prototype = {
        add: function(key, board){
            if(this.Cache[key] === undefined){
                this.Cache[key] = board; 
            }
            return this.Cache[key];
        },
        has: function(key){
            return !!this.Cache[key];
        },
        on:function(key){
            if(key !== this.Current){
                this.Current && this.hide(this.Cache[this.Current]);
                this.Current = key;
                this.show(this.Cache[key]);
            }
            return this.Cache[key];
        },
        hide: function(board){
            board.Svg._groups[0][0].style.display = 'none';
        },
        show: function(board){
            board.Svg._groups[0][0].style.display = 'block';
        }
    };

    var BoardCtrl = function(id, config, keys, key){
        this.ConId = id;
        this.BoardConfig = config;
        this.Range = RAWDATA.templateRange;
        this.Keys = keys || [''];
        this.CurrentKey1 = '';
        this.CurrentKey = key || keys[0];
        this.Cache = new CacheDom();
        this._AfterCreateFuncs = [];
    };
    BoardCtrl.prototype = {
        switch: function(key1, data, key2){
            this.Data = data;
            if(key2){
                this.CurrentKey = key2;
            }
            if(key1){
                this.CurrentKey1 = key1;
            }
            var key = this.CurrentKey1 + this.CurrentKey;
            if(!this.Cache.has(key)){
                var bd =this.Cache.add(key, new MomentumChart.Board(this.ConId, this.BoardConfig, data));
                this.fireCreate(bd);
                bd.render();
            }
            this.Cache.on(key);
        },
        afterCreate: function(call) {
            this._AfterCreateFuncs.push(call);
        },
        fireCreate: function(board) {
            for(var n in this._AfterCreateFuncs) {
                this._AfterCreateFuncs[n](board);
            }
        },
        generateData: function() {
            return {
                data
            }
        }
    };

    var DataCenter = function(key){
        this.Template = RAWDATA.template;
        this.Hash = RAWDATA.hash;
        this.CurrentKey = key || 'day';
        this.HashData = {
            day: RAWDATA.data,
            week: RAWDATA.week,
            month: RAWDATA.month
        };
        this._cache = {};
    };
    DataCenter.prototype = {
        add: function(id, boardctrl) {
            this._cache[id] = boardctrl;
        },
        switch: function(id, key, key2) {
            if(key){
                this.CurrentKey = key;
            }
            this._cache[id].switch(key,this.HashData[key], key2);
        },
        switchAll: function(key){
            if(key){
                this.CurrentKey = key;
            }else{
                key = this.CurrentKey;
            }
            for(var id in this._cache) {
                this._cache[id].switch(key, this.HashData[key]);
            }
        }
    };

    window.onload = function () {
        var card = new Card(document.getElementById('template_card').value, document.getElementById('card_container_display'));
        card.htmls([{
            title: 'Total Meetings',
            sum: '13K',
            arrow: 'up',
            increase: 10,
            percentage: 10
        },{
            title: 'Total Meeting Minutes',
            sum: '109K',
            arrow: 'up',
            increase: 10,
            percentage: 10
        },{
            title: 'Active Hosts',
            sum: '8.9K',
            arrow: 'up',
            increase: 13,
            percentage: 10
        },{
            title: 'Active Participants',
            sum: '1.5K',
            arrow: 'down',
            increase: 3,
            percentage: 10
        },{
            title: 'International Meetings',
            sum: '2.6K',
            arrow: 'up',
            increase: 7,
            percentage: 10
        },{
            title: 'Service Up Time %',
            sum: '92.5%',
            arrow: 'down',
            increase: 10,
            percentage: 10
        }]);

        var DC = new DataCenter();
        var b1 = new BoardCtrl('#board_bar1', {
            attr: {
              width: '900',
              height: '400',
              viewBox: "0 0 900 400"
            },
            style: {
              'background-color': '#f2f4f5',
              'margin': '60px 0 0 24px'
            }
          } , ['meetings', 'minutes'], 'meetings');
        b1.afterCreate(function(board){
            
        });
        DC.add('#board_bar1', b1);
        DC.switchAll();
    };
})();