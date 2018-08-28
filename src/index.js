import { App, FeathersCoordinator, User } from '@yanux/coordinator';
import $ from 'jquery';
import * as queryString from 'query-string';

const params = queryString.parse(location.hash);
let url = "http://localhost:3030";

function yxDisplay(displayClasses, hiddenClasses) {
    if (hiddenClasses) {
        hiddenClasses.split(',').forEach(c => $("." + c.trim()).css("display", "none"));
    }
    if (displayClasses) {
        displayClasses.split(',').forEach(c => $("." + c.trim()).css("display", "block"));
    }
    $(".yx-always-visible").css("display", "block");
}
yxDisplay(params.displayClasses || null, params.hiddenClasses || "yx-view, yx-control");
/** ------------------------------------------------------------------------ **/
/** -------------------------- YanuX Coordinator --------------------------- **/
/** ------------------------------------------------------------------------ **/
let app = new App(params.app || "demo");
let user = new User(params.username || "test_user_0@yanux.org", params.password || "topsecret");
$("#welcome").append(user.username);

let coordinator = new FeathersCoordinator(params.url || url, app, user);
function setSquareColor(color) {
    if (color) {
        $(".square").css("background-color", color)
    }
}

function setCurrentColorText(color) {
    if (color) {
        $("#current-color").text(color);
    }
}

coordinator.init().then(data => {
    console.log('State:', data);
    if (data) {
        setSquareColor(data["squareColor"]);
        setCurrentColorText(data["squareColor"]);
    }
});

coordinator.subscribe(data => {
    console.log('Data Changed: ', data);
    setSquareColor(data["squareColor"]);
    setCurrentColorText(data["squareColor"]);
})

$(".red-button").click(function (evt) {
    console.log("Clicked Red Button:", evt);
    coordinator.setData({ squareColor: "#ff0000" });
});

$(".green-button").click(function (evt) {
    console.log("Clicked Green Button:", evt);
    coordinator.setData({ squareColor: "#00ff00" });
});

$(".blue-button").click(function (evt) {
    console.log("Clicked Blue Button:", evt);
    coordinator.setData({ squareColor: "#0000ff" });
});

/** ------------------------------------------------------------------------ **/
/** -------------------------- Web Bluetooth API --------------------------- **/
/** ------------------------------------------------------------------------ **/
 /** NOTE: This could actually work and possibly replace the need of
 * platform specific code once the following conditions are met:
 * - watchAdvertisements() is actually implemented in at least one
 * browser for each of the most common end-user platforms (e.g.,
 * Google Chrome on Windows, Linux, macOS, Android and iOS)
 * - It becomes possible to scan for nearby advertisements without
 * user intervention. I understand that there are privacy concerns,
 * but asking for permission once the page is loaded should be more
 * than enough.
 * - The standard should mature and become more than just a draft.
 * So far the only browser vendor interested in the Web Bluetooth API
 * seems to be Google, yet Chrome doesn't have it enabled across all
 * platforms. Some are unsupported (e.g., Windows) and others are
 * experimental and hidden behind a flag (e.g., Linux) Mozilla and 
 * Microsoft have not implemented it yet and they don't seem to be very
 * interested in doing so. Opera, since it relies on Chromium/Blink, has
 * it working as well. I supposse that other Chromium-based browsers can
 * also just enable or provide a flag if they want it to.
 **/
/* function webBluetoothApi() {
    navigator.bluetooth.requestDevice({
        "acceptAllDevices": true
    }).then(device => {
        console.log('Device Found:', device);
       
        device.watchAdvertisements();
        device.addEventListener('advertisementreceived', interpretIBeacon);
    });
    function interpretIBeacon(event) {
        var rssi = event.rssi;
        var ibeaconData = event.manufacturerData.get(0x004C);
        if (ibeaconData.byteLength != 23 ||
            ibeaconData.getUint16(0, false) !== 0x0215) {
            console.log({ isBeacon: false });
        }
        var uuidArray = new Uint8Array(ibeaconData.buffer, 2, 16);
        var major = ibeaconData.getUint16(18, false);
        var minor = ibeaconData.getUint16(20, false);
        var txPowerAt1m = -ibeaconData.getInt8(22);
        console.log({
            isBeacon: true,
            uuidArray,
            major,
            minor,
            pathLossVs1m: txPowerAt1m - rssi
        });
    };
}; */