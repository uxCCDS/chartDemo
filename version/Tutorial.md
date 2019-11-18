# Tutorial

[![CircleCI](https://img.shields.io/circleci/project/github/momentum-design/momentum-ui/master.svg)](https://circleci.com/gh/momentum-design/momentum-ui/)
[![license](https://img.shields.io/github/license/momentum-design/momentum-ui.svg?color=blueviolet)](https://github.com/momentum-design/momentum-ui/blob/master/charts/LICENSE)

> @momentum-ui/charts/


# Get start

## Install

### Npm or yarn

Install and manage the Momentum Charts using NPM. You may use yarn or npm. By default, yarn/npm installs packages to node_modules/.

```npm install @momentum-ui/charts --save```

or

```yarn add @momentum-ui/charts```

### Github

You can clone Momentum Charts from [github](https://github.com/momentum-design/momentum-ui/tree/master/charts).

After you download and go to charts folder, you can run ```yarn build``` to generate different files for usage.

```/bundles``` javascript file for script usage

```/lib``` built folder

```/es``` es6 version

```/src/lib``` source file

## Usage

### Node

Default usage

```import MomentumCharts from '@momentum-ui/charts';```

Import source file and build in your own application

```import MomentumCharts from '@momentum-ui/charts/src/lib/index';```

### Web

```
<script src='../js/d3.v5.js' type="text/javascript"></script>
<script src='../js/momentum-ui-charts-min.js' type="text/javascript"></script>
```

You can access the library via global varible 'MomentumCharts' or '$c'.

## Your first chart

At first, we are going to teach you how to draw a simple line.

#### Example

![Get Start](https://screenshot.codepen.io/3315115.NWWLBrx.small.c4b8f5b4-7061-4168-b99e-b64ab0978aa1.png)

#### Code

Momentum Charts will create a SVG node and append it to a HTML dom. In our tutorial, we create an empty Div with the id of 'app'.

```
<body>
  <div id='app'></div>
</body>
```
With the following code, Momentum Charts will creat a line chart with the data of an array [5,18,40,50,30]. 
We will discuss more details in the following part.

```
import MomentumCharts from '@momentum-ui/charts';

let board = MomentumCharts.board('#app', {
    attr: {
      width: '1200',
      height: '700',
      viewBox: "0 0 1200 700"
    }
 }, [5,18,40,50,30]);

board.line({
    generator: {
        x: function(d, i) {
            return 100 + i * 250;
        },
        y: function(d) {
            return 650-d*10;
        }
    },
    modify: {
        attr: {
            stroke: '#0090C4',
            'stroke-width': 2
        }
    }
});

```

[Try it yourself >>](https://codepen.io/arthusliang/pen/NWWLBrx)


## Board & Shape

All the charts components inhert from the class Shape. They are the subclass of Shape.js.

Check more detail in the API documents.

## Modify

Modify object is used to set the properties of SVG node in Momentum Charts. You can pass set the following properties. Their properties should accept both value and function.

+ style
+ attr
+ classed
+ property
+ text
+ html

### Modify Board

In Board, Modify is passed as the second argument. 

#### Example

This example will adjust the 'box-shadow' and 'class' of an board instance.

![Modify Board](https://screenshot.codepen.io/3315115.RwwYBYw.small.3b7d3157-59e2-4d13-9a68-d930acf2a3a6.png)

#### Code

```
var ifShowClass = true;
var board = MomentumCharts.board('#app', {
  attr: {
    width: '1200',
    height: '700',
    viewBox: "0 0 1200 700"
  },
  style: {
    'box-shadow':'0 1px 2px 0 rgba(0,0,0,0.2),0 2px 4px 0 rgba(0,0,0,0.2)',
  },
  classed: {
    'my-class': function() {
      return ifShowClass;
    }
  }
});
board.render();

```

[Try it by yourself >>](https://codepen.io/arthusliang/pen/RwwYBYw)

### Modify Shapes

In Shapes, Modify is passed as a property of the config. In SVG, the style will overwrite the attr.

#### Example

This example shows how to apply dash-array style to line chart.

![Modify Shapes](https://screenshot.codepen.io/3315115.yLLxqGp.small.d1d1e9bb-88b6-4e76-884a-75c878113c4c.png)

#### Code

```
var board = MomentumCharts.board('#app', {
  attr: {
    width: '1200',
    height: '700',
    viewBox: "0 0 1200 700"
  }
 }, [5,18,40,50,30]);

board.line({
  generator: {
    x: function(d, i) {
      return 100 + i * 250;
    },
    y: function(d) {
      return 650-d*10;
    }
  },
  modify: {
    attr: {
      stroke: '#0090C4',
      'stroke-width': 2
    },
    style: {
      'stroke-dasharray':"10 5"
    }
  }
});

board.render();
```

[Try is by yourself >>](https://codepen.io/arthusliang/pen/yLLxqGp)


## Generator

Generator is used to define how to map the data to the shape's properies. The Generator is passed as a property of the config in Shape. The properties should accept both value and function. Different shape acceopt different properties.

#### Example

The example shows how to create a bar chart based on an array.

![Generator](https://screenshot.codepen.io/3315115.RwwYBzW.small.8629c529-6374-4c91-9de2-41e48fa791e1.png)

#### Code

```
var board = MomentumCharts.board('#app', {
    attr: {
      width: '1200',
      height: '700',
      viewBox: "0 0 1200 700"
    }
 }, [15,28,30,20,30,40,48,30,50,40]);

board.rect({
    generator: {
        x: function(d, i) {
            return 100 + i * 100;
        },
        y: function(d) {
            return 650-d*10;
        },
        w: 40,
        h: function(d) {
            return d*10;
        },
        rx: [4,4,0,0],
        ry: [4,4,0,0]
    },
    modify: {
        attr: {
            fill: '#0090C4'
        }
    }
});

board.render();
```

[Try is by yourself >>](https://codepen.io/arthusliang/pen/RwwYBzW)

## Databind

Momentum Charts has its own data managerment module. Generally, you can bind data to the board instance. Then you can pass a string as dataUrl to define which data you will use.

#### example

This example show how to use different part of the data object to render different line charts.

![Databind](https://screenshot.codepen.io/3315115.vYYVZdM.small.365eb4a1-7d6c-4418-a8e1-f478a11040f1.png)

#### code

```
var rootData = {
  line: {
    l1: [10, 40, 30, 60, 50],
    l2: [20, 30, 35, 50, 40]
  },
  baseline:[30,30,30,30,30]
};

var generator = {
  x: function(d, i) {
    return 100 + i * 250;
  },
  y: function(d) {
    return 650-d*10;
  }
};

var board = MomentumCharts.board('#app', {
  attr: {
    width: '1200',
    height: '700',
    viewBox: "0 0 1200 700"
  }
}, rootData);

console.log(board.data('baseline')); // [30, 30, 30, 30, 30]
board.data('baseline',[10,10,10,10,10])
console.log(board.data('baseline')); // [10, 10, 10, 10, 10]

board.line('line/l1', {
  generator: generator,
  modify: {
    attr: {
      stroke: '#0074a3',
      'stroke-width': 2
    }
  }
});

board.line('line/l2', {
  generator: generator,
  modify: {
    attr: {
      stroke: '#ba2f00',
      'stroke-width': 2
    }
  }
});

board.line('baseline', {
  generator: generator,
  modify: {
    attr: {
      stroke: '#d2d5d6',
      'stroke-width': 2
    }
  }
});

board.render();
```

+ board.data

	You can set or get the data of the board according to the function 'data'.

+ dataUrl

	Here, we pass ```'line/l1'``` as the dataUrl of the frist line chart. This line chart will as ```data.line.l1``` as its data.
	
	If you do not pass a string as the first argument, the line chart will use the root data in the board.
	
	The empty string will define a dataUrl for the root data.

[Try is by yourself >>](https://codepen.io/arthusliang/pen/vYYVZdM)


## Events

### Event type

The followings are three important events in board.

+ data

	The data event will emit when board's data changes.

+ render

	The data event will emit when the function ```render``` of board is called.

+ transition

	The data event will emit when the function ```transition ``` of board is called.
	
### on

Bind a function which will be called when the event is emitted.


#### arugment

+ eventName

	Refer the Event type Above

+ dataUrl

	Refer to the dataUrl in Databind

+ callback

	callback function
	
```
board.on('data', '', function(data){
  console.log('the data under root changed', data);
});
```

### off

Unbind a function which will be called when the event is emitted.

#### arugment

+ eventName

	Refer the Event type Above

+ dataUrl

	Refer to the dataUrl in Databind
	
+ callback

	function or string. Momentum Charts will add a guid to the functions which have been bund.
	
```
var callback = function(data){
  console.log('the data under root changed', data);
};
board.on('data', '', callback);
board.off('data', '', callback);
```


[Try is by yourself >>](https://codepen.io/arthusliang/pen/vYYVZdM)

