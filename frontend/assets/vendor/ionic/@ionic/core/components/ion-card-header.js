/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { c as createColorClasses } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const cardHeaderIosCss = ":host{--background:transparent;--color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;background:var(--background);color:var(--color)}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host{-webkit-padding-start:20px;padding-inline-start:20px;-webkit-padding-end:20px;padding-inline-end:20px;padding-top:20px;padding-bottom:16px;-ms-flex-direction:column-reverse;flex-direction:column-reverse}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){:host(.card-header-translucent){background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.9);-webkit-backdrop-filter:saturate(180%) blur(30px);backdrop-filter:saturate(180%) blur(30px)}}";
const IonCardHeaderIosStyle0 = cardHeaderIosCss;

const cardHeaderMdCss = ":host{--background:transparent;--color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;background:var(--background);color:var(--color)}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:16px;padding-bottom:16px}::slotted(ion-card-title:not(:first-child)),::slotted(ion-card-subtitle:not(:first-child)){margin-top:8px}";
const IonCardHeaderMdStyle0 = cardHeaderMdCss;

const CardHeader = /*@__PURE__*/ proxyCustomElement(class CardHeader extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.color = undefined;
        this.translucent = false;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '64246b81931203a64d553c788cd736f41e23f37b', class: createColorClasses(this.color, {
                'card-header-translucent': this.translucent,
                'ion-inherit-color': true,
                [mode]: true,
            }) }, h("slot", { key: 'af2da2dfe266889afeb57fac25c6a730558dbba4' })));
    }
    static get style() { return {
        ios: IonCardHeaderIosStyle0,
        md: IonCardHeaderMdStyle0
    }; }
}, [33, "ion-card-header", {
        "color": [513],
        "translucent": [4]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-card-header"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-card-header":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, CardHeader);
            }
            break;
    } });
}

const IonCardHeader = CardHeader;
const defineCustomElement = defineCustomElement$1;

export { IonCardHeader, defineCustomElement };
