/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class ListHeader {
    constructor() {
        this.color = undefined;
        this.lines = undefined;
    }
    render() {
        const { lines } = this;
        const mode = getIonMode(this);
        return (h(Host, { key: '95ce2135e2b1ad4d7d6020b0fb9bc6e02b3c0851', class: createColorClasses(this.color, {
                [mode]: true,
                [`list-header-lines-${lines}`]: lines !== undefined,
            }) }, h("div", { key: '3065b0a094bc31a90518898a5126a813c8a33816', class: "list-header-inner" }, h("slot", { key: 'fe15c87d7867f3e5d8185645c49c0228496697b8' }))));
    }
    static get is() { return "ion-list-header"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["list-header.ios.scss"],
            "md": ["list-header.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["list-header.ios.css"],
            "md": ["list-header.md.css"]
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
            "lines": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'full' | 'inset' | 'none'",
                    "resolved": "\"full\" | \"inset\" | \"none\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "How the bottom border should be displayed on the list header."
                },
                "attribute": "lines",
                "reflect": false
            }
        };
    }
}
