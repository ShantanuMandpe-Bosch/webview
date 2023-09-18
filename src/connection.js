/*const button = document.getElementById("connectButton");
const text = document.getElementById("bluetoothText");

const niclaService = '19b10000-0000-537e-4f6c-d104768a1214';
const bleNusCharRXUUID = '19b10000-1001-537e-4f6c-d104768a1214';

var clicking = 0;
var bluetoothDevice;

button.addEventListener("click", function () {
    if(clicking === 0){
        console.log("Button Clicked");
        bluetoothConnect();
        text.innerHTML("Button Clicked");
        clicking = 1;
    } else {
        onDisconnected();
        clicking = 0;
    }
});

function bluetoothConnect() {
    if (!navigator.bluetooth) {
        console.log('WebBluetooth API is not available.\r\n' +
            'Please make sure the Web Bluetooth flag is enabled.');
        window.term_.io.println('WebBluetooth API is not available on your browser.\r\n' +
            'Please make sure the Web Bluetooth flag is enabled.');
        return;
    } else {
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [niclaService] // Required to access service later.
        })
            .then(device => {
                bluetoothDevice = device;
                console.log(device.name);
                text.innerHTML = device.name
                // Set up event listener for when device gets disconnected.
                bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

                return bluetoothDevice.gatt.connect();
            })
            .then(server => {
                console.log("Getting Primary Service")
                return server.getPrimaryService(niclaService);
            })
            .then(service => {
                console.log("Getting service characteristics")
                // Getting Battery Level Characteristic…
                return service.getCharacteristic(bleNusCharRXUUID);
            })
            .then(characteristic => {
                console.log("reading characteristics")
                return characteristic.readValue();
            })
            .then(value => {
                console.log(`Battery percentage is ${value.getUint8(0)}`);
            })
            .catch(error => { console.error(error); });
    }
}

function onDisconnected() {
    bluetoothDevice.gatt.disconnect();
}*/

console.log("this script has been reached");
    

