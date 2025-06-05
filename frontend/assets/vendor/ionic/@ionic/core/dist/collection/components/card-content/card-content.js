/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class CardContent {
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'd98e4d1fc6ad3237549f9bc17e4c67ec5059b1b3', class: {
                [mode]: true,
                // Used internally for styling
                [`card-content-${mode}`]: true,
            } }));
    }
    static get is() { return "ion-card-content"; }
    static get originalStyleUrls() {
        return {
            "ios": ["card-content.ios.scss"],
            "md": ["card-content.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["card-content.ios.css"],
            "md": ["card-content.md.css"]
        };
    }
}
