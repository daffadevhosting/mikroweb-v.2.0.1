/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the divider text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the divider text in LTR, and to the left in RTL.
 */
export class ItemDivider {
    constructor() {
        this.color = undefined;
        this.sticky = false;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '7150b1a3a881c3c312db40821acb9830c2885ccf', class: createColorClasses(this.color, {
                [mode]: true,
                'item-divider-sticky': this.sticky,
                item: true,
            }) }, h("slot", { key: '6e9d9615f475392a81177bc49b4b01dbdab67925', name: "start" }), h("div", { key: '12fe6b840ad1a1897cc34529e488207b2df448f7', class: "item-divider-inner" }, h("div", { key: '626776a8c9887dd2df5ecf3b7861beb742b41e03', class: "item-divider-wrapper" }, h("slot", { key: '90379dd99914e24ae45c9571c8d390f9b6622fd4' })), h("slot", { key: '105644332c08530155b9cd8e8c6fa9e332072a63', name: "end" }))));
    }
    static get is() { return "ion-item-divider"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["item-divider.ios.scss"],
            "md": ["item-divider.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["item-divider.ios.css"],
            "md": ["item-divider.md.css"]
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
            "sticky": {
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
                    "text": "When it's set to `true`, the item-divider will stay visible when it reaches the top\nof the viewport until the next `ion-item-divider` replaces it.\n\nThis feature relies in `position:sticky`:\nhttps://caniuse.com/#feat=css-sticky"
                },
                "attribute": "sticky",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get elementRef() { return "el"; }
}
