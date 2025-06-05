/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, h, e as Host } from './index-527b9e34.js';
import { c as createColorClasses } from './theme-01f3f29c.js';
import { b as getIonMode } from './ionic-global-b26f573e.js';
import './index-cfd9c1f2.js';

const textCss = ":host(.ion-color){color:var(--ion-color-base)}";
const IonTextStyle0 = textCss;

const Text = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.color = undefined;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '0c2546ea3f24b0a6bfd606199441d0a4edfa4ca1', class: createColorClasses(this.color, {
                [mode]: true,
            }) }, h("slot", { key: 'b7623ccb06f9461090a1f33e9f85886c7a4d5eff' })));
    }
};
Text.style = IonTextStyle0;

export { Text as ion_text };
