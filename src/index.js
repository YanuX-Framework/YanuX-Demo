import { FeathersCoordinator, Credentials } from "@yanux/coordinator";
import $ from "jquery";
import * as queryString from "query-string";

function initUi(params) {
    yxDisplay(params.displayClasses || null, params.hiddenClasses || null /* "yx-view, yx-control" */);
    $("#login a").text("Login");
    $("#login a").attr(
        "href",
        "http://localhost:3001/oauth2/authorize?client_id=yanux-demo-app&response_type=token&redirect_uri=" + window.location.href
    );
}

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
function yxDisplay(displayClasses, hiddenClasses) {
    if (hiddenClasses) {
        hiddenClasses.split(",").forEach(c => $("." + c.trim()).css("display", "none"));
    }
    if (displayClasses) {
        displayClasses.split(",").forEach(c => $("." + c.trim()).css("display", "block"));
    }
    $(".yx-always-visible").css("display", "block");
}

function initCoordinator(coordinator) {
    coordinator.init().then(data => {
        coordinator.subscribe(data => {
            console.log("Data Changed:", data);
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

        if (data) {
            console.log("State:", data);
            console.log("User:", coordinator.user)
            $("#welcome").append(coordinator.user.email);
            $("#login a").text("Logout");
            $("#login a").click(() => {
                coordinator.logout();
                $("#login a").text("Login");
            })
            setSquareColor(data["squareColor"]);
            setCurrentColorText(data["squareColor"]);
        }
    }).catch(e => {
        console.log(e);
        alert('Try to log back in!')
        coordinator.logout();
        initUi(params);
    });
}

/** ------------------------------------------------------------------------ **/
/** -------------------------- YanuX Coordinator --------------------------- **/
/** ------------------------------------------------------------------------ **/
function main() {
    const params = queryString.parse(location.hash);
    console.log("Params:", params);
    const coordinator = new FeathersCoordinator(
        params.url || "http://localhost:3002",
    );
    //window.coordinator = coordinator;
    if (coordinator.credentials) {
        initCoordinator(coordinator);
    } else if (params.access_token) {
        coordinator.credentials = new Credentials("yanux", [
            params.access_token,
            params.app || "yanux-demo-app"
        ]);
        initCoordinator(coordinator);
    } else {
        initUi(params);
    }
}

main();