'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
let inputDistance = document.querySelector('.form__input--distance');
let inputDuration = document.querySelector('.form__input--duration');
let inputCadence = document.querySelector('.form__input--cadence');
let inputElevation = document.querySelector('.form__input--elevation');

// Logic Variables
let map, mapEvent;

// OOP
class App {
  constructor() {}

  // Geolocation API:

  // This method takes to arguments (callbacks) and gets the current position of the user:
  // First callback: Called on Success
  // Second callback: Called on Error

  _getPosition() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(this._loadMap(), () =>
        alert("Sorry, we couldn't get your address.")
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    map = L.map('map').setView(coords, 24);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', function (mapE) {
      mapEvent = mapE;
      form.classList.remove('hidden');

      inputDistance.focus();
    });
  }

  _showForm() {}

  _toggleElevationField() {}

  _newWorkout() {}
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Clear input fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // Display marker
  const { lat, lng } = mapEvent.latlng;
  // Displaying a marker in that position
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

// 'change' event: Activates each time the user selects a new value in the input field
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
