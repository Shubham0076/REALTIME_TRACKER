const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((Position)=>{
        const {latitude,longitude} = Position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy: true,
        timeout:5000,
        maximumAge:0, 
    });
}

const map = L.map("map").setView([0,0],20);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map)  

const markers = {};

socket.on("receive-location",(data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude],20);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});
socket.on("user-disconnected",() => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})