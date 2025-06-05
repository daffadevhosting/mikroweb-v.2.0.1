/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { c as createColorClasses } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const cardSubtitleIosCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, var(--ion-text-color-step-400, #666666));margin-left:0;margin-right:0;margin-top:0;margin-bottom:4px;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:0.75rem;font-weight:700;letter-spacing:0.4px;text-transform:uppercase}";
const IonCardSubtitleIosStyle0 = cardSubtitleIosCss;

const cardSubtitleMdCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-550, var(--ion-text-color-step-450, #737373));margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:0.875rem;font-weight:500}";
const IonCardSubtitleMdStyle0 = cardSubtitleMdCss;

const CardSubtitle = /*@__PURE__*/ proxyCustomElement(class CardSubtitle extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.color = undefined;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '84d820a19d9074f9c8bc61ccba1ca40062a60b73', role: "heading", "aria-level": "3", class: createColorClasses(this.color, {
                'ion-inherit-color': true,
                [mode]: true,
            }) }, h("slot", { key: 'e4d07d395a1f4469a90847636083101b32b776a1' })));
    }
    static get style() { return {
        ios: IonCardSubtitleIosStyle0,
        md: IonCardSubtitleMdStyle0
    }; }
}, [33, "ion-card-subtitle", {
        "color": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-card-subtitle"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-card-subtitle":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, CardSubtitle);
            }
            break;
    } });
}

const IonCardSubtitle = CardSubtitle;
const defineCustomElement = defineCustomElement$1;

export { IonCardSubtitle, defineCustomElement };
