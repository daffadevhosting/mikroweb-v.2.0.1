/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as inheritAttributes } from './helpers.js';
import { c as createColorClasses } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const pickerColumnOptionIosCss = "button{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;width:100%;height:34px;border:0px;outline:none;background:transparent;color:inherit;font-family:var(--ion-font-family, inherit);font-size:inherit;line-height:34px;text-align:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;overflow:hidden}:host(.option-disabled){opacity:0.4}:host(.option-disabled) button{cursor:default}";
const IonPickerColumnOptionIosStyle0 = pickerColumnOptionIosCss;

const pickerColumnOptionMdCss = "button{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;width:100%;height:34px;border:0px;outline:none;background:transparent;color:inherit;font-family:var(--ion-font-family, inherit);font-size:inherit;line-height:34px;text-align:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;overflow:hidden}:host(.option-disabled){opacity:0.4}:host(.option-disabled) button{cursor:default}:host(.option-active){color:var(--ion-color-base)}";
const IonPickerColumnOptionMdStyle0 = pickerColumnOptionMdCss;

const PickerColumnOption = /*@__PURE__*/ proxyCustomElement(class PickerColumnOption extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        /**
         * We keep track of the parent picker column
         * so we can update the value of it when
         * clicking an enable option.
         */
        this.pickerColumn = null;
        this.ariaLabel = null;
        this.disabled = false;
        this.value = undefined;
        this.color = 'primary';
    }
    /**
     * The aria-label of the option has changed after the
     * first render and needs to be updated within the component.
     *
     * @param ariaLbl The new aria-label value.
     */
    onAriaLabelChange(ariaLbl) {
        this.ariaLabel = ariaLbl;
    }
    componentWillLoad() {
        const inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
        /**
         * The initial value of `aria-label` needs to be set for
         * the first render.
    
         */
        this.ariaLabel = inheritedAttributes['aria-label'] || null;
    }
    connectedCallback() {
        this.pickerColumn = this.el.closest('ion-picker-column');
    }
    disconnectedCallback() {
        this.pickerColumn = null;
    }
    /**
     * The column options can load at any time
     * so the options needs to tell the
     * parent picker column when it is loaded
     * so the picker column can ensure it is
     * centered in the view.
     *
     * We intentionally run this for every
     * option. If we only ran this from
     * the selected option then if the newly
     * loaded options were not selected then
     * scrollActiveItemIntoView would not be called.
     */
    componentDidLoad() {
        const { pickerColumn } = this;
        if (pickerColumn !== null) {
            pickerColumn.scrollActiveItemIntoView();
        }
    }
    /**
     * When an option is clicked, update the
     * parent picker column value. This
     * component will handle centering the option
     * in the column view.
     */
    onClick() {
        const { pickerColumn } = this;
        if (pickerColumn !== null) {
            pickerColumn.setValue(this.value);
        }
    }
    render() {
        const { color, disabled, ariaLabel } = this;
        const mode = getIonMode(this);
        return (h(Host, { key: 'c1353e99c2aa19c0e3ddbe433557ed18e72e1c66', class: createColorClasses(color, {
                [mode]: true,
                ['option-disabled']: disabled,
            }) }, h("button", { key: 'b4ee62ecf7458a07a56e8aa494485766a87a3fcb', tabindex: "-1", "aria-label": ariaLabel, disabled: disabled, onClick: () => this.onClick() }, h("slot", { key: '9ab1e4700c27103b676670a4b3521c183c6ab83d' }))));
    }
    get el() { return this; }
    static get watchers() { return {
        "aria-label": ["onAriaLabelChange"]
    }; }
    static get style() { return {
        ios: IonPickerColumnOptionIosStyle0,
        md: IonPickerColumnOptionMdStyle0
    }; }
}, [33, "ion-picker-column-option", {
        "disabled": [4],
        "value": [8],
        "color": [513],
        "ariaLabel": [32]
    }, undefined, {
        "aria-label": ["onAriaLabelChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-picker-column-option"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-picker-column-option":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, PickerColumnOption);
            }
            break;
    } });
}

export { PickerColumnOption as P, defineCustomElement as d };
