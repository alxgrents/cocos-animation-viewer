import 'bootstrap';
import {App} from "./app";

const app = new App();
window.app = app;

Promise.resolve()
    .then(() => app.init())
    .then(() => app.run());