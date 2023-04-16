// Use D3 to read in samples.json data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {

// Extract necessary data from samples.json for the bar chart
const sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
const otuIds = data.samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
const otuLabels = data.samples[0].otu_labels.slice(0, 10).reverse();

// Create bar chart using Plotly
const barData = [{
  x: sampleValues,
  y: otuIds,
  text: otuLabels,
  type: "bar",
  orientation: "h"
}];

const barLayout = {
  title: "Top 10 OTUs Found",
  xaxis: { title: "Sample Values" },
  yaxis: { title: "OTU IDs" }
};

Plotly.newPlot("bar", barData, barLayout);
// Extract necessary data from samples.json for the bubble chart
const bubbleX = data.samples[0].otu_ids;
const bubbleY = data.samples[0].sample_values;
const bubbleSize = data.samples[0].sample_values;
const bubbleColor = data.samples[0].otu_ids;
const bubbleLabels = data.samples[0].otu_labels;

// Create bubble chart using Plotly
const bubbleData = [{
  x: bubbleX,
  y: bubbleY,
  text: bubbleLabels,
  mode: "markers",
  marker: {
    size: bubbleSize,
    color: bubbleColor
  }
}];

const bubbleLayout = {
  title: "Belly Button Biodiversity",
  xaxis: { title: "OTU IDs" },
  yaxis: { title: "Sample Values" }
};

Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// Extract necessary data from samples.json for sample metadata
const metadata = data.metadata[0];

// Display sample metadata somewhere on the page
const sampleMetadata = d3.select("#sample-metadata");
sampleMetadata.html("");
Object.entries(metadata).forEach(([key, value]) => {
  sampleMetadata.append("p").text(`${key}: ${value}`);
});
// Function to handle dropdown menu change
function optionChanged(sampleId) {
    // Update visualizations with new sample data
    const sample = data.samples.find(sample => sample.id === sampleId);
    const metadata = data.metadata.find(meta => meta.id === +sampleId);

    // Update bar chart
    Plotly.update("bar", {
        x: [sample.sample_values.slice(0, 10).reverse()],
        y: [sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`)],
        text: [sample.otu_labels.slice(0, 10).reverse()]
    });

    // Update bubble chart
    Plotly.update("bubble", {
        x: [sample.otu_ids],
        y: [sample.sample_values],
        text: [sample.otu_labels],
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    });

    // Update sample metadata
    const sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        sampleMetadata.append("p").text(`${key}: ${value}`);
    });

    // Update gauge chart
    const washFreq = metadata.wfreq;
    updateGaugeChart(washFreq);

}

// Function to update gauge chart
function updateGaugeChart(washFreq) {
    // Update gauge chart data and layout
    const gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Weekly Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                bar: { color: "darkblue" },
                steps: [
                    { range: [0, 1], color: "rgb(248, 243, 236)" },
                    { range: [1, 2], color: "rgb(244, 241, 229)" },
                    { range: [2, 3], color: "rgb(233, 230, 202)" },
                    { range: [3, 4], color: "rgb(229, 231, 179)" },
                    { range: [4, 5], color: "rgb(213, 228, 157)" },
                    { range: [5, 6], color: "rgb(183, 204, 146)" },
                    { range: [6, 7], color: "rgb(140, 191, 136)" },
                    { range: [7, 8], color: "rgb(138, 187, 143)" },
                    { range: [8, 9], color: "rgb(133, 180, 138)" }
                ]
            }
        }
    ];

    const gaugeLayout = { margin: { t: 0, b: 0 } };

    // Update gauge chart
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}

// Create dropdown menu with sample IDs
const dropdownMenu = d3.select("#selDataset");
data.names.forEach(sampleId => {
    dropdownMenu.append("option").text(sampleId).property("value", sampleId);
});

// Call optionChanged function with default sample ID
optionChanged(data.names[0]);

// Event listener for dropdown menu change
dropdownMenu.on("change", function() {
    const sampleId = d3.event.target.value;
    optionChanged(sampleId);
});

});




