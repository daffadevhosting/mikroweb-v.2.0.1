/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { reorderThreeOutline, reorderTwoSharp } from "ionicons/icons";
import { getIonMode } from "../../global/ionic-global";
/**
 * @part icon - The icon of the reorder handle (uses ion-icon).
 */
export class Reorder {
    onClick(ev) {
        const reorderGroup = this.el.closest('ion-reorder-group');
        ev.preventDefault();
        // Only stop event propagation if the reorder is inside of an enabled
        // reorder group. This allows interaction with clickable children components.
        if (!reorderGroup || !reorderGroup.disabled) {
            ev.stopImmediatePropagation();
        }
    }
    render() {
        const mode = getIonMode(this);
        const reorderIcon = mode === 'ios' ? reorderThreeOutline : reorderTwoSharp;
        return (h(Host, { key: '17adf3165f4e09283d5d6434d7cd47bd23519048', class: mode }, h("slot", { key: 'd00d1cd97c689fc5c7b7175a2051cf697fe22871' }, h("ion-icon", { key: 'eec219aebde6083de98358be3e75965c5a5dc3d0', icon: reorderIcon, lazy: false, class: "reorder-icon", part: "icon", "aria-hidden": "true" }))));
    }
    static get is() { return "ion-reorder"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["reorder.ios.scss"],
            "md": ["reorder.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["reorder.ios.css"],
            "md": ["reorder.md.css"]
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "click",
                "method": "onClick",
                "target": undefined,
                "capture": true,
                "passive": false
            }];
    }
}
