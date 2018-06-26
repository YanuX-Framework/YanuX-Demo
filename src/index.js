import { App, FeathersCoordinator, User } from '@yanux/coordinator';
import $ from 'jquery';

let url = "http://localhost:3030";
let app = new App("demo");
let user = new User("pedro@albuquerques.net", "topsecret");
let coordinator = new FeathersCoordinator(url, app, user);

function setSquareColor(color) {
    if (color) {
        $(".square").css("background-color", color)
    }
}

coordinator.init().then(data => {
    console.log('State:', data);
    setSquareColor(data["squareColor"]);
});

coordinator.subscribe(data => {
    console.log('Data Changed: ', data);
    setSquareColor(data["squareColor"]);
})

$(".red-button").click(function (evt) {
    console.log("Clicked Red Button:", evt);
    coordinator.setData({ squareColor: "red" });
});

$(".blue-button").click(function (evt) {
    console.log("Clicked Blue Button:", evt);
    coordinator.setData({ squareColor: "blue" });
});