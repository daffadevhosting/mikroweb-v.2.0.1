/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const index$1 = require('./index-cc858e97.js');
const theme = require('./theme-d1c573d2.js');
const index$2 = require('./index-073c7cdc.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');

const iosInputPasswordToggleCss = "";
const IonInputPasswordToggleIosStyle0 = iosInputPasswordToggleCss;

const mdInputPasswordToggleCss = "";
const IonInputPasswordToggleMdStyle0 = mdInputPasswordToggleCss;

const InputPasswordToggle = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.togglePasswordVisibility = () => {
            const { inputElRef } = this;
            if (!inputElRef) {
                return;
            }
            inputElRef.type = inputElRef.type === 'text' ? 'password' : 'text';
        };
        this.color = undefined;
        this.showIcon = undefined;
        this.hideIcon = undefined;
        this.type = 'password';
    }
    /**
     * Whenever the input type changes we need to re-run validation to ensure the password
     * toggle is being used with the correct input type. If the application changes the type
     * outside of this component we also need to re-render so the correct icon is shown.
     */
    onTypeChange(newValue) {
        if (newValue !== 'text' && newValue !== 'password') {
            index$1.printIonWarning(`[ion-input-password-toggle] - Only inputs of type "text" or "password" are supported. Input of type "${newValue}" is not compatible.`, this.el);
            return;
        }
    }
    connectedCallback() {
        const { el } = this;
        const inputElRef = (this.inputElRef = el.closest('ion-input'));
        if (!inputElRef) {
            index$1.printIonWarning('[ion-input-password-toggle] - No ancestor ion-input found. This component must be slotted inside of an ion-input.', el);
            return;
        }
        /**
         * Important: Set the type in connectedCallback because the default value
         * of this.type may not always be accurate. Usually inputs have the "password" type
         * but it is possible to have the input to initially have the "text" type. In that scenario
         * the wrong icon will show briefly before switching to the correct icon. Setting the
         * type here allows us to avoid that flicker.
         */
        this.type = inputElRef.type;
    }
    disconnectedCallback() {
        this.inputElRef = null;
    }
    render() {
        var _a, _b;
        const { color, type } = this;
        const mode = ionicGlobal.getIonMode(this);
        const showPasswordIcon = (_a = this.showIcon) !== null && _a !== void 0 ? _a : index$2.eye;
        const hidePasswordIcon = (_b = this.hideIcon) !== null && _b !== void 0 ? _b : index$2.eyeOff;
        const isPasswordVisible = type === 'text';
        return (index.h(index.Host, { key: '1a28e078c83e74c72d8bb8189ece93ec2e3fa3d0', class: theme.createColorClasses(color, {
                [mode]: true,
            }) }, index.h("ion-button", { key: '039d1bab764093bb6fe4a34299b0872abda087fd', mode: mode, color: color, fill: "clear", shape: "round", "aria-checked": isPasswordVisible ? 'true' : 'false', "aria-label": "show password", role: "switch", type: "button", onPointerDown: (ev) => {
                /**
                 * This prevents mobile browsers from
                 * blurring the input when the password toggle
                 * button is activated.
                 */
                ev.preventDefault();
            }, onClick: this.togglePasswordVisibility }, index.h("ion-icon", { key: '26477ee97b808c3d79944bf5e33d4e05f1ae0b3f', slot: "icon-only", "aria-hidden": "true", icon: isPasswordVisible ? hidePasswordIcon : showPasswordIcon }))));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "type": ["onTypeChange"]
    }; }
};
InputPasswordToggle.style = {
    ios: IonInputPasswordToggleIosStyle0,
    md: IonInputPasswordToggleMdStyle0
};

exports.ion_input_password_toggle = InputPasswordToggle;
