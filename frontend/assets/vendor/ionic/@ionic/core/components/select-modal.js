/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, forceUpdate, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';
import { s as safeCall } from './overlays.js';
import { g as getClassMap } from './theme.js';
import { d as defineCustomElement$d } from './button.js';
import { d as defineCustomElement$c } from './buttons.js';
import { d as defineCustomElement$b } from './checkbox.js';
import { d as defineCustomElement$a } from './content.js';
import { d as defineCustomElement$9 } from './header.js';
import { d as defineCustomElement$8 } from './icon.js';
import { d as defineCustomElement$7 } from './item.js';
import { d as defineCustomElement$6 } from './list.js';
import { d as defineCustomElement$5 } from './radio.js';
import { d as defineCustomElement$4 } from './radio-group.js';
import { d as defineCustomElement$3 } from './ripple-effect.js';
import { d as defineCustomElement$2 } from './title.js';
import { d as defineCustomElement$1 } from './toolbar.js';

const ionicSelectModalMdCss = ".sc-ion-select-modal-ionic-h{height:100%}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(container){display:none}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(label){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-ionic{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-ionic{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-ionic{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}";
const IonSelectModalIonicStyle0 = ionicSelectModalMdCss;

const selectModalIosCss = ".sc-ion-select-modal-ios-h{height:100%}ion-item.sc-ion-select-modal-ios{--inner-padding-end:0}ion-radio.sc-ion-select-modal-ios::after{bottom:0;position:absolute;width:calc(100% - 0.9375rem - 16px);border-width:0px 0px 0.55px 0px;border-style:solid;border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));content:\"\"}ion-radio.sc-ion-select-modal-ios::after{inset-inline-start:calc(0.9375rem + 16px)}";
const IonSelectModalIosStyle0 = selectModalIosCss;

const selectModalMdCss = ".sc-ion-select-modal-md-h{height:100%}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(container){display:none}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(label){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-md{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}";
const IonSelectModalMdStyle0 = selectModalMdCss;

const SelectModal = /*@__PURE__*/ proxyCustomElement(class SelectModal extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.header = undefined;
        this.multiple = undefined;
        this.options = [];
    }
    closeModal() {
        const modal = this.el.closest('ion-modal');
        if (modal) {
            modal.dismiss();
        }
    }
    findOptionFromEvent(ev) {
        const { options } = this;
        return options.find((o) => o.value === ev.target.value);
    }
    getValues(ev) {
        const { multiple, options } = this;
        if (multiple) {
            // this is a modal with checkboxes (multiple value select)
            // return an array of all the checked values
            return options.filter((o) => o.checked).map((o) => o.value);
        }
        // this is a modal with radio buttons (single value select)
        // return the value that was clicked, otherwise undefined
        const option = ev ? this.findOptionFromEvent(ev) : null;
        return option ? option.value : undefined;
    }
    callOptionHandler(ev) {
        const option = this.findOptionFromEvent(ev);
        const values = this.getValues(ev);
        if (option === null || option === void 0 ? void 0 : option.handler) {
            safeCall(option.handler, values);
        }
    }
    setChecked(ev) {
        const { multiple } = this;
        const option = this.findOptionFromEvent(ev);
        // this is a modal with checkboxes (multiple value select)
        // we need to set the checked value for this option
        if (multiple && option) {
            option.checked = ev.detail.checked;
        }
    }
    renderRadioOptions() {
        const checked = this.options.filter((o) => o.checked).map((o) => o.value)[0];
        return (h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, this.options.map((option) => (h("ion-item", { lines: "none", class: Object.assign({
                // TODO FW-4784
                'item-radio-checked': option.value === checked
            }, getClassMap(option.cssClass)) }, h("ion-radio", { value: option.value, disabled: option.disabled, justify: "start", labelPlacement: "end", onClick: () => this.closeModal(), onKeyUp: (ev) => {
                if (ev.key === ' ') {
                    /**
                     * Selecting a radio option with keyboard navigation,
                     * either through the Enter or Space keys, should
                     * dismiss the modal.
                     */
                    this.closeModal();
                }
            } }, option.text))))));
    }
    renderCheckboxOptions() {
        return this.options.map((option) => (h("ion-item", { class: Object.assign({
                // TODO FW-4784
                'item-checkbox-checked': option.checked
            }, getClassMap(option.cssClass)) }, h("ion-checkbox", { value: option.value, disabled: option.disabled, checked: option.checked, justify: "start", labelPlacement: "end", onIonChange: (ev) => {
                this.setChecked(ev);
                this.callOptionHandler(ev);
                // TODO FW-4784
                forceUpdate(this);
            } }, option.text))));
    }
    render() {
        return (h(Host, { key: '885198a9f21884e3bfb9bf0af53e0ee3ae37b231', class: getIonMode(this) }, h("ion-header", { key: 'd8b63726869747ac711e4fda78a50ce46f72970c' }, h("ion-toolbar", { key: '9ab2a4c1480dd74eeae38d7b580a2e87fb71270e' }, this.header !== undefined && h("ion-title", { key: '87a7034385ef57f55cefdd0371dbb66a64827290' }, this.header), h("ion-buttons", { key: '0a35424ea13ca002abc9a43b6138730254f187d0', slot: "end" }, h("ion-button", { key: '238bf40b47128d9aa995d14d9ff9ebcae4f79492', onClick: () => this.closeModal() }, "Close")))), h("ion-content", { key: '4a256f3381f8cabbc7194337b8ae4aa1c3ab1066' }, h("ion-list", { key: 'acd38fc52024632176467ed6a84106a454021544' }, this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions()))));
    }
    get el() { return this; }
    static get style() { return {
        ionic: IonSelectModalIonicStyle0,
        ios: IonSelectModalIosStyle0,
        md: IonSelectModalMdStyle0
    }; }
}, [34, "ion-select-modal", {
        "header": [1],
        "multiple": [4],
        "options": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-select-modal", "ion-button", "ion-buttons", "ion-checkbox", "ion-content", "ion-header", "ion-icon", "ion-item", "ion-list", "ion-radio", "ion-radio-group", "ion-ripple-effect", "ion-title", "ion-toolbar"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-select-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SelectModal);
            }
            break;
        case "ion-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$d();
            }
            break;
        case "ion-buttons":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "ion-checkbox":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "ion-content":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "ion-header":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "ion-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "ion-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "ion-list":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "ion-radio":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "ion-radio-group":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "ion-ripple-effect":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "ion-title":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "ion-toolbar":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SelectModal as S, defineCustomElement as d };
