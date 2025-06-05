/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { i as inheritAriaAttributes } from './helpers.js';
import { m as menuController } from './index5.js';
import { c as createColorClasses, h as hostContext } from './theme.js';
import { n as menuOutline, o as menuSharp } from './index7.js';
import { c as config } from './index4.js';
import { b as getIonMode } from './ionic-global.js';
import { u as updateVisibility } from './menu-toggle-util.js';
import { d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './ripple-effect.js';

const menuButtonIosCss = ":host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.1;--border-radius:4px;--color:var(--ion-color-primary, #0054e9);--padding-start:5px;--padding-end:5px;min-height:32px;font-size:clamp(31px, 1.9375rem, 38.13px)}:host(.ion-activated){opacity:0.4}@media (any-hover: hover){:host(:hover){opacity:0.6}}";
const IonMenuButtonIosStyle0 = menuButtonIosCss;

const menuButtonMdCss = ":host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.12;--background-hover:currentColor;--background-hover-opacity:.04;--border-radius:50%;--color:initial;--padding-start:8px;--padding-end:8px;width:3rem;height:3rem;font-size:1.5rem}:host(.ion-color.ion-focused)::after{background:var(--ion-color-base)}@media (any-hover: hover){:host(.ion-color:hover) .button-native::after{background:var(--ion-color-base)}}";
const IonMenuButtonMdStyle0 = menuButtonMdCss;

const MenuButton = /*@__PURE__*/ proxyCustomElement(class MenuButton extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.inheritedAttributes = {};
        this.onClick = async () => {
            return menuController.toggle(this.menu);
        };
        this.visible = false;
        this.color = undefined;
        this.disabled = false;
        this.menu = undefined;
        this.autoHide = true;
        this.type = 'button';
    }
    componentWillLoad() {
        this.inheritedAttributes = inheritAriaAttributes(this.el);
    }
    componentDidLoad() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const { color, disabled, inheritedAttributes } = this;
        const mode = getIonMode(this);
        const menuIcon = config.get('menuIcon', mode === 'ios' ? menuOutline : menuSharp);
        const hidden = this.autoHide && !this.visible;
        const attrs = {
            type: this.type,
        };
        const ariaLabel = inheritedAttributes['aria-label'] || 'menu';
        return (h(Host, { key: '3cde3704f28eb275f4a5ff2985bbb68c1024e79c', onClick: this.onClick, "aria-disabled": disabled ? 'true' : null, "aria-hidden": hidden ? 'true' : null, class: createColorClasses(color, {
                [mode]: true,
                button: true, // ion-buttons target .button
                'menu-button-hidden': hidden,
                'menu-button-disabled': disabled,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'ion-activatable': true,
                'ion-focusable': true,
            }) }, h("button", Object.assign({ key: 'a02a3374288bd1759b6e352ada8eab0d45c6422f' }, attrs, { disabled: disabled, class: "button-native", part: "native", "aria-label": ariaLabel }), h("span", { key: 'ba699f2277a4e7b27ce5e42faeefc53d8805bb43', class: "button-inner" }, h("slot", { key: '829fe6cbdeb173f50d1a670389d1565baa6273e4' }, h("ion-icon", { key: 'a9a9f7b8dcffc648a8429fe0adbe766869de72fd', part: "icon", icon: menuIcon, mode: mode, lazy: false, "aria-hidden": "true" }))), mode === 'md' && h("ion-ripple-effect", { key: '48deca9a771a249f2fc76eaa8b9741c8d66d8355', type: "unbounded" }))));
    }
    get el() { return this; }
    static get style() { return {
        ios: IonMenuButtonIosStyle0,
        md: IonMenuButtonMdStyle0
    }; }
}, [33, "ion-menu-button", {
        "color": [513],
        "disabled": [4],
        "menu": [1],
        "autoHide": [4, "auto-hide"],
        "type": [1],
        "visible": [32]
    }, [[16, "ionMenuChange", "visibilityChanged"], [16, "ionSplitPaneVisible", "visibilityChanged"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-menu-button", "ion-icon", "ion-ripple-effect"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-menu-button":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, MenuButton);
            }
            break;
        case "ion-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "ion-ripple-effect":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const IonMenuButton = MenuButton;
const defineCustomElement = defineCustomElement$1;

export { IonMenuButton, defineCustomElement };
