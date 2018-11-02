import { FeathersCoordinator, Credentials } from "@yanux/coordinator";
import $ from "jquery";
import _ from "lodash";
import * as queryString from "query-string";

window.$ = $;
const defaultComponentsConfig = {
    view: false,
    control: false
}
window.defaultComponentsConfig = defaultComponentsConfig;

function initDisplay(params) {
    const displayClasses = params.displayClasses || "yx-view, yx-control";
    const hiddenClasses = params.hiddenClasses || "yx-view, yx-control";

    hiddenClasses.split(",").forEach(c => {
        $("." + c.trim()).css("display", "none");
    });

    displayClasses.split(",").forEach(c => {
        $("." + c.trim()).css("display", "block")
    });

    if ($(".yx-view").css("display") === 'block') {
        defaultComponentsConfig.view = true;
    } else {
        defaultComponentsConfig.view = false;
    }

    if ($(".yx-control").css("display") === 'block') {
        defaultComponentsConfig.control = true;
    } else {
        defaultComponentsConfig.control = false;
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
        coordinator.subscribeResource(data => {
            console.log("Data Changed:", data);
            setSquareColor(data["squareColor"]);
            setCurrentColorText(data["squareColor"]);
        });

        coordinator.subscribeProxemics(proxemics => {
            const localDeviceUuid = coordinator.device.deviceUuid;
            console.log("Proxemics:", proxemics);
            const componentsDistribution = _.cloneDeep(proxemics);
            let componentsConfig;
            if (proxemics[localDeviceUuid]) {
                const viewAndControlDevices = _.pickBy(proxemics, caps => {
                    return caps.view === true && caps.control === true
                });
                const viewOnlyDevices = _.pickBy(proxemics, caps => {
                    return caps.view === true && caps.control === false
                });
                const controlOnlyDevices = _.pickBy(proxemics, caps => {
                    return caps.view === false && caps.control === true
                });
                if (!_.isEmpty(viewOnlyDevices)) {
                    for (let deviceUuid in viewAndControlDevices) {
                        componentsDistribution[deviceUuid].view = false;
                    }
                }
                if (!_.isEmpty(controlOnlyDevices)) {
                    for (let deviceUuid in viewAndControlDevices) {
                        componentsDistribution[deviceUuid].control = false;
                    }
                }
                componentsConfig = componentsDistribution[localDeviceUuid];
            } else {
                componentsConfig = defaultComponentsConfig;
            }
            console.log("Components Config:",componentsConfig);
            if(componentsConfig.view) {
                $(".yx-view").css("display","block");
            } else {
                $(".yx-view").css("display","none");
            }
            if(componentsConfig.control) {
                $(".yx-control").css("display","block");
            } else {
                $(".yx-control").css("display","none");
            }
            $(".yx-always-visible").css("display", "block");
        });

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