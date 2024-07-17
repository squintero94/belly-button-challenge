// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    metadata = data.metadata.filter(obj => obj.id === sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let sample_data = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_data.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadata[0]).forEach(([key, value]) => {
      sample_data.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selectedSample = samples.filter(obj => obj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = selectedSample[0].otu_ids;
    let otuLabels = selectedSample[0].otu_labels;
    let sampleValues = selectedSample[0].sample_values;

    // Build a Bubble Chart
    let trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth' // You can choose a different colorscale
      }
    };


    let layout = {
      title: 'Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', trace, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace_bar = {
      x: sampleValues.slice(0, 10), // Use the top 10 sample values
      y: yticks.slice(0, 10), // Use the top 10 OTU IDs as labels
      text: otuLabels.slice(0, 10), // Use the top 10 OTU labels as hovertext
      type: 'bar',
      orientation: 'h'
    };

    let data_bar = [trace_bar];

    let layout_bar = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', data_bar, layout_bar);
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option")
        .text(name)
        .attr("value", name);
    });

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);

    // Attach event listener to the dropdown to call optionChanged function
    dropdown.on("change", function() {
      let newSample = dropdown.property("value");
      optionChanged(newSample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
