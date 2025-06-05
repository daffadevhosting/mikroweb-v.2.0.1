/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Build, Host, h } from "@stencil/core";
import { getTimeGivenProgression } from "../../utils/animation/cubic-bezier";
import { focusFirstDescendant, focusLastDescendant } from "../../utils/focus-trap";
import { GESTURE_CONTROLLER } from "../../utils/gesture/index";
import { shouldUseCloseWatcher } from "../../utils/hardware-back-button";
import { inheritAriaAttributes, assert, clamp, isEndSide as isEnd } from "../../utils/helpers";
import { printIonError } from "../../utils/logging/index";
import { menuController } from "../../utils/menu-controller/index";
import { BACKDROP, GESTURE, getPresentedOverlay } from "../../utils/overlays";
import { isPlatform } from "../../utils/platform";
import { hostContext } from "../../utils/theme";
import { config } from "../../global/config";
import { getIonMode } from "../../global/ionic-global";
const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
const mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
const mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';
/**
 * @part container - The container for the menu content.
 * @part backdrop - The backdrop that appears over the main content when the menu is open.
 */
export class Menu {
    constructor() {
        this.lastOnEnd = 0;
        this.blocker = GESTURE_CONTROLLER.createBlocker({ disableScroll: true });
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
            const lastOverlay = getPresentedOverlay(document);
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
        this.isEndSide = isEnd(this.side);
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
            this.type = config.get('menuType', 'overlay');
        }
        if (!Build.isBrowser) {
            return;
        }
        const content = this.contentId !== undefined ? document.getElementById(this.contentId) : null;
        if (content === null) {
            printIonError('[ion-menu] - Must have a "content" element to listen for drag events on.');
            return;
        }
        if (this.el.contains(content)) {
            printIonError(`[ion-menu] - The "contentId" should refer to the main view's ion-content, not the ion-content inside of the ion-menu.`);
        }
        this.contentEl = content;
        // add menu's content classes
        content.classList.add('menu-content');
        this.typeChanged(this.type, undefined);
        this.sideChanged();
        // register this menu with the app's menu controller
        menuController._register(this);
        this.menuChanged();
        this.gesture = (await import('../../utils/gesture')).createGesture({
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
        this.inheritedAttributes = inheritAriaAttributes(this.el);
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
        menuController._unregister(this);
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
                this.close(undefined, BACKDROP);
            }
        }
    }
    onKeydown(ev) {
        if (ev.key === 'Escape') {
            this.close(undefined, BACKDROP);
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
        return menuController._setOpen(this, shouldOpen, animated, role);
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
            focusFirstDescendant(el);
            /**
             * If the cached last focused element is the same as the now-
             * active element, that means the user was on the first element
             * already and pressed Shift + Tab, so we need to wrap to the
             * last descendant.
             */
            if (this.lastFocus === doc.activeElement) {
                focusLastDescendant(el);
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
        const isEndSide = isEnd(this.side);
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
        const animation = (this.animation = await menuController._createAnimation(this.type, this));
        if (!config.getBoolean('animated', true)) {
            animation.duration(0);
        }
        animation.fill('both');
    }
    async startAnimation(shouldOpen, animated) {
        const isReversed = !shouldOpen;
        const mode = getIonMode(this);
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
        else if (menuController._getOpenSync()) {
            return false;
        }
        return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
    }
    onWillStart() {
        this.beforeAnimation(!this._isOpen, GESTURE);
        return this.loadAnimation();
    }
    onStart() {
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        // the cloned animation should not use an easing curve during seek
        this.animation.progressStart(true, this._isOpen ? 1 : 0);
    }
    onMove(detail) {
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        const delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
        const stepValue = delta / this.width;
        this.animation.progressStep(this._isOpen ? 1 - stepValue : stepValue);
    }
    onEnd(detail) {
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
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
            getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp(0, adjustedStepValue, 0.9999))[0] || 0;
        const playTo = this._isOpen ? !shouldComplete : shouldComplete;
        this.animation
            .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
            .onFinish(() => this.afterAnimation(shouldOpen, GESTURE), { oneTimeCallback: true })
            .progressEnd(playTo ? 1 : 0, this._isOpen ? 1 - newStepValue : newStepValue, 300);
    }
    beforeAnimation(shouldOpen, role) {
        assert(!this.isAnimating, '_before() should not be called while animating');
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
        if (isPlatform('android')) {
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
            if (isPlatform('android')) {
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
            this.afterAnimation(false, GESTURE);
        }
    }
    render() {
        const { type, disabled, el, isPaneVisible, inheritedAttributes, side } = this;
        const mode = getIonMode(this);
        /**
         * If the Close Watcher is enabled then
         * the ionBackButton listener in the menu controller
         * will handle closing the menu when Escape is pressed.
         */
        return (h(Host, { key: '0a2ba4ff5600b80b54d1b5b45124779c6aa0d2f2', onKeyDown: shouldUseCloseWatcher() ? null : this.onKeydown, role: "navigation", "aria-label": inheritedAttributes['aria-label'] || 'menu', class: {
                [mode]: true,
                [`menu-type-${type}`]: true,
                'menu-enabled': !disabled,
                [`menu-side-${side}`]: true,
                'menu-pane-visible': isPaneVisible,
                'split-pane-side': hostContext('ion-split-pane', el),
            } }, h("div", { key: '40a222bcde4b959abc9939c44e89ea0cf8967aba', class: "menu-inner", part: "container", ref: (el) => (this.menuInnerEl = el) }, h("slot", { key: '6a7ec5583294bb314990ff4ce6f25045652c07cb' })), h("ion-backdrop", { key: '95f1e87237f3cc24845d91b744f935bad6bb460d', ref: (el) => (this.backdropEl = el), class: "menu-backdrop", tappable: false, stopPropagation: false, part: "backdrop" })));
    }
    static get is() { return "ion-menu"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["menu.ios.scss"],
            "md": ["menu.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["menu.ios.css"],
            "md": ["menu.md.css"]
        };
    }
    static get properties() {
        return {
            "contentId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The `id` of the main content. When using\na router this is typically `ion-router-outlet`.\nWhen not using a router, this is typically\nyour main view's `ion-content`. This is not the\nid of the `ion-content` inside of your `ion-menu`."
                },
                "attribute": "content-id",
                "reflect": true
            },
            "menuId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "An id for the menu."
                },
                "attribute": "menu-id",
                "reflect": true
            },
            "type": {
                "type": "string",
                "mutable": true,
                "complexType": {
                    "original": "MenuType",
                    "resolved": "\"overlay\" | \"push\" | \"reveal\" | undefined",
                    "references": {
                        "MenuType": {
                            "location": "import",
                            "path": "./menu-interface",
                            "id": "src/components/menu/menu-interface.ts::MenuType"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The display type of the menu.\nAvailable options: `\"overlay\"`, `\"reveal\"`, `\"push\"`."
                },
                "attribute": "type",
                "reflect": false
            },
            "disabled": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the menu is disabled."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "side": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Side",
                    "resolved": "\"end\" | \"start\"",
                    "references": {
                        "Side": {
                            "location": "import",
                            "path": "./menu-interface",
                            "id": "src/components/menu/menu-interface.ts::Side"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Which side of the view the menu should be placed."
                },
                "attribute": "side",
                "reflect": true,
                "defaultValue": "'start'"
            },
            "swipeGesture": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, swiping the menu is enabled."
                },
                "attribute": "swipe-gesture",
                "reflect": false,
                "defaultValue": "true"
            },
            "maxEdgeStart": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The edge threshold for dragging the menu open.\nIf a drag/swipe happens over this value, the menu is not triggered."
                },
                "attribute": "max-edge-start",
                "reflect": false,
                "defaultValue": "50"
            }
        };
    }
    static get states() {
        return {
            "isPaneVisible": {},
            "isEndSide": {}
        };
    }
    static get events() {
        return [{
                "method": "ionWillOpen",
                "name": "ionWillOpen",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the menu is about to be opened."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionWillClose",
                "name": "ionWillClose",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the menu is about to be closed."
                },
                "complexType": {
                    "original": "MenuCloseEventDetail",
                    "resolved": "MenuCloseEventDetail",
                    "references": {
                        "MenuCloseEventDetail": {
                            "location": "import",
                            "path": "./menu-interface",
                            "id": "src/components/menu/menu-interface.ts::MenuCloseEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionDidOpen",
                "name": "ionDidOpen",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the menu is open."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionDidClose",
                "name": "ionDidClose",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the menu is closed."
                },
                "complexType": {
                    "original": "MenuCloseEventDetail",
                    "resolved": "MenuCloseEventDetail",
                    "references": {
                        "MenuCloseEventDetail": {
                            "location": "import",
                            "path": "./menu-interface",
                            "id": "src/components/menu/menu-interface.ts::MenuCloseEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionMenuChange",
                "name": "ionMenuChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the menu state is changed."
                },
                "complexType": {
                    "original": "MenuChangeEventDetail",
                    "resolved": "MenuChangeEventDetail",
                    "references": {
                        "MenuChangeEventDetail": {
                            "location": "import",
                            "path": "./menu-interface",
                            "id": "src/components/menu/menu-interface.ts::MenuChangeEventDetail"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "isOpen": {
                "complexType": {
                    "signature": "() => Promise<boolean>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Returns `true` is the menu is open.",
                    "tags": []
                }
            },
            "isActive": {
                "complexType": {
                    "signature": "() => Promise<boolean>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Returns `true` is the menu is active.\n\nA menu is active when it can be opened or closed, meaning it's enabled\nand it's not part of a `ion-split-pane`.",
                    "tags": []
                }
            },
            "open": {
                "complexType": {
                    "signature": "(animated?: boolean) => Promise<boolean>",
                    "parameters": [{
                            "name": "animated",
                            "type": "boolean",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Opens the menu. If the menu is already open or it can't be opened,\nit returns `false`.",
                    "tags": []
                }
            },
            "close": {
                "complexType": {
                    "signature": "(animated?: boolean, role?: string) => Promise<boolean>",
                    "parameters": [{
                            "name": "animated",
                            "type": "boolean",
                            "docs": ""
                        }, {
                            "name": "role",
                            "type": "string | undefined",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Closes the menu. If the menu is already closed or it can't be closed,\nit returns `false`.",
                    "tags": []
                }
            },
            "toggle": {
                "complexType": {
                    "signature": "(animated?: boolean) => Promise<boolean>",
                    "parameters": [{
                            "name": "animated",
                            "type": "boolean",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.\nIf the operation can't be completed successfully, it returns `false`.",
                    "tags": []
                }
            },
            "setOpen": {
                "complexType": {
                    "signature": "(shouldOpen: boolean, animated?: boolean, role?: string) => Promise<boolean>",
                    "parameters": [{
                            "name": "shouldOpen",
                            "type": "boolean",
                            "docs": ""
                        }, {
                            "name": "animated",
                            "type": "boolean",
                            "docs": ""
                        }, {
                            "name": "role",
                            "type": "string | undefined",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Opens or closes the button.\nIf the operation can't be completed successfully, it returns `false`.",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "type",
                "methodName": "typeChanged"
            }, {
                "propName": "disabled",
                "methodName": "disabledChanged"
            }, {
                "propName": "side",
                "methodName": "sideChanged"
            }, {
                "propName": "swipeGesture",
                "methodName": "swipeGestureChanged"
            }];
    }
    static get listeners() {
        return [{
                "name": "ionSplitPaneVisible",
                "method": "onSplitPaneChanged",
                "target": "body",
                "capture": false,
                "passive": false
            }, {
                "name": "click",
                "method": "onBackdropClick",
                "target": undefined,
                "capture": true,
                "passive": false
            }];
    }
}
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
