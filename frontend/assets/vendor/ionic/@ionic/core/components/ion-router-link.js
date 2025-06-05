/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { o as openURL, c as createColorClasses } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const routerLinkCss = ":host{--background:transparent;--color:var(--ion-color-primary, #0054e9);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}";
const IonRouterLinkStyle0 = routerLinkCss;

const RouterLink = /*@__PURE__*/ proxyCustomElement(class RouterLink extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.onClick = (ev) => {
            openURL(this.href, ev, this.routerDirection, this.routerAnimation);
        };
        this.color = undefined;
        this.href = undefined;
        this.rel = undefined;
        this.routerDirection = 'forward';
        this.routerAnimation = undefined;
        this.target = undefined;
    }
    render() {
        const mode = getIonMode(this);
        const attrs = {
            href: this.href,
            rel: this.rel,
            target: this.target,
        };
        return (h(Host, { key: '11183264fb6ae0db9a7a47c71b6862d60001b834', onClick: this.onClick, class: createColorClasses(this.color, {
                [mode]: true,
                'ion-activatable': true,
            }) }, h("a", Object.assign({ key: '3e0e5242161cb0df593d6d573e51b8ba750065a1' }, attrs), h("slot", { key: '5bd808e98a4627bb1236f0d955f4b32971355417' }))));
    }
    static get style() { return IonRouterLinkStyle0; }
}, [1, "ion-router-link", {
        "color": [513],
        "href": [1],
        "rel": [1],
        "routerDirection": [1, "router-direction"],
        "routerAnimation": [16],
        "target": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-router-link"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-router-link":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, RouterLink);
            }
            break;
    } });
}

const IonRouterLink = RouterLink;
const defineCustomElement = defineCustomElement$1;

export { IonRouterLink, defineCustomElement };
