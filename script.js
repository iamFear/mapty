'use strict';
// Class: Blueprint for a house
// Class instances: Actual Houses

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// OOP
class Workout {
  date = new Date();
  id = Date.now();

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in KM
    this.duration = duration; // in Minutes
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // Cadence = Duration / Distance
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// /////////////////////////////////////////////////////////////////////////////
// Application Architecture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
let inputDistance = document.querySelector('.form__input--distance');
let inputDuration = document.querySelector('.form__input--duration');
let inputCadence = document.querySelector('.form__input--cadence');
let inputElevation = document.querySelector('.form__input--elevation');
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    // 'change' event: Activates each time the user selects a new value in the input field
    inputType.addEventListener('change', this._toggleElevationField);
  }

  // Geolocation API:

  // This method takes to arguments (callbacks) and gets the current position of the user:
  // First callback: Called on Success
  // Second callback: Called on Error

  _getPosition() {
    if (navigator) {
      // Making the 'this' keyword of the regular function call point to our object
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert("Sorry, we couldn't get your address.")
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    this.#map = L.map('map').setView(coords, 24);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');

    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // Helper functions

    // Checking that all inputs are numbers
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositives = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    // Converting values to numbers
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Get different data depending on the workout

    // If workout === running, the create a running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      const params = [distance, duration, cadence];
      // Check if input data is valid
      if (!validInputs(...params) || !allPositives(...params))
        return alert('Inputs have to be positive numbers.');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout === cycling, the create a cycling object
    if (type === 'cycling') {
      const elevationGain = +inputElevation.value;
      // Check if input data is valid
      if (
        !validInputs(distance, duration, elevationGain) ||
        !allPositives(distance, duration)
      )
        return alert('Inputs have to be positive numbers.');

      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }

    // Adding the new workout to the workouts array
    this.#workouts.push(workout);

    // Render the workout on the map as a marker
    this.renderWorkoutMarker(workout);

    // Render workout on list of workouts (UI)

    // Hide form and Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  // Display marker
  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`workout`)
      .openPopup();
  }
}

const app = new App();
