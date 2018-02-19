import _ from 'lodash';
import { Coordinator } from '@yanux/coordinator'

function component() {
    var element = document.createElement('div');
    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}
 
document.body.appendChild(component());

var coordinator = new Coordinator("ws://localhost:6020/deepstream", { username: "john", password: "doe" });