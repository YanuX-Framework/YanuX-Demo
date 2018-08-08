import { App, FeathersCoordinator, User } from '@yanux/coordinator';
import $ from 'jquery';
import * as queryString from 'query-string';

const params = queryString.parse(location.hash);
let url = "http://localhost:3030";
let app = new App(params.app || "demo");
let user = new User("pedro@albuquerques.net", "topsecret");
let coordinator = new FeathersCoordinator(url, app, user);

function setSquareColor(color) {
    if (color) {
        $(".square").css("background-color", color)
    }
}

coordinator.init().then(data => {
    console.log('State:', data);
    if (data) {
        setSquareColor(data["squareColor"]);
    }
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