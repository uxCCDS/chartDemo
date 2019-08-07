

var gBoard = function(){
	return new MomentumChart.Board('#app', {
	    attr: {
	      width: '1000',
	      height: '100',
	      viewBox: "0 0 1000 100"
	    },
	    style: {
	      'background-color': '#f2f4f5',
	      'margin-top': '10px'
	    }
	});
};

var gData = function(l) {
	var a=[];
	for(var i=0;i<l;i++){
		a.push(360);
	}
	return a;
};

var displayColor = function(num, colorPersets) {
	var p = document.createElement('p');
	p.innerHTML = colorPersets + ' with ' + num + ' colors';
	document.getElementById('app').append(p);

	var colorsSet = new MomentumChart.Colors(colorPersets),
		colors = colorsSet.scheme(num),
		data = gData(num),
		board = gBoard(),
		step = (1000 - 20) / num >> 0;
	board.data(data);
	board.rect({
		generator: {
		  	x: function (d, i) {
		    	return 10 + step * i;
		  	},
		  	y: function (d) {
		    	return 100 - d;
		  	},
		  	h: function (d) {
		    	return d;
		  	},
		  	w: 16
		},
		modify: {
			attr: {
				rx: 2,
				ry: 2
			},
		  	style: {
		    	fill: function (d, i) {
		      	return colors[i].toString();
		    },
		    'stroke-width': 3
		  }
		}
	});
	board.render();
};

window.onload = function(argument) {
	displayColor(10, 'ColorWheel');
	displayColor(20, 'ColorWheel');
	displayColor(30, 'ColorWheel');
	displayColor(40, 'ColorWheel');
	displayColor(40, '12Colors');
	displayColor(40, '10Colors');
	displayColor(40, '8Colors');
	displayColor(40, '3Colors');
	displayColor(40, 'jmt');
	displayColor(40, 'quality');
	displayColor(40, 'AudioSourcesColors');
};