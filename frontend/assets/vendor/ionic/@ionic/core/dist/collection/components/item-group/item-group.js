/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class ItemGroup {
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'de2a969ed0dda880bc560a325848b28d0287fdb9', role: "group", class: {
                [mode]: true,
                // Used internally for styling
                [`item-group-${mode}`]: true,
                item: true,
            } }));
    }
    static get is() { return "ion-item-group"; }
    static get originalStyleUrls() {
        return {
            "ios": ["item-group.ios.scss"],
            "md": ["item-group.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["item-group.ios.css"],
            "md": ["item-group.md.css"]
        };
    }
}
