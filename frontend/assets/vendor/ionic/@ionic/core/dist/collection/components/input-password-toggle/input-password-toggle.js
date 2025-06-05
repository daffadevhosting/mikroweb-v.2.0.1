/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { printIonWarning } from "../../utils/logging/index";
import { createColorClasses } from "../../utils/theme";
import { eyeOff, eye } from "ionicons/icons";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class InputPasswordToggle {
    constructor() {
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
            printIonWarning(`[ion-input-password-toggle] - Only inputs of type "text" or "password" are supported. Input of type "${newValue}" is not compatible.`, this.el);
            return;
        }
    }
    connectedCallback() {
        const { el } = this;
        const inputElRef = (this.inputElRef = el.closest('ion-input'));
        if (!inputElRef) {
            printIonWarning('[ion-input-password-toggle] - No ancestor ion-input found. This component must be slotted inside of an ion-input.', el);
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
        const mode = getIonMode(this);
        const showPasswordIcon = (_a = this.showIcon) !== null && _a !== void 0 ? _a : eye;
        const hidePasswordIcon = (_b = this.hideIcon) !== null && _b !== void 0 ? _b : eyeOff;
        const isPasswordVisible = type === 'text';
        return (h(Host, { key: '1a28e078c83e74c72d8bb8189ece93ec2e3fa3d0', class: createColorClasses(color, {
                [mode]: true,
            }) }, h("ion-button", { key: '039d1bab764093bb6fe4a34299b0872abda087fd', mode: mode, color: color, fill: "clear", shape: "round", "aria-checked": isPasswordVisible ? 'true' : 'false', "aria-label": "show password", role: "switch", type: "button", onPointerDown: (ev) => {
                /**
                 * This prevents mobile browsers from
                 * blurring the input when the password toggle
                 * button is activated.
                 */
                ev.preventDefault();
            }, onClick: this.togglePasswordVisibility }, h("ion-icon", { key: '26477ee97b808c3d79944bf5e33d4e05f1ae0b3f', slot: "icon-only", "aria-hidden": "true", icon: isPasswordVisible ? hidePasswordIcon : showPasswordIcon }))));
    }
    static get is() { return "ion-input-password-toggle"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["input-password-toggle.scss"],
            "md": ["input-password-toggle.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["input-password-toggle.css"],
            "md": ["input-password-toggle.css"]
        };
    }
    static get properties() {
        return {
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Color",
                    "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
                    "references": {
                        "Color": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::Color"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
                },
                "attribute": "color",
                "reflect": true
            },
            "showIcon": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The icon that can be used to represent showing a password. If not set, the \"eye\" Ionicon will be used."
                },
                "attribute": "show-icon",
                "reflect": false
            },
            "hideIcon": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The icon that can be used to represent hiding a password. If not set, the \"eyeOff\" Ionicon will be used."
                },
                "attribute": "hide-icon",
                "reflect": false
            },
            "type": {
                "type": "string",
                "mutable": true,
                "complexType": {
                    "original": "TextFieldTypes",
                    "resolved": "\"date\" | \"datetime-local\" | \"email\" | \"month\" | \"number\" | \"password\" | \"search\" | \"tel\" | \"text\" | \"time\" | \"url\" | \"week\"",
                    "references": {
                        "TextFieldTypes": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::TextFieldTypes"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": ""
                },
                "attribute": "type",
                "reflect": false,
                "defaultValue": "'password'"
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "type",
                "methodName": "onTypeChange"
            }];
    }
}
