import $ from 'jquery'
import { Coordinator, DeepstreamCoordinator, User, App } from '@yanux/coordinator'

var coordinator = new DeepstreamCoordinator("ws://localhost:6020/deepstream", new App("demo"), new User("jonhdoe", { password: "password123456" }));

coordinator.subscribeUiState(function(state){
    console.log("State Changed: "+state)
    $(".square").css("background-color", state["squareColor"]);
});

$(".red-button").click(function() {
    coordinator.setUiState({squareColor: "red"})
});

$(".blue-button").click(function() {
    coordinator.setUiState({squareColor: "blue"})
});
