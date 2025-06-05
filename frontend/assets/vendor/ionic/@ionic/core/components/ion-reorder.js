/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reorderThreeOutline, s as reorderTwoSharp } from './index7.js';
import { b as getIonMode } from './ionic-global.js';
import { d as defineCustomElement$2 } from './icon.js';

const reorderIosCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block}::slotted(ion-icon){font-size:dynamic-font(16px)}.reorder-icon{font-size:2.125rem;opacity:0.4}";
const IonReorderIosStyle0 = reorderIosCss;

const reorderMdCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block}::slotted(ion-icon){font-size:dynamic-font(16px)}.reorder-icon{font-size:1.9375rem;opacity:0.3}";
const IonReorderMdStyle0 = reorderMdCss;

const Reorder = /*@__PURE__*/ proxyCustomElement(class Reorder extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    onClick(ev) {
        const reorderGroup = this.el.closest('ion-reorder-group');
        ev.preventDefault();
        // Only stop event propagation if the reorder is inside of an enabled
        // reorder group. This allows interaction with clickable children components.
        if (!reorderGroup || !reorderGroup.disabled) {
            ev.stopImmediatePropagation();
        }
    }
    render() {
        const mode = getIonMode(this);
        const reorderIcon = mode === 'ios' ? reorderThreeOutline : reorderTwoSharp;
        return (h(Host, { key: '17adf3165f4e09283d5d6434d7cd47bd23519048', class: mode }, h("slot", { key: 'd00d1cd97c689fc5c7b7175a2051cf697fe22871' }, h("ion-icon", { key: 'eec219aebde6083de98358be3e75965c5a5dc3d0', icon: reorderIcon, lazy: false, class: "reorder-icon", part: "icon", "aria-hidden": "true" }))));
    }
    get el() { return this; }
    static get style() { return {
        ios: IonReorderIosStyle0,
        md: IonReorderMdStyle0
    }; }
}, [33, "ion-reorder", undefined, [[2, "click", "onClick"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-reorder", "ion-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-reorder":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Reorder);
            }
            break;
        case "ion-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const IonReorder = Reorder;
const defineCustomElement = defineCustomElement$1;

export { IonReorder, defineCustomElement };
