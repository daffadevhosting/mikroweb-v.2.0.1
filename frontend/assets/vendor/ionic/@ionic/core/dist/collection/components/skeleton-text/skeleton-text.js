/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { hostContext } from "../../utils/theme";
import { config } from "../../global/config";
import { getIonMode } from "../../global/ionic-global";
export class SkeletonText {
    constructor() {
        this.animated = false;
    }
    componentWillLoad() {
        this.emitStyle();
    }
    emitStyle() {
        // The emitted property is used by item in order
        // to add the item-skeleton-text class which applies
        // overflow: hidden to its label
        const style = {
            'skeleton-text': true,
        };
        this.ionStyle.emit(style);
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        const mode = getIonMode(this);
        return (h(Host, { key: 'c193f9a8e8efab5139544f047bdae4b6d421aa86', class: {
                [mode]: true,
                'skeleton-text-animated': animated,
                'in-media': inMedia,
            } }, h("span", { key: 'e15db679bd3c359b4df5123efd2f92e5b380fde3' }, "\u00A0")));
    }
    static get is() { return "ion-skeleton-text"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["skeleton-text.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["skeleton-text.css"]
        };
    }
    static get properties() {
        return {
            "animated": {
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
                    "text": "If `true`, the skeleton text will animate."
                },
                "attribute": "animated",
                "reflect": false,
                "defaultValue": "false"
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
}
