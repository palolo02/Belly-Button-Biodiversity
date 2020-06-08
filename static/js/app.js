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
    var panel = d3.select(".panel-heading");
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
}
