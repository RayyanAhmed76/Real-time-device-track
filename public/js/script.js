const socket = io("https://real-time-device-track-918m.onrender.com");
console.log("heyyy");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      console.log("my position", position);
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Geolocation error: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

let map = L.map("map").setView([0, 0], 20);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Rayyan's Map",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    map.setView([latitude, longitude], 18); // only first time
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
