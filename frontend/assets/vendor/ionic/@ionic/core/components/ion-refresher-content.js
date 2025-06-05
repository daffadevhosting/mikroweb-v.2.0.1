/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { E as ENABLE_HTML_CONTENT_DEFAULT, a as sanitizeDOMString } from './config.js';
import { p as caretBackSharp, q as arrowDown } from './index7.js';
import { c as config } from './index4.js';
import { b as getIonMode } from './ionic-global.js';
import { e as supportsRubberBandScrolling } from './refresher.utils.js';
import { d as defineCustomElement$2, S as SPINNERS } from './spinner.js';
import { d as defineCustomElement$3 } from './icon.js';

const RefresherContent = /*@__PURE__*/ proxyCustomElement(class RefresherContent extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
        this.pullingIcon = undefined;
        this.pullingText = undefined;
        this.refreshingSpinner = undefined;
        this.refreshingText = undefined;
    }
    componentWillLoad() {
        if (this.pullingIcon === undefined) {
            /**
             * The native iOS refresher uses a spinner instead of
             * an icon, so we need to see if this device supports
             * the native iOS refresher.
             */
            const hasRubberBandScrolling = supportsRubberBandScrolling();
            const mode = getIonMode(this);
            const overflowRefresher = hasRubberBandScrolling ? 'lines' : arrowDown;
            this.pullingIcon = config.get('refreshingIcon', mode === 'ios' && hasRubberBandScrolling ? config.get('spinner', overflowRefresher) : 'circular');
        }
        if (this.refreshingSpinner === undefined) {
            const mode = getIonMode(this);
            this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
        }
    }
    renderPullingText() {
        const { customHTMLEnabled, pullingText } = this;
        if (customHTMLEnabled) {
            return h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(pullingText) });
        }
        return h("div", { class: "refresher-pulling-text" }, pullingText);
    }
    renderRefreshingText() {
        const { customHTMLEnabled, refreshingText } = this;
        if (customHTMLEnabled) {
            return h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(refreshingText) });
        }
        return h("div", { class: "refresher-refreshing-text" }, refreshingText);
    }
    render() {
        const pullingIcon = this.pullingIcon;
        const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
        const mode = getIonMode(this);
        return (h(Host, { key: 'fb78d7e31f8feb31025e58903eb9de85cb928dbd', class: mode }, h("div", { key: '23f67800f09765ef8fde8cf85a843e19e667f337', class: "refresher-pulling" }, this.pullingIcon && hasSpinner && (h("div", { key: '5a08d3b69762f8b51dcd3dcfbaf3fddb707257fa', class: "refresher-pulling-icon" }, h("div", { key: '42a613b029e092acdff7fe613a429375d89f157e', class: "spinner-arrow-container" }, h("ion-spinner", { key: '2f9cdc75938c4d306de7a717ed67901daef71c2c', name: this.pullingIcon, paused: true }), mode === 'md' && this.pullingIcon === 'circular' && (h("div", { key: '1f8a6347b4a46417ba55286a79f1a41f04bf9c91', class: "arrow-container" }, h("ion-icon", { key: '326713d11d482d420ba5a739ff4528400a37e9ca', icon: caretBackSharp, "aria-hidden": "true" })))))), this.pullingIcon && !hasSpinner && (h("div", { key: 'ab18c7cbea7bcbfa034f90f317652af4d93660ed', class: "refresher-pulling-icon" }, h("ion-icon", { key: 'f488acd54acc8a61b6c5a279f0d7f9a437c370c0', icon: this.pullingIcon, lazy: false, "aria-hidden": "true" }))), this.pullingText !== undefined && this.renderPullingText()), h("div", { key: '914ad6139442dac53af47120ea821fa11c309a38', class: "refresher-refreshing" }, this.refreshingSpinner && (h("div", { key: '7eba732f5e2d72b90399d68a3e89617d8979b3d1', class: "refresher-refreshing-icon" }, h("ion-spinner", { key: '838d66d8bef6f56622c62b1068e7fed29e094302', name: this.refreshingSpinner }))), this.refreshingText !== undefined && this.renderRefreshingText())));
    }
    get el() { return this; }
}, [0, "ion-refresher-content", {
        "pullingIcon": [1025, "pulling-icon"],
        "pullingText": [1, "pulling-text"],
        "refreshingSpinner": [1025, "refreshing-spinner"],
        "refreshingText": [1, "refreshing-text"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-refresher-content", "ion-icon", "ion-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-refresher-content":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, RefresherContent);
            }
            break;
        case "ion-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "ion-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const IonRefresherContent = RefresherContent;
const defineCustomElement = defineCustomElement$1;

export { IonRefresherContent, defineCustomElement };
