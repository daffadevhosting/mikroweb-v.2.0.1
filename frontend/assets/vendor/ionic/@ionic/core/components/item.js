/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, forceUpdate, h, Host } from '@stencil/core/internal/client';
import { d as inheritAttributes, r as raf } from './helpers.js';
import { h as hostContext, c as createColorClasses, o as openURL } from './theme.js';
import { f as chevronForward } from './index7.js';
import { b as getIonMode } from './ionic-global.js';
import { d as defineCustomElement$2 } from './icon.js';
import { d as defineCustomElement$1 } from './ripple-effect.js';

const itemIosCss = ":host{--border-radius:0px;--border-width:0px;--border-style:solid;--padding-top:0px;--padding-bottom:0px;--padding-end:0px;--padding-start:0px;--inner-border-width:0px;--inner-padding-top:0px;--inner-padding-bottom:0px;--inner-padding-start:0px;--inner-padding-end:0px;--inner-box-shadow:none;--detail-icon-color:initial;--detail-icon-font-size:1.25em;--detail-icon-opacity:0.25;--color-activated:var(--color);--color-focused:var(--color);--color-hover:var(--color);--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:block;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;outline:none;color:var(--color);font-family:var(--ion-font-family, inherit);text-align:initial;text-decoration:none;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color) .item-native{background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.ion-color) .item-native,:host(.ion-color) .item-inner{border-color:var(--ion-color-shade)}:host(.ion-activated) .item-native{color:var(--color-activated)}:host(.ion-activated) .item-native::after{background:var(--background-activated);opacity:var(--background-activated-opacity)}:host(.ion-color.ion-activated) .item-native{color:var(--ion-color-contrast)}:host(.ion-focused) .item-native{color:var(--color-focused)}:host(.ion-focused) .item-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}:host(.ion-color.ion-focused) .item-native{color:var(--ion-color-contrast)}:host(.ion-color.ion-focused) .item-native::after{background:var(--ion-color-contrast)}@media (any-hover: hover){:host(.ion-activatable:not(.ion-focused):hover) .item-native{color:var(--color-hover)}:host(.ion-activatable:not(.ion-focused):hover) .item-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity)}:host(.ion-color.ion-activatable:not(.ion-focused):hover) .item-native{color:var(--ion-color-contrast)}:host(.ion-color.ion-activatable:not(.ion-focused):hover) .item-native::after{background:var(--ion-color-contrast)}}:host(.item-control-needs-pointer-cursor){cursor:pointer}:host(.item-interactive-disabled:not(.item-multiple-inputs)){cursor:default;pointer-events:none}:host(.item-disabled){cursor:default;opacity:0.3;pointer-events:none}.item-native{border-radius:var(--border-radius);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-right:var(--padding-end);padding-left:calc(var(--padding-start) + var(--ion-safe-area-left, 0px));display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;min-height:var(--min-height);-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:var(--background);overflow:inherit;z-index:1;-webkit-box-sizing:border-box;box-sizing:border-box}:host-context([dir=rtl]) .item-native{padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}[dir=rtl] .item-native{padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}@supports selector(:dir(rtl)){.item-native:dir(rtl){padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}}.item-native::-moz-focus-inner{border:0}.item-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0;-webkit-transition:var(--transition);transition:var(--transition);z-index:-1}button,a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}.item-inner{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-top:var(--inner-padding-top);padding-bottom:var(--inner-padding-bottom);padding-right:calc(var(--ion-safe-area-right, 0px) + var(--inner-padding-end));padding-left:var(--inner-padding-start);display:-ms-flexbox;display:flex;position:relative;-ms-flex:1;flex:1;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-item-align:stretch;align-self:stretch;min-height:inherit;border-width:var(--inner-border-width);border-style:var(--border-style);border-color:var(--border-color);-webkit-box-shadow:var(--inner-box-shadow);box-shadow:var(--inner-box-shadow);overflow:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}:host-context([dir=rtl]) .item-inner{padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}[dir=rtl] .item-inner{padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}@supports selector(:dir(rtl)){.item-inner:dir(rtl){padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}}.item-detail-icon{-webkit-margin-start:calc(var(--inner-padding-end) / 2);margin-inline-start:calc(var(--inner-padding-end) / 2);-webkit-margin-end:-6px;margin-inline-end:-6px;color:var(--detail-icon-color);font-size:var(--detail-icon-font-size);opacity:var(--detail-icon-opacity)}::slotted(ion-icon){font-size:1.6em}::slotted(ion-button){--margin-top:0;--margin-bottom:0;--margin-start:0;--margin-end:0;z-index:1}::slotted(ion-label:not([slot=end])){-ms-flex:1;flex:1;width:-webkit-min-content;width:-moz-min-content;width:min-content;max-width:100%}:host(.item-input){-ms-flex-align:center;align-items:center}.input-wrapper{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-item-align:stretch;align-self:stretch;text-overflow:ellipsis;overflow:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}:host(.item-label-stacked),:host(.item-label-floating){-ms-flex-align:start;align-items:start}:host(.item-label-stacked) .input-wrapper,:host(.item-label-floating) .input-wrapper{-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column}:host(.item-multiple-inputs) ::slotted(ion-checkbox),:host(.item-multiple-inputs) ::slotted(ion-datetime),:host(.item-multiple-inputs) ::slotted(ion-radio){position:relative}:host(.item-textarea){-ms-flex-align:stretch;align-items:stretch}::slotted(ion-reorder[slot]){margin-top:0;margin-bottom:0}ion-ripple-effect{color:var(--ripple-color)}:host{--min-height:44px;--transition:background-color 200ms linear, opacity 200ms linear;--padding-start:16px;--inner-padding-end:16px;--inner-border-width:0px 0px 0.55px 0px;--background:var(--ion-item-background, var(--ion-background-color, #fff));--background-activated:var(--ion-text-color, #000);--background-focused:var(--ion-text-color, #000);--background-hover:currentColor;--background-activated-opacity:.12;--background-focused-opacity:.15;--background-hover-opacity:.04;--border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));--color:var(--ion-item-color, var(--ion-text-color, #000));font-size:1rem}:host(.ion-activated){--transition:none}:host(.ion-color.ion-focused) .item-native::after{background:#000;opacity:0.15}:host(.ion-color.ion-activated) .item-native::after{background:#000;opacity:0.12}:host(.item-lines-full){--border-width:0px 0px 0.55px 0px}:host(.item-lines-inset){--inner-border-width:0px 0px 0.55px 0px}:host(.item-lines-inset),:host(.item-lines-none){--border-width:0px}:host(.item-lines-full),:host(.item-lines-none){--inner-border-width:0px}::slotted([slot=start]){-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:2px;margin-bottom:2px}::slotted(ion-icon[slot=start]),::slotted(ion-icon[slot=end]){margin-top:7px;margin-bottom:7px}::slotted(ion-toggle[slot=start]),::slotted(ion-toggle[slot=end]){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}:host(.item-label-stacked) ::slotted([slot=end]),:host(.item-label-floating) ::slotted([slot=end]){margin-top:7px;margin-bottom:7px}::slotted(.button-small){--padding-top:1px;--padding-bottom:1px;--padding-start:.5em;--padding-end:.5em;min-height:24px;font-size:0.8125rem}::slotted(ion-avatar){width:36px;height:36px}::slotted(ion-thumbnail){--size:56px}::slotted(ion-avatar[slot=end]),::slotted(ion-thumbnail[slot=end]){-webkit-margin-start:8px;margin-inline-start:8px;-webkit-margin-end:8px;margin-inline-end:8px;margin-top:8px;margin-bottom:8px}:host(.item-radio) ::slotted(ion-label),:host(.item-toggle) ::slotted(ion-label){-webkit-margin-start:0px;margin-inline-start:0px}::slotted(ion-label){-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:8px;margin-inline-end:8px;margin-top:10px;margin-bottom:10px}:host(.item-label-floating),:host(.item-label-stacked){--min-height:68px}";
const IonItemIosStyle0 = itemIosCss;

const itemMdCss = ":host{--border-radius:0px;--border-width:0px;--border-style:solid;--padding-top:0px;--padding-bottom:0px;--padding-end:0px;--padding-start:0px;--inner-border-width:0px;--inner-padding-top:0px;--inner-padding-bottom:0px;--inner-padding-start:0px;--inner-padding-end:0px;--inner-box-shadow:none;--detail-icon-color:initial;--detail-icon-font-size:1.25em;--detail-icon-opacity:0.25;--color-activated:var(--color);--color-focused:var(--color);--color-hover:var(--color);--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:block;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;outline:none;color:var(--color);font-family:var(--ion-font-family, inherit);text-align:initial;text-decoration:none;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color) .item-native{background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.ion-color) .item-native,:host(.ion-color) .item-inner{border-color:var(--ion-color-shade)}:host(.ion-activated) .item-native{color:var(--color-activated)}:host(.ion-activated) .item-native::after{background:var(--background-activated);opacity:var(--background-activated-opacity)}:host(.ion-color.ion-activated) .item-native{color:var(--ion-color-contrast)}:host(.ion-focused) .item-native{color:var(--color-focused)}:host(.ion-focused) .item-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}:host(.ion-color.ion-focused) .item-native{color:var(--ion-color-contrast)}:host(.ion-color.ion-focused) .item-native::after{background:var(--ion-color-contrast)}@media (any-hover: hover){:host(.ion-activatable:not(.ion-focused):hover) .item-native{color:var(--color-hover)}:host(.ion-activatable:not(.ion-focused):hover) .item-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity)}:host(.ion-color.ion-activatable:not(.ion-focused):hover) .item-native{color:var(--ion-color-contrast)}:host(.ion-color.ion-activatable:not(.ion-focused):hover) .item-native::after{background:var(--ion-color-contrast)}}:host(.item-control-needs-pointer-cursor){cursor:pointer}:host(.item-interactive-disabled:not(.item-multiple-inputs)){cursor:default;pointer-events:none}:host(.item-disabled){cursor:default;opacity:0.3;pointer-events:none}.item-native{border-radius:var(--border-radius);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-right:var(--padding-end);padding-left:calc(var(--padding-start) + var(--ion-safe-area-left, 0px));display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;min-height:var(--min-height);-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:var(--background);overflow:inherit;z-index:1;-webkit-box-sizing:border-box;box-sizing:border-box}:host-context([dir=rtl]) .item-native{padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}[dir=rtl] .item-native{padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}@supports selector(:dir(rtl)){.item-native:dir(rtl){padding-right:calc(var(--padding-start) + var(--ion-safe-area-right, 0px));padding-left:var(--padding-end)}}.item-native::-moz-focus-inner{border:0}.item-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0;-webkit-transition:var(--transition);transition:var(--transition);z-index:-1}button,a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}.item-inner{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-top:var(--inner-padding-top);padding-bottom:var(--inner-padding-bottom);padding-right:calc(var(--ion-safe-area-right, 0px) + var(--inner-padding-end));padding-left:var(--inner-padding-start);display:-ms-flexbox;display:flex;position:relative;-ms-flex:1;flex:1;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-item-align:stretch;align-self:stretch;min-height:inherit;border-width:var(--inner-border-width);border-style:var(--border-style);border-color:var(--border-color);-webkit-box-shadow:var(--inner-box-shadow);box-shadow:var(--inner-box-shadow);overflow:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}:host-context([dir=rtl]) .item-inner{padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}[dir=rtl] .item-inner{padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}@supports selector(:dir(rtl)){.item-inner:dir(rtl){padding-right:var(--inner-padding-start);padding-left:calc(var(--ion-safe-area-left, 0px) + var(--inner-padding-end))}}.item-detail-icon{-webkit-margin-start:calc(var(--inner-padding-end) / 2);margin-inline-start:calc(var(--inner-padding-end) / 2);-webkit-margin-end:-6px;margin-inline-end:-6px;color:var(--detail-icon-color);font-size:var(--detail-icon-font-size);opacity:var(--detail-icon-opacity)}::slotted(ion-icon){font-size:1.6em}::slotted(ion-button){--margin-top:0;--margin-bottom:0;--margin-start:0;--margin-end:0;z-index:1}::slotted(ion-label:not([slot=end])){-ms-flex:1;flex:1;width:-webkit-min-content;width:-moz-min-content;width:min-content;max-width:100%}:host(.item-input){-ms-flex-align:center;align-items:center}.input-wrapper{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-item-align:stretch;align-self:stretch;text-overflow:ellipsis;overflow:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}:host(.item-label-stacked),:host(.item-label-floating){-ms-flex-align:start;align-items:start}:host(.item-label-stacked) .input-wrapper,:host(.item-label-floating) .input-wrapper{-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column}:host(.item-multiple-inputs) ::slotted(ion-checkbox),:host(.item-multiple-inputs) ::slotted(ion-datetime),:host(.item-multiple-inputs) ::slotted(ion-radio){position:relative}:host(.item-textarea){-ms-flex-align:stretch;align-items:stretch}::slotted(ion-reorder[slot]){margin-top:0;margin-bottom:0}ion-ripple-effect{color:var(--ripple-color)}:host{--min-height:48px;--background:var(--ion-item-background, var(--ion-background-color, #fff));--background-activated:transparent;--background-focused:currentColor;--background-hover:currentColor;--background-activated-opacity:0;--background-focused-opacity:.12;--background-hover-opacity:.04;--border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, var(--ion-background-color-step-150, rgba(0, 0, 0, 0.13)))));--color:var(--ion-item-color, var(--ion-text-color, #000));--transition:opacity 15ms linear, background-color 15ms linear;--padding-start:16px;--inner-padding-end:16px;--inner-border-width:0 0 1px 0;font-size:1rem;font-weight:normal;text-transform:none}:host(.ion-color.ion-activated) .item-native::after{background:transparent}:host(.item-interactive){--border-width:0 0 1px 0;--inner-border-width:0}:host(.item-lines-full){--border-width:0 0 1px 0}:host(.item-lines-inset){--inner-border-width:0 0 1px 0}:host(.item-lines-inset),:host(.item-lines-none){--border-width:0}:host(.item-lines-full),:host(.item-lines-none){--inner-border-width:0}:host(.item-multi-line) ::slotted([slot=start]),:host(.item-multi-line) ::slotted([slot=end]){margin-top:16px;margin-bottom:16px;-ms-flex-item-align:start;align-self:flex-start}::slotted([slot=start]){-webkit-margin-end:16px;margin-inline-end:16px}::slotted([slot=end]){-webkit-margin-start:16px;margin-inline-start:16px}::slotted(ion-icon){color:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.54);font-size:1.5em}:host(.ion-color) ::slotted(ion-icon){color:var(--ion-color-contrast)}::slotted(ion-icon[slot]){margin-top:12px;margin-bottom:12px}::slotted(ion-icon[slot=start]){-webkit-margin-end:32px;margin-inline-end:32px}::slotted(ion-icon[slot=end]){-webkit-margin-start:16px;margin-inline-start:16px}::slotted(ion-toggle[slot=start]),::slotted(ion-toggle[slot=end]){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}::slotted(ion-note){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-ms-flex-item-align:start;align-self:flex-start;font-size:0.6875rem}::slotted(ion-note[slot]){padding-left:0;padding-right:0;padding-top:18px;padding-bottom:10px}::slotted(ion-avatar){width:40px;height:40px}::slotted(ion-thumbnail){--size:56px}::slotted(ion-avatar),::slotted(ion-thumbnail){margin-top:8px;margin-bottom:8px}::slotted(ion-avatar[slot=start]),::slotted(ion-thumbnail[slot=start]){-webkit-margin-end:16px;margin-inline-end:16px}::slotted(ion-avatar[slot=end]),::slotted(ion-thumbnail[slot=end]){-webkit-margin-start:16px;margin-inline-start:16px}::slotted(ion-label){margin-left:0;margin-right:0;margin-top:10px;margin-bottom:10px}:host(.item-label-stacked) ::slotted([slot=end]),:host(.item-label-floating) ::slotted([slot=end]){margin-top:7px;margin-bottom:7px}:host(.item-toggle) ::slotted(ion-label),:host(.item-radio) ::slotted(ion-label){-webkit-margin-start:0;margin-inline-start:0}::slotted(.button-small){--padding-top:2px;--padding-bottom:2px;--padding-start:.6em;--padding-end:.6em;min-height:25px;font-size:0.75rem}:host(.item-label-floating),:host(.item-label-stacked){--min-height:55px}:host(.ion-focused:not(.ion-color)) ::slotted(.label-stacked),:host(.ion-focused:not(.ion-color)) ::slotted(.label-floating),:host(.item-has-focus:not(.ion-color)) ::slotted(.label-stacked),:host(.item-has-focus:not(.ion-color)) ::slotted(.label-floating){color:var(--ion-color-primary, #0054e9)}";
const IonItemMdStyle0 = itemMdCss;

const Item = /*@__PURE__*/ proxyCustomElement(class Item extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.labelColorStyles = {};
        this.itemStyles = new Map();
        this.inheritedAriaAttributes = {};
        this.multipleInputs = false;
        this.focusable = true;
        this.color = undefined;
        this.button = false;
        this.detail = undefined;
        this.detailIcon = chevronForward;
        this.disabled = false;
        this.download = undefined;
        this.href = undefined;
        this.rel = undefined;
        this.lines = undefined;
        this.routerAnimation = undefined;
        this.routerDirection = 'forward';
        this.target = undefined;
        this.type = 'button';
    }
    buttonChanged() {
        // Update the focusable option when the button option is changed
        this.focusable = this.isFocusable();
    }
    labelColorChanged(ev) {
        const { color } = this;
        // There will be a conflict with item color if
        // we apply the label color to item, so we ignore
        // the label color if the user sets a color on item
        if (color === undefined) {
            this.labelColorStyles = ev.detail;
        }
    }
    itemStyle(ev) {
        ev.stopPropagation();
        const tagName = ev.target.tagName;
        const updatedStyles = ev.detail;
        const newStyles = {};
        const childStyles = this.itemStyles.get(tagName) || {};
        let hasStyleChange = false;
        Object.keys(updatedStyles).forEach((key) => {
            if (updatedStyles[key]) {
                const itemKey = `item-${key}`;
                if (!childStyles[itemKey]) {
                    hasStyleChange = true;
                }
                newStyles[itemKey] = true;
            }
        });
        if (!hasStyleChange && Object.keys(newStyles).length !== Object.keys(childStyles).length) {
            hasStyleChange = true;
        }
        if (hasStyleChange) {
            this.itemStyles.set(tagName, newStyles);
            forceUpdate(this);
        }
    }
    connectedCallback() {
        this.hasStartEl();
    }
    componentWillLoad() {
        this.inheritedAriaAttributes = inheritAttributes(this.el, ['aria-label']);
    }
    componentDidLoad() {
        raf(() => {
            this.setMultipleInputs();
            this.focusable = this.isFocusable();
        });
    }
    // If the item contains multiple clickable elements and/or inputs, then the item
    // should not have a clickable input cover over the entire item to prevent
    // interfering with their individual click events
    setMultipleInputs() {
        // The following elements have a clickable cover that is relative to the entire item
        const covers = this.el.querySelectorAll('ion-checkbox, ion-datetime, ion-select, ion-radio');
        // The following elements can accept focus alongside the previous elements
        // therefore if these elements are also a child of item, we don't want the
        // input cover on top of those interfering with their clicks
        const inputs = this.el.querySelectorAll('ion-input, ion-range, ion-searchbar, ion-segment, ion-textarea, ion-toggle');
        // The following elements should also stay clickable when an input with cover is present
        const clickables = this.el.querySelectorAll('ion-router-link, ion-button, a, button');
        // Check for multiple inputs to change the position of the input cover to relative
        // for all of the covered inputs above
        this.multipleInputs =
            covers.length + inputs.length > 1 ||
                covers.length + clickables.length > 1 ||
                (covers.length > 0 && this.isClickable());
    }
    // If the item contains an input including a checkbox, datetime, select, or radio
    // then the item will have a clickable input cover that covers the item
    // that should get the hover, focused and activated states UNLESS it has multiple
    // inputs, then those need to individually get each click
    hasCover() {
        const inputs = this.el.querySelectorAll('ion-checkbox, ion-datetime, ion-select, ion-radio');
        return inputs.length === 1 && !this.multipleInputs;
    }
    // If the item has an href or button property it will render a native
    // anchor or button that is clickable
    isClickable() {
        return this.href !== undefined || this.button;
    }
    canActivate() {
        return this.isClickable() || this.hasCover();
    }
    isFocusable() {
        const focusableChild = this.el.querySelector('.ion-focusable');
        return this.canActivate() || focusableChild !== null;
    }
    hasStartEl() {
        const startEl = this.el.querySelector('[slot="start"]');
        if (startEl !== null) {
            this.el.classList.add('item-has-start-slot');
        }
    }
    getFirstInteractive() {
        const controls = this.el.querySelectorAll('ion-toggle:not([disabled]), ion-checkbox:not([disabled]), ion-radio:not([disabled]), ion-select:not([disabled]), ion-input:not([disabled]), ion-textarea:not([disabled])');
        return controls[0];
    }
    render() {
        const { detail, detailIcon, download, labelColorStyles, lines, disabled, href, rel, target, routerAnimation, routerDirection, inheritedAriaAttributes, multipleInputs, } = this;
        const childStyles = {};
        const mode = getIonMode(this);
        const clickable = this.isClickable();
        const canActivate = this.canActivate();
        const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div';
        const attrs = TagType === 'button'
            ? { type: this.type }
            : {
                download,
                href,
                rel,
                target,
            };
        let clickFn = {};
        const firstInteractive = this.getFirstInteractive();
        // Only set onClick if the item is clickable to prevent screen
        // readers from reading all items as clickable
        if (clickable || (firstInteractive !== undefined && !multipleInputs)) {
            clickFn = {
                onClick: (ev) => {
                    if (clickable) {
                        openURL(href, ev, routerDirection, routerAnimation);
                    }
                    if (firstInteractive !== undefined && !multipleInputs) {
                        const path = ev.composedPath();
                        const target = path[0];
                        if (ev.isTrusted) {
                            /**
                             * Dispatches a click event to the first interactive element,
                             * when it is the result of a user clicking on the item.
                             *
                             * We check if the click target is in the shadow root,
                             * which means the user clicked on the .item-native or
                             * .item-inner padding.
                             */
                            const clickedWithinShadowRoot = this.el.shadowRoot.contains(target);
                            if (clickedWithinShadowRoot) {
                                /**
                                 * For input/textarea clicking the padding should focus the
                                 * text field (thus making it editable). For everything else,
                                 * we want to click the control so it activates.
                                 */
                                if (firstInteractive.tagName === 'ION-INPUT' || firstInteractive.tagName === 'ION-TEXTAREA') {
                                    firstInteractive.setFocus();
                                }
                                firstInteractive.click();
                                /**
                                 * Stop the item event from being triggered
                                 * as the firstInteractive click event will also
                                 * trigger the item click event.
                                 */
                                ev.stopImmediatePropagation();
                            }
                        }
                    }
                },
            };
        }
        const showDetail = detail !== undefined ? detail : mode === 'ios' && clickable;
        this.itemStyles.forEach((value) => {
            Object.assign(childStyles, value);
        });
        const ariaDisabled = disabled || childStyles['item-interactive-disabled'] ? 'true' : null;
        const inList = hostContext('ion-list', this.el) && !hostContext('ion-radio-group', this.el);
        /**
         * Inputs and textareas do not need to show a cursor pointer.
         * However, other form controls such as checkboxes and radios do.
         */
        const firstInteractiveNeedsPointerCursor = firstInteractive !== undefined && !['ION-INPUT', 'ION-TEXTAREA'].includes(firstInteractive.tagName);
        return (h(Host, { key: '15e7d3b674c25232bc2d51573b291c72548690e5', "aria-disabled": ariaDisabled, class: Object.assign(Object.assign(Object.assign({}, childStyles), labelColorStyles), createColorClasses(this.color, {
                item: true,
                [mode]: true,
                'item-lines-default': lines === undefined,
                [`item-lines-${lines}`]: lines !== undefined,
                'item-control-needs-pointer-cursor': firstInteractiveNeedsPointerCursor,
                'item-disabled': disabled,
                'in-list': inList,
                'item-multiple-inputs': this.multipleInputs,
                'ion-activatable': canActivate,
                'ion-focusable': this.focusable,
                'item-rtl': document.dir === 'rtl',
            })), role: inList ? 'listitem' : null }, h(TagType, Object.assign({ key: 'f27ae647501e29db554efe8f12f498b165d1dbf6' }, attrs, inheritedAriaAttributes, { class: "item-native", part: "native", disabled: disabled }, clickFn), h("slot", { key: 'ba039a321df0e4bd5ce11e7a6e7e174c8623b112', name: "start" }), h("div", { key: 'e67fdf4ad9086d855da8402ca04ffe292cf6ce67', class: "item-inner" }, h("div", { key: '2434348a0b3f10052a340c57a7ac127ddc851729', class: "input-wrapper" }, h("slot", { key: '3e27090ae4dab734541b3fd2c94de0f98c0f0030' })), h("slot", { key: '52dc633b60fe612d48d2efffbf2c4c62692bef85', name: "end" }), showDetail && (h("ion-icon", { key: '4fb7397dc8cf4cecb82f19a6151f85112b73992b', icon: detailIcon, lazy: false, class: "item-detail-icon", part: "detail-icon", "aria-hidden": "true", "flip-rtl": detailIcon === chevronForward }))), canActivate && mode === 'md' && h("ion-ripple-effect", { key: '09b2413a7a484ecd8ffb00805223727da4d4e344' }))));
    }
    get el() { return this; }
    static get watchers() { return {
        "button": ["buttonChanged"]
    }; }
    static get style() { return {
        ios: IonItemIosStyle0,
        md: IonItemMdStyle0
    }; }
}, [33, "ion-item", {
        "color": [513],
        "button": [4],
        "detail": [4],
        "detailIcon": [1, "detail-icon"],
        "disabled": [516],
        "download": [1],
        "href": [1],
        "rel": [1],
        "lines": [1],
        "routerAnimation": [16],
        "routerDirection": [1, "router-direction"],
        "target": [1],
        "type": [1],
        "multipleInputs": [32],
        "focusable": [32]
    }, [[0, "ionColor", "labelColorChanged"], [0, "ionStyle", "itemStyle"]], {
        "button": ["buttonChanged"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-item", "ion-icon", "ion-ripple-effect"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Item);
            }
            break;
        case "ion-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "ion-ripple-effect":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Item as I, defineCustomElement as d };
