/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const helpers = require('./helpers-8a48fdea.js');
const theme = require('./theme-d1c573d2.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');
require('./index-cc858e97.js');

const cardIosCss = ":host{--ion-safe-area-left:0px;--ion-safe-area-right:0px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:block;position:relative;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);contain:content;overflow:hidden}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.card-disabled){cursor:default;opacity:0.3;pointer-events:none}.card-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;min-height:var(--min-height);-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:inherit}.card-native::-moz-focus-inner{border:0}button,a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}ion-ripple-effect{color:var(--ripple-color)}:host{--background:var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)));--color:var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-600, var(--ion-text-color-step-400, #666666))));-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:24px;margin-bottom:24px;border-radius:8px;-webkit-transition:-webkit-transform 500ms cubic-bezier(0.12, 0.72, 0.29, 1);transition:-webkit-transform 500ms cubic-bezier(0.12, 0.72, 0.29, 1);transition:transform 500ms cubic-bezier(0.12, 0.72, 0.29, 1);transition:transform 500ms cubic-bezier(0.12, 0.72, 0.29, 1), -webkit-transform 500ms cubic-bezier(0.12, 0.72, 0.29, 1);font-size:0.875rem;-webkit-box-shadow:0 4px 16px rgba(0, 0, 0, 0.12);box-shadow:0 4px 16px rgba(0, 0, 0, 0.12)}:host(.ion-activated){-webkit-transform:scale3d(0.97, 0.97, 1);transform:scale3d(0.97, 0.97, 1)}";
const IonCardIosStyle0 = cardIosCss;

const cardMdCss = ":host{--ion-safe-area-left:0px;--ion-safe-area-right:0px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:block;position:relative;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);contain:content;overflow:hidden}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.card-disabled){cursor:default;opacity:0.3;pointer-events:none}.card-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;min-height:var(--min-height);-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:inherit}.card-native::-moz-focus-inner{border:0}button,a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}ion-ripple-effect{color:var(--ripple-color)}:host{--background:var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)));--color:var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-550, var(--ion-text-color-step-450, #737373))));-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px;margin-top:10px;margin-bottom:10px;border-radius:4px;font-size:0.875rem;-webkit-box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)}";
const IonCardMdStyle0 = cardMdCss;

const Card = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.inheritedAriaAttributes = {};
        this.color = undefined;
        this.button = false;
        this.type = 'button';
        this.disabled = false;
        this.download = undefined;
        this.href = undefined;
        this.rel = undefined;
        this.routerDirection = 'forward';
        this.routerAnimation = undefined;
        this.target = undefined;
    }
    componentWillLoad() {
        this.inheritedAriaAttributes = helpers.inheritAttributes(this.el, ['aria-label']);
    }
    isClickable() {
        return this.href !== undefined || this.button;
    }
    renderCard(mode) {
        const clickable = this.isClickable();
        if (!clickable) {
            return [index.h("slot", null)];
        }
        const { href, routerAnimation, routerDirection, inheritedAriaAttributes } = this;
        const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div';
        const attrs = TagType === 'button'
            ? { type: this.type }
            : {
                download: this.download,
                href: this.href,
                rel: this.rel,
                target: this.target,
            };
        return (index.h(TagType, Object.assign({}, attrs, inheritedAriaAttributes, { class: "card-native", part: "native", disabled: this.disabled, onClick: (ev) => theme.openURL(href, ev, routerDirection, routerAnimation) }), index.h("slot", null), clickable && mode === 'md' && index.h("ion-ripple-effect", null)));
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: '85e9b30bd81e79a0c7ac75cb3664bdcf9e4afc4d', class: theme.createColorClasses(this.color, {
                [mode]: true,
                'card-disabled': this.disabled,
                'ion-activatable': this.isClickable(),
            }) }, this.renderCard(mode)));
    }
    get el() { return index.getElement(this); }
};
Card.style = {
    ios: IonCardIosStyle0,
    md: IonCardMdStyle0
};

const cardContentIosCss = "ion-card-content{display:block;position:relative}.card-content-ios{-webkit-padding-start:20px;padding-inline-start:20px;-webkit-padding-end:20px;padding-inline-end:20px;padding-top:20px;padding-bottom:20px;font-size:1rem;line-height:1.4}.card-content-ios h1{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:1.5rem;font-weight:normal}.card-content-ios h2{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:1rem;font-weight:normal}.card-content-ios h3,.card-content-ios h4,.card-content-ios h5,.card-content-ios h6{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:0.875rem;font-weight:normal}.card-content-ios p{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:0.875rem}ion-card-header+.card-content-ios{padding-top:0}";
const IonCardContentIosStyle0 = cardContentIosCss;

const cardContentMdCss = "ion-card-content{display:block;position:relative}.card-content-md{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:13px;padding-bottom:13px;font-size:0.875rem;line-height:1.5}.card-content-md h1{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:1.5rem;font-weight:normal}.card-content-md h2{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:1rem;font-weight:normal}.card-content-md h3,.card-content-md h4,.card-content-md h5,.card-content-md h6{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:0.875rem;font-weight:normal}.card-content-md p{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:0.875rem;font-weight:normal;line-height:1.5}ion-card-header+.card-content-md{padding-top:0}";
const IonCardContentMdStyle0 = cardContentMdCss;

const CardContent = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: 'd98e4d1fc6ad3237549f9bc17e4c67ec5059b1b3', class: {
                [mode]: true,
                // Used internally for styling
                [`card-content-${mode}`]: true,
            } }));
    }
};
CardContent.style = {
    ios: IonCardContentIosStyle0,
    md: IonCardContentMdStyle0
};

const cardHeaderIosCss = ":host{--background:transparent;--color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;background:var(--background);color:var(--color)}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host{-webkit-padding-start:20px;padding-inline-start:20px;-webkit-padding-end:20px;padding-inline-end:20px;padding-top:20px;padding-bottom:16px;-ms-flex-direction:column-reverse;flex-direction:column-reverse}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){:host(.card-header-translucent){background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.9);-webkit-backdrop-filter:saturate(180%) blur(30px);backdrop-filter:saturate(180%) blur(30px)}}";
const IonCardHeaderIosStyle0 = cardHeaderIosCss;

const cardHeaderMdCss = ":host{--background:transparent;--color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;background:var(--background);color:var(--color)}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:16px;padding-bottom:16px}::slotted(ion-card-title:not(:first-child)),::slotted(ion-card-subtitle:not(:first-child)){margin-top:8px}";
const IonCardHeaderMdStyle0 = cardHeaderMdCss;

const CardHeader = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.color = undefined;
        this.translucent = false;
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: '64246b81931203a64d553c788cd736f41e23f37b', class: theme.createColorClasses(this.color, {
                'card-header-translucent': this.translucent,
                'ion-inherit-color': true,
                [mode]: true,
            }) }, index.h("slot", { key: 'af2da2dfe266889afeb57fac25c6a730558dbba4' })));
    }
};
CardHeader.style = {
    ios: IonCardHeaderIosStyle0,
    md: IonCardHeaderMdStyle0
};

const cardSubtitleIosCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, var(--ion-text-color-step-400, #666666));margin-left:0;margin-right:0;margin-top:0;margin-bottom:4px;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:0.75rem;font-weight:700;letter-spacing:0.4px;text-transform:uppercase}";
const IonCardSubtitleIosStyle0 = cardSubtitleIosCss;

const cardSubtitleMdCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-550, var(--ion-text-color-step-450, #737373));margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:0.875rem;font-weight:500}";
const IonCardSubtitleMdStyle0 = cardSubtitleMdCss;

const CardSubtitle = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.color = undefined;
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: '84d820a19d9074f9c8bc61ccba1ca40062a60b73', role: "heading", "aria-level": "3", class: theme.createColorClasses(this.color, {
                'ion-inherit-color': true,
                [mode]: true,
            }) }, index.h("slot", { key: 'e4d07d395a1f4469a90847636083101b32b776a1' })));
    }
};
CardSubtitle.style = {
    ios: IonCardSubtitleIosStyle0,
    md: IonCardSubtitleMdStyle0
};

const cardTitleIosCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-text-color, #000);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:1.75rem;font-weight:700;line-height:1.2}";
const IonCardTitleIosStyle0 = cardTitleIosCss;

const cardTitleMdCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-850, var(--ion-text-color-step-150, #262626));margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:1.25rem;font-weight:500;line-height:1.2}";
const IonCardTitleMdStyle0 = cardTitleMdCss;

const CardTitle = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.color = undefined;
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { key: 'fca001a86396e83718d5211cd71912fdf40dea2f', role: "heading", "aria-level": "2", class: theme.createColorClasses(this.color, {
                'ion-inherit-color': true,
                [mode]: true,
            }) }, index.h("slot", { key: '2ba416aed488b2ff462fa75fb3b70373a6dd7da6' })));
    }
};
CardTitle.style = {
    ios: IonCardTitleIosStyle0,
    md: IonCardTitleMdStyle0
};

exports.ion_card = Card;
exports.ion_card_content = CardContent;
exports.ion_card_header = CardHeader;
exports.ion_card_subtitle = CardSubtitle;
exports.ion_card_title = CardTitle;
