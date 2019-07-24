(function(){

	var BOARD;

	var tickName = ['04/22','04/24','04/26','04/28',
	'04/30','05/02','05/04','05/06',
	'05/08','05/10','05/12','05/14',
	'05/16','05/18','05/20','05/22'];

	var dynamicBoards = [];
	var tickValues = [];
	(function(){
		for(var i=0;i<16;i++){
			tickValues.push(1+i*3);
		}
	})();

	let scaleX = new MomentumChart.Scale('scaleLinear', {
    	range: [38, 1000],
    	domain: [0, 50]
  	}).Scale;

  	let scaleY = new MomentumChart.Scale('scaleLinear', {
    	range: [190, 10],
    	domain: [0, 1500]
  	}).Scale;

  	var generatorAxis = function(id){
  		var staticBoard = new MomentumChart.Board(id, {
		    attr: {
		      width: '1000',
		      height: '250',
		      viewBox: "0 0 1000 250"
		    }
		 });
		staticBoard.axis('axisBottom', {
			generator: {
			  scale: scaleX,
			  ticks: 16,
			  y: 190,
			  tickPadding: 10,
			  tickSize: 0,
			  tickValues: tickValues,
			  tickFormat: function(d){
			  	return tickName[((d-1)/3>>0)];
			  }
			},
			modify: {
				classed: {
			    	'canvasAxis': true
			    }	
			}
		});

		staticBoard.axis('axisLeft', {
			generator: {
			  scale: scaleY,
			  ticks: 7,
			  tickPadding: 10,
			  tickSize: 0,
			  x: 38
			},
			modify: {
				classed: {
			    	'canvasAxis': true
			    }	
			}
		});
		var _config = {
			generator: {
		      x: function(d, i) {
		        return scaleX(d.x);
		      },
		      y: function(d) {
		        return scaleY(d.y);
		      }
		    },
		    modify: {
		      attr: {
		        stroke: 'rgba(216,216,216,0.5)',
		        fill: 'none'
		      }
		    }
		};
		for(var i=200;i<1401;){
			staticBoard.add('line', [{x:0, y:i},{x:50, y:i}] , _config);	
			i+= 200;
		}
		staticBoard.render();

		var board = new MomentumChart.Board(id, {
		    attr: {
		      width: '1000',
		      height: '250',
		      viewBox: "0 0 1000 250"
		    }
		 });

		board.add('line', Jabber.data , {
			generator: {
				y: function(d){
					return scaleY(d.way.all)
				},
				x: function(d, i){
					return scaleX(i*3+1)
				}
			},
			modify: {
				attr: {
					stroke: '#4FC125',
					'stroke-width': 2
				}
			}
		});
		board.add('line', Jabber.data , {
			generator: {
				y: function(d){
					return scaleY(d.way.video)
				},
				x: function(d, i){
					return scaleX(i*3+1)
				}
			},
			modify: {
				attr: {
					stroke: '#F5A623',
					'stroke-width': 2
				}
			}
		});
		board.render();
		BOARD = board;
	}
	var l1 = function(){
		generatorAxis('#conl1');
	};

	var l2 = function(){

	};

	var r1 = function(){

	};

	var r2 = function(){

	};

	var r3 = function(){

	};

	var r4 = function(){

	};



	window.onload = function(){
		l1();
		l2();
		r1();
		r2();
		r3();
		r4();

		var now = 'Meetings';
		document.getElementById('sel2').addEventListener('change',function(e){
			var val = e.target.value;
			if(now!=val){
				var _data = val == 'Meetings' ? Jabber.data : Webex.data;
				now = val;
				BOARD.transition({
				    delay: 0,
				    duration: 2000,
				    ease: d3.easeCubicOut
				  }, _data);
			}
		});
	};
})();