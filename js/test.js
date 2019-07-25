(function(){

	var BOARD;

	var boardConfig1 = {
		attr: {
			width: '1000',
			height: '250',
			viewBox: "0 0 1000 250"
		}
	};

	var boardConfig2 = {
		attr: {
			width: '300',
			height: '140',
			viewBox: "0 0 300 140"
		}
	};

	var Hub = new function() {
		var item = [];
		this.add = function(a){item.push(a)};
		this.render = function(d){
			for(var n in item){
				item[n].render(d);
			}
		};
		this.transition = function(c,d){
			for(var n in item){
				item[n].transition(c,d);
			}
		};
	};

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

	var scaleX = new MomentumChart.Scale('scaleLinear', {
    	range: [38, 1000],
    	domain: [0, 50]
  	}).Scale;

  	var scaleY = new MomentumChart.Scale('scaleLinear', {
    	range: [190, 10],
    	domain: [0, 1500]
  	}).Scale;

  	var scaleY2 = new MomentumChart.Scale('scaleLinear', {
    	range: [190, 10],
    	domain: [0, 110]
  	}).Scale;

  	var sx = function(d){ return d.x};
  	var sy = function(d){ return d.y};

  	var generatorAxis = function(id, config, yAxisGenerator){
  		var staticBoard = new MomentumChart.Board(id, boardConfig1);
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
			generator: yAxisGenerator,
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
		var txts=[],
			colors=[];
		for(var name in config){
			txts.push(name);
			colors.push(config[name]);
		}
		staticBoard.add('text', txts, {
			generator: {
		      x: function(d, i) {
		        return 38+15+11+i*107;
		      },
		      y: function(d) {
		        return 240;
		      },
		      text: function(d) {
		        return d;
		      }
		    },
		    modify: {
		      style: {
		      	'font-size': 12,
		      	'color': '#666666'
		      }
		    }
		});

		staticBoard.add('line', [{
			x: 38,
			y: 235
		},{
			x: 53,
			y: 235
		}], {
			generator: {
				x: sx,
				y: sy
			},
			modify: {
				attr: {
					'stroke-linecap': 'round',
					'stroke': colors[0],
					'stroke-width': 3
				}
			}
		});

		staticBoard.add('line', [{
			x: 145,
			y: 235
		},{
			x: 160,
			y: 235
		}], {
			generator: {
				x: sx,
				y: sy
			},
			modify: {
				attr: {
					'stroke-linecap': 'round',
					'stroke': colors[1],
					'stroke-width': 3
				}
			}
		});
		staticBoard.render();

	}
	var l1 = function(){

		generatorAxis('#conl1', {
			'All Meetings':'#4FC125',
			'Video Meetings': '#F5A623'
		}, {
			scale: scaleY,
			ticks: 7,
			tickPadding: 10,
			tickSize: 0,
			x: 38
		});


		var board = new MomentumChart.Board('#conl1', boardConfig1);

		board.add('line', Jabber.data , {
			generator: {
				y: function(d){
					return scaleY(d.way.all);
				},
				x: function(d, i){
					return scaleX(i*3+1);
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
					return scaleY(d.way.video);
				},
				x: function(d, i){
					return scaleX(i*3+1);
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
		Hub.add(board);
	};

	var l2 = function(){
		generatorAxis('#conl2', {
			'Host':'#00A3B5',
			'Participant': '#62D189'
		}, {
			scale: scaleY2,
			ticks: 6,
			tickPadding: 10,
			tickSize: 0,
			x: 38
		});

		var board = new MomentumChart.Board('#conl2', boardConfig1);

		board.add('rect', Jabber.data , {
			generator: {
				y: function(d){
					return scaleY2(d.role.host);
				},
				x: function(d, i){
					return scaleX(i*3+1) - 6 - 1;
				},
				w: 6,
				h: function(d){
					return 190 - scaleY2(d.role.host) + 3;
				}
			},
			modify: {
				attr: {
					fill: '#00A3B5',
					rx: 3,
					ry: 3
				}
			}
		});
		board.add('rect', Jabber.data , {
			generator: {
				y: function(d){
					return scaleY2(d.role.attendee);
				},
				x: function(d, i){
					return scaleX(i*3+1) + 1;
				},
				w: 6,
				h: function(d){
					return 190 - scaleY2(d.role.attendee) + 3;
				}
			},
			modify: {
				attr: {
					fill: '#62D189',
					rx: 3,
					ry: 3
				}
			}
		});
		board.render();
		Hub.add(board);
	};

	var createTitle = function(conId, id){
		var board = new MomentumChart.Board(conId, boardConfig2);
			board.add('text', [id] , {
				generator: {
					x: 130,
					y: 58,
					text: function(d) {
						return 'by '+ d;
					}
				},
				modify: {
					style: {
						'font-size': '9px',
						'color': '#4A4A4A'
					}
				}
			});
			board.add('text', [id] , {
				generator: {
					x: 130,
					y: 41,
					text: 'Usage'
				},
				modify: {
					style: {
						'font-size': '11px',
						'color': '#000000'
					}
				}
			});
			board.render();
	};

	//150- 55  95 205
	var createTxtConfig = function(leftTxts, yTop){
		var o,arr = [];
		for(var n in leftTxts){
			o = leftTxts[n];
			if(o.l){
				arr.push({
					x: 95 - o.d - o.w,
					y: o.y - yTop,
					y2: o.y - yTop + 11,
					width: o.w + 'px',
					tl: o.tl || 'left'
				});
			}else{
				arr.push({
					x: 205 + o.d,
					y: o.y - yTop,
					y2: o.y - yTop + 11,
					width: o.w + 'px',
					tl: o.tl || 'left'
				});
			}

		}
		return arr;
	};

	var createBoardTxt = function(board, data, textSettings, ifReverse) {

		board.add('text', data , {
			generator: {
				x: function(d,i){
					return textSettings[i].x;
				},
				y: function(d, i) {
					return textSettings[i].y;
				},
				text: function(d) {
					return ifReverse ? d.value + ' %' : d.name; 
				}
			},
			modify: {
				style: {
					color: '#9B9B9B',
					'font-size': '8px',
					width: function(d, i){
						return textSettings[i].width;
					},
					'text-align': function(d, i){
						return textSettings[i].tl;
					}
				}
			}
		});
		board.add('text', data , {
			generator: {
				x: function(d,i){
					return textSettings[i].x;
				},
				y: function(d, i) {
					return textSettings[i].y2;
				},
				text: function(d) {
					return ifReverse ? d.name : d.value + ' %'; 
				}
			},
			modify: {
				style: {
					color: '#9B9B9B',
					'font-size': '8px',
					width: function(d, i){
						return textSettings[i].width;
					},
					'text-align': function(d, i){
						return textSettings[i].tl;
					}
				}
			}
		});
	};

	var BOARDr1,BOARDr2,BOARDr3,BOARDr4;

	var r1 = function(){
		createTitle('#conr1','Product');
		var board1 = new MomentumChart.Board('#conr1', boardConfig2);
		var textSettings = createTxtConfig([
			{ l:true, d:12, w:67, y:303 },
			{ d:12, w:51, y:309 },
			{ d:18, w:55, y:381 },
			{ d:-20, w:56, y:414 }
			], 298);
		createBoardTxt(board1, Jabber.usage.Product, textSettings);
		var colors = ['#059FD8','#C4EAF7','#B3FF7B','#25C44F'];
		board1.add('arc', Jabber.usage.Product, {
			generator: {
				x: 150,
				y: 55,
    			innerRadius: 40,
    			outerRadius: 55,
			},
		    pie: {
		      value: function (d) {
		        return d.value;
		      },
		      sort: function (d1, d2) {
		        return d1.idx - d2.idx;
		      },
		      startAngle: Math.PI,
		      endAngle: 3 * Math.PI
		    },
		    modify: {
		      attr: {
		        fill: function(d,i){
		        	return colors[i];
		        }
		      },
		    }
		});
		board1.render();
		BOARDr1 = board1;
	};

	var r2 = function(){
		createTitle('#conr2','Activity');
		var board2 = new MomentumChart.Board('#conr2', boardConfig2);
		var textSettings = createTxtConfig([
			{ l:true, d:9, w:42, y:473 },
			{ d:21, w:42, y:537 },
			{ d:2, w:22, y:497 },
			], 454);
		createBoardTxt(board2, Jabber.usage.Activity, textSettings);
		var colors = ['#7ED321','#4A90E2','#07C1E4'];
		board2.add('arc', Jabber.usage.Activity, {
			generator: {
				x: 150,
				y: 55,
    			innerRadius: function(d, i){
    				return 55 - d.index * 10;
    			},
    			outerRadius: function(d, i){
    				return 45 - d.index * 10;
    			},
    			startAngle: function(d) {
    				return 3/4*Math.PI;
    			},
    			endAngle: function(d) {
    				return 3/4*Math.PI + d.endAngle- d.startAngle;
    			}
			},
		    pie: {
		      value: function (d) {
		        return d.value;
		      },
		      sort: function (d1, d2) {
		        return d1.idx - d2.idx;
		      },
		      startAngle: 0.75*Math.PI,
		      endAngle: 2.75 * Math.PI
		    },
		    modify: {
		      attr: {
		        fill: function(d,i){
		        	return colors[i];
		        }
		      },
		    }
		});
		board2.render();
		BOARDr2 = board2;	
	};

	var r3 = function(){
		createTitle('#conr3','Group');
		var board3 = new MomentumChart.Board('#conr3', boardConfig2);
		var textSettings = createTxtConfig([
			{ d:12, w:24, y:703 },
			{ l:true, d:22, w:36, y:647 },
			{ l:true, d:2, w:48, y:611 }
			], 611);
		createBoardTxt(board3, Jabber.usage.Group, textSettings);
		var colors = ['#00D6A2','#FFD87B','#C9E9D0'];
		board3.add('arc', Jabber.usage.Group, {
			generator: {
				x: 150,
				y: 55,
    			innerRadius: 40,
    			outerRadius: 55,
			},
		    pie: {
		      value: function (d) {
		        return d.value;
		      },
		      sort: function (d1, d2) {
		        return d1.idx - d2.idx;
		      }
		    },
		    modify: {
		      attr: {
		        fill: function(d,i){
		        	return colors[i];
		        }
		      },
		    }
		});
		board3.render();
		BOARDr3 = board3;
	};

	var r4 = function(){
		createTitle('#conr4','Location');
		var board4 = new MomentumChart.Board('#conr4', boardConfig2);
		var textSettings = createTxtConfig([
			{ d:19, w:18, y:772 },
			{ d:-2, w:18, y:854 },
			{ l:true, d:7, w:35, y:854 },
			{ l:true, d:7, w:17, y:769 }
			], 757);
		createBoardTxt(board4, Jabber.usage.Location, textSettings);
		var colors = ['#07C1E4','#7ED321','#FFD87B', '#F2A62C'];
		board4.add('arc', Jabber.usage.Location, {
			generator: {
				x: 150,
				y: 55,
    			innerRadius: 40,
    			outerRadius: 55,
			},
		    pie: {
		      value: function (d) {
		        return d.value;
		      },
		      sort: function (d1, d2) {
		        return d1.idx - d2.idx;
		      }
		    },
		    modify: {
		      attr: {
		        fill: function(d,i){
		        	return colors[i];
		        }
		      },
		    }
		});
		board4.render();
		BOARDr4 = board4;
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
				var _data,
					_usage;
				if(val == 'Meetings'){
					_data = Jabber.data;
					_usage = Jabber.usage;
				}else{
					_data = Webex.data;
					_usage = Webex.usage;
				}
				now = val;
				var ts = {
				    delay: 0,
				    duration: 600,
				    ease: d3.easeCubicOut
				 };
				Hub.transition(ts, _data);
				//BOARDr1.render(ts, _usage.Product);
				//BOARDr2.render(ts, _usage.Activity);
				//BOARDr3.render(ts, _usage.Group);
				//BOARDr4.render(ts, _usage.Location);
			}
		});
	};
})();