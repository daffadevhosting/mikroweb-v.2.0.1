/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';

const rowCss = ":host{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}";
const IonRowStyle0 = rowCss;

const Row = /*@__PURE__*/ proxyCustomElement(class Row extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: 'a690022e2abdce6946d24264574e4aa0886a8ea5', class: getIonMode(this) }, h("slot", { key: 'd1a0e831dd1dbfe7877d3ad01d0a3045a5fb29e3' })));
    }
    static get style() { return IonRowStyle0; }
}, [1, "ion-row"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-row"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-row":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Row);
            }
            break;
    } });
}

const IonRow = Row;
const defineCustomElement = defineCustomElement$1;

export { IonRow, defineCustomElement };
