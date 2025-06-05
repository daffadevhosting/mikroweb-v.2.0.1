/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';

const selectOptionCss = ":host{display:none}";
const IonSelectOptionStyle0 = selectOptionCss;

const SelectOption = /*@__PURE__*/ proxyCustomElement(class SelectOption extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.inputId = `ion-selopt-${selectOptionIds++}`;
        this.disabled = false;
        this.value = undefined;
    }
    render() {
        return h(Host, { key: '8c96c199ce3a3065de3fe446500f567236e0610a', role: "option", id: this.inputId, class: getIonMode(this) });
    }
    get el() { return this; }
    static get style() { return IonSelectOptionStyle0; }
}, [1, "ion-select-option", {
        "disabled": [4],
        "value": [8]
    }]);
let selectOptionIds = 0;
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-select-option"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-select-option":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SelectOption);
            }
            break;
    } });
}

const IonSelectOption = SelectOption;
const defineCustomElement = defineCustomElement$1;

export { IonSelectOption, defineCustomElement };
