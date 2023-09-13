import {App} from "../src/app";

declare global {
    interface Window {
        cc: typeof cc,
        spine: typeof spine;
        app: App;

        sp: typeof sp;
        ccui: typeof ccui;
    }
}