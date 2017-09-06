/*
 * Cloud with point for each candidate
 * layout is t-SNE (multidimensional reduction) from 8 topic NMF model
 */


var svg = d3.select("#viz-topics").append("svg"),
    detailsContainer = d3.select("#viz-topics").append("div")
       .attr("class", "detailsContainer");

// state variable
var switches = {
                    'natur': false,
                    'arbeit': false,
                    'digital': false,
                    'familie': false
                };

var colorSchema = {   'CDU': '#000000',
                       'CSU': '#000000',
                       'SPD': '#e3000f',
                       'DIE GRÜNEN': '#1aa037',
                       'AfD': '#408cea',
                       'FDP': '#f3ff00',
                       'DIE LINKE': '#BE3075'
                   };

var colorManager = function(d) {
    //console.log(switches);
    var show_all = Object.values(switches).every(function(b) { return !b });

    if (show_all) {
        return colorSchema[d['party']] || 'grey';
    }
    else {
        if (switches.natur   && d['natur'] > 0.065    || // 80 percentile
            switches.arbeit  && d['arbeit'] > 0.076   ||
            switches.digital && d['digital'] > 0.027 ||
            switches.familie && d['familie'] > 0.076  ) {
            
            return colorSchema[d['party']] || 'grey';
        }
        else {
            return '#dddddd';
        }
    }
};

// global
var pointSize;


// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);


function initTopics() {

    var container = document.getElementById("viz-topics");
    var width = container.clientWidth * .7;
    var height = Math.floor(.6 * width);
    console.log(width);
    console.log(height);
    pointSize = width / 150.;

    svg
        .attr("width", width)
        .attr("height", height);

    detailsContainer.attr("height", height);

    // setup x 
    xValue = function(d) { return +d.x;}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display

    // setup y
    yValue = function(d) { return +d.y;}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display


    d3.queue()
      .defer(d3.csv, "/candidates-topics-custom-cloud.csv")
      .await(ready);

}

// TODO resize on window change

function ready(error, data) {
    if (error) throw error;

    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // top candidates
    var topCandidates = [ 'angela-merkel', 'martin-schulz-1', 'christian-lindner', 'cem-ozdemir', 'alexander-gauland', 'joachim-herrmann' ];

    // draw dots
    svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      //.attr("r", pointSize)
      .attr("r", function(d) { return topCandidates.includes(d.label) ? pointSize*2.5 : pointSize; })
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", colorManager) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.name + "<br/>" + d.party)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("click", function(d) {
          showDetails(d);
      });

}

function updateTopics(button) {

    var topic = button.dataset['topic'];
    if (switches[topic]) {
        switches[topic] = false;
    }
    else {
    // reset
        for (var i in switches) {
            switches[i] = false;
        }
        // set
        switches[topic] = true;
    }

    console.log(switches);

    // draw dots
    svg.selectAll(".dot")
        .style("fill", colorManager);

}

function showDetails(d) {

    var text = '<div>' + d.name + "<br/>" + d.party + "<br/><a href='https://www.abgeordnetenwatch.de/profile/" + d.label + "'>Text</a></div>"
    detailsContainer.node().innerHTML = '';
    detailsContainer.node().insertAdjacentHTML('afterbegin', text)
    
}


initTopics();