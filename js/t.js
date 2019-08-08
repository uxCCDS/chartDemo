

var gBoard = function(num, colorPersets, root){
	var p = document.createElement('p');
		p.innerHTML = colorPersets + ' with ' + num + ' colors';
	root.append(p);
	return new MomentumChart.Board('#app', {
	    attr: {
	      width: '1000',
	      height: '100',
	      viewBox: "0 0 1000 100"
	    },
	    style: {
	      'background-color': '#f2f4f5',
	      'margin': '7px 0 14px 0'
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
var regHsl = /Hsl$/;
var displayColor = function(num, colorPersets, root) {
	var colorsSet = new MomentumChart.Colors(colorPersets),
		colors = colorsSet.scheme(num),
		data = gData(num),
		board = gBoard(num, colorPersets, root),
		step = (1000 - 20) / num >> 0;
	if (regHsl.test(colorPersets)) {
		root.append(document.createElement('HR'));
	}
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
		  	w: 12
		},
		modify: {
			attr: {
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
  var root = document.getElementById('app');
  var presets = MomentumChart.Colors.allPersets();
  for (var name in presets) {
    displayColor(40, name, root);
  }
};