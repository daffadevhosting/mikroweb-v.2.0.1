/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const cubicBezier = require('./cubic-bezier-f2dccc53.js');
const overlays = require('./overlays-4c291a05.js');
const gestureController = require('./gesture-controller-9436f482.js');
const hardwareBackButton = require('./hardware-back-button-3d2b1004.js');
const helpers = require('./helpers-8a48fdea.js');
const index$1 = require('./index-cc858e97.js');
const index$2 = require('./index-a96d31ae.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');
const theme = require('./theme-d1c573d2.js');
const index$3 = require('./index-073c7cdc.js');
require('./index-c8d52405.js');
require('./framework-delegate-862d9d00.js');
require('./animation-ab2d3449.js');

const menuIosCss = ":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{-webkit-transform:translateX(-9999px);transform:translateX(-9999px);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;top:0;bottom:0}:host(.menu-side-start) .menu-inner{inset-inline-start:0;inset-inline-end:auto}:host-context([dir=rtl]):host(.menu-side-start) .menu-inner,:host-context([dir=rtl]).menu-side-start .menu-inner{--ion-safe-area-right:unset;--ion-safe-area-left:0px}@supports selector(:dir(rtl)){:host(.menu-side-start:dir(rtl)) .menu-inner{--ion-safe-area-right:unset;--ion-safe-area-left:0px}}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;top:0;bottom:0}:host(.menu-side-end) .menu-inner{inset-inline-start:auto;inset-inline-end:0}:host-context([dir=rtl]):host(.menu-side-end) .menu-inner,:host-context([dir=rtl]).menu-side-end .menu-inner{--ion-safe-area-left:unset;--ion-safe-area-right:0px}@supports selector(:dir(rtl)){:host(.menu-side-end:dir(rtl)) .menu-inner{--ion-safe-area-left:unset;--ion-safe-area-right:0px}}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){-ms-flex:0 1 auto;flex:0 1 auto;width:var(--side-width, var(--width));min-width:var(--side-min-width, var(--min-width));max-width:var(--side-max-width, var(--max-width))}:host(.menu-pane-visible.split-pane-side){left:0;right:0;top:0;bottom:0;position:relative;-webkit-box-shadow:none;box-shadow:none;z-index:0}:host(.menu-pane-visible.split-pane-side.menu-enabled){display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0}:host(.menu-pane-visible.split-pane-side){-ms-flex-order:-1;order:-1}:host(.menu-pane-visible.split-pane-side[side=end]){-ms-flex-order:1;order:1}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none;transform:none;-webkit-box-shadow:none;box-shadow:none}:host(.menu-pane-visible) ion-backdrop{display:hidden !important}:host(.menu-pane-visible.split-pane-side){-webkit-border-start:0;border-inline-start:0;-webkit-border-end:var(--border);border-inline-end:var(--border);border-top:0;border-bottom:0;min-width:var(--side-min-width);max-width:var(--side-max-width)}:host(.menu-pane-visible.split-pane-side[side=end]){-webkit-border-start:var(--border);border-inline-start:var(--border);-webkit-border-end:0;border-inline-end:0;border-top:0;border-bottom:0;min-width:var(--side-min-width);max-width:var(--side-max-width)}:host(.menu-type-push){z-index:1000}:host(.menu-type-push) .show-backdrop{display:block}";
const IonMenuIosStyle0 = menuIosCss;

const menuMdCss = ":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{-webkit-transform:translateX(-9999px);transform:translateX(-9999px);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;top:0;bottom:0}:host(.menu-side-start) .menu-inner{inset-inline-start:0;inset-inline-end:auto}:host-context([dir=rtl]):host(.menu-side-start) .menu-inner,:host-context([dir=rtl]).menu-side-start .menu-inner{--ion-safe-area-right:unset;--ion-safe-area-left:0px}@supports selector(:dir(rtl)){:host(.menu-side-start:dir(rtl)) .menu-inner{--ion-safe-area-right:unset;--ion-safe-area-left:0px}}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;top:0;bottom:0}:host(.menu-side-end) .menu-inner{inset-inline-start:auto;inset-inline-end:0}:host-context([dir=rtl]):host(.menu-side-end) .menu-inner,:host-context([dir=rtl]).menu-side-end .menu-inner{--ion-safe-area-left:unset;--ion-safe-area-right:0px}@supports selector(:dir(rtl)){:host(.menu-side-end:dir(rtl)) .menu-inner{--ion-safe-area-left:unset;--ion-safe-area-right:0px}}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){-ms-flex:0 1 auto;flex:0 1 auto;width:var(--side-width, var(--width));min-width:var(--side-min-width, var(--min-width));max-width:var(--side-max-width, var(--max-width))}:host(.menu-pane-visible.split-pane-side){left:0;right:0;top:0;bottom:0;position:relative;-webkit-box-shadow:none;box-shadow:none;z-index:0}:host(.menu-pane-visible.split-pane-side.menu-enabled){display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0}:host(.menu-pane-visible.split-pane-side){-ms-flex-order:-1;order:-1}:host(.menu-pane-visible.split-pane-side[side=end]){-ms-flex-order:1;order:1}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none;transform:none;-webkit-box-shadow:none;box-shadow:none}:host(.menu-pane-visible) ion-backdrop{display:hidden !important}:host(.menu-pane-visible.split-pane-side){-webkit-border-start:0;border-inline-start:0;-webkit-border-end:var(--border);border-inline-end:var(--border);border-top:0;border-bottom:0;min-width:var(--side-min-width);max-width:var(--side-max-width)}:host(.menu-pane-visible.split-pane-side[side=end]){-webkit-border-start:var(--border);border-inline-start:var(--border);-webkit-border-end:0;border-inline-end:0;border-top:0;border-bottom:0;min-width:var(--side-min-width);max-width:var(--side-max-width)}:host(.menu-type-overlay) .menu-inner{-webkit-box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18);box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18)}";
const IonMenuMdStyle0 = menuMdCss;

const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
const mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
const mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';
const Menu = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.ionWillOpen = index.createEvent(this, "ionWillOpen", 7);
        this.ionWillClose = index.createEvent(this, "ionWillClose", 7);
        this.ionDidOpen = index.createEvent(this, "ionDidOpen", 7);
        this.ionDidClose = index.createEvent(this, "ionDidClose", 7);
        this.ionMenuChange = index.createEvent(this, "ionMenuChange", 7);
        this.lastOnEnd = 0;
        this.blocker = gestureController.GESTURE_CONTROLLER.createBlocker({ disableScroll: true });
        this.didLoad = false;
        /**
         * Flag used to determine if an open/close
         * operation was cancelled. For example, if
         * an app calls "menu.open" then disables the menu
         * part way through the animation, then this would
         * be considered a cancelled operation.
         */
        this.operationCancelled = false;
        this.isAnimating = false;
        this._isOpen = false;
        this.inheritedAttributes = {};
        this.handleFocus = (ev) => {
            /**
             * Overlays have their own focus trapping listener
             * so we do not want the two listeners to conflict
             * with each other. If the top-most overlay that is
             * open does not contain this ion-menu, then ion-menu's
             * focus trapping should not run.
             */
            const lastOverlay = overlays.getPresentedOverlay(document);
            if (lastOverlay && !lastOverlay.contains(this.el)) {
                return;
            }
            this.trapKeyboardFocus(ev, document);
        };
        this.isPaneVisible = false;
        this.isEndSide = false;
        this.contentId = undefined;
        this.menuId = undefined;
        this.type = undefined;
        this.disabled = false;
        this.side = 'start';
        this.swipeGesture = true;
        this.maxEdgeStart = 50;
    }
    typeChanged(type, oldType) {
        const contentEl = this.contentEl;
        if (contentEl) {
            if (oldType !== undefined) {
                contentEl.classList.remove(`menu-content-${oldType}`);
            }
            contentEl.classList.add(`menu-content-${type}`);
            contentEl.removeAttribute('style');
        }
        if (this.menuInnerEl) {
            // Remove effects of previous animations
            this.menuInnerEl.removeAttribute('style');
        }
        this.animation = undefined;
    }
    disabledChanged() {
        this.updateState();
        this.ionMenuChange.emit({
            disabled: this.disabled,
            open: this._isOpen,
        });
    }
    sideChanged() {
        this.isEndSide = helpers.isEndSide(this.side);
        /**
         * Menu direction animation is calculated based on the document direction.
         * If the document direction changes, we need to create a new animation.
         */
        this.animation = undefined;
    }
    swipeGestureChanged() {
        this.updateState();
    }
    async connectedCallback() {
        // TODO: connectedCallback is fired in CE build
        // before WC is defined. This needs to be fixed in Stencil.
        if (typeof customElements !== 'undefined' && customElements != null) {
            await customElements.whenDefined('ion-menu');
        }
        if (this.type === undefined) {
            this.type = index$1.config.get('menuType', 'overlay');
        }
        const content = this.contentId !== undefined ? document.getElementById(this.contentId) : null;
        if (content === null) {
            index$1.printIonError('[ion-menu] - Must have a "content" element to listen for drag events on.');
            return;
        }
        if (this.el.contains(content)) {
            index$1.printIonError(`[ion-menu] - The "contentId" should refer to the main view's ion-content, not the ion-content inside of the ion-menu.`);
        }
        this.contentEl = content;
        // add menu's content classes
        content.classList.add('menu-content');
        this.typeChanged(this.type, undefined);
        this.sideChanged();
        // register this menu with the app's menu controller
        index$2.menuController._register(this);
        this.menuChanged();
        this.gesture = (await Promise.resolve().then(function () { return require('./index-ee07ed59.js'); })).createGesture({
            el: document,
            gestureName: 'menu-swipe',
            gesturePriority: 30,
            threshold: 10,
            blurOnStart: true,
            canStart: (ev) => this.canStart(ev),
            onWillStart: () => this.onWillStart(),
            onStart: () => this.onStart(),
            onMove: (ev) => this.onMove(ev),
            onEnd: (ev) => this.onEnd(ev),
        });
        this.updateState();
    }
    componentWillLoad() {
        this.inheritedAttributes = helpers.inheritAriaAttributes(this.el);
    }
    async componentDidLoad() {
        this.didLoad = true;
        /**
         * A menu inside of a split pane is assumed
         * to be a side pane.
         *
         * When the menu is loaded it needs to
         * see if it should be considered visible inside
         * of the split pane. If the split pane is
         * hidden then the menu should be too.
         */
        const splitPane = this.el.closest('ion-split-pane');
        if (splitPane !== null) {
            this.isPaneVisible = await splitPane.isVisible();
        }
        this.menuChanged();
        this.updateState();
    }
    menuChanged() {
        /**
         * Inform dependent components such as ion-menu-button
         * that the menu is ready. Note that we only want to do this
         * once the menu has been rendered which is why we check for didLoad.
         */
        if (this.didLoad) {
            this.ionMenuChange.emit({ disabled: this.disabled, open: this._isOpen });
        }
    }
    async disconnectedCallback() {
        /**
         * The menu should be closed when it is
         * unmounted from the DOM.
         * This is an async call, so we need to wait for
         * this to finish otherwise contentEl
         * will not have MENU_CONTENT_OPEN removed.
         */
        await this.close(false);
        this.blocker.destroy();
        index$2.menuController._unregister(this);
        if (this.animation) {
            this.animation.destroy();
        }
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
        this.animation = undefined;
        this.contentEl = undefined;
    }
    onSplitPaneChanged(ev) {
        const closestSplitPane = this.el.closest('ion-split-pane');
        if (closestSplitPane !== null && closestSplitPane === ev.target) {
            this.isPaneVisible = ev.detail.visible;
            this.updateState();
        }
    }
    onBackdropClick(ev) {
        // TODO(FW-2832): type (CustomEvent triggers errors which should be sorted)
        if (this._isOpen && this.lastOnEnd < ev.timeStamp - 100) {
            const shouldClose = ev.composedPath ? !ev.composedPath().includes(this.menuInnerEl) : false;
            if (shouldClose) {
                ev.preventDefault();
                ev.stopPropagation();
                this.close(undefined, overlays.BACKDROP);
            }
        }
    }
    onKeydown(ev) {
        if (ev.key === 'Escape') {
            this.close(undefined, overlays.BACKDROP);
        }
    }
    /**
     * Returns `true` is the menu is open.
     */
    isOpen() {
        return Promise.resolve(this._isOpen);
    }
    /**
     * Returns `true` is the menu is active.
     *
     * A menu is active when it can be opened or closed, meaning it's enabled
     * and it's not part of a `ion-split-pane`.
     */
    isActive() {
        return Promise.resolve(this._isActive());
    }
    /**
     * Opens the menu. If the menu is already open or it can't be opened,
     * it returns `false`.
     */
    open(animated = true) {
        return this.setOpen(true, animated);
    }
    /**
     * Closes the menu. If the menu is already closed or it can't be closed,
     * it returns `false`.
     */
    close(animated = true, role) {
        return this.setOpen(false, animated, role);
    }
    /**
     * Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.
     * If the operation can't be completed successfully, it returns `false`.
     */
    toggle(animated = true) {
        return this.setOpen(!this._isOpen, animated);
    }
    /**
     * Opens or closes the button.
     * If the operation can't be completed successfully, it returns `false`.
     */
    setOpen(shouldOpen, animated = true, role) {
        return index$2.menuController._setOpen(this, shouldOpen, animated, role);
    }
    trapKeyboardFocus(ev, doc) {
        const target = ev.target;
        if (!target) {
            return;
        }
        /**
         * If the target is inside the menu contents, let the browser
         * focus as normal and keep a log of the last focused element.
         */
        if (this.el.contains(target)) {
            this.lastFocus = target;
        }
        else {
            /**
             * Otherwise, we are about to have focus go out of the menu.
             * Wrap the focus to either the first or last element.
             */
            const { el } = this;
            /**
             * Once we call `focusFirstDescendant`, another focus event
             * will fire, which will cause `lastFocus` to be updated
             * before we can run the code after that. We cache the value
             * here to avoid that.
             */
            overlays.focusFirstDescendant(el);
            /**
             * If the cached last focused element is the same as the now-
             * active element, that means the user was on the first element
             * already and pressed Shift + Tab, so we need to wrap to the
             * last descendant.
             */
            if (this.lastFocus === doc.activeElement) {
                overlays.focusLastDescendant(el);
            }
        }
    }
    async _setOpen(shouldOpen, animated = true, role) {
        // If the menu is disabled or it is currently being animated, let's do nothing
        if (!this._isActive() || this.isAnimating || shouldOpen === this._isOpen) {
            return false;
        }
        this.beforeAnimation(shouldOpen, role);
        await this.loadAnimation();
        await this.startAnimation(shouldOpen, animated);
        /**
         * If the animation was cancelled then
         * return false because the operation
         * did not succeed.
         */
        if (this.operationCancelled) {
            this.operationCancelled = false;
            return false;
        }
        this.afterAnimation(shouldOpen, role);
        return true;
    }
    async loadAnimation() {
        // Menu swipe animation takes the menu's inner width as parameter,
        // If `offsetWidth` changes, we need to create a new animation.
        const width = this.menuInnerEl.offsetWidth;
        /**
         * Menu direction animation is calculated based on the document direction.
         * If the document direction changes, we need to create a new animation.
         */
        const isEndSide = helpers.isEndSide(this.side);
        if (width === this.width && this.animation !== undefined && isEndSide === this.isEndSide) {
            return;
        }
        this.width = width;
        this.isEndSide = isEndSide;
        // Destroy existing animation
        if (this.animation) {
            this.animation.destroy();
            this.animation = undefined;
        }
        // Create new animation
        const animation = (this.animation = await index$2.menuController._createAnimation(this.type, this));
        if (!index$1.config.getBoolean('animated', true)) {
            animation.duration(0);
        }
        animation.fill('both');
    }
    async startAnimation(shouldOpen, animated) {
        const isReversed = !shouldOpen;
        const mode = ionicGlobal.getIonMode(this);
        const easing = mode === 'ios' ? iosEasing : mdEasing;
        const easingReverse = mode === 'ios' ? iosEasingReverse : mdEasingReverse;
        const ani = this.animation
            .direction(isReversed ? 'reverse' : 'normal')
            .easing(isReversed ? easingReverse : easing);
        if (animated) {
            await ani.play();
        }
        else {
            ani.play({ sync: true });
        }
        /**
         * We run this after the play invocation
         * instead of using ani.onFinish so that
         * multiple onFinish callbacks do not get
         * run if an animation is played, stopped,
         * and then played again.
         */
        if (ani.getDirection() === 'reverse') {
            ani.direction('normal');
        }
    }
    _isActive() {
        return !this.disabled && !this.isPaneVisible;
    }
    canSwipe() {
        return this.swipeGesture && !this.isAnimating && this._isActive();
    }
    canStart(detail) {
        // Do not allow swipe gesture if a modal is open
        const isModalPresented = !!document.querySelector('ion-modal.show-modal');
        if (isModalPresented || !this.canSwipe()) {
            return false;
        }
        if (this._isOpen) {
            return true;
        }
        else if (index$2.menuController._getOpenSync()) {
            return false;
        }
        return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
    }
    onWillStart() {
        this.beforeAnimation(!this._isOpen, overlays.GESTURE);
        return this.loadAnimation();
    }
    onStart() {
        if (!this.isAnimating || !this.animation) {
            helpers.assert(false, 'isAnimating has to be true');
            return;
        }
        // the cloned animation should not use an easing curve during seek
        this.animation.progressStart(true, this._isOpen ? 1 : 0);
    }
    onMove(detail) {
        if (!this.isAnimating || !this.animation) {
            helpers.assert(false, 'isAnimating has to be true');
            return;
        }
        const delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
        const stepValue = delta / this.width;
        this.animation.progressStep(this._isOpen ? 1 - stepValue : stepValue);
    }
    onEnd(detail) {
        if (!this.isAnimating || !this.animation) {
            helpers.assert(false, 'isAnimating has to be true');
            return;
        }
        const isOpen = this._isOpen;
        const isEndSide = this.isEndSide;
        const delta = computeDelta(detail.deltaX, isOpen, isEndSide);
        const width = this.width;
        const stepValue = delta / width;
        const velocity = detail.velocityX;
        const z = width / 2.0;
        const shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);
        const shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);
        const shouldComplete = isOpen
            ? isEndSide
                ? shouldCompleteRight
                : shouldCompleteLeft
            : isEndSide
                ? shouldCompleteLeft
                : shouldCompleteRight;
        let shouldOpen = !isOpen && shouldComplete;
        if (isOpen && !shouldComplete) {
            shouldOpen = true;
        }
        this.lastOnEnd = detail.currentTime;
        // Account for rounding errors in JS
        let newStepValue = shouldComplete ? 0.001 : -0.001;
        /**
         * stepValue can sometimes return a negative
         * value, but you can't have a negative time value
         * for the cubic bezier curve (at least with web animations)
         */
        const adjustedStepValue = stepValue < 0 ? 0.01 : stepValue;
        /**
         * Animation will be reversed here, so need to
         * reverse the easing curve as well
         *
         * Additionally, we need to account for the time relative
         * to the new easing curve, as `stepValue` is going to be given
         * in terms of a linear curve.
         */
        newStepValue +=
            cubicBezier.getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], helpers.clamp(0, adjustedStepValue, 0.9999))[0] || 0;
        const playTo = this._isOpen ? !shouldComplete : shouldComplete;
        this.animation
            .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
            .onFinish(() => this.afterAnimation(shouldOpen, overlays.GESTURE), { oneTimeCallback: true })
            .progressEnd(playTo ? 1 : 0, this._isOpen ? 1 - newStepValue : newStepValue, 300);
    }
    beforeAnimation(shouldOpen, role) {
        helpers.assert(!this.isAnimating, '_before() should not be called while animating');
        /**
         * When the menu is presented on an Android device, TalkBack's focus rings
         * may appear in the wrong position due to the transition (specifically
         * `transform` styles). This occurs because the focus rings are initially
         * displayed at the starting position of the elements before the transition
         * begins. This workaround ensures the focus rings do not appear in the
         * incorrect location.
         *
         * If this solution is applied to iOS devices, then it leads to a bug where
         * the overlays cannot be accessed by screen readers. This is due to
         * VoiceOver not being able to update the accessibility tree when the
         * `aria-hidden` is removed.
         */
        if (ionicGlobal.isPlatform('android')) {
            this.el.setAttribute('aria-hidden', 'true');
        }
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        this.el.classList.add(SHOW_MENU);
        /**
         * We add a tabindex here so that focus trapping
         * still works even if the menu does not have
         * any focusable elements slotted inside. The
         * focus trapping utility will fallback to focusing
         * the menu so focus does not leave when the menu
         * is open.
         */
        this.el.setAttribute('tabindex', '0');
        if (this.backdropEl) {
            this.backdropEl.classList.add(SHOW_BACKDROP);
        }
        // add css class and hide content behind menu from screen readers
        if (this.contentEl) {
            this.contentEl.classList.add(MENU_CONTENT_OPEN);
            /**
             * When the menu is open and overlaying the main
             * content, the main content should not be announced
             * by the screenreader as the menu is the main
             * focus. This is useful with screenreaders that have
             * "read from top" gestures that read the entire
             * page from top to bottom when activated.
             * This should be done before the animation starts
             * so that users cannot accidentally scroll
             * the content while dragging a menu open.
             */
            this.contentEl.setAttribute('aria-hidden', 'true');
        }
        this.blocker.block();
        this.isAnimating = true;
        if (shouldOpen) {
            this.ionWillOpen.emit();
        }
        else {
            this.ionWillClose.emit({ role });
        }
    }
    afterAnimation(isOpen, role) {
        var _a;
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events
        this._isOpen = isOpen;
        this.isAnimating = false;
        if (!this._isOpen) {
            this.blocker.unblock();
        }
        if (isOpen) {
            /**
             * When the menu is presented on an Android device, TalkBack's focus rings
             * may appear in the wrong position due to the transition (specifically
             * `transform` styles). The menu is hidden from screen readers during the
             * transition to prevent this. Once the transition is complete, the menu
             * is shown again.
             */
            if (ionicGlobal.isPlatform('android')) {
                this.el.removeAttribute('aria-hidden');
            }
            // emit open event
            this.ionDidOpen.emit();
            /**
             * Move focus to the menu to prepare focus trapping, as long as
             * it isn't already focused. Use the host element instead of the
             * first descendant to avoid the scroll position jumping around.
             */
            const focusedMenu = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.closest('ion-menu');
            if (focusedMenu !== this.el) {
                this.el.focus();
            }
            // start focus trapping
            document.addEventListener('focus', this.handleFocus, true);
        }
        else {
            this.el.removeAttribute('aria-hidden');
            // remove css classes and unhide content from screen readers
            this.el.classList.remove(SHOW_MENU);
            /**
             * Remove tabindex from the menu component
             * so that is cannot be tabbed to.
             */
            this.el.removeAttribute('tabindex');
            if (this.contentEl) {
                this.contentEl.classList.remove(MENU_CONTENT_OPEN);
                /**
                 * Remove aria-hidden so screen readers
                 * can announce the main content again
                 * now that the menu is not the main focus.
                 */
                this.contentEl.removeAttribute('aria-hidden');
            }
            if (this.backdropEl) {
                this.backdropEl.classList.remove(SHOW_BACKDROP);
            }
            if (this.animation) {
                this.animation.stop();
            }
            // emit close event
            this.ionDidClose.emit({ role });
            // undo focus trapping so multiple menus don't collide
            document.removeEventListener('focus', this.handleFocus, true);
        }
    }
    updateState() {
        const isActive = this._isActive();
        if (this.gesture) {
            this.gesture.enable(isActive && this.swipeGesture);
        }
        /**
         * If the menu is disabled but it is still open
         * then we should close the menu immediately.
         * Additionally, if the menu is in the process
         * of animating {open, close} and the menu is disabled
         * then it should still be closed immediately.
         */
        if (!isActive) {
            /**
             * It is possible to disable the menu while
             * it is mid-animation. When this happens, we
             * need to set the operationCancelled flag
             * so that this._setOpen knows to return false
             * and not run the "afterAnimation" callback.
             */
            if (this.isAnimating) {
                this.operationCancelled = true;
            }
            /**
             * If the menu is disabled then we should
             * forcibly close the menu even if it is open.
             */
            this.afterAnimation(false, overlays.GESTURE);
        }
    }
    render() {
        const { type, disabled, el, isPaneVisible, inheritedAttributes, side } = this;
        const mode = ionicGlobal.getIonMode(this);
        /**
         * If the Close Watcher is enabled then
         * the ionBackButton listener in the menu controller
         * will handle closing the menu when Escape is pressed.
         */
        return (index.h(index.Host, { key: '0a2ba4ff5600b80b54d1b5b45124779c6aa0d2f2', onKeyDown: hardwareBackButton.shouldUseCloseWatcher() ? null : this.onKeydown, role: "navigation", "aria-label": inheritedAttributes['aria-label'] || 'menu', class: {
                [mode]: true,
                [`menu-type-${type}`]: true,
                'menu-enabled': !disabled,
                [`menu-side-${side}`]: true,
                'menu-pane-visible': isPaneVisible,
                'split-pane-side': theme.hostContext('ion-split-pane', el),
            } }, index.h("div", { key: '40a222bcde4b959abc9939c44e89ea0cf8967aba', class: "menu-inner", part: "container", ref: (el) => (this.menuInnerEl = el) }, index.h("slot", { key: '6a7ec5583294bb314990ff4ce6f25045652c07cb' })), index.h("ion-backdrop", { key: '95f1e87237f3cc24845d91b744f935bad6bb460d', ref: (el) => (this.backdropEl = el), class: "menu-backdrop", tappable: false, stopPropagation: false, part: "backdrop" })));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "type": ["typeChanged"],
        "disabled": ["disabledChanged"],
        "side": ["sideChanged"],
        "swipeGesture": ["swipeGestureChanged"]
    }; }
};
const computeDelta = (deltaX, isOpen, isEndSide) => {
    return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
};
const checkEdgeSide = (win, posX, isEndSide, maxEdgeStart) => {
    if (isEndSide) {
        return posX >= win.innerWidth - maxEdgeStart;
    }
    else {
        return posX <= maxEdgeStart;
    }
};
const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';
Menu.style = {
    ios: IonMenuIosStyle0,
    md: IonMenuMdStyle0
};

// Given a menu, return whether or not the menu toggle should be visible
const updateVisibility = async (menu) => {
    const menuEl = await index$2.menuController.get(menu);
    return !!(menuEl && (await menuEl.isActive()));
};

const menuButtonIosCss = ":host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.1;--border-radius:4px;--color:var(--ion-color-primary, #0054e9);--padding-start:5px;--padding-end:5px;min-height:32px;font-size:clamp(31px, 1.9375rem, 38.13px)}:host(.ion-activated){opacity:0.4}@media (any-hover: hover){:host(:hover){opacity:0.6}}";
const IonMenuButtonIosStyle0 = menuButtonIosCss;

const menuButtonMdCss = ":host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;min-height:inherit;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.12;--background-hover:currentColor;--background-hover-opacity:.04;--border-radius:50%;--color:initial;--padding-start:8px;--padding-end:8px;width:3rem;height:3rem;font-size:1.5rem}:host(.ion-color.ion-focused)::after{background:var(--ion-color-base)}@media (any-hover: hover){:host(.ion-color:hover) .button-native::after{background:var(--ion-color-base)}}";
const IonMenuButtonMdStyle0 = menuButtonMdCss;

const MenuButton = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.inheritedAttributes = {};
        this.onClick = async () => {
            return index$2.menuController.toggle(this.menu);
        };
        this.visible = false;
        this.color = undefined;
        this.disabled = false;
        this.menu = undefined;
        this.autoHide = true;
        this.type = 'button';
    }
    componentWillLoad() {
        this.inheritedAttributes = helpers.inheritAriaAttributes(this.el);
    }
    componentDidLoad() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const { color, disabled, inheritedAttributes } = this;
        const mode = ionicGlobal.getIonMode(this);
        const menuIcon = index$1.config.get('menuIcon', mode === 'ios' ? index$3.menuOutline : index$3.menuSharp);
        const hidden = this.autoHide && !this.visible;
        const attrs = {
            type: this.type,
        };
        const ariaLabel = inheritedAttributes['aria-label'] || 'menu';
        return (index.h(index.Host, { key: '3cde3704f28eb275f4a5ff2985bbb68c1024e79c', onClick: this.onClick, "aria-disabled": disabled ? 'true' : null, "aria-hidden": hidden ? 'true' : null, class: theme.createColorClasses(color, {
                [mode]: true,
                button: true, // ion-buttons target .button
                'menu-button-hidden': hidden,
                'menu-button-disabled': disabled,
                'in-toolbar': theme.hostContext('ion-toolbar', this.el),
                'in-toolbar-color': theme.hostContext('ion-toolbar[color]', this.el),
                'ion-activatable': true,
                'ion-focusable': true,
            }) }, index.h("button", Object.assign({ key: 'a02a3374288bd1759b6e352ada8eab0d45c6422f' }, attrs, { disabled: disabled, class: "button-native", part: "native", "aria-label": ariaLabel }), index.h("span", { key: 'ba699f2277a4e7b27ce5e42faeefc53d8805bb43', class: "button-inner" }, index.h("slot", { key: '829fe6cbdeb173f50d1a670389d1565baa6273e4' }, index.h("ion-icon", { key: 'a9a9f7b8dcffc648a8429fe0adbe766869de72fd', part: "icon", icon: menuIcon, mode: mode, lazy: false, "aria-hidden": "true" }))), mode === 'md' && index.h("ion-ripple-effect", { key: '48deca9a771a249f2fc76eaa8b9741c8d66d8355', type: "unbounded" }))));
    }
    get el() { return index.getElement(this); }
};
MenuButton.style = {
    ios: IonMenuButtonIosStyle0,
    md: IonMenuButtonMdStyle0
};

const menuToggleCss = ":host(.menu-toggle-hidden){display:none}";
const IonMenuToggleStyle0 = menuToggleCss;

const MenuToggle = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.onClick = () => {
            return index$2.menuController.toggle(this.menu);
        };
        this.visible = false;
        this.menu = undefined;
        this.autoHide = true;
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (index.h(index.Host, { key: '88e88fa13ac7f10ba3acfe378bd11cda0c7e2749', onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, index.h("slot", { key: '0a14c7b63eda64702d2fd1b4bc7db4809892842d' })));
    }
};
MenuToggle.style = IonMenuToggleStyle0;

exports.ion_menu = Menu;
exports.ion_menu_button = MenuButton;
exports.ion_menu_toggle = MenuToggle;
