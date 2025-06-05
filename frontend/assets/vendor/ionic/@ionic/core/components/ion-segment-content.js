/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const segmentContentCss = ":host{scroll-snap-align:center;scroll-snap-stop:always;-ms-flex-negative:0;flex-shrink:0;width:100%;overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none;}:host::-webkit-scrollbar{display:none}";
const IonSegmentContentStyle0 = segmentContentCss;

const SegmentContent = /*@__PURE__*/ proxyCustomElement(class SegmentContent extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '64b3965b14c749e77e9ce13b59f349d971e245c8' }, h("slot", { key: '2d0bed34f9bc93f92e713cb51e42220f3cecd8f5' })));
    }
    static get style() { return IonSegmentContentStyle0; }
}, [1, "ion-segment-content"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-segment-content"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-segment-content":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SegmentContent);
            }
            break;
    } });
}

const IonSegmentContent = SegmentContent;
const defineCustomElement = defineCustomElement$1;

export { IonSegmentContent, defineCustomElement };
