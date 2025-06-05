/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class Chip {
    constructor() {
        this.color = undefined;
        this.outline = false;
        this.disabled = false;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'fa2e9a4837ef87a17ef10f388e8caa7f604d9145', "aria-disabled": this.disabled ? 'true' : null, class: createColorClasses(this.color, {
                [mode]: true,
                'chip-outline': this.outline,
                'chip-disabled': this.disabled,
                'ion-activatable': true,
            }) }, h("slot", { key: '3793fbd9d915cef7241fb101e2bc64c08b9ba482' }), mode === 'md' && h("ion-ripple-effect", { key: 'd3b95b53918611dec095a50f2aaaab65617947a4' })));
    }
    static get is() { return "ion-chip"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["chip.ios.scss"],
            "md": ["chip.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["chip.ios.css"],
            "md": ["chip.md.css"]
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
            "outline": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Display an outline style button."
                },
                "attribute": "outline",
                "reflect": false,
                "defaultValue": "false"
            },
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the chip."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
}
