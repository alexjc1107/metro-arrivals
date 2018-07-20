'use strict';

const railPredictionURL = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/';
const railLinesURL = 'https://api.wmata.com/Rail.svc/json/jLines';
const railStationURL = 'https://api.wmata.com/Rail.svc/json/jStations'
const busStopURL = 'https://api.wmata.com/Bus.svc/json/jStops';
const busRoutesURL = 'https://api.wmata.com/Bus.svc/json/jRoutes';
const busPredictionURL = 'https://api.wmata.com/NextBusService.svc/json/jPredictions';
const apiKey = '8232a7f9731949c282083d6fc7f3aa51';

var railPredictionData = []; //may not be needed
var railLinesData = [];
var railStationData = [];
var busStopData = [];
var busRoutesData = [];

var selectedRailLineValue = '';
var selectedRailStationValue = '';
var predictionString = '';




function getBusRouteData(callback) {
    console.log(`getBusRouteData ran`);
    const query = {
        url: `${busRoutesURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function displayBusRouteData(data) {
    console.log(`displayBusRouteData ran`);
    console.log(data);
    $('#js-main').append(`
    <select id="js-busRoute-dropDown">
    </select>
  `);
    let select = document.getElementById('js-busRoute-dropDown');
    for (let i = 0; i < data.Routes.length; i++) {
        select.add(new Option(data.Routes[i]['Name']));
    }
}






function getBusStopData(callback) {
    console.log(`getBusStopData ran`);
    const query = {
        url: `${busStopURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function displayBusStopData(data) {
    console.log(`displayBusStopData ran`);
    console.log(data);
    $('#js-main').append(`
    <select id="js-busStop-dropDown">
    </select>
  `);
    let select = document.getElementById('js-busStop-dropDown');
    console.log('stops length');
    for (let i = 0; i < data.Stops.length; i++) {
        select.add(new Option(data.Stops[i]['Name']));
    }
}





function getRailLinesData(callback) {
    console.log(`getRailLinesData ran`);
    const query = {
        url: `${railLinesURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function saveRailLinesData(data) {
    console.log(`saveRailLinesData ran`);
    railLinesData = data;
    displayRailLinesData();
}

function displayRailLinesData() {
    console.log(`displayRailLinesData ran`);
    let select = document.getElementById('js-railLines-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
    opt.text = '<Select Line>';
    select.add(opt, null);
    for (let i = 0; i < railLinesData.Lines.length; i++) {
        let opt = document.createElement("option");
        opt.value = railLinesData.Lines[i]['LineCode'];
        opt.text = railLinesData.Lines[i]['DisplayName'];
        select.add(opt, null);
    }
}





function getRailStationData(callback) {
    console.log(`getRailStationData ran`);
    const query = {
        url: `${railStationURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function saveRailStationData(data) {
    console.log(`saveRailStationData ran`);
    railStationData = data;
    //displayRailStationData();
}

function displayRailStationData() {
    console.log(`displayRailStationData ran`);
    $('#js-railStation-dropDown').empty();
    let select = document.getElementById('js-railStation-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
    opt.text = 'blank';
    opt.text = '<Select Station>';
    select.add(opt, null);
    for (let i = 0; i < railStationData.Stations.length; i++) {
        for (let j = 1; j < 4; j++) {
            if (railStationData.Stations[i][`LineCode${j}`] == selectedRailLineValue) {
                let opt = document.createElement("option");
                opt.value = railStationData.Stations[i][`LineCode${j}`];
                opt.text = railStationData.Stations[i]['Name'];
                opt.id = railStationData.Stations[i]['Code'];
                select.add(opt, null);
            }
        }
    }
}



function getRailPredictionData(stationCode, callback) {
    console.log(`getRailPredictionData ran`);
    const query = {
        url: `${railPredictionURL}/${stationCode}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function displayRailPredictions(data) {
    $('#js-predictionTable').empty();
    predictionString = '';
    for (let i = 0; i < data.Trains.length; i++) {
        if (data.Trains[i]['Line'] == selectedRailLineValue) {
            predictionString = predictionString + `
      <tr>
        <td>${data.Trains[i]['Line']}</td>
        <td>${data.Trains[i]['Car']}</td>
        <td>${data.Trains[i]['Destination']}</td> 
        <td>${data.Trains[i]['Min']}</td>
      </tr>`
        }
    }

    $('#js-predictionTable').append(`
    <tr>
      <th>Line</th>
      <th>Cars</th>
      <th>Destination</th> 
      <th>Minutes</th>
    </tr>
    ${predictionString}
`);
}






function handleRailButton() {
    $('#js-rail-button').click(function() {
        $('#js-main').html(`rail information
    <button type="button" id="js-home-button">Home</button>
    <select id="js-railLines-dropDown"></select>
    <select id="js-railStation-dropDown"></select>
    <table id="js-predictionTable" style="width:100%"></table>
    `);
        $('#js-railStation-dropDown').hide();
        if (railLinesData.length == 0) {
            getRailLinesData(saveRailLinesData);
            getRailStationData(saveRailStationData);
        } else {
            selectedRailLineValue = '';
            displayRailLinesData();
            displayRailStationData($("#js-railLines-dropDown option:selected").text());
        }
    });
}

function handleBusButton() {
    $('#js-bus-button').click(function() {
        $('#js-main').html(`bus information
    <button type="button" id="js-home-button">Home</button>`);
        getBusRouteData(displayBusRouteData);
    });
}

function handleHomeButton() {
    $('#js-main').on('click', '#js-home-button', function() {
        handleArrival();
    });
}

function handleRailLineChange() {
    $('#js-main').on('change', '#js-railLines-dropDown', function() {
        selectedRailLineValue = $("#js-railLines-dropDown option:selected").val();
        $('#js-predictionTable').empty();
        displayRailStationData();
        $('#js-railStation-dropDown').show();
    });
}

function handleRailStationChange() {
    $('#js-main').on('change', '#js-railStation-dropDown', function() {
        selectedRailStationValue = $("#js-railStation-dropDown option:selected").attr("id");
        getRailPredictionData(selectedRailStationValue, displayRailPredictions);
    });
}

function renderHomepage() {
    $('#js-main').html(`<h1>Metro Arrivals</h1>
      <h2>Select below to show arrival times</h2>
      <button type="button" id="js-rail-button">Rail</button>
      <button type="button" id="js-bus-button">Bus</button>

  `);
}

function handleArrival() {
    renderHomepage();
    handleRailButton();
    handleBusButton();
    handleHomeButton();
    handleRailLineChange();
    handleRailStationChange();
}

$(handleArrival);