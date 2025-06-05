/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, h, i as forceUpdate, e as Host, f as getElement } from './index-527b9e34.js';
import { b as getIonMode } from './ionic-global-b26f573e.js';
import { s as safeCall } from './overlays-d99dcb0a.js';
import { g as getClassMap } from './theme-01f3f29c.js';
import './index-cfd9c1f2.js';
import './index-a5d50daf.js';
import './helpers-d94bc8ad.js';
import './hardware-back-button-a7eb8233.js';
import './framework-delegate-56b467ad.js';
import './gesture-controller-314a54f6.js';

const ionicSelectModalMdCss = ".sc-ion-select-modal-ionic-h{height:100%}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(container){display:none}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(label){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-ionic{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-ionic{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-ionic{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}";
const IonSelectModalIonicStyle0 = ionicSelectModalMdCss;

const selectModalIosCss = ".sc-ion-select-modal-ios-h{height:100%}ion-item.sc-ion-select-modal-ios{--inner-padding-end:0}ion-radio.sc-ion-select-modal-ios::after{bottom:0;position:absolute;width:calc(100% - 0.9375rem - 16px);border-width:0px 0px 0.55px 0px;border-style:solid;border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));content:\"\"}ion-radio.sc-ion-select-modal-ios::after{inset-inline-start:calc(0.9375rem + 16px)}";
const IonSelectModalIosStyle0 = selectModalIosCss;

const selectModalMdCss = ".sc-ion-select-modal-md-h{height:100%}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(container){display:none}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(label){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-md{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}";
const IonSelectModalMdStyle0 = selectModalMdCss;

const SelectModal = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
    get el() { return getElement(this); }
};
SelectModal.style = {
    ionic: IonSelectModalIonicStyle0,
    ios: IonSelectModalIosStyle0,
    md: IonSelectModalMdStyle0
};

export { SelectModal as ion_select_modal };
