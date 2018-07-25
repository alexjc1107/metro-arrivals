'use strict';

const railPredictionURL = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/';
const railLineURL = 'https://api.wmata.com/Rail.svc/json/jLines';
const railStationURL = 'https://api.wmata.com/Rail.svc/json/jStations'
const busStopURL = 'https://api.wmata.com/Bus.svc/json/jStops';
const busRouteURL = 'https://api.wmata.com/Bus.svc/json/jRoutes';
const busPredictionURL = 'https://api.wmata.com/NextBusService.svc/json/jPredictions';
const apiKey = '8232a7f9731949c282083d6fc7f3aa51';

let railLineData = [];
let railStationData = [];
let busStopData = [];
let busRouteData = [];

let selectedRailLineValue = '';
let selectedRailStationValue = '';
let railPredictionString = '';
let selectedBusRouteValue = '';
let selectedBusStopValue = '';
let busPredictionString = '';
let currentPage = '';

function printError(error) {
    console.log(error);
}

function getBusRouteData(callback) {
    const query = {
        url: `${busRouteURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: printError
    };
    $.ajax(query);
}

function saveBusRouteData(busRouteQueryData) {
    busRouteData = busRouteQueryData;
    displayBusRouteData();
}

function displayBusRouteData() {
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
    const query = {
        url: `${busStopURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: printError
    };
    $.ajax(query);
}

function saveBusStopData(busStopQueryData) {
    busStopData = busStopQueryData;
}

function displayBusStopData() {
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
                opt.value = busStopData.Stops[i]['StopID'];
                opt.text = busStopData.Stops[i]['Name'];
                select.add(opt, null);
            }
        }
    }
}

function getBusPredictionData(stopID, callback) {
    const query = {
        url: `${busPredictionURL}?api_key=${apiKey}&StopID=${stopID}`,
        type: 'GET',
        success: callback,
        error: handleGetBusPredictionDataError
    };
    $.ajax(query);
}

function handleGetBusPredictionDataError(error) {
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

function displayBusPredictions(busPredictionData) {
    $('#js-busPredictionTable').empty();
    busPredictionString = '';
    let predictionCount = 0;
    let altClass = ``;
    for (let i = 0; i < busPredictionData.Predictions.length; i++) {
        if (busPredictionData.Predictions[i]['RouteID'] == selectedBusRouteValue) {
            if (predictionCount % 2 == 1) {
                altClass = ` class="altRow"`;
            } else {
                altClass = ``;
            }
            busPredictionString = busPredictionString + `
        <tr${altClass}>
          <td>${busPredictionData.Predictions[i]['RouteID']}</td>
          <td>${busPredictionData.Predictions[i]['VehicleID']}</td>
          <td>${busPredictionData.Predictions[i]['DirectionText']}</td> 
          <td>${busPredictionData.Predictions[i]['Minutes']}</td>
        </tr>
      `;
            predictionCount++;
        }
    }
    if (predictionCount == 0) {
        busPredictionString = busPredictionString + `
      <tr>
        <td>N/A</td>
        <td>N/A</td>
        <td>No Buses Scheduled</td> 
        <td>N/A</td>
      </tr>
    `;
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
    const query = {
        url: `${railLineURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: printError
    };
    $.ajax(query);
}

function saveRailLineData(railLineQueryData) {
    railLineData = railLineQueryData;
    displayRailLineData();
}

function displayRailLineData() {
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
    const query = {
        url: `${railStationURL}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: printError
    };
    $.ajax(query);
}

function saveRailStationData(railStationQueryData) {
    railStationData = railStationQueryData;
}

function displayRailStationData() {
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
                opt.value = railStationData.Stations[i]['Code'];
                opt.text = railStationData.Stations[i]['Name'];
                select.add(opt, null);
            }
        }
    }
}

function getRailPredictionData(stationCode, callback) {
    const query = {
        url: `${railPredictionURL}/${stationCode}?api_key=${apiKey}`,
        type: 'GET',
        success: callback,
        error: handleGetRailPredictionDataError
    };
    $.ajax(query);
}

function handleGetRailPredictionDataError(error) {
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

function displayRailPredictions(railPredictionData) {
    $('#js-railPredictionTable').empty();
    railPredictionString = '';
    let predictionCount = 0;
    let altClass = ``;
    for (let i = 0; i < railPredictionData.Trains.length; i++) {
        if (railPredictionData.Trains[i]['Line'] == selectedRailLineValue) {
            if (predictionCount % 2 == 1) {
                altClass = ` class="altRow"`;
            } else {
                altClass = ``;
            }
            railPredictionString = railPredictionString + `
        <tr${altClass}>
          <td>${railPredictionData.Trains[i]['Line']}</td>
          <td>${railPredictionData.Trains[i]['Car']}</td>
          <td>${railPredictionData.Trains[i]['Destination']}</td> 
          <td>${railPredictionData.Trains[i]['Min']}</td>
        </tr>
      `;
            predictionCount++;
        }
    }

    if (predictionCount == 0) {
        railPredictionString = railPredictionString + `
      <tr>
        <td>N/A</td>
        <td>N/A</td>
        <td>No Trains Scheduled</td> 
        <td>N/A</td>
      </tr>
    `;
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
        <form class="dropDown">
          <label for="js-railLine-dropDown">Line:</label>
          <select name="railLine-dropDown" id="js-railLine-dropDown"></select>
        </form>
        <form id="js-railStation-dropDown-form" class="dropDown">
          <label for="js-railStation-dropDown">Station:</label>
          <select name="railStation-dropDown" id="js-railStation-dropDown"></select>
        </form>
      </section>
      <table id="js-railPredictionTable"></table>
    `);
        $('#js-railStation-dropDown-form').hide();
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
        <form class="dropDown">
          <label for="js-busRoute-dropDown">Route:</label>
          <select name="busRoute-dropDown" id="js-busRoute-dropDown"></select>
        </form>
        <form id="js-busStop-dropDown-form" class="dropDown">
          <label for="js-busStop-dropDown">Stop:</label>
          <select name="busStop-dropDown" id="js-busStop-dropDown"></select>
        </form>
      </section>
      <table id="js-busPredictionTable"></table>
    `);
        $('#js-busStop-dropDown-form').hide();
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
        $('#js-railStation-dropDown-form').show();
    });
}

function handleRailStationChange() {
    $('#js-main').on('change', '#js-railStation-dropDown', function() {
        selectedRailStationValue = $("#js-railStation-dropDown option:selected").attr("value");
        removeHomeRefreshButton();
        getRailPredictionData(selectedRailStationValue, displayRailPredictions);
    });
}

function handleBusRouteChange() {
    $('#js-main').on('change', '#js-busRoute-dropDown', function() {
        selectedBusRouteValue = $("#js-busRoute-dropDown option:selected").val();
        $('#js-busPredictionTable').empty();
        displayBusStopData();
        $('#js-busStop-dropDown-form').show();
    });
}

function handleBusStopChange() {
    $('#js-main').on('change', '#js-busStop-dropDown', function() {
        selectedBusStopValue = $("#js-busStop-dropDown option:selected").attr("value");
        removeHomeRefreshButton();
        getBusPredictionData(selectedBusStopValue, displayBusPredictions);
    });
}

function renderHomepage() {
    $('#js-main').html(`
    <h1>Metro Arrivals</h1>
    <h2>Select a button below to show arrival times for Metro trains and buses in the Washington DC area</h2>
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