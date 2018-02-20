import { Coordinator } from '@yanux/coordinator' 
document.body.appendChild(component());

var coordinator = new Coordinator("ws://localhost:6020/deepstream", { username: "john", password: "doe" });