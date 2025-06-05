/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { d as inheritAttributes } from './helpers.js';
import { c as config } from './index4.js';
import { b as getIonMode } from './ionic-global.js';
import { d as defineCustomElement$2 } from './ripple-effect.js';

const tabButtonIosCss = ":host{--ripple-color:var(--color-selected);--background-focused-opacity:1;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;height:100%;outline:none;background:var(--background);color:var(--color)}.button-native{border-radius:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;height:100%;border:0;outline:none;background:transparent;text-decoration:none;cursor:pointer;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-drag:none}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:inherit;flex-flow:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;height:100%;z-index:1}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}@media (any-hover: hover){a:hover{color:var(--color-selected)}}:host(.tab-selected){color:var(--color-selected)}:host(.tab-hidden){display:none !important}:host(.tab-disabled){pointer-events:none;opacity:0.4}::slotted(ion-label),::slotted(ion-icon){display:block;-ms-flex-item-align:center;align-self:center;max-width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}::slotted(ion-label){-ms-flex-order:0;order:0}::slotted(ion-icon){-ms-flex-order:-1;order:-1;height:1em}:host(.tab-has-label-only) ::slotted(ion-label){white-space:normal}::slotted(ion-badge){-webkit-box-sizing:border-box;box-sizing:border-box;position:absolute;z-index:1}:host(.tab-layout-icon-start){-ms-flex-direction:row;flex-direction:row}:host(.tab-layout-icon-end){-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.tab-layout-icon-bottom){-ms-flex-direction:column-reverse;flex-direction:column-reverse}:host(.tab-layout-icon-hide) ::slotted(ion-icon){display:none}:host(.tab-layout-label-hide) ::slotted(ion-label){display:none}ion-ripple-effect{color:var(--ripple-color)}:host{--padding-top:0;--padding-end:2px;--padding-bottom:0;--padding-start:2px;max-width:240px;font-size:10px}::slotted(ion-badge){-webkit-padding-start:6px;padding-inline-start:6px;-webkit-padding-end:6px;padding-inline-end:6px;padding-top:1px;padding-bottom:1px;top:4px;height:auto;font-size:12px;line-height:16px}::slotted(ion-badge){inset-inline-start:calc(50% + 6px)}::slotted(ion-icon){margin-top:2px;margin-bottom:2px;font-size:24px}::slotted(ion-icon::before){vertical-align:top}::slotted(ion-label){margin-top:0;margin-bottom:1px;min-height:11px;font-weight:500}:host(.tab-has-label-only) ::slotted(ion-label){margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:12px;font-size:14px;line-height:1.1}:host(.tab-layout-icon-end) ::slotted(ion-label),:host(.tab-layout-icon-start) ::slotted(ion-label),:host(.tab-layout-icon-hide) ::slotted(ion-label){margin-top:2px;margin-bottom:2px;font-size:14px;line-height:1.1}:host(.tab-layout-icon-end) ::slotted(ion-icon),:host(.tab-layout-icon-start) ::slotted(ion-icon){min-width:24px;height:26px;margin-top:2px;margin-bottom:1px;font-size:24px}:host(.tab-layout-icon-bottom) ::slotted(ion-badge){inset-inline-start:calc(50% + 12px)}:host(.tab-layout-icon-bottom) ::slotted(ion-icon){margin-top:0;margin-bottom:1px}:host(.tab-layout-icon-bottom) ::slotted(ion-label){margin-top:4px}:host(.tab-layout-icon-start) ::slotted(ion-badge),:host(.tab-layout-icon-end) ::slotted(ion-badge){top:10px}:host(.tab-layout-icon-start) ::slotted(ion-badge),:host(.tab-layout-icon-end) ::slotted(ion-badge){inset-inline-start:calc(50% + 35px)}:host(.tab-layout-icon-hide) ::slotted(ion-badge),:host(.tab-has-label-only) ::slotted(ion-badge){top:10px}:host(.tab-layout-icon-hide) ::slotted(ion-badge),:host(.tab-has-label-only) ::slotted(ion-badge){inset-inline-start:calc(50% + 30px)}:host(.tab-layout-label-hide) ::slotted(ion-badge),:host(.tab-has-icon-only) ::slotted(ion-badge){top:10px}:host(.tab-layout-label-hide) ::slotted(ion-icon){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}:host(.tab-layout-label-hide) ::slotted(ion-icon),:host(.tab-has-icon-only) ::slotted(ion-icon){font-size:30px}";
const IonTabButtonIosStyle0 = tabButtonIosCss;

const tabButtonMdCss = ":host{--ripple-color:var(--color-selected);--background-focused-opacity:1;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;height:100%;outline:none;background:var(--background);color:var(--color)}.button-native{border-radius:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;height:100%;border:0;outline:none;background:transparent;text-decoration:none;cursor:pointer;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-drag:none}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:inherit;flex-flow:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;height:100%;z-index:1}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}@media (any-hover: hover){a:hover{color:var(--color-selected)}}:host(.tab-selected){color:var(--color-selected)}:host(.tab-hidden){display:none !important}:host(.tab-disabled){pointer-events:none;opacity:0.4}::slotted(ion-label),::slotted(ion-icon){display:block;-ms-flex-item-align:center;align-self:center;max-width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}::slotted(ion-label){-ms-flex-order:0;order:0}::slotted(ion-icon){-ms-flex-order:-1;order:-1;height:1em}:host(.tab-has-label-only) ::slotted(ion-label){white-space:normal}::slotted(ion-badge){-webkit-box-sizing:border-box;box-sizing:border-box;position:absolute;z-index:1}:host(.tab-layout-icon-start){-ms-flex-direction:row;flex-direction:row}:host(.tab-layout-icon-end){-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.tab-layout-icon-bottom){-ms-flex-direction:column-reverse;flex-direction:column-reverse}:host(.tab-layout-icon-hide) ::slotted(ion-icon){display:none}:host(.tab-layout-label-hide) ::slotted(ion-label){display:none}ion-ripple-effect{color:var(--ripple-color)}:host{--padding-top:0;--padding-end:12px;--padding-bottom:0;--padding-start:12px;max-width:168px;font-size:12px;font-weight:normal;letter-spacing:0.03em}::slotted(ion-label){margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;text-transform:none}::slotted(ion-icon){margin-left:0;margin-right:0;margin-top:16px;margin-bottom:16px;-webkit-transform-origin:center center;transform-origin:center center;font-size:22px}:host-context([dir=rtl]) ::slotted(ion-icon){-webkit-transform-origin:calc(100% - center) center;transform-origin:calc(100% - center) center}[dir=rtl] ::slotted(ion-icon){-webkit-transform-origin:calc(100% - center) center;transform-origin:calc(100% - center) center}@supports selector(:dir(rtl)){::slotted(ion-icon):dir(rtl){-webkit-transform-origin:calc(100% - center) center;transform-origin:calc(100% - center) center}}::slotted(ion-badge){border-radius:8px;-webkit-padding-start:2px;padding-inline-start:2px;-webkit-padding-end:2px;padding-inline-end:2px;padding-top:3px;padding-bottom:2px;top:8px;min-width:12px;font-size:8px;font-weight:normal}::slotted(ion-badge){inset-inline-start:calc(50% + 6px)}::slotted(ion-badge:empty){display:block;min-width:8px;height:8px}:host(.tab-layout-icon-top) ::slotted(ion-icon){margin-top:6px;margin-bottom:2px}:host(.tab-layout-icon-top) ::slotted(ion-label){margin-top:0;margin-bottom:6px}:host(.tab-layout-icon-bottom) ::slotted(ion-badge){top:8px}:host(.tab-layout-icon-bottom) ::slotted(ion-badge){inset-inline-start:70%}:host(.tab-layout-icon-bottom) ::slotted(ion-icon){margin-top:0;margin-bottom:6px}:host(.tab-layout-icon-bottom) ::slotted(ion-label){margin-top:6px;margin-bottom:0}:host(.tab-layout-icon-start) ::slotted(ion-badge),:host(.tab-layout-icon-end) ::slotted(ion-badge){top:16px}:host(.tab-layout-icon-start) ::slotted(ion-badge),:host(.tab-layout-icon-end) ::slotted(ion-badge){inset-inline-start:80%}:host(.tab-layout-icon-start) ::slotted(ion-icon){-webkit-margin-end:6px;margin-inline-end:6px}:host(.tab-layout-icon-end) ::slotted(ion-icon){-webkit-margin-start:6px;margin-inline-start:6px}:host(.tab-layout-icon-hide) ::slotted(ion-badge),:host(.tab-has-label-only) ::slotted(ion-badge){top:16px}:host(.tab-layout-icon-hide) ::slotted(ion-badge),:host(.tab-has-label-only) ::slotted(ion-badge){inset-inline-start:70%}:host(.tab-layout-icon-hide) ::slotted(ion-label),:host(.tab-has-label-only) ::slotted(ion-label){margin-top:0;margin-bottom:0}:host(.tab-layout-label-hide) ::slotted(ion-badge),:host(.tab-has-icon-only) ::slotted(ion-badge){top:16px}:host(.tab-layout-label-hide) ::slotted(ion-icon),:host(.tab-has-icon-only) ::slotted(ion-icon){margin-top:0;margin-bottom:0;font-size:24px}";
const IonTabButtonMdStyle0 = tabButtonMdCss;

const TabButton = /*@__PURE__*/ proxyCustomElement(class TabButton extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.ionTabButtonClick = createEvent(this, "ionTabButtonClick", 7);
        this.inheritedAttributes = {};
        this.onKeyUp = (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                this.selectTab(ev);
            }
        };
        this.onClick = (ev) => {
            this.selectTab(ev);
        };
        this.disabled = false;
        this.download = undefined;
        this.href = undefined;
        this.rel = undefined;
        this.layout = undefined;
        this.selected = false;
        this.tab = undefined;
        this.target = undefined;
    }
    onTabBarChanged(ev) {
        const dispatchedFrom = ev.target;
        const parent = this.el.parentElement;
        if (ev.composedPath().includes(parent) || (dispatchedFrom === null || dispatchedFrom === void 0 ? void 0 : dispatchedFrom.contains(this.el))) {
            this.selected = this.tab === ev.detail.tab;
        }
    }
    componentWillLoad() {
        this.inheritedAttributes = Object.assign({}, inheritAttributes(this.el, ['aria-label']));
        if (this.layout === undefined) {
            this.layout = config.get('tabButtonLayout', 'icon-top');
        }
    }
    selectTab(ev) {
        if (this.tab !== undefined) {
            if (!this.disabled) {
                this.ionTabButtonClick.emit({
                    tab: this.tab,
                    href: this.href,
                    selected: this.selected,
                });
            }
            ev.preventDefault();
        }
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    render() {
        const { disabled, hasIcon, hasLabel, href, rel, target, layout, selected, tab, inheritedAttributes } = this;
        const mode = getIonMode(this);
        const attrs = {
            download: this.download,
            href,
            rel,
            target,
        };
        return (h(Host, { key: 'a86d441d8df350fe991f2f948fc6b6ad007728f7', onClick: this.onClick, onKeyup: this.onKeyUp, id: tab !== undefined ? `tab-button-${tab}` : null, class: {
                [mode]: true,
                'tab-selected': selected,
                'tab-disabled': disabled,
                'tab-has-label': hasLabel,
                'tab-has-icon': hasIcon,
                'tab-has-label-only': hasLabel && !hasIcon,
                'tab-has-icon-only': hasIcon && !hasLabel,
                [`tab-layout-${layout}`]: true,
                'ion-activatable': true,
                'ion-selectable': true,
                'ion-focusable': true,
            } }, h("a", Object.assign({ key: '8dfe1ccff2cf21601c5aea7f7f877c0fbe384e09' }, attrs, { class: "button-native", part: "native", role: "tab", "aria-selected": selected ? 'true' : null, "aria-disabled": disabled ? 'true' : null, tabindex: disabled ? '-1' : undefined }, inheritedAttributes), h("span", { key: '3f557cf6e96e22b9318b4aee19ede810eb7fb720', class: "button-inner" }, h("slot", { key: '836dd090dbe3c2ea97dc263fca7d01dea6ea0eb6' })), mode === 'md' && h("ion-ripple-effect", { key: '488a924fd04602c1b23e03d1a4c84dfa0f2ca03d', type: "unbounded" }))));
    }
    get el() { return this; }
    static get style() { return {
        ios: IonTabButtonIosStyle0,
        md: IonTabButtonMdStyle0
    }; }
}, [33, "ion-tab-button", {
        "disabled": [4],
        "download": [1],
        "href": [1],
        "rel": [1],
        "layout": [1025],
        "selected": [1028],
        "tab": [1],
        "target": [1]
    }, [[8, "ionTabBarChanged", "onTabBarChanged"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-tab-button", "ion-ripple-effect"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-tab-button":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabButton);
            }
            break;
        case "ion-ripple-effect":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const IonTabButton = TabButton;
const defineCustomElement = defineCustomElement$1;

export { IonTabButton, defineCustomElement };
