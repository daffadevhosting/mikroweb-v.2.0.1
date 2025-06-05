/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, Build, h, Host } from '@stencil/core/internal/client';
import { shouldUseCloseWatcher } from './hardware-back-button.js';
import { c as config, a as printIonWarning } from './index4.js';
import { b as getIonMode, a as isPlatform } from './ionic-global.js';

const appCss = "html.plt-mobile ion-app{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}html.plt-mobile ion-app [contenteditable]{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";
const IonAppStyle0 = appCss;

const App = /*@__PURE__*/ proxyCustomElement(class App extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
    }
    componentDidLoad() {
        if (Build.isBrowser) {
            rIC(async () => {
                const isHybrid = isPlatform(window, 'hybrid');
                if (!config.getBoolean('_testing')) {
                    import('./index9.js').then((module) => module.startTapClick(config));
                }
                if (config.getBoolean('statusTap', isHybrid)) {
                    import('./status-tap.js').then((module) => module.startStatusTap());
                }
                if (config.getBoolean('inputShims', needInputShims())) {
                    /**
                     * needInputShims() ensures that only iOS and Android
                     * platforms proceed into this block.
                     */
                    const platform = isPlatform(window, 'ios') ? 'ios' : 'android';
                    import('./input-shims.js').then((module) => module.startInputShims(config, platform));
                }
                const hardwareBackButtonModule = await import('./hardware-back-button.js');
                const supportsHardwareBackButtonEvents = isHybrid || shouldUseCloseWatcher();
                if (config.getBoolean('hardwareBackButton', supportsHardwareBackButtonEvents)) {
                    hardwareBackButtonModule.startHardwareBackButton();
                }
                else {
                    /**
                     * If an app sets hardwareBackButton: false and experimentalCloseWatcher: true
                     * then the close watcher will not be used.
                     */
                    if (shouldUseCloseWatcher()) {
                        printIonWarning('[ion-app] - experimentalCloseWatcher was set to `true`, but hardwareBackButton was set to `false`. Both config options must be `true` for the Close Watcher API to be used.');
                    }
                    hardwareBackButtonModule.blockHardwareBackButton();
                }
                if (typeof window !== 'undefined') {
                    import('./keyboard2.js').then((module) => module.startKeyboardAssist(window));
                }
                import('./focus-visible.js').then((module) => (this.focusVisible = module.startFocusVisible()));
            });
        }
    }
    /**
     * Used to set focus on an element that uses `ion-focusable`.
     * Do not use this if focusing the element as a result of a keyboard
     * event as the focus utility should handle this for us. This method
     * should be used when we want to programmatically focus an element as
     * a result of another user action. (Ex: We focus the first element
     * inside of a popover when the user presents it, but the popover is not always
     * presented as a result of keyboard action.)
     */
    async setFocus(elements) {
        if (this.focusVisible) {
            this.focusVisible.setFocus(elements);
        }
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '03aa892f986330078d112b1e8b010df98fa7e39e', class: {
                [mode]: true,
                'ion-page': true,
                'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
            } }));
    }
    get el() { return this; }
    static get style() { return IonAppStyle0; }
}, [0, "ion-app", {
        "setFocus": [64]
    }]);
const needInputShims = () => {
    /**
     * iOS always needs input shims
     */
    const needsShimsIOS = isPlatform(window, 'ios') && isPlatform(window, 'mobile');
    if (needsShimsIOS) {
        return true;
    }
    /**
     * Android only needs input shims when running
     * in the browser and only if the browser is using the
     * new Chrome 108+ resize behavior: https://developer.chrome.com/blog/viewport-resize-behavior/
     */
    const isAndroidMobileWeb = isPlatform(window, 'android') && isPlatform(window, 'mobileweb');
    if (isAndroidMobileWeb) {
        return true;
    }
    return false;
};
const rIC = (callback) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    }
    else {
        setTimeout(callback, 32);
    }
};
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-app"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-app":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, App);
            }
            break;
    } });
}

const IonApp = App;
const defineCustomElement = defineCustomElement$1;

export { IonApp, defineCustomElement };
