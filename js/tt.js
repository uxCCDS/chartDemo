(function(){

    window.onload = function() {
        var scale = d3.scaleLinear()
        .domain([0, 1000, 9000, 10000])
        .range([380, 280, 180, 80]);

        var scale2 = d3.scaleBand()
        .domain([1,2,3])
        .range([380, 280],[280, 180],[180, 80]);
        

        var scale3 = d3.scaleOrdinal()
        .domain([0, 0],[0, 10000],[10000, 10000])
        .range([380, 380],[380, 80],[80, 80]);
        
        var axis = d3.axisLeft(scale)
        .ticks(10);
        //.tickValues([0, 1000, 9000, 10000]);
        
        d3.select("body").append("svg")
        .attr("width", 800)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(50,0)")
        .call(axis);
    };

})();