import { isGlobalVisible } from './is-global-visible';

export function addTouchListener (node: cc.Node, callback: () => any) {
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: (touch) => isGlobalVisible(node)
            && cc.rectContainsPoint(node.getBoundingBoxToWorld(), touch.getLocation()),
        onTouchEnded: (touch) => isGlobalVisible(node)
            && cc.rectContainsPoint(node.getBoundingBoxToWorld(), touch.getLocation()) && callback(),
    }), node);
}
