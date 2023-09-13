import { COCOS_CONFIG } from './cocos-config';
import './main.less';
import {SettingsWidgetHelper} from "./settings-widget-helper";

export class App {
    public readonly container: HTMLElement = document.getElementById('app-container');

    public readonly canvas: HTMLElement = document.getElementById('app');

    private cocos2dGameContainer!: HTMLElement;

    public settingsWidgetHelper = new SettingsWidgetHelper;

    public scene!: cc.Scene;

    async _runGame () {
        this._resize();
        const startPromise = new Promise<void>((resolve) => {
            cc.game.onStart = () => resolve();
        });
        cc.game.run(COCOS_CONFIG);
        cc.view.setDesignResolutionSize(COCOS_CONFIG.width, COCOS_CONFIG.height, cc.ResolutionPolicy.FIXED_HEIGHT);
        await startPromise;
        this.cocos2dGameContainer = document.getElementById('Cocos2dGameContainer');
        this._resize();
    }

    async init () {
        await this._runGame();
        console.log('game load');

        this._resize();
        window.addEventListener('resize', this._resize);

        this.scene = new cc.Scene();
    }

    _resize = () => {
        // resizeContainer({
        //     canvas: this.canvas,
        //     container: this.container,
        //     cocos2dGameContainer: this.cocos2dGameContainer,
        // });
    }

    async run () {
        const colorBg = cc.LayerColor.create(cc.color('#ffffff'), 2000, 2000);
        this.scene.addChild(colorBg, -1);
        const colorPicker = document.querySelector<HTMLInputElement>('#colorPicker');
        colorPicker.addEventListener('input', () => {
            colorBg.setColor(cc.color(colorPicker.value));
        });
        cc.director.runScene(this.scene);
        this.settingsWidgetHelper.init(this.scene);
    }
}
