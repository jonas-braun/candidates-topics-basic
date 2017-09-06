/*
 * Candidate list per topic
 * ranks are from NMF model
 */

var parent = d3.select("#viz-one-topic");
var containers = [];
var topicNames = [ "arbeit", "natur", "digital", "familie" ];
for (topic of topicNames) {
    var container = d3.select("#viz-one-topic").append("div")
             .attr("class", "wordContainer")
             .attr("data-topic", topic);
    container.node().insertAdjacentHTML('afterbegin', "<div>"+topic+"</div>")
    containers.push(container);
}

// state variable
var partySwitches = {
                    'cdu': false,
                    'spd': false,
                    'linke': false,
                    'gruene': false,
                    'fdp': false,
                    'afd': false
                };


// setup fill color
var cValue = function(d) { return d.score; },
    color1 = d3.scaleLinear()
    .domain([0, 0.8])
    .range(['white', 'green']),
    color2 = d3.scaleLinear()
    .domain([0, 0.8])
    .range(['white', 'red']),
    colorBW = d3.scaleLinear()
    .domain([0.0, 0.3])
    .range(['white', 'black']);

var partyKeywords = {   'CDU': 'cdu',
                       'CSU': 'cdu',
                       'SPD': 'spd',
                       'DIE GRÜNEN': 'gruene',
                       'AfD': 'afd',
                       'FDP': 'fdp',
                       'DIE LINKE': 'linke'
                   };


var colorSchema = {   'CDU': '#000000',
                       'CSU': '#000000',
                       'SPD': '#e3000f',
                       'DIE GRÜNEN': '#1aa037',
                       'AfD': '#408cea',
                       'FDP': '#f3ff00',
                       'DIE LINKE': '#BE3075'
                   };

var colorManagerParty = function(d) { 
    //console.log(switches);
    var show_none = Object.values(partySwitches).every(function(b) { return !b });

    if (show_none) {
        return 'white';
    }
    else {
       if (partySwitches[partyKeywords[d.party]]) {
           return colorSchema[d.party]
        }
        else {
            return 'white';
        }
    }
};


var colorManagerTopic = function(d, topic, maxValue) {
      // TODO maxValue
      return colorBW(d[topic]);
}

function initOneTopic() {

    d3.queue()
      .defer(d3.csv, "/candidates-topics-custom-cloud.csv")
      .await(ready);

}


function ready(error, data) {
    if (error) throw error;

    for (container of containers) {

        var topic = container.attr("data-topic");
        console.log(topic);

        var sortedData = data.sort(function(a, b) {
                return d3['descending'](+a[topic], +b[topic])
        });
        var maxValue = d3.max(sortedData);

      // draw dots
        container.selectAll(".word")
          .data(sortedData)
        .enter().append("span")
          .html(function(d) { return d.name })
          .attr("class", "word")
          .style("background-color", colorManagerParty)
          .style("color", function(d) { return colorManagerTopic(d, topic, maxValue); });

    }

}


function updateOneTopic(button) {

  var party = button.dataset.party;
  console.log(party);

    if (partySwitches[party]) {
        partySwitches[party] = false;
    }
    else {
        partySwitches[party] = true;
    }

    console.log(partySwitches);
  
    for (container of containers) {

        var topic = container.attr("data-topic");


    // draw dots
      container.selectAll(".word")
          .style("background-color", colorManagerParty);

    }

}

initOneTopic();
