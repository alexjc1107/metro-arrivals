'use strict';
let stationCode = '';
const railPredictionURL = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/';
const railStationURL = 'https://api.wmata.com/Rail.svc/json/jLines';
const primaryKey = '8232a7f9731949c282083d6fc7f3aa51';

function getRailStationData (callback) {
    console.log(`getRailStationData ran`);
    const query = {
        api_key: primaryKey
    };
    $.getJSON(railStationURL, query, callback);
}

function displayRailStationData(data) {
  console.log(`displayRailStationData ran`);
  console.log(data);
  $('#js-main').append(`
    <select id="js-railStation-dropDown">
    </select>
  `);
  let select = document.getElementById('js-railStation-dropDown');
  for (let i = 0; i < data.Lines.length; i++) {
    console.log(data.Lines[i]['DisplayName']);
    select.add(new Option(data.Lines[i]['DisplayName']));
  }
}

function renderResult(result) {
    return `
    <section>
      <h2>${result.DisplayName}</h2>
      <p>${result.LineCode}</p>
      <p>${result.StartStationCode}</p>
      <p>${result.EndStationCode}</p>
    </section>
  `;
}

function handleRailButton() {
  $('#js-rail-button').click(function() {
    $('#js-main').html(`rail information
    <button type="button" id="js-home-button">Home</button>`);
    getRailStationData(displayRailStationData);
  });
}

function handleBusButton() {
  $('#js-bus-button').click(function() {
    $('#js-main').html(`bus information
    <button type="button" id="js-home-button">Home</button>`);
  });
}

function handleHomeButton() {
  $('#js-main').on('click', '#js-home-button', function() {
    handleArrival();
  });
}

function renderHomepage() {
  stationCode = '';
  $('#js-main').html(`<h1>Metro Arrivals</h1>
      <h2>Select below to show arrival times</h2>
      <button type="button" id="js-rail-button">Rail</button>
      <button type="button" id="js-bus-button">Bus</button>`);
}

function handleArrival() {
  renderHomepage();
  handleRailButton();
  handleBusButton();
  handleHomeButton();
}

$(handleArrival);