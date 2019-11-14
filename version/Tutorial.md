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

The following code shows the usage in Node

```
import { Board } from '@momentum-ui/charts';

cosnt board = new Board('#Id', {
    attr: {
      width: '600',
      height: '400',
      viewBox: "0 0 600 400"
    }
 }, [15,28,52,63,40]);

board.line({
    generator: {
        x: function(d, i) {
            return 50 + i * 100;
        },
        y: function(d) {
            return 300-d*3;
        }
    },
    modify: {
        attr: {
            stroke: '#0090C4',
            'stroke-width': 2
        }
    }
});

board.render();

```

[Try it by yourself](https://codepen.io/arthusliang/pen/NWWLBrx)

![Get Start](https://codepen.io/arthusliang/pen/NWWLBrx/image/small.png)

# Foundation

## Modify

Modify object is used to set the properties of SVG node in Momentum Charts. You can pass set the following properties. Their properties should accept both value and function.

+ style
+ attr
+ classed
+ property
+ text
+ html

In Board, Modify is passed as the second argument.

```
var ifShowClass = true;
var board = MomentumCharts.board('#app', {
  attr: {
    width: '600',
    height: '400',
    viewBox: "0 0 600 400"
  },
  style: {
    'box-shadow':'0 1px 2px 0 rgba(0,0,0,0.2),0 2px 4px 0 rgba(0,0,0,0.2)',
    'margin-top':'10px'
  },
  classed: {
    'my-class': function() {
      return ifShowClass;
    }
  }
});
board.render();
```

[Try it by yourself](https://codepen.io/arthusliang/pen/RwwYBYw)



In Shapes, Modify is passed as a property of the config. In SVG, the style will overwrite the attr.

[Try is by yourself](https://codepen.io/arthusliang/pen/yLLxqGp)


```
var board = MomentumCharts.board('#app', {
  attr: {
    width: '1000',
    height: '400',
    viewBox: "0 0 1000 400"
  },
  style: {
    'box-shadow':'0 1px 2px 0 rgba(0,0,0,0.2),0 2px 4px 0 rgba(0,0,0,0.2)',
    'margin-top':'10px'
  }
}, [15,28,52,63,40]);

board.line({
  generator: {
    x: function(d, i) {
      return 50 + i * 150;
    },
    y: function(d) {
      return 300-d*3;
    }
  },
   modify: {
    attr: {
      stroke: 'red',
      'stroke-width': 2
    },
    style: {
      stroke: '#0090C4',
    }
  }
});

board.render();
```

## Generator

Generator is used to define how to map the data to the shape's properies. The Generator is passed as a property of the config in Shape. The properties should accept both value and function. Different shape acceopt different properties.

[Try is by yourself](https://codepen.io/arthusliang/pen/RwwYBzW)


```
var board = MomentumCharts.board('#app', {
    attr: {
      width: '1000',
      height: '400',
      viewBox: "0 0 1000 400"
    }
 }, [10,20,30,40,50,60,40,50,60,40,50,60]);

board.line({
    generator: {
        x: function(d, i) {
            return 10 + i * 50;
        },
        y: function(d) {
            return 300-d;
        }
    },
    modify: {
      attr: {
        stroke: 'red',
        'stroke-width': 2
      }
    }
});

board.render();
```

## databind

## event

## template

## color system

## scale

# Professional

## break

## responsive

## preload

## create your own shape

## create your own template

## contributing
