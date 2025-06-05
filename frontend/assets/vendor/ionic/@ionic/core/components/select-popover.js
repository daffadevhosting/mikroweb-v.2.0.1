/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, forceUpdate, Host } from '@stencil/core/internal/client';
import { s as safeCall } from './overlays.js';
import { g as getClassMap } from './theme.js';
import { b as getIonMode } from './ionic-global.js';
import { d as defineCustomElement$9 } from './checkbox.js';
import { d as defineCustomElement$8 } from './icon.js';
import { d as defineCustomElement$7 } from './item.js';
import { d as defineCustomElement$6 } from './label.js';
import { d as defineCustomElement$5 } from './list.js';
import { d as defineCustomElement$4 } from './list-header.js';
import { d as defineCustomElement$3 } from './radio.js';
import { d as defineCustomElement$2 } from './radio-group.js';
import { d as defineCustomElement$1 } from './ripple-effect.js';

const selectPopoverIosCss = ".sc-ion-select-popover-ios-h ion-list.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-ios,ion-label.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-select-popover-ios-h{overflow-y:auto}";
const IonSelectPopoverIosStyle0 = selectPopoverIosCss;

const selectPopoverMdCss = ".sc-ion-select-popover-md-h ion-list.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-md,ion-label.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-select-popover-md-h{overflow-y:auto}ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md::part(container){display:none}ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md::part(label){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-popover-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-popover-md{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-popover-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}";
const IonSelectPopoverMdStyle0 = selectPopoverMdCss;

const SelectPopover = /*@__PURE__*/ proxyCustomElement(class SelectPopover extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.header = undefined;
        this.subHeader = undefined;
        this.message = undefined;
        this.multiple = undefined;
        this.options = [];
    }
    findOptionFromEvent(ev) {
        const { options } = this;
        return options.find((o) => o.value === ev.target.value);
    }
    /**
     * When an option is selected we need to get the value(s)
     * of the selected option(s) and return it in the option
     * handler
     */
    callOptionHandler(ev) {
        const option = this.findOptionFromEvent(ev);
        const values = this.getValues(ev);
        if (option === null || option === void 0 ? void 0 : option.handler) {
            safeCall(option.handler, values);
        }
    }
    /**
     * Dismisses the host popover that the `ion-select-popover`
     * is rendered within.
     */
    dismissParentPopover() {
        const popover = this.el.closest('ion-popover');
        if (popover) {
            popover.dismiss();
        }
    }
    setChecked(ev) {
        const { multiple } = this;
        const option = this.findOptionFromEvent(ev);
        // this is a popover with checkboxes (multiple value select)
        // we need to set the checked value for this option
        if (multiple && option) {
            option.checked = ev.detail.checked;
        }
    }
    getValues(ev) {
        const { multiple, options } = this;
        if (multiple) {
            // this is a popover with checkboxes (multiple value select)
            // return an array of all the checked values
            return options.filter((o) => o.checked).map((o) => o.value);
        }
        // this is a popover with radio buttons (single value select)
        // return the value that was clicked, otherwise undefined
        const option = this.findOptionFromEvent(ev);
        return option ? option.value : undefined;
    }
    renderOptions(options) {
        const { multiple } = this;
        switch (multiple) {
            case true:
                return this.renderCheckboxOptions(options);
            default:
                return this.renderRadioOptions(options);
        }
    }
    renderCheckboxOptions(options) {
        return options.map((option) => (h("ion-item", { class: Object.assign({
                // TODO FW-4784
                'item-checkbox-checked': option.checked
            }, getClassMap(option.cssClass)) }, h("ion-checkbox", { value: option.value, disabled: option.disabled, checked: option.checked, justify: "start", labelPlacement: "end", onIonChange: (ev) => {
                this.setChecked(ev);
                this.callOptionHandler(ev);
                // TODO FW-4784
                forceUpdate(this);
            } }, option.text))));
    }
    renderRadioOptions(options) {
        const checked = options.filter((o) => o.checked).map((o) => o.value)[0];
        return (h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, options.map((option) => (h("ion-item", { class: Object.assign({
                // TODO FW-4784
                'item-radio-checked': option.value === checked
            }, getClassMap(option.cssClass)) }, h("ion-radio", { value: option.value, disabled: option.disabled, onClick: () => this.dismissParentPopover(), onKeyUp: (ev) => {
                if (ev.key === ' ') {
                    /**
                     * Selecting a radio option with keyboard navigation,
                     * either through the Enter or Space keys, should
                     * dismiss the popover.
                     */
                    this.dismissParentPopover();
                }
            } }, option.text))))));
    }
    render() {
        const { header, message, options, subHeader } = this;
        const hasSubHeaderOrMessage = subHeader !== undefined || message !== undefined;
        return (h(Host, { key: '542367ab8fb72bfebf7e65630b91017d68827fd6', class: getIonMode(this) }, h("ion-list", { key: 'f2f0f37e1365cd7780b02de1a1698700d0df48a7' }, header !== undefined && h("ion-list-header", { key: '4b8800a68e800f19277a44b7074ca24b70218daf' }, header), hasSubHeaderOrMessage && (h("ion-item", { key: '932b7903daf97d5a57d289b7ee49e868bb9b0cf5' }, h("ion-label", { key: 'fc3f1b69aa2a0bc6125d35692dcad3a8a99fd160', class: "ion-text-wrap" }, subHeader !== undefined && h("h3", { key: 'eceab2f47afa95f04b138342b0bdbfa1f50919a8' }, subHeader), message !== undefined && h("p", { key: '70f4e27ad1316318efd0c17efce31e5e45c8fa02' }, message)))), this.renderOptions(options))));
    }
    get el() { return this; }
    static get style() { return {
        ios: IonSelectPopoverIosStyle0,
        md: IonSelectPopoverMdStyle0
    }; }
}, [34, "ion-select-popover", {
        "header": [1],
        "subHeader": [1, "sub-header"],
        "message": [1],
        "multiple": [4],
        "options": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-select-popover", "ion-checkbox", "ion-icon", "ion-item", "ion-label", "ion-list", "ion-list-header", "ion-radio", "ion-radio-group", "ion-ripple-effect"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-select-popover":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SelectPopover);
            }
            break;
        case "ion-checkbox":
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
        case "ion-label":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "ion-list":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "ion-list-header":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "ion-radio":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "ion-radio-group":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "ion-ripple-effect":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SelectPopover as S, defineCustomElement as d };
