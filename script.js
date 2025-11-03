// Import Firebase modules using the modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGtcnSQLlZG5jAMQeYFjI2aOlEUPTQ6jU",
  authDomain: "carsos-acc15.firebaseapp.com",
  projectId: "carsos-acc15",
  storageBucket: "carsos-acc15.appspot.com",
  messagingSenderId: "651807933526",
  appId: "1:651807933526:web:c0150533c0945d7d3127f7",
  measurementId: "G-W9MB06R43L",
  databaseURL: "https://carsos-acc15-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Firebase references
const temperatureRef = ref(db, "temp");
const humidityRef = ref(db, "humidity");
const alertRef = ref(db, "alert");
const cameraRef = ref(db, "cameraURL");

// UI elements
const sosOverlay = document.getElementById("sos-overlay");
const dismissSosBtn = document.getElementById("dismiss-sos");
const cameraFrame = document.getElementById("camera-feed");

// Timeout control
let sosTimeout = null;

// Trigger SOS overlay with camera feed and 20 sec timeout
// function triggerSOSWithTimeout() {
//   triggerSOS();

//   // Clear any existing timeout
//   if (sosTimeout) clearTimeout(sosTimeout);

//   // Dismiss after 20 seconds
//   sosTimeout = setTimeout(() => {
//     dismissSOS();
//   }, 200000);
// }

// Show SOS alert
function triggerSOS() {
  sosOverlay.classList.remove("hidden");
  document.body.classList.add("danger-theme");

  // Fetch and set camera feed URL
  onValue(cameraRef, (snapshot) => {
    const url = snapshot.val();
    if (url && cameraFrame) {
      cameraFrame.src = url;
    }
  }, (error) => {
    console.error("Error fetching camera URL:", error);
  });
}

// Hide SOS alert
function dismissSOS() {
  sosOverlay.classList.add("hidden");
  document.body.classList.remove("danger-theme");
  if (cameraFrame) cameraFrame.src = ""; // Stop camera stream
}

// Listen for alert changes
onValue(alertRef, (snapshot) => {
  const alertStatus = snapshot.val();

  if (alertStatus === true) {
    triggerSOSWithTimeout();  // Show and lock for 20 sec
  }
}, (error) => {
  console.error("Error fetching alert status:", error);
});



// Temperature updates
onValue(temperatureRef, (snapshot) => {
  const temperatureData = snapshot.val();
  const tempElement = document.getElementById("temperature");
  const tempStatus = tempElement.nextElementSibling;

  if (temperatureData != null) {
    tempElement.innerText = `${temperatureData}°C`;
    const temperature = parseFloat(temperatureData);

    if (temperature > 35) {
      tempStatus.textContent = 'Critical - SOS Activated';
      tempStatus.className = 'metric-status danger';
    } else if (temperature > 32) {
      tempStatus.textContent = 'High - Warning';
      tempStatus.className = 'metric-status danger';
    } else if (temperature > 29) {
      tempStatus.textContent = 'Elevated';
      tempStatus.className = 'metric-status warning';
    } else {
      tempStatus.textContent = 'Safe Range';
      tempStatus.className = 'metric-status safe';
    }
  } else {
    tempElement.innerText = "No data";
  }
}, (error) => {
  console.error("Error fetching temperature data:", error);
});

// Humidity updates
onValue(humidityRef, (snapshot) => {
  const humidityData = snapshot.val();
  const humidityElement = document.getElementById("humidity");
  const humidityStatus = humidityElement.nextElementSibling;

  if (humidityData != null) {
    humidityElement.innerText = `${humidityData}%`;
    const humidity = parseFloat(humidityData);

    if (humidity > 70) {
      humidityStatus.textContent = 'High';
      humidityStatus.className = 'metric-status danger';
    } else if (humidity > 60) {
      humidityStatus.textContent = 'Moderate';
      humidityStatus.className = 'metric-status warning';
    } else {
      humidityStatus.textContent = 'Optimal';
      humidityStatus.className = 'metric-status safe';
    }
  } else {
    humidityElement.innerText = "No data";
  }
}, (error) => {
  console.error("Error fetching humidity data:", error);
});

// Dismiss SOS button
dismissSosBtn.addEventListener("click", dismissSOS);


