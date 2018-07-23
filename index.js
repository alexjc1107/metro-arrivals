'use strict';

const railPredictionURL = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/';
const railLineURL = 'https://api.wmata.com/Rail.svc/json/jLines';
const railStationURL = 'https://api.wmata.com/Rail.svc/json/jStations'
const busStopURL = 'https://api.wmata.com/Bus.svc/json/jStops';
const busRouteURL = 'https://api.wmata.com/Bus.svc/json/jRoutes';
const busPredictionURL = 'https://api.wmata.com/NextBusService.svc/json/jPredictions';
const apiKey = '8232a7f9731949c282083d6fc7f3aa51';

var railLineData = [];
var railStationData = [];
var busStopData = [];
var busRouteData = [];

var selectedRailLineValue = '';
var selectedRailStationValue = '';
var railPredictionString = '';
var selectedBusRouteValue = '';
var selectedBusStopValue = '';
var busPredictionString = '';

var currentPage = '';


function getBusRouteData(callback) {
    console.log(`getBusRouteData ran`);
    const query = {
        url: `${busRouteURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function saveBusRouteData(data) {
    console.log(`saveBusRouteData ran`);
    busRouteData = data;
    displayBusRouteData();
}

function displayBusRouteData() {
    console.log(`displayBusRouteData ran`);
    let select = document.getElementById('js-busRoute-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
    opt.text = '<Select Route>';
    select.add(opt, null);
    for (let i = 0; i < busRouteData.Routes.length; i++) {
        let opt = document.createElement("option");
        opt.value = busRouteData.Routes[i]['RouteID'];
        opt.text = busRouteData.Routes[i]['Name'];
        select.add(opt, null);
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

function saveBusStopData(data) {
    console.log(`saveBusStopData ran`);
    busStopData = data;
}

function displayBusStopData(data) {
    console.log(`displayBusStopData ran`);
    $('#js-busStop-dropDown').empty();
    let select = document.getElementById('js-busStop-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
    opt.text = '<Select Stop>';
    select.add(opt, null);
    for (let i = 0; i < busStopData.Stops.length; i++) {
        for (let j = 0; j < busStopData.Stops[i].Routes.length; j++) {
            if (busStopData.Stops[i].Routes[j] == selectedBusRouteValue) {
                let opt = document.createElement("option");
                opt.value = busStopData.Stops[i].Routes[j];
                opt.text = busStopData.Stops[i]['Name'];
                opt.id = busStopData.Stops[i]['StopID'];
                select.add(opt, null);
            }
        }
    }
}


function getBusPredictionData(stopID, callback) {
    console.log(`getBusPredictionData ran`);
    const query = {
        url: `${busPredictionURL}?api_key=${apiKey}&StopID=${stopID}`,
        type: 'GET',
        success: callback,
        error: function(error) {
            console.log(error);
            $('#js-busPredictionTable').empty();
            $('#js-busPredictionTable').append(`
      <tr>
        <th>Route</th>
        <th>Bus ID</th>
        <th>Destination</th> 
        <th>Minutes</th>
      </tr>
      <tr>
        <td>N/A</td>
        <td>N/A</td>
        <td>Data Unavailable</td> 
        <td>N/A</td>
      </tr>
      `);
            removeHomeRefreshButton();
            currentPage = 'bus';
            displayHomeRefreshButton();
        }
    };
    $.ajax(query);
}

function displayBusPredictions(data) {
    console.log(`displayBusPredictions ran`);
    $('#js-busPredictionTable').empty();
    busPredictionString = '';
    let predictionCount = 0;
    let altClass = ``;
    for (let i = 0; i < data.Predictions.length; i++) {
        if (data.Predictions[i]['RouteID'] == selectedBusRouteValue) {
            if (predictionCount % 2 == 1) {
                altClass = ` class="altRow"`;
            } else {
                altClass = ``;
            }
            busPredictionString = busPredictionString + `
      <tr${altClass}>
        <td>${data.Predictions[i]['RouteID']}</td>
        <td>${data.Predictions[i]['VehicleID']}</td>
        <td>${data.Predictions[i]['DirectionText']}</td> 
        <td>${data.Predictions[i]['Minutes']}</td>
      </tr>`;
            predictionCount++;
        }
    }
    $('#js-busPredictionTable').append(`
    <tr>
      <th>Route</th>
      <th>Bus ID</th>
      <th>Destination</th> 
      <th>Minutes</th>
    </tr>
    ${busPredictionString}
  `);
    removeHomeRefreshButton();
    currentPage = 'bus';
    displayHomeRefreshButton();
}










function getRailLineData(callback) {
    console.log(`getRailLineData ran`);
    const query = {
        url: `${railLineURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: function(error) { console.log(error); }
    };
    $.ajax(query);
}

function saveRailLineData(data) {
    console.log(`saveRailLineData ran`);
    railLineData = data;
    displayRailLineData();
}

function displayRailLineData() {
    console.log(`displayRailLineData ran`);
    let select = document.getElementById('js-railLine-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
    opt.text = '<Select Line>';
    select.add(opt, null);
    for (let i = 0; i < railLineData.Lines.length; i++) {
        let opt = document.createElement("option");
        opt.value = railLineData.Lines[i]['LineCode'];
        opt.text = railLineData.Lines[i]['DisplayName'];
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
}

function displayRailStationData() {
    console.log(`displayRailStationData ran`);
    $('#js-railStation-dropDown').empty();
    let select = document.getElementById('js-railStation-dropDown');
    let opt = document.createElement("option");
    opt.value = 'blank';
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
        error: function(error) {
            console.log(error);
            $('#js-railPredictionTable').empty();
            $('#js-railPredictionTable').append(`
        <tr>
          <th>Line</th>
          <th>Cars</th>
          <th>Destination</th>
          <th>Minutes</th>
        </tr>
        <tr>
          <td>N/A</td>
          <td>N/A</td>
          <td>Data Unavailable</td> 
          <td>N/A</td>
        </tr>
      `);
            removeHomeRefreshButton();
            currentPage = 'rail';
            displayHomeRefreshButton();
        }
    };
    $.ajax(query);
}

function displayRailPredictions(data) {
    $('#js-railPredictionTable').empty();
    railPredictionString = '';
    let predictionCount = 0;
    let altClass = ``;
    for (let i = 0; i < data.Trains.length; i++) {
        if (data.Trains[i]['Line'] == selectedRailLineValue) {
            if (predictionCount % 2 == 1) {
                altClass = ` class="altRow"`;
            } else {
                altClass = ``;
            }
            railPredictionString = railPredictionString + `
      <tr${altClass}>
        <td>${data.Trains[i]['Line']}</td>
        <td>${data.Trains[i]['Car']}</td>
        <td>${data.Trains[i]['Destination']}</td> 
        <td>${data.Trains[i]['Min']}</td>
      </tr>`;
            predictionCount++;
        }
    }

    $('#js-railPredictionTable').append(`
    <tr>
      <th>Line</th>
      <th>Cars</th>
      <th>Destination</th> 
      <th>Minutes</th>
    </tr>
    ${railPredictionString}
  `);
    removeHomeRefreshButton();
    currentPage = 'rail';
    displayHomeRefreshButton();
}

function displayHomeRefreshButton() {
    $('#js-main').append(`
    <section class="button-section" id="js-HomeRefresh-button">
      <button type="button" id="js-home-button">Home</button>
      <button type="button" id="js-refresh-button">Refresh</button>
    </section>
  `);
}

function removeHomeRefreshButton() {
    $("#js-HomeRefresh-button").remove();
}

function handleRailButton() {
    $('#js-rail-button').click(function() {
        $('#js-main').html(`
    <h1>Rail Arrivals</h1>
    <section>
      <div class="dropDown">
        <select id="js-railLine-dropDown"></select>
      </div>
      <div class="dropDown">
        <select id="js-railStation-dropDown"></select>
      </div>
    </section>
    <table id="js-railPredictionTable"></table>
    `);
        $('#js-railStation-dropDown').hide();
        if (railLineData.length == 0) {
            getRailLineData(saveRailLineData);
            getRailStationData(saveRailStationData);
        } else {
            selectedRailLineValue = '';
            displayRailLineData();
            displayRailStationData();
        }
    });
}

function handleBusButton() {
    $('#js-bus-button').click(function() {
        $('#js-main').html(`
    <h1>Bus Arrivals</h1>
    <section>
      <div class="dropDown">
        <select id="js-busRoute-dropDown"></select>
      </div>
      <div class="dropDown">
        <select id="js-busStop-dropDown"></select>
      </div>
    </section>
    <table id="js-busPredictionTable"></table>
    `);
        $('#js-busStop-dropDown').hide();
        console.log(busStopData.length);
        if (busStopData.length == 0) {
            getBusRouteData(saveBusRouteData);
            getBusStopData(saveBusStopData);
        } else {
            selectedBusRouteValue = '';
            displayBusRouteData();
            displayBusStopData();
        }
    });
}

function handleHomeButton() {
    $('#js-main').on('click', '#js-home-button', function() {
        handleArrival();
    });
}

function handleRefreshButton() {
    $('#js-main').on('click', '#js-refresh-button', function() {
        if (currentPage == 'bus') {
            getBusPredictionData(selectedBusStopValue, displayBusPredictions);
            removeHomeRefreshButton();
        } else if (currentPage == 'rail') {
            getRailPredictionData(selectedRailStationValue, displayRailPredictions);
            removeHomeRefreshButton();
        }
    });
}

function handleRailLineChange() {
    $('#js-main').on('change', '#js-railLine-dropDown', function() {
        selectedRailLineValue = $("#js-railLine-dropDown option:selected").val();
        $('#js-railPredictionTable').empty();
        displayRailStationData();
        $('#js-railStation-dropDown').show();
    });
}

function handleRailStationChange() {
    $('#js-main').on('change', '#js-railStation-dropDown', function() {
        selectedRailStationValue = $("#js-railStation-dropDown option:selected").attr("id");
        removeHomeRefreshButton();
        getRailPredictionData(selectedRailStationValue, displayRailPredictions);
    });
}

function handleBusRouteChange() {
    $('#js-main').on('change', '#js-busRoute-dropDown', function() {
        selectedBusRouteValue = $("#js-busRoute-dropDown option:selected").val();
        $('#js-busPredictionTable').empty();
        displayBusStopData();
        $('#js-busStop-dropDown').show();
    });
}

function handleBusStopChange() {
    $('#js-main').on('change', '#js-busStop-dropDown', function() {
        selectedBusStopValue = $("#js-busStop-dropDown option:selected").attr("id");
        removeHomeRefreshButton();
        getBusPredictionData(selectedBusStopValue, displayBusPredictions);
    });
}

function renderHomepage() {
    $('#js-main').html(`
      <h1>Metro Arrivals</h1>
      <h2>Select below to show arrival times</h2>
      <section class="button-section">
      <button type="button" id="js-rail-button">Rail</button>
      <button type="button" id="js-bus-button">Bus</button>
      </section>
  `);
}

function handleArrival() {
    renderHomepage();
    handleRailButton();
    handleBusButton();
    handleHomeButton();
    handleRefreshButton();
    handleRailLineChange();
    handleRailStationChange();
    handleBusRouteChange();
    handleBusStopChange();
}

$(handleArrival);