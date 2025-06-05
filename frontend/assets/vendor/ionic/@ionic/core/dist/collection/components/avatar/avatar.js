/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class Avatar {
    render() {
        return (h(Host, { key: '998217066084f966bf5d356fed85bcbd451f675a', class: getIonMode(this) }, h("slot", { key: '1a6f7c9d4dc6a875f86b5b3cda6d59cb39587f22' })));
    }
    static get is() { return "ion-avatar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["avatar.ios.scss"],
            "md": ["avatar.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["avatar.ios.css"],
            "md": ["avatar.md.css"]
        };
    }
}
