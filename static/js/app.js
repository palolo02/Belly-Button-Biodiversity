console.log('Loading JSON');
// Use d3.json() to fetch data from JSON file
var samples = [];


// Incoming data is internally referred to as incomingData
d3.json("./data/samples.json").then((incomingData) => {
    
    // Create single structure
    // Add demographic information
    incomingData.metadata.forEach(function(sample){
        // Store ethnicity
        var s = {};
        s.ethnicity = sample.ethnicity;
        s.gender = sample.gender;
        s.age = sample.age;
        s.location = sample.location;
        s.bbtype = sample.bbtype;
        s.wfreq = sample.wfreq;
        s.id = sample.id;
        samples.push(s);
    });

    var analysis = []
    // Add analysis information
    incomingData.samples.forEach(function(sample, index){
        
        var s = samples[index];
        // Store sample ID
        s.id = sample.id;
        // Store first 10 otu ids
        s.otu_ids = sample.otu_ids.filter((i, index) => (index < 10));
        s.otu_ids = s.otu_ids.map((otu) => {return 'OTU ' + otu});
        // Store first 10 sample values
        s.sample_values = sample.sample_values.filter((i, index) => (index < 10));
        // Store first 10 otu labels
        s.otu_labels = sample.otu_labels.filter((i, index) => (index < 10));
    });

    // Add element to main list


    
});

var id;
var trace;
var data;
var layout;

// main code
setTimeout(function(){

    // Fill elements in select
    fillOptions();

    fillDemographics(samples[0]);

    // PLot the information
    plotData(samples[0]);

    plotBubbleData(samples[0]);

    plotGaugePlot(samples[0]);

//Wait 3 seconds to execute
}, 3000);


function fillOptions(){
    var select = d3.select("#selDataset");
    samples.forEach(function(sample){
        select.append("option").text(sample.id).property("value",sample.id);
    });
    
}

function plotData(id){
    
    // Create your trace.
    trace = {
        x: id.sample_values,
        y: id.otu_ids,
        type: "bar",
        orientation: 'h'
    };

    // Create the data array for our plot
    data = [trace];

    // Define the plot layout
    layout = {
        title: `OTUS for ${id.id}`,
        xaxis: { title: "Values" },
        yaxis: { title: ""}
    };

    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", data, layout);

}


function fillDemographics(id){
    var panel = d3.select("#contentDemo");
    panel.html("");
    Object.entries(id).forEach(([key,value]) => {
        if ((typeof value === 'string' || value instanceof String) || 
            (typeof value === 'number' || value instanceof Number))
            panel.append("p").text(`${key} : ${value}`);
    })
}

function optionChanged(value){
    console.log(value);
    id = samples.filter((sample) => {return sample.id == value})[0];
    plotData(id);
    fillDemographics(id);
    plotBubbleData(id);
}


function plotBubbleData(id){

    // Create your trace.
    trace = {
        x: id.otu_ids,
        y: id.sample_values,
        text: id.otu_labels,
        mode: 'markers',
        marker: {
            size: id.sample_values,
            color: id.otu_ids
        }
    };

    // Create the data array for our plot
    data = [trace];

    // Define the plot layout
    layout = {
        title: `OTUS for ${id.id}`,
        showlegend: false
    };

    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bubble", data, layout);

}


function plotGaugePlot(id){

    var maxWeeks = samples.map((sample) => {return sample.wfreq});
    maxWeeks = maxWeeks.filter((weeks) => { return weeks != null})
    maxWeeks = 9;
    console.log(maxWeeks);
    var minWeeks = samples.map((sample) => {return sample.wfreq});
    minWeeks = minWeeks.filter((weeks) => { return weeks != null})
    minWeeks = 0;
    console.log(minWeeks);

    labels = ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''];

    

    trace1 = {
        type: "pie",
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9,100 / 9,100 / 9,100 / 9,100 / 9, 100],
        text: labels,
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: ["#2B2823","#2B2823","#B4C5AC","#2B2823","#7AAE9F","#5CBCAF","#2B2823","#248D8C","#00A2A0","white"]
        },
        labels: labels,
        hoverinfo: "label"
      };
      
      
      var degrees = 90, radius = .6;
      var radians = degrees * Math.PI / 180;
      var x = -1 * radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      console.log(id.wfreq);

      layout = {
        shapes:[{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: 0.3,
            y1: 0.55,
            line: {
              color: 'black',
              width: 5
            }
          }],
        title: 'Number of Printers Sold in a Week',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
      };
      
      data = [trace1];
      
      Plotly.plot("gauge", data, layout, {staticPlot: true});
      
}