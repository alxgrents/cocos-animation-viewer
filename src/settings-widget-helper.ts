import {addTouchListener} from "./utils/add-touch-listener";

type WidgetData = {
    node: cc.Node,
    name: string,
    settings: HTMLDivElement,
}

export class SettingsWidgetHelper {
    private readonly loadSprite = document.querySelector<HTMLButtonElement>('#loadSprite');
    private readonly spriteFile = document.querySelector<HTMLInputElement>('#spriteFile');
    private readonly spriteModalClose = document.querySelector<HTMLButtonElement>('#spriteModalClose');

    private readonly loadSpine = document.querySelector<HTMLButtonElement>('#loadSpine');
    private readonly imageFile = document.querySelector<HTMLInputElement>('#imageFile');
    private readonly atlasFile = document.querySelector<HTMLInputElement>('#atlasFile');
    private readonly jsonFile = document.querySelector<HTMLInputElement>('#jsonFile');
    private readonly spineModalClose = document.querySelector<HTMLButtonElement>('#spineModalClose');

    private readonly hotkeyModal = document.querySelector<HTMLDivElement>('#hotkeyModal');

    private readonly elements = document.querySelector<HTMLDivElement>('#elements');

    private scene!: cc.Scene;
    private readonly widgets = new Map<string, WidgetData>;
    private spriteIndex = 1;
    private spineIndex = 1;

    private readonly hotkeys = new Map();

    private _disableKeydown = false;

    init (scene: cc.Scene) {
        this.scene = scene;
        this.loadSprite.addEventListener('click', this._onLoadSprite);
        this.loadSpine.addEventListener('click', this._onLoadSpine);
        this.hotkeyModal.addEventListener('shown.bs.modal', this._onHotkeyModalOpen);
        document.addEventListener('keydown', this._onkeydown, {capture: true});
    }

    _onkeydown = (event) => {
        if (this._disableKeydown) {
            return;
        }

        const key = event.key.toLowerCase();
        console.log('keydown', key);
        const callback = this.hotkeys.get(key);
        if (callback) {
            callback();
        }
    }

    _onHotkeyModalOpen = (event) => {
        this._disableKeydown = true;
        console.log('_onHotkeyModalOpen', event);
        const button = event.relatedTarget;
        const callback = button.parentElement.querySelector('.animation-play').onclick;
        let currentKey = null;
        const onKeydown = (event) => {
            const key = event.key.toLowerCase();
            document.getElementById('hotkeyValue').innerText = key;
            currentKey = key;
            console.log(event.key.toLowerCase());
        };
        document.addEventListener('keydown', onKeydown);

        this.hotkeyModal.addEventListener('hidden.bs.modal', () => {
            document.removeEventListener('keydown', onKeydown);
            if (currentKey) {
                this.hotkeys.set(currentKey, callback);
                button.innerText = currentKey;
            }
            this._disableKeydown = false;
        }, { once: true });
    }

    _onLoadSpine = async () => {
        const image = await this._readAsUrl(this.imageFile);
        const rawAtlas = await this._readAsText(this.atlasFile);

        const dirname = image.match(/\S*\//)[0];
        const imageName = image.split(dirname).pop();

        const atlasText = rawAtlas
            .split('\n')
            .map((row, i) => i === 1 ? imageName : row)
            .join('\n');

        const atlasFile = new File([atlasText], this.atlasFile.files[0].name);
        const atlas = URL.createObjectURL(atlasFile) + `#${this.atlasFile.files[0].name}`;

        const json = await this._readAsUrl(this.jsonFile);

        await new Promise(resolve => {
            cc.loader.load([atlas, json, image], () => console.log(111), resolve);
        });

        const node = sp.SkeletonAnimation.createWithJsonFile(json, atlas, 1);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        const name = `animation_${this.spineIndex++}`;
        node.setName(name);
        this.scene.addChild(node);
        addTouchListener(node, () => this._onTouchNode(node));
        const settings = createSettingsForSprite(node);
        this.elements.append(settings);

        this.widgets.set(name, {
            node,
            name,
            settings,
        });
        this.spineModalClose.click();
    }

    _onLoadSprite = async () => {
        const url = await this._readAsUrl(this.spriteFile);
        const node = new cc.Sprite(url);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        const name = `sprite_${this.spriteIndex++}`;
        node.setName(name);
        this.scene.addChild(node);
        addTouchListener(node, () => this._onTouchNode(node));
        const settings = createSettingsForSprite(node);
        this.elements.append(settings);

        this.widgets.set(name, {
            node,
            name,
            settings,
        });
        this.spriteModalClose.click();
    }

    _onTouchNode (node: cc.Node) {
        console.log(node);
    }

    _readAsText: (input: HTMLInputElement) => Promise<string> = (input) => {
        return new Promise(resolve => {
            const reader = new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    resolve(reader.result as string);
                });

            reader.readAsText(input.files[0], 'utf-8');
        });
    }

    _readAsUrl: (input: HTMLInputElement) => Promise<string> = (input) => {
        return new Promise(resolve => {
            const file = input.files[0];
            const url = URL.createObjectURL(file) + `#${file.name}`;
            console.log(file.name, url);
            resolve(url);
        });
    }
}

function isCheckbox (input: HTMLInputElement) {
    return input.type === 'checkbox';
}

function showValue (node: cc.Node, input: HTMLInputElement) {
    if (isCheckbox(input)) {
        input.checked = {
            visible: node.isVisible(),
        }[input.name];
    } else {
        input.value = {
            x: node.getPositionX(),
            y: node.getPositionY(),
            scale: node.getScale(),
            opacity: node.getOpacity(),
            zindex: node.getLocalZOrder(),
        }[input.name];
    }
}

function setValue (node: cc.Node, input: HTMLInputElement) {
    const value = isCheckbox(input)
        ? input.checked
        : parseFloat(input.value)
    if (Number.isNaN(value)) {
        return;
    }
    console.log(input.value, value);

    return {
        x: () => node.setPositionX(value),
        y: () => node.setPositionY(value),
        zindex: () => node.setLocalZOrder(value),
        scale: () => node.setScale(value),
        opacity: () => node.setOpacity(value),
        visible: () => node.setVisible(value),
    }[input.name]();
}

function createSettingsForSprite (node: cc.Node): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = `
        <p>${node.getName()}</p>
        <label for="x">x:</label><input class="node-property" type="text" name="x" class="x"><br>
        <label for="y">y:</label><input class="node-property" type="text" name="y" class="y"><br>
        <label for="scale">scale:</label><input class="node-property" type="text" name="scale" class="scale"><br>
        <label for="zindex">zindex:</label><input class="node-property" type="text" name="zindex" class="zindex"><br>
        <label for="opacity">opacity:</label><input class="node-property" type="text" name="opacity" class="opacity"><br>
        <label for="visible">visible:</label><input class="node-property" type="checkbox" name="visible" class="visible"><br>
    `;
    if (node instanceof sp.SkeletonAnimation) {
        const animations = node._skeleton.data.animations;
        animations.forEach((animation, i) => {
            const data = {
                track: 0,
                loop: false,
                started: false,
                startedTrack: 0,
            };
            const animationSetting = document.createElement('div');
            animationSetting.classList.add('animation-setting');
            animationSetting.innerHTML = `
                <b>${i+1}  ${animation.name} </b>  
                <i>track</i>
                <input width="30px" type="text" value="0" class="animation-track">
                <i>loop</i>
                <input type="checkbox" class="animation-loop">
                <button width="30px" class="animation-play">⏵</button>
                <button width="30px" class="hotkey-bind" data-bs-toggle="modal" data-bs-target="#hotkeyModal">⏺</button>
            `;
            const track = animationSetting.querySelector<HTMLInputElement>('.animation-track');
            track.addEventListener('input', () => {
                const value = parseInt(track.value);
                if (!Number.isNaN(value)) {
                    data.track = value;
                }
            });
            const loop = animationSetting.querySelector<HTMLInputElement>('.animation-loop');
            loop.addEventListener('input', () => {
                data.loop = loop.checked;
            });
            const play = animationSetting.querySelector<HTMLInputElement>('.animation-play');
            const start = () => {
                data.startedTrack = data.track;
                const trackEntry = node.setAnimation(data.startedTrack, animation.name, data.loop);
                data.started = true;
                play.innerHTML = '⏯';

                if (!data.loop) {
                    node.setTrackCompleteListener(trackEntry, () => {
                        data.started = false;
                        play.innerHTML = '⏵'
                    });
                }
            };
            const restart = () => {
                node.clearTrack(data.startedTrack);

                start();
            }
            play.onclick = () => {
                if (data.started) {
                    restart();
                } else {
                    start();
                }
            };

            div.append(animationSetting);
        });
    }
    div.classList.add('settings-element');

    div.querySelectorAll<HTMLInputElement>('.node-property').forEach((input) => {
        showValue(node, input);
        input.addEventListener('input', () => setValue(node, input));
    });

    return div;
}

