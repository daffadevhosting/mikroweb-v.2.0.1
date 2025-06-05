/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const theme = require('./theme-d1c573d2.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');
require('./index-cc858e97.js');

const textCss = ":host(.ion-color){color:var(--ion-color-base)}";
const IonTextStyle0 = textCss;

const Text = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.color = undefined;
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: '0c2546ea3f24b0a6bfd606199441d0a4edfa4ca1', class: theme.createColorClasses(this.color, {
                [mode]: true,
            }) }, index.h("slot", { key: 'b7623ccb06f9461090a1f33e9f85886c7a4d5eff' })));
    }
};
Text.style = IonTextStyle0;

exports.ion_text = Text;
