// Import Firebase modules using the modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Your Firebase configuration (replace with your actual config values)
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

// References to sensor data and alert in the Firebase Realtime Database
const temperatureRef = ref(db, "temp");      // Adjust to your structure
const humidityRef = ref(db, "humidity");       // Adjust to your structure
const alertRef = ref(db, "alert");             // Boolean alert variable

// SOS Overlay Element
const sosOverlay = document.getElementById("sos-overlay");
const dismissSosBtn = document.getElementById("dismiss-sos");

// Function to trigger the SOS overlay and apply danger theme
function triggerSOS() {
  sosOverlay.classList.remove("hidden");
  document.body.classList.add("danger-theme");
}

// Function to dismiss the SOS overlay and remove danger theme
function dismissSOS() {
  sosOverlay.classList.add("hidden");
  document.body.classList.remove("danger-theme");
}

// Listen for changes on the "alert" variable from Firebase
onValue(alertRef, (snapshot) => {
  const alertStatus = snapshot.val();
  if (alertStatus === true) {
    if (sosOverlay.classList.contains("hidden")) {
      triggerSOS();
    }
  } else {
    dismissSOS();
  }
}, (error) => {
  console.error("Error fetching alert status:", error);
});

// Update DOM when temperature data changes (optional: update sensor readings on page)
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

// Update DOM when humidity data changes (optional)
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

// Dismiss button functionality for SOS overlay
dismissSosBtn.addEventListener("click", dismissSOS);

// Other UI functionalities (navigation, smooth scrolling, etc.) remain as before.
