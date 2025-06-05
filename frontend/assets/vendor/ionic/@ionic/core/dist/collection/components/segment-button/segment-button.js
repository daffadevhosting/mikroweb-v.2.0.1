/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { addEventListener, removeEventListener, inheritAttributes } from "../../utils/helpers";
import { printIonError, printIonWarning } from "../../utils/logging/index";
import { hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
let ids = 0;
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part indicator - The indicator displayed on the checked segment button.
 * @part indicator-background - The background element for the indicator displayed on the checked segment button.
 */
export class SegmentButton {
    constructor() {
        this.segmentEl = null;
        this.inheritedAttributes = {};
        this.updateStyle = () => {
            forceUpdate(this);
        };
        this.updateState = () => {
            const { segmentEl } = this;
            if (segmentEl) {
                this.checked = segmentEl.value === this.value;
                if (segmentEl.disabled) {
                    this.disabled = true;
                }
            }
        };
        this.checked = false;
        this.contentId = undefined;
        this.disabled = false;
        this.layout = 'icon-top';
        this.type = 'button';
        this.value = 'ion-sb-' + ids++;
    }
    valueChanged() {
        this.updateState();
    }
    connectedCallback() {
        const segmentEl = (this.segmentEl = this.el.closest('ion-segment'));
        if (segmentEl) {
            this.updateState();
            addEventListener(segmentEl, 'ionSelect', this.updateState);
            addEventListener(segmentEl, 'ionStyle', this.updateStyle);
        }
        // Prevent buttons from being disabled when associated with segment content
        if (this.contentId && this.disabled) {
            printIonWarning(`[ion-segment-button] - Segment buttons cannot be disabled when associated with an <ion-segment-content>.`);
            this.disabled = false;
        }
    }
    disconnectedCallback() {
        const segmentEl = this.segmentEl;
        if (segmentEl) {
            removeEventListener(segmentEl, 'ionSelect', this.updateState);
            removeEventListener(segmentEl, 'ionStyle', this.updateStyle);
            this.segmentEl = null;
        }
    }
    componentWillLoad() {
        this.inheritedAttributes = Object.assign({}, inheritAttributes(this.el, ['aria-label']));
        // Return if there is no contentId defined
        if (!this.contentId)
            return;
        // Attempt to find the Segment Content by its contentId
        const segmentContent = document.getElementById(this.contentId);
        // If no associated Segment Content exists, log an error and return
        if (!segmentContent) {
            printIonError(`[ion-segment-button] - Unable to find Segment Content with id="${this.contentId}".`);
            return;
        }
        // Ensure the found element is a valid ION-SEGMENT-CONTENT
        if (segmentContent.tagName !== 'ION-SEGMENT-CONTENT') {
            printIonError(`[ion-segment-button] - Element with id="${this.contentId}" is not an <ion-segment-content> element.`);
            return;
        }
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    /**
     * @internal
     * Focuses the native <button> element
     * inside of ion-segment-button.
     */
    async setFocus() {
        const { nativeEl } = this;
        if (nativeEl !== undefined) {
            nativeEl.focus();
        }
    }
    render() {
        const { checked, type, disabled, hasIcon, hasLabel, layout, segmentEl } = this;
        const mode = getIonMode(this);
        const hasSegmentColor = () => (segmentEl === null || segmentEl === void 0 ? void 0 : segmentEl.color) !== undefined;
        return (h(Host, { key: 'd79dad80db69123510c6d52bbf4424558600c14a', class: {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'in-segment': hostContext('ion-segment', this.el),
                'in-segment-color': hasSegmentColor(),
                'segment-button-has-label': hasLabel,
                'segment-button-has-icon': hasIcon,
                'segment-button-has-label-only': hasLabel && !hasIcon,
                'segment-button-has-icon-only': hasIcon && !hasLabel,
                'segment-button-disabled': disabled,
                'segment-button-checked': checked,
                [`segment-button-layout-${layout}`]: true,
                'ion-activatable': true,
                'ion-activatable-instant': true,
                'ion-focusable': true,
            } }, h("button", Object.assign({ key: '781fd7fef443a2fbd404b8a399d1203794759a69', "aria-selected": checked ? 'true' : 'false', role: "tab", ref: (el) => (this.nativeEl = el), type: type, class: "button-native", part: "native", disabled: disabled }, this.inheritedAttributes), h("span", { key: '64df08f60ea17481183f8ad284884b9979eaeb24', class: "button-inner" }, h("slot", { key: '2b7ef328023ab5ccc0adc6f865e5e7121467eeb8' })), mode === 'md' && h("ion-ripple-effect", { key: '1fd5e6179227925a03b6c3b5258bbf4ea99bfef1' })), h("div", { key: 'dbcedad6988b0eadeebe02bdafdedb8eb37af19c', part: "indicator", class: "segment-button-indicator segment-button-indicator-animated" }, h("div", { key: 'f4f1789f66bdfa2de5445bc0d292116a93bad7cc', part: "indicator-background", class: "segment-button-indicator-background" }))));
    }
    static get is() { return "ion-segment-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["segment-button.ios.scss"],
            "md": ["segment-button.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["segment-button.ios.css"],
            "md": ["segment-button.md.css"]
        };
    }
    static get properties() {
        return {
            "contentId": {
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
                    "text": "The `id` of the segment content."
                },
                "attribute": "content-id",
                "reflect": true
            },
            "disabled": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the segment button."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "layout": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "SegmentButtonLayout",
                    "resolved": "\"icon-bottom\" | \"icon-end\" | \"icon-hide\" | \"icon-start\" | \"icon-top\" | \"label-hide\" | undefined",
                    "references": {
                        "SegmentButtonLayout": {
                            "location": "import",
                            "path": "./segment-button-interface",
                            "id": "src/components/segment-button/segment-button-interface.ts::SegmentButtonLayout"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Set the layout of the text and icon in the segment."
                },
                "attribute": "layout",
                "reflect": false,
                "defaultValue": "'icon-top'"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'submit' | 'reset' | 'button'",
                    "resolved": "\"button\" | \"reset\" | \"submit\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The type of the button."
                },
                "attribute": "type",
                "reflect": false,
                "defaultValue": "'button'"
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "SegmentValue",
                    "resolved": "number | string",
                    "references": {
                        "SegmentValue": {
                            "location": "import",
                            "path": "../segment/segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentValue"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The value of the segment button."
                },
                "attribute": "value",
                "reflect": false,
                "defaultValue": "'ion-sb-' + ids++"
            }
        };
    }
    static get states() {
        return {
            "checked": {}
        };
    }
    static get methods() {
        return {
            "setFocus": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": "Focuses the native <button> element\ninside of ion-segment-button."
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "value",
                "methodName": "valueChanged"
            }];
    }
}
