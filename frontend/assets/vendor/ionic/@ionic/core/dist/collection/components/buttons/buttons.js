/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class Buttons {
    constructor() {
        this.collapse = false;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '58c1fc5eb867d0731c63549b1ccb3ec3bbbe6e1b', class: {
                [mode]: true,
                ['buttons-collapse']: this.collapse,
            } }, h("slot", { key: '0c8f95b9840c8fa0c4e50be84c5159620a3eb5c8' })));
    }
    static get is() { return "ion-buttons"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "ios": ["buttons.ios.scss"],
            "md": ["buttons.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["buttons.ios.css"],
            "md": ["buttons.md.css"]
        };
    }
    static get properties() {
        return {
            "collapse": {
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
                    "text": "If true, buttons will disappear when its\nparent toolbar has fully collapsed if the toolbar\nis not the first toolbar. If the toolbar is the\nfirst toolbar, the buttons will be hidden and will\nonly be shown once all toolbars have fully collapsed.\n\nOnly applies in `ios` mode with `collapse` set to\n`true` on `ion-header`.\n\nTypically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)"
                },
                "attribute": "collapse",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
}
