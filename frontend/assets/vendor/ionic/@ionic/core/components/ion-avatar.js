/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';

const avatarIosCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:48px;height:48px}";
const IonAvatarIosStyle0 = avatarIosCss;

const avatarMdCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:64px;height:64px}";
const IonAvatarMdStyle0 = avatarMdCss;

const Avatar = /*@__PURE__*/ proxyCustomElement(class Avatar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '998217066084f966bf5d356fed85bcbd451f675a', class: getIonMode(this) }, h("slot", { key: '1a6f7c9d4dc6a875f86b5b3cda6d59cb39587f22' })));
    }
    static get style() { return {
        ios: IonAvatarIosStyle0,
        md: IonAvatarMdStyle0
    }; }
}, [33, "ion-avatar"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-avatar"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-avatar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Avatar);
            }
            break;
    } });
}

const IonAvatar = Avatar;
const defineCustomElement = defineCustomElement$1;

export { IonAvatar, defineCustomElement };
