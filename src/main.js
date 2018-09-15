// navigator.bluetooth.requestDevice({
//
//   optionalServices: ['generic_access'],acceptAllDevices:true
// })
//         .then(device => {
//             console.log('> Found ' + device.name);
//             console.log('Connecting to GATT Server...');
//             device.addEventListener('gattserverdisconnected', onDisconnected)
//             return device.gatt.connect();
//         })
