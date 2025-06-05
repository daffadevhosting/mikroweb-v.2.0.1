/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in `ios` mode, and directly to the right in `md` mode.
 * @slot primary - Content is placed to the right of the toolbar text in `ios` mode, and to the far right in `md` mode.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 *
 * @part background - The background of the toolbar, covering the entire area behind the toolbar content.
 * @part container - The container that wraps all toolbar content, including the default slot and named slot content.
 * @part content - The container for the default slot, wrapping content provided without a named slot.
 */
export class Toolbar {
    constructor() {
        this.childrenStyles = new Map();
        this.color = undefined;
    }
    componentWillLoad() {
        const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));
        const firstButtons = buttons.find((button) => {
            return button.slot === 'start';
        });
        if (firstButtons) {
            firstButtons.classList.add('buttons-first-slot');
        }
        const buttonsReversed = buttons.reverse();
        const lastButtons = buttonsReversed.find((button) => button.slot === 'end') ||
            buttonsReversed.find((button) => button.slot === 'primary') ||
            buttonsReversed.find((button) => button.slot === 'secondary');
        if (lastButtons) {
            lastButtons.classList.add('buttons-last-slot');
        }
    }
    childrenStyle(ev) {
        ev.stopPropagation();
        const tagName = ev.target.tagName;
        const updatedStyles = ev.detail;
        const newStyles = {};
        const childStyles = this.childrenStyles.get(tagName) || {};
        let hasStyleChange = false;
        Object.keys(updatedStyles).forEach((key) => {
            const childKey = `toolbar-${key}`;
            const newValue = updatedStyles[key];
            if (newValue !== childStyles[childKey]) {
                hasStyleChange = true;
            }
            if (newValue) {
                newStyles[childKey] = true;
            }
        });
        if (hasStyleChange) {
            this.childrenStyles.set(tagName, newStyles);
            forceUpdate(this);
        }
    }
    render() {
        const mode = getIonMode(this);
        const childStyles = {};
        this.childrenStyles.forEach((value) => {
            Object.assign(childStyles, value);
        });
        return (h(Host, { key: '402afe7ce0c97883cedd0e48a5a0492a9bfe76ae', class: Object.assign(Object.assign({}, childStyles), createColorClasses(this.color, {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
            })) }, h("div", { key: '2465a6dc8d507ec650538378d1be2abd399c58ad', class: "toolbar-background", part: "background" }), h("div", { key: '6075096afd12303b961e4fe9ad345ef2887573af', class: "toolbar-container", part: "container" }, h("slot", { key: '8b7eec1148cfeb339d87cdf9273f2104703e7601', name: "start" }), h("slot", { key: 'b102d3926cade24faf78b7af78ad5e192c4c0308', name: "secondary" }), h("div", { key: 'c6ab2e978328324c6f9e7892024cbcd8b8987067', class: "toolbar-content", part: "content" }, h("slot", { key: '86f8952c4355a9df5b4bbb95e9d0cafefd272d5b' })), h("slot", { key: '501e43431da6b9dd35b47b79222f948d445f7a78', name: "primary" }), h("slot", { key: '84bf1a15a5e52e8e94df9f479c4ce18004f5ab57', name: "end" }))));
    }
    static get is() { return "ion-toolbar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["toolbar.ios.scss"],
            "md": ["toolbar.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["toolbar.ios.css"],
            "md": ["toolbar.md.css"]
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
            }
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "ionStyle",
                "method": "childrenStyle",
                "target": undefined,
                "capture": false,
                "passive": false
            }];
    }
}
