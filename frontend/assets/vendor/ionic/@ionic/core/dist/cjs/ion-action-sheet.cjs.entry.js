/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const buttonActive = require('./button-active-43e2b419.js');
const helpers = require('./helpers-8a48fdea.js');
const lockController = require('./lock-controller-6585a42a.js');
const overlays = require('./overlays-4c291a05.js');
const theme = require('./theme-d1c573d2.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');
const animation = require('./animation-ab2d3449.js');
require('./haptic-f6b37aa3.js');
require('./capacitor-c04564bf.js');
require('./index-c8d52405.js');
require('./index-ee07ed59.js');
require('./gesture-controller-9436f482.js');
require('./index-cc858e97.js');
require('./hardware-back-button-3d2b1004.js');
require('./framework-delegate-862d9d00.js');

/**
 * iOS Action Sheet Enter Animation
 */
const iosEnterAnimation = (baseEl) => {
    const baseAnimation = animation.createAnimation();
    const backdropAnimation = animation.createAnimation();
    const wrapperAnimation = animation.createAnimation();
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
        .beforeStyles({
        'pointer-events': 'none',
    })
        .afterClearStyles(['pointer-events']);
    wrapperAnimation
        .addElement(baseEl.querySelector('.action-sheet-wrapper'))
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * iOS Action Sheet Leave Animation
 */
const iosLeaveAnimation = (baseEl) => {
    const baseAnimation = animation.createAnimation();
    const backdropAnimation = animation.createAnimation();
    const wrapperAnimation = animation.createAnimation();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 'var(--backdrop-opacity)', 0);
    wrapperAnimation
        .addElement(baseEl.querySelector('.action-sheet-wrapper'))
        .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * MD Action Sheet Enter Animation
 */
const mdEnterAnimation = (baseEl) => {
    const baseAnimation = animation.createAnimation();
    const backdropAnimation = animation.createAnimation();
    const wrapperAnimation = animation.createAnimation();
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
        .beforeStyles({
        'pointer-events': 'none',
    })
        .afterClearStyles(['pointer-events']);
    wrapperAnimation
        .addElement(baseEl.querySelector('.action-sheet-wrapper'))
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * MD Action Sheet Leave Animation
 */
const mdLeaveAnimation = (baseEl) => {
    const baseAnimation = animation.createAnimation();
    const backdropAnimation = animation.createAnimation();
    const wrapperAnimation = animation.createAnimation();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 'var(--backdrop-opacity)', 0);
    wrapperAnimation
        .addElement(baseEl.querySelector('.action-sheet-wrapper'))
        .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

const actionSheetIosCss = ".sc-ion-action-sheet-ios-h{--color:initial;--button-color-activated:var(--button-color);--button-color-focused:var(--button-color);--button-color-hover:var(--button-color);--button-color-selected:var(--button-color);--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:auto;--max-height:calc(100% - (var(--ion-safe-area-top) + var(--ion-safe-area-bottom)));-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;outline:none;font-family:var(--ion-font-family, inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-action-sheet-ios-h{display:none}.action-sheet-wrapper.sc-ion-action-sheet-ios{left:0;right:0;bottom:0;-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}.action-sheet-button.sc-ion-action-sheet-ios{display:block;position:relative;width:100%;border:0;outline:none;background:var(--button-background);color:var(--button-color);font-family:inherit;overflow:hidden}.action-sheet-button.sc-ion-action-sheet-ios:disabled{color:var(--button-color-disabled);opacity:0.4}.action-sheet-button-inner.sc-ion-action-sheet-ios{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;pointer-events:none;width:100%;height:100%;z-index:1}.action-sheet-container.sc-ion-action-sheet-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:calc(100vh - (var(--ion-safe-area-top, 0) + var(--ion-safe-area-bottom, 0)));max-height:calc(100dvh - (var(--ion-safe-area-top, 0) + var(--ion-safe-area-bottom, 0)))}.action-sheet-group.sc-ion-action-sheet-ios{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:auto;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}@media (any-pointer: coarse){.action-sheet-group.sc-ion-action-sheet-ios::-webkit-scrollbar{display:none}}.action-sheet-group-cancel.sc-ion-action-sheet-ios{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-button.sc-ion-action-sheet-ios::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}.action-sheet-selected.sc-ion-action-sheet-ios{color:var(--button-color-selected)}.action-sheet-selected.sc-ion-action-sheet-ios::after{background:var(--button-background-selected);opacity:var(--button-background-selected-opacity)}.action-sheet-button.ion-activated.sc-ion-action-sheet-ios{color:var(--button-color-activated)}.action-sheet-button.ion-activated.sc-ion-action-sheet-ios::after{background:var(--button-background-activated);opacity:var(--button-background-activated-opacity)}.action-sheet-button.ion-focused.sc-ion-action-sheet-ios{color:var(--button-color-focused)}.action-sheet-button.ion-focused.sc-ion-action-sheet-ios::after{background:var(--button-background-focused);opacity:var(--button-background-focused-opacity)}@media (any-hover: hover){.action-sheet-button.sc-ion-action-sheet-ios:not(:disabled):hover{color:var(--button-color-hover)}.action-sheet-button.sc-ion-action-sheet-ios:not(:disabled):hover::after{background:var(--button-background-hover);opacity:var(--button-background-hover-opacity)}}.sc-ion-action-sheet-ios-h{--background:var(--ion-overlay-background-color, var(--ion-color-step-100, var(--ion-background-color-step-100, #f9f9f9)));--backdrop-opacity:var(--ion-backdrop-opacity, 0.4);--button-background:linear-gradient(0deg, rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08), rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08) 50%, transparent 50%) bottom/100% 1px no-repeat transparent;--button-background-activated:var(--ion-text-color, #000);--button-background-activated-opacity:.08;--button-background-hover:currentColor;--button-background-hover-opacity:.04;--button-background-focused:currentColor;--button-background-focused-opacity:.12;--button-background-selected:var(--ion-color-step-150, var(--ion-background-color-step-150, var(--ion-background-color, #fff)));--button-background-selected-opacity:1;--button-color:var(--ion-color-primary, #0054e9);--button-color-disabled:var(--ion-color-step-850, var(--ion-text-color-step-150, #262626));--color:var(--ion-color-step-400, var(--ion-text-color-step-600, #999999));text-align:center}.action-sheet-wrapper.sc-ion-action-sheet-ios{-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;margin-top:var(--ion-safe-area-top, 0);padding-bottom:var(--ion-safe-area-bottom, 0);-webkit-box-sizing:content-box;box-sizing:content-box}.action-sheet-container.sc-ion-action-sheet-ios{-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px;padding-top:0;padding-bottom:0}.action-sheet-group.sc-ion-action-sheet-ios{border-radius:13px;margin-bottom:8px}.action-sheet-group.sc-ion-action-sheet-ios:first-child{margin-top:10px}.action-sheet-group.sc-ion-action-sheet-ios:last-child{margin-bottom:10px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.action-sheet-translucent.sc-ion-action-sheet-ios-h .action-sheet-group.sc-ion-action-sheet-ios{background-color:transparent;-webkit-backdrop-filter:saturate(280%) blur(20px);backdrop-filter:saturate(280%) blur(20px)}.action-sheet-translucent.sc-ion-action-sheet-ios-h .action-sheet-title.sc-ion-action-sheet-ios,.action-sheet-translucent.sc-ion-action-sheet-ios-h .action-sheet-button.sc-ion-action-sheet-ios{background-color:transparent;background-image:-webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)), to(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8))), -webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4)), color-stop(50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4)), color-stop(50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)));background-image:linear-gradient(0deg, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8), rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 100%), linear-gradient(0deg, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4), rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4) 50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 50%);background-repeat:no-repeat;background-position:top, bottom;background-size:100% calc(100% - 1px), 100% 1px;-webkit-backdrop-filter:saturate(120%);backdrop-filter:saturate(120%)}.action-sheet-translucent.sc-ion-action-sheet-ios-h .action-sheet-button.ion-activated.sc-ion-action-sheet-ios{background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.7);background-image:none}.action-sheet-translucent.sc-ion-action-sheet-ios-h .action-sheet-cancel.sc-ion-action-sheet-ios{background:var(--button-background-selected)}}.action-sheet-title.sc-ion-action-sheet-ios{background:-webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08)), color-stop(50%, rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08)), color-stop(50%, transparent)) bottom/100% 1px no-repeat transparent;background:linear-gradient(0deg, rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08), rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08) 50%, transparent 50%) bottom/100% 1px no-repeat transparent}.action-sheet-title.sc-ion-action-sheet-ios{-webkit-padding-start:10px;padding-inline-start:10px;-webkit-padding-end:10px;padding-inline-end:10px;padding-top:14px;padding-bottom:13px;color:var(--color, var(--ion-color-step-400, var(--ion-text-color-step-600, #999999)));font-size:max(13px, 0.8125rem);font-weight:400;text-align:center}.action-sheet-title.action-sheet-has-sub-title.sc-ion-action-sheet-ios{font-weight:600}.action-sheet-sub-title.sc-ion-action-sheet-ios{padding-left:0;padding-right:0;padding-top:6px;padding-bottom:0;font-size:max(13px, 0.8125rem);font-weight:400}.action-sheet-button.sc-ion-action-sheet-ios{-webkit-padding-start:14px;padding-inline-start:14px;-webkit-padding-end:14px;padding-inline-end:14px;padding-top:14px;padding-bottom:14px;min-height:56px;font-size:max(20px, 1.25rem);contain:content}.action-sheet-button.sc-ion-action-sheet-ios .action-sheet-icon.sc-ion-action-sheet-ios{-webkit-margin-end:0.3em;margin-inline-end:0.3em;font-size:max(28px, 1.75rem);pointer-events:none}.action-sheet-button.sc-ion-action-sheet-ios:last-child{background-image:none}.action-sheet-selected.sc-ion-action-sheet-ios{font-weight:bold}.action-sheet-cancel.sc-ion-action-sheet-ios{font-weight:600}.action-sheet-cancel.sc-ion-action-sheet-ios::after{background:var(--button-background-selected);opacity:var(--button-background-selected-opacity)}.action-sheet-destructive.sc-ion-action-sheet-ios,.action-sheet-destructive.ion-activated.sc-ion-action-sheet-ios,.action-sheet-destructive.ion-focused.sc-ion-action-sheet-ios{color:var(--ion-color-danger, #c5000f)}@media (any-hover: hover){.action-sheet-destructive.sc-ion-action-sheet-ios:hover{color:var(--ion-color-danger, #c5000f)}}";
const IonActionSheetIosStyle0 = actionSheetIosCss;

const actionSheetMdCss = ".sc-ion-action-sheet-md-h{--color:initial;--button-color-activated:var(--button-color);--button-color-focused:var(--button-color);--button-color-hover:var(--button-color);--button-color-selected:var(--button-color);--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:auto;--max-height:calc(100% - (var(--ion-safe-area-top) + var(--ion-safe-area-bottom)));-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;outline:none;font-family:var(--ion-font-family, inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-action-sheet-md-h{display:none}.action-sheet-wrapper.sc-ion-action-sheet-md{left:0;right:0;bottom:0;-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}.action-sheet-button.sc-ion-action-sheet-md{display:block;position:relative;width:100%;border:0;outline:none;background:var(--button-background);color:var(--button-color);font-family:inherit;overflow:hidden}.action-sheet-button.sc-ion-action-sheet-md:disabled{color:var(--button-color-disabled);opacity:0.4}.action-sheet-button-inner.sc-ion-action-sheet-md{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;pointer-events:none;width:100%;height:100%;z-index:1}.action-sheet-container.sc-ion-action-sheet-md{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:calc(100vh - (var(--ion-safe-area-top, 0) + var(--ion-safe-area-bottom, 0)));max-height:calc(100dvh - (var(--ion-safe-area-top, 0) + var(--ion-safe-area-bottom, 0)))}.action-sheet-group.sc-ion-action-sheet-md{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:auto;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}@media (any-pointer: coarse){.action-sheet-group.sc-ion-action-sheet-md::-webkit-scrollbar{display:none}}.action-sheet-group-cancel.sc-ion-action-sheet-md{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-button.sc-ion-action-sheet-md::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}.action-sheet-selected.sc-ion-action-sheet-md{color:var(--button-color-selected)}.action-sheet-selected.sc-ion-action-sheet-md::after{background:var(--button-background-selected);opacity:var(--button-background-selected-opacity)}.action-sheet-button.ion-activated.sc-ion-action-sheet-md{color:var(--button-color-activated)}.action-sheet-button.ion-activated.sc-ion-action-sheet-md::after{background:var(--button-background-activated);opacity:var(--button-background-activated-opacity)}.action-sheet-button.ion-focused.sc-ion-action-sheet-md{color:var(--button-color-focused)}.action-sheet-button.ion-focused.sc-ion-action-sheet-md::after{background:var(--button-background-focused);opacity:var(--button-background-focused-opacity)}@media (any-hover: hover){.action-sheet-button.sc-ion-action-sheet-md:not(:disabled):hover{color:var(--button-color-hover)}.action-sheet-button.sc-ion-action-sheet-md:not(:disabled):hover::after{background:var(--button-background-hover);opacity:var(--button-background-hover-opacity)}}.sc-ion-action-sheet-md-h{--background:var(--ion-overlay-background-color, var(--ion-background-color, #fff));--backdrop-opacity:var(--ion-backdrop-opacity, 0.32);--button-background:transparent;--button-background-selected:currentColor;--button-background-selected-opacity:0;--button-background-activated:transparent;--button-background-activated-opacity:0;--button-background-hover:currentColor;--button-background-hover-opacity:.04;--button-background-focused:currentColor;--button-background-focused-opacity:.12;--button-color:var(--ion-color-step-850, var(--ion-text-color-step-150, #262626));--button-color-disabled:var(--button-color);--color:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.54)}.action-sheet-wrapper.sc-ion-action-sheet-md{-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;margin-top:var(--ion-safe-area-top, 0);margin-bottom:0}.action-sheet-title.sc-ion-action-sheet-md{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:20px;padding-bottom:17px;min-height:60px;color:var(--color, rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.54));font-size:1rem;text-align:start}.action-sheet-sub-title.sc-ion-action-sheet-md{padding-left:0;padding-right:0;padding-top:16px;padding-bottom:0;font-size:0.875rem}.action-sheet-group.sc-ion-action-sheet-md:first-child{padding-top:0}.action-sheet-group.sc-ion-action-sheet-md:last-child{padding-bottom:var(--ion-safe-area-bottom)}.action-sheet-button.sc-ion-action-sheet-md{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:12px;padding-bottom:12px;position:relative;min-height:52px;font-size:1rem;text-align:start;contain:content;overflow:hidden}.action-sheet-icon.sc-ion-action-sheet-md{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:32px;margin-inline-end:32px;margin-top:0;margin-bottom:0;color:var(--color);font-size:1.5rem}.action-sheet-button-inner.sc-ion-action-sheet-md{-ms-flex-pack:start;justify-content:flex-start}.action-sheet-selected.sc-ion-action-sheet-md{font-weight:bold}";
const IonActionSheetMdStyle0 = actionSheetMdCss;

const ActionSheet = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.didPresent = index.createEvent(this, "ionActionSheetDidPresent", 7);
        this.willPresent = index.createEvent(this, "ionActionSheetWillPresent", 7);
        this.willDismiss = index.createEvent(this, "ionActionSheetWillDismiss", 7);
        this.didDismiss = index.createEvent(this, "ionActionSheetDidDismiss", 7);
        this.didPresentShorthand = index.createEvent(this, "didPresent", 7);
        this.willPresentShorthand = index.createEvent(this, "willPresent", 7);
        this.willDismissShorthand = index.createEvent(this, "willDismiss", 7);
        this.didDismissShorthand = index.createEvent(this, "didDismiss", 7);
        this.delegateController = overlays.createDelegateController(this);
        this.lockController = lockController.createLockController();
        this.triggerController = overlays.createTriggerController();
        this.presented = false;
        this.onBackdropTap = () => {
            this.dismiss(undefined, overlays.BACKDROP);
        };
        this.dispatchCancelHandler = (ev) => {
            const role = ev.detail.role;
            if (overlays.isCancel(role)) {
                const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
                this.callButtonHandler(cancelButton);
            }
        };
        this.overlayIndex = undefined;
        this.delegate = undefined;
        this.hasController = false;
        this.keyboardClose = true;
        this.enterAnimation = undefined;
        this.leaveAnimation = undefined;
        this.buttons = [];
        this.cssClass = undefined;
        this.backdropDismiss = true;
        this.header = undefined;
        this.subHeader = undefined;
        this.translucent = false;
        this.animated = true;
        this.htmlAttributes = undefined;
        this.isOpen = false;
        this.trigger = undefined;
    }
    onIsOpenChange(newValue, oldValue) {
        if (newValue === true && oldValue === false) {
            this.present();
        }
        else if (newValue === false && oldValue === true) {
            this.dismiss();
        }
    }
    triggerChanged() {
        const { trigger, el, triggerController } = this;
        if (trigger) {
            triggerController.addClickListener(el, trigger);
        }
    }
    /**
     * Present the action sheet overlay after it has been created.
     */
    async present() {
        const unlock = await this.lockController.lock();
        await this.delegateController.attachViewToDom();
        await overlays.present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);
        unlock();
    }
    /**
     * Dismiss the action sheet overlay after it has been presented.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the action sheet.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the action sheet.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     *
     * This is a no-op if the overlay has not been presented yet. If you want
     * to remove an overlay from the DOM that was never presented, use the
     * [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method.
     */
    async dismiss(data, role) {
        const unlock = await this.lockController.lock();
        const dismissed = await overlays.dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
        if (dismissed) {
            this.delegateController.removeViewFromDom();
        }
        unlock();
        return dismissed;
    }
    /**
     * Returns a promise that resolves when the action sheet did dismiss.
     */
    onDidDismiss() {
        return overlays.eventMethod(this.el, 'ionActionSheetDidDismiss');
    }
    /**
     * Returns a promise that resolves when the action sheet will dismiss.
     *
     */
    onWillDismiss() {
        return overlays.eventMethod(this.el, 'ionActionSheetWillDismiss');
    }
    async buttonClick(button) {
        const role = button.role;
        if (overlays.isCancel(role)) {
            return this.dismiss(button.data, role);
        }
        const shouldDismiss = await this.callButtonHandler(button);
        if (shouldDismiss) {
            return this.dismiss(button.data, button.role);
        }
        return Promise.resolve();
    }
    async callButtonHandler(button) {
        if (button) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            const rtn = await overlays.safeCall(button.handler);
            if (rtn === false) {
                // if the return value of the handler is false then do not dismiss
                return false;
            }
        }
        return true;
    }
    getButtons() {
        return this.buttons.map((b) => {
            return typeof b === 'string' ? { text: b } : b;
        });
    }
    connectedCallback() {
        overlays.prepareOverlay(this.el);
        this.triggerChanged();
    }
    disconnectedCallback() {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
        this.triggerController.removeClickListener();
    }
    componentWillLoad() {
        var _a;
        if (!((_a = this.htmlAttributes) === null || _a === void 0 ? void 0 : _a.id)) {
            overlays.setOverlayId(this.el);
        }
    }
    componentDidLoad() {
        /**
         * Only create gesture if:
         * 1. A gesture does not already exist
         * 2. App is running in iOS mode
         * 3. A wrapper ref exists
         * 4. A group ref exists
         */
        const { groupEl, wrapperEl } = this;
        if (!this.gesture && ionicGlobal.getIonMode(this) === 'ios' && wrapperEl && groupEl) {
            index.readTask(() => {
                const isScrollable = groupEl.scrollHeight > groupEl.clientHeight;
                if (!isScrollable) {
                    this.gesture = buttonActive.createButtonActiveGesture(wrapperEl, (refEl) => refEl.classList.contains('action-sheet-button'));
                    this.gesture.enable(true);
                }
            });
        }
        /**
         * If action sheet was rendered with isOpen="true"
         * then we should open action sheet immediately.
         */
        if (this.isOpen === true) {
            helpers.raf(() => this.present());
        }
        /**
         * When binding values in frameworks such as Angular
         * it is possible for the value to be set after the Web Component
         * initializes but before the value watcher is set up in Stencil.
         * As a result, the watcher callback may not be fired.
         * We work around this by manually calling the watcher
         * callback when the component has loaded and the watcher
         * is configured.
         */
        this.triggerChanged();
    }
    render() {
        const { header, htmlAttributes, overlayIndex } = this;
        const mode = ionicGlobal.getIonMode(this);
        const allButtons = this.getButtons();
        const cancelButton = allButtons.find((b) => b.role === 'cancel');
        const buttons = allButtons.filter((b) => b.role !== 'cancel');
        const headerID = `action-sheet-${overlayIndex}-header`;
        return (index.h(index.Host, Object.assign({ key: '7bbd202ca9e19727e7514abbe073687d982f80c3', role: "dialog", "aria-modal": "true", "aria-labelledby": header !== undefined ? headerID : null, tabindex: "-1" }, htmlAttributes, { style: {
                zIndex: `${20000 + this.overlayIndex}`,
            }, class: Object.assign(Object.assign({ [mode]: true }, theme.getClassMap(this.cssClass)), { 'overlay-hidden': true, 'action-sheet-translucent': this.translucent }), onIonActionSheetWillDismiss: this.dispatchCancelHandler, onIonBackdropTap: this.onBackdropTap }), index.h("ion-backdrop", { key: '23344a9221a2e6720d7b9de5249dc37256cafa7b', tappable: this.backdropDismiss }), index.h("div", { key: 'fbc2ba15549c2ab04e759e82df6e177fd80cc0a6', tabindex: "0", "aria-hidden": "true" }), index.h("div", { key: '748ee5235d0b4cb26d6f1b7589f77af2e37ad28a', class: "action-sheet-wrapper ion-overlay-wrapper", ref: (el) => (this.wrapperEl = el) }, index.h("div", { key: '7ce5fa236cf75e9b1e49c4725c9a811078706554', class: "action-sheet-container" }, index.h("div", { key: 'dc2251f3bcee4a93e3449f09621cbd2b65d329e9', class: "action-sheet-group", ref: (el) => (this.groupEl = el) }, header !== undefined && (index.h("div", { key: '48d325c8a852f56ed57a9ada1a6709d05ba32ee2', id: headerID, class: {
                'action-sheet-title': true,
                'action-sheet-has-sub-title': this.subHeader !== undefined,
            } }, header, this.subHeader && index.h("div", { key: '66093728052eb67f37a35f3232761ce4a08896f3', class: "action-sheet-sub-title" }, this.subHeader))), buttons.map((b) => (index.h("button", Object.assign({}, b.htmlAttributes, { type: "button", id: b.id, class: buttonClass(b), onClick: () => this.buttonClick(b), disabled: b.disabled }), index.h("span", { class: "action-sheet-button-inner" }, b.icon && index.h("ion-icon", { icon: b.icon, "aria-hidden": "true", lazy: false, class: "action-sheet-icon" }), b.text), mode === 'md' && index.h("ion-ripple-effect", null))))), cancelButton && (index.h("div", { key: 'f4eb8e3e2885b85af5080df18d0de0bdd1d719de', class: "action-sheet-group action-sheet-group-cancel" }, index.h("button", Object.assign({ key: '169f4eb09255aba85062baad49ceb151239fbfb7' }, cancelButton.htmlAttributes, { type: "button", class: buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) }), index.h("span", { key: '25fb8a466dd67ea94c79cfb4f9965527e1ce6d42', class: "action-sheet-button-inner" }, cancelButton.icon && (index.h("ion-icon", { key: 'eb5b071e120a2c86afdf967af6a763a43044d1ca', icon: cancelButton.icon, "aria-hidden": "true", lazy: false, class: "action-sheet-icon" })), cancelButton.text), mode === 'md' && index.h("ion-ripple-effect", { key: '452ad7e1052b2c681e2d98de8193949755ad4d54' })))))), index.h("div", { key: 'e1cecf280c987c050d9445e2c458b903f153089b', tabindex: "0", "aria-hidden": "true" })));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "isOpen": ["onIsOpenChange"],
        "trigger": ["triggerChanged"]
    }; }
};
const buttonClass = (button) => {
    return Object.assign({ 'action-sheet-button': true, 'ion-activatable': !button.disabled, 'ion-focusable': !button.disabled, [`action-sheet-${button.role}`]: button.role !== undefined }, theme.getClassMap(button.cssClass));
};
ActionSheet.style = {
    ios: IonActionSheetIosStyle0,
    md: IonActionSheetMdStyle0
};

exports.ion_action_sheet = ActionSheet;
