import { FeathersCoordinator, Credentials } from "@yanux/coordinator";
import $ from "jquery";
import * as queryString from "query-string";

function initDisplay(params) {
    const displayClasses = params.displayClasses || "yx-view, yx-control";
    const hiddenClasses = params.hiddenClasses || "yx-view, yx-control";
    if (hiddenClasses) {
        hiddenClasses.split(",").forEach(c => $("." + c.trim()).css("display", "none"));
    }
    if (displayClasses) {
        displayClasses.split(",").forEach(c => $("." + c.trim()).css("display", "block"));
    }
    $(".yx-always-visible").css("display", "block");
}

function initLogin() {
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
                setTimeout(initLogin, 100);
            })
            setSquareColor(data["squareColor"]);
            setCurrentColorText(data["squareColor"]);
        }
    }).catch(e => {
        console.error(e);
        alert('Try to log back in!')
        coordinator.logout();
        initDisplay(params);
        initLogin();
    });
}

/** ------------------------------------------------------------------------ **/
/** -------------------------- YanuX Coordinator --------------------------- **/
/** ------------------------------------------------------------------------ **/
function main() {
    const params = queryString.parse(location.hash);

    console.log("Params:", params);
    const coordinator = new FeathersCoordinator(
        params.brokerUrl || "http://localhost:3002",
        params.localDeviceUrl || "http://localhost:3003"
    );
    if (!params.access_token) {
        sessionStorage.setItem('hash', window.location.hash);
    }
    initDisplay(params);
    if (coordinator.credentials) {
        initCoordinator(coordinator);
    } else if (params.access_token) {
        coordinator.credentials = new Credentials("yanux", [
            params.access_token,
            params.app || "yanux-demo-app"
        ]);
        coordinator.init().then(data => {
            location.hash = sessionStorage.getItem('hash');
            location.reload();
        });
    } else {
        initLogin();
    }
}

main();