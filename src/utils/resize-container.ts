import { COCOS_CONFIG } from '../cocos-config';

type ResizeContainerParams = {
    container?: HTMLElement,
    cocos2dGameContainer?: HTMLElement,
    canvas: HTMLElement,
};

export function resizeContainer ({
    cocos2dGameContainer,
    container,
}: ResizeContainerParams) {
    const height = window.innerHeight - 4;
    const maxWidth = 590;
    const isMobile = window.innerWidth < maxWidth;
    const widthByHeight = height * 0.8;
    const width = isMobile
        ? window.innerWidth
        : Math.min(maxWidth, widthByHeight);
    const isFixed = !isMobile && width !== widthByHeight;

    console.log(width, height);

    if (cocos2dGameContainer) {
        cocos2dGameContainer.style.width = `${width}px`;
        cocos2dGameContainer.style.height = `${height}px`;
    }
    if (container) {
        container.setAttribute('width', `${width}px`);
        container.setAttribute('height', `${height}px`);

        const borderLeft = document.getElementById('border-left');
        const borderRight = document.getElementById('border-right');

        const margin = Math.max(0, (window.innerWidth - width) / 2);
        container.style.marginLeft = `${margin}px`;
        container.style.marginRight = `${margin}px`;

        if (borderLeft && borderRight) {
            borderLeft.style.left = `${margin - 30}px`;
            borderRight.style.left = `${margin + container.clientWidth}px`;
            borderLeft.style.height = `${container.clientHeight}px`;
            borderRight.style.height = `${container.clientHeight}px`;
        }
    }

    if (cc.view) {
        cc.view.resizeWithBrowserSize(false);

        const policy = (isMobile || isFixed)
            ? cc.ResolutionPolicy.FIXED_WIDTH
            : cc.ResolutionPolicy.SHOW_ALL;

        cc.view.setDesignResolutionSize(COCOS_CONFIG.width, COCOS_CONFIG.height, policy);
    }
}
