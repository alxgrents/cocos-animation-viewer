export function isGlobalVisible (node: cc.Node): boolean {
    if (node instanceof cc.Scene) {
        return true;
    } if (!node.parent) {
        return false;
    }
    if (!node.isVisible()) {
        return false;
    }
    return isGlobalVisible(node.parent);
}
