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
                    'demokratie': false,
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
        if (switches.natur   && d['natur'] > 0.037    || // 80 percentile
            switches.arbeit  && d['arbeit'] > 0.076   ||
            switches.digital && d['digital'] > 0.027 ||
            switches.demokratie && d['demokratie'] > 0.068 ||
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


// top candidates
var topCandidates = [ 'angela-merkel', 'martin-schulz-1', 'christian-lindner', 'cem-ozdemir', 'alexander-gauland', 'joachim-herrmann' ];


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
      .defer(d3.csv, "./candidates-topics-custom-cloud.csv")
      .await(ready);

}

// TODO resize on window change

function ready(error, data) {
    if (error) throw error;

    var margin = 20

    xScale.domain([d3.min(data, xValue)-margin, d3.max(data, xValue)+margin]);
    yScale.domain([d3.min(data, yValue)-margin, d3.max(data, yValue)+margin]);


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

    // url for top candidates is different
    var url = topCandidates.includes(d.label) ? "https://wahl2017.withgoogle.com/top-10-candidates" : "https://www.abgeordnetenwatch.de/profile/" + d.label;

    var topWords = [];
    for (var i=0; i<20; i++) {
        topWords.push(d['top_word_'+i]);
    }
    

    var text = '<div>' + d.name + "<br/>" + d.party + "<br/><a href='" + url + "'>Text</a></div>"

    text += '<br>' + topWords.join(', ');

    detailsContainer.node().innerHTML = '';
    detailsContainer.node().insertAdjacentHTML('afterbegin', text)
    
}


initTopics();
