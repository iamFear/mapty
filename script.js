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

// Geolocation API:

// This method takes to arguments (callbacks) and gets the current position of the user:
// First callback: Called on Success
// Second callback: Called on Error

// Guard Clause in case the browser doesn't support geolocation API

// Creating a link that shows the current location of the user in Google Maps:
if (navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];

      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      map = L.map('map').setView(coords, 24);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // const marker = L.marker(coords);

      // marker.addTo(map).bindPopup('This is your current location!').openPopup();

      // Marker's count:
      // let markCount = 1;

      // Handling clicks on Map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        // Focus this element after the event occurs
        inputDistance.focus();

        // const { lat, lng } = mapEvent.latlng;
        // Displaying a marker in that position
        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       minWidth: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: 'running-popup',
        //     })
        //   )
        //   .setPopupContent('Workout')
        //   .openPopup();
      });

      // marker.on('onmouseout', () => {
      //   marker.closePopup();
      // });
    },
    () => alert("Sorry, we couldn't get your address.")
  );
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

// change event: Activates each time the user selects a new value in the input field
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

// if (navigator) {
//   console.log(
//     navigator.geolocation.getCurrentPosition(
//       position => {
//         const { latitude } = position.coords;
//         const { longitude } = position.coords;

//         console.log(`Latitude: ${latitude}\nLongitude: ${longitude}`);
//       },
//       () => alert("We couldn't get your address.")
//     )
//   );
// }

// Test Branch
