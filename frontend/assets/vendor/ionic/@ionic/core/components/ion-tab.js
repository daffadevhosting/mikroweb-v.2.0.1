/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, Build, h, Host } from '@stencil/core/internal/client';
import { a as attachComponent } from './framework-delegate.js';
import { p as printIonError } from './index4.js';

const tabCss = ":host(.tab-hidden){display:none !important}";
const IonTabStyle0 = tabCss;

const Tab = /*@__PURE__*/ proxyCustomElement(class Tab extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.loaded = false;
        this.active = false;
        this.delegate = undefined;
        this.tab = undefined;
        this.component = undefined;
    }
    async componentWillLoad() {
        if (Build.isDev) {
            if (this.component !== undefined && this.el.childElementCount > 0) {
                printIonError('[ion-tab] - You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
                    `- Remove the component attribute in: <ion-tab component="${this.component}">` +
                    ` or` +
                    `- Remove the embedded content inside the ion-tab: <ion-tab></ion-tab>`);
            }
        }
        if (this.active) {
            await this.setActive();
        }
    }
    /** Set the active component for the tab */
    async setActive() {
        await this.prepareLazyLoaded();
        this.active = true;
    }
    changeActive(isActive) {
        if (isActive) {
            this.prepareLazyLoaded();
        }
    }
    prepareLazyLoaded() {
        if (!this.loaded && this.component != null) {
            this.loaded = true;
            try {
                return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
            }
            catch (e) {
                printIonError('[ion-tab] - Exception in prepareLazyLoaded:', e);
            }
        }
        return Promise.resolve(undefined);
    }
    render() {
        const { tab, active, component } = this;
        return (h(Host, { key: 'c36c113e74e12b58459df9e3b546ad4856187e90', role: "tabpanel", "aria-hidden": !active ? 'true' : null, "aria-labelledby": `tab-button-${tab}`, class: {
                'ion-page': component === undefined,
                'tab-hidden': !active,
            } }, h("slot", { key: '0d7821dac70ba7a12edfb3331988f3df1566cc1a' })));
    }
    get el() { return this; }
    static get watchers() { return {
        "active": ["changeActive"]
    }; }
    static get style() { return IonTabStyle0; }
}, [1, "ion-tab", {
        "active": [1028],
        "delegate": [16],
        "tab": [1],
        "component": [1],
        "setActive": [64]
    }, undefined, {
        "active": ["changeActive"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-tab":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Tab);
            }
            break;
    } });
}

const IonTab = Tab;
const defineCustomElement = defineCustomElement$1;

export { IonTab, defineCustomElement };
