/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { m as menuController } from './index5.js';
import { b as getIonMode } from './ionic-global.js';
import { u as updateVisibility } from './menu-toggle-util.js';

const menuToggleCss = ":host(.menu-toggle-hidden){display:none}";
const IonMenuToggleStyle0 = menuToggleCss;

const MenuToggle = /*@__PURE__*/ proxyCustomElement(class MenuToggle extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.onClick = () => {
            return menuController.toggle(this.menu);
        };
        this.visible = false;
        this.menu = undefined;
        this.autoHide = true;
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const mode = getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (h(Host, { key: '88e88fa13ac7f10ba3acfe378bd11cda0c7e2749', onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, h("slot", { key: '0a14c7b63eda64702d2fd1b4bc7db4809892842d' })));
    }
    static get style() { return IonMenuToggleStyle0; }
}, [1, "ion-menu-toggle", {
        "menu": [1],
        "autoHide": [4, "auto-hide"],
        "visible": [32]
    }, [[16, "ionMenuChange", "visibilityChanged"], [16, "ionSplitPaneVisible", "visibilityChanged"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-menu-toggle"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-menu-toggle":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, MenuToggle);
            }
            break;
    } });
}

const IonMenuToggle = MenuToggle;
const defineCustomElement = defineCustomElement$1;

export { IonMenuToggle, defineCustomElement };
