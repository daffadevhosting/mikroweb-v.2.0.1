/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
export class ToolbarTitle {
    constructor() {
        this.color = undefined;
        this.size = undefined;
    }
    sizeChanged() {
        this.emitStyle();
    }
    connectedCallback() {
        this.emitStyle();
    }
    emitStyle() {
        const size = this.getSize();
        this.ionStyle.emit({
            [`title-${size}`]: true,
        });
    }
    getSize() {
        return this.size !== undefined ? this.size : 'default';
    }
    render() {
        const mode = getIonMode(this);
        const size = this.getSize();
        return (h(Host, { key: '3f7b19c99961dbb86c0a925218332528b22e6880', class: createColorClasses(this.color, {
                [mode]: true,
                [`title-${size}`]: true,
                'title-rtl': document.dir === 'rtl',
            }) }, h("div", { key: '12054fbdd60e40a15875e442c20143766fc34fc3', class: "toolbar-title" }, h("slot", { key: '9f14fb14a67d4bd1e4536a4d64a637fbe5a151c7' }))));
    }
    static get is() { return "ion-title"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["title.ios.scss"],
            "md": ["title.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["title.ios.css"],
            "md": ["title.md.css"]
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
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'large' | 'small'",
                    "resolved": "\"large\" | \"small\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The size of the toolbar title."
                },
                "attribute": "size",
                "reflect": false
            }
        };
    }
    static get events() {
        return [{
                "method": "ionStyle",
                "name": "ionStyle",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the styles change."
                },
                "complexType": {
                    "original": "StyleEventDetail",
                    "resolved": "StyleEventDetail",
                    "references": {
                        "StyleEventDetail": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::StyleEventDetail"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "size",
                "methodName": "sizeChanged"
            }];
    }
}
