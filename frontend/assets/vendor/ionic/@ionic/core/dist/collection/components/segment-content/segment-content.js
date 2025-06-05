/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
export class SegmentContent {
    render() {
        return (h(Host, { key: '64b3965b14c749e77e9ce13b59f349d971e245c8' }, h("slot", { key: '2d0bed34f9bc93f92e713cb51e42220f3cecd8f5' })));
    }
    static get is() { return "ion-segment-content"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["segment-content.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["segment-content.css"]
        };
    }
}
