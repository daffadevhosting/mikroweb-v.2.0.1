/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, writeTask, h, Host } from '@stencil/core/internal/client';
import { r as raf } from './helpers.js';
import { i as isRTL } from './dir.js';
import { c as createColorClasses, h as hostContext } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const segmentIosCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:grid;grid-auto-columns:1fr;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto;grid-auto-columns:minmax(-webkit-min-content, 1fr);grid-auto-columns:minmax(min-content, 1fr)}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.065);border-radius:8px;overflow:hidden;z-index:0}:host(.ion-color){background:rgba(var(--ion-color-base-rgb), 0.065)}:host(.in-toolbar){-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;margin-top:0;margin-bottom:0;width:auto}:host(.in-toolbar:not(.ion-color)){background:var(--ion-toolbar-segment-background, var(--background))}:host(.in-toolbar-color:not(.ion-color)){background:rgba(var(--ion-color-contrast-rgb), 0.11)}";
const IonSegmentIosStyle0 = segmentIosCss;

const segmentMdCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:grid;grid-auto-columns:1fr;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto;grid-auto-columns:minmax(-webkit-min-content, 1fr);grid-auto-columns:minmax(min-content, 1fr)}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:transparent;grid-auto-columns:minmax(auto, 360px)}:host(.in-toolbar){min-height:var(--min-height)}:host(.segment-scrollable) ::slotted(ion-segment-button){min-width:auto}";
const IonSegmentMdStyle0 = segmentMdCss;

const Segment = /*@__PURE__*/ proxyCustomElement(class Segment extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionSelect = createEvent(this, "ionSelect", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.segmentViewEl = null;
        this.onClick = (ev) => {
            const current = ev.target;
            const previous = this.checked;
            // If the current element is a segment then that means
            // the user tried to swipe to a segment button and
            // click a segment button at the same time so we should
            // not update the checked segment button
            if (current.tagName === 'ION-SEGMENT') {
                return;
            }
            this.value = current.value;
            if (current !== previous) {
                this.emitValueChange();
            }
            if (this.segmentViewEl) {
                this.updateSegmentView();
                if (this.scrollable && previous) {
                    this.checkButton(previous, current);
                }
            }
            else if (this.scrollable || !this.swipeGesture) {
                if (previous) {
                    this.checkButton(previous, current);
                }
                else {
                    this.setCheckedClasses();
                }
            }
        };
        this.onSlottedItemsChange = () => {
            /**
             * When the slotted segment buttons change we need to
             * ensure that the new segment buttons are checked if
             * the value matches the segment button value.
             */
            this.valueChanged(this.value);
        };
        this.getSegmentButton = (selector) => {
            var _a, _b;
            const buttons = this.getButtons().filter((button) => !button.disabled);
            const currIndex = buttons.findIndex((button) => button === document.activeElement);
            switch (selector) {
                case 'first':
                    return buttons[0];
                case 'last':
                    return buttons[buttons.length - 1];
                case 'next':
                    return (_a = buttons[currIndex + 1]) !== null && _a !== void 0 ? _a : buttons[0];
                case 'previous':
                    return (_b = buttons[currIndex - 1]) !== null && _b !== void 0 ? _b : buttons[buttons.length - 1];
                default:
                    return null;
            }
        };
        this.activated = false;
        this.color = undefined;
        this.disabled = false;
        this.scrollable = false;
        this.swipeGesture = true;
        this.value = undefined;
        this.selectOnFocus = false;
    }
    colorChanged(value, oldValue) {
        /**
         * If color is set after not having
         * previously been set (or vice versa),
         * we need to emit style so the segment-buttons
         * can apply their color classes properly.
         */
        if ((oldValue === undefined && value !== undefined) || (oldValue !== undefined && value === undefined)) {
            this.emitStyle();
        }
    }
    swipeGestureChanged() {
        this.gestureChanged();
    }
    valueChanged(value, oldValue) {
        // Force a value to exist if we're using a segment view
        if (this.segmentViewEl && value === undefined) {
            this.value = this.getButtons()[0].value;
            return;
        }
        if (oldValue !== undefined && value !== undefined) {
            const buttons = this.getButtons();
            const previous = buttons.find((button) => button.value === oldValue);
            const current = buttons.find((button) => button.value === value);
            if (previous && current) {
                if (!this.segmentViewEl) {
                    this.checkButton(previous, current);
                }
                else if (this.triggerScrollOnValueChange !== false) {
                    this.updateSegmentView();
                }
            }
        }
        else if (value !== undefined && oldValue === undefined && this.segmentViewEl) {
            this.updateSegmentView();
        }
        /**
         * `ionSelect` is emitted every time the value changes (internal or external changes).
         * Used by `ion-segment-button` to determine if the button should be checked.
         */
        this.ionSelect.emit({ value });
        // The scroll listener should handle scrolling the active button into view as needed
        if (!this.segmentViewEl) {
            this.scrollActiveButtonIntoView();
        }
        this.triggerScrollOnValueChange = undefined;
    }
    disabledChanged() {
        this.gestureChanged();
        if (!this.segmentViewEl) {
            const buttons = this.getButtons();
            for (const button of buttons) {
                button.disabled = this.disabled;
            }
        }
        else {
            this.segmentViewEl.disabled = this.disabled;
        }
    }
    gestureChanged() {
        if (this.gesture) {
            this.gesture.enable(!this.scrollable && !this.disabled && this.swipeGesture);
        }
    }
    connectedCallback() {
        this.emitStyle();
        this.segmentViewEl = this.getSegmentView();
    }
    disconnectedCallback() {
        this.segmentViewEl = null;
    }
    componentWillLoad() {
        this.emitStyle();
    }
    async componentDidLoad() {
        this.segmentViewEl = this.getSegmentView();
        this.setCheckedClasses();
        /**
         * We need to wait for the buttons to all be rendered
         * before we can scroll.
         */
        raf(() => {
            /**
             * When the segment loads for the first
             * time we just want to snap the active button into
             * place instead of scroll. Smooth scrolling should only
             * happen when the user interacts with the segment.
             */
            this.scrollActiveButtonIntoView(false);
        });
        this.gesture = (await import('./index3.js')).createGesture({
            el: this.el,
            gestureName: 'segment',
            gesturePriority: 100,
            threshold: 0,
            passive: false,
            onStart: (ev) => this.onStart(ev),
            onMove: (ev) => this.onMove(ev),
            onEnd: (ev) => this.onEnd(ev),
        });
        this.gestureChanged();
        if (this.disabled) {
            this.disabledChanged();
        }
        // Update segment view based on the initial value,
        // but do not animate the scroll
        this.updateSegmentView(false);
    }
    onStart(detail) {
        this.valueBeforeGesture = this.value;
        this.activate(detail);
    }
    onMove(detail) {
        this.setNextIndex(detail);
    }
    onEnd(detail) {
        this.setActivated(false);
        this.setNextIndex(detail, true);
        detail.event.stopImmediatePropagation();
        const value = this.value;
        if (value !== undefined) {
            if (this.valueBeforeGesture !== value) {
                this.emitValueChange();
                this.updateSegmentView();
            }
        }
        this.valueBeforeGesture = undefined;
    }
    /**
     * Emits an `ionChange` event.
     *
     * This API should be called for user committed changes.
     * This API should not be used for external value changes.
     */
    emitValueChange() {
        const { value } = this;
        this.ionChange.emit({ value });
    }
    getButtons() {
        return Array.from(this.el.querySelectorAll('ion-segment-button'));
    }
    get checked() {
        return this.getButtons().find((button) => button.value === this.value);
    }
    /*
     * Activate both the segment and the buttons
     * due to a bug with ::slotted in Safari
     */
    setActivated(activated) {
        const buttons = this.getButtons();
        buttons.forEach((button) => {
            button.classList.toggle('segment-button-activated', activated);
        });
        this.activated = activated;
    }
    activate(detail) {
        const clicked = detail.event.target;
        const buttons = this.getButtons();
        const checked = buttons.find((button) => button.value === this.value);
        // Make sure we are only checking for activation on a segment button
        // since disabled buttons will get the click on the segment
        if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
            return;
        }
        // If there are no checked buttons, set the current button to checked
        if (!checked) {
            this.value = clicked.value;
            this.setCheckedClasses();
        }
        // If the gesture began on the clicked button with the indicator
        // then we should activate the indicator
        if (this.value === clicked.value) {
            this.setActivated(true);
        }
    }
    getIndicator(button) {
        const root = button.shadowRoot || button;
        return root.querySelector('.segment-button-indicator');
    }
    checkButton(previous, current) {
        const previousIndicator = this.getIndicator(previous);
        const currentIndicator = this.getIndicator(current);
        if (previousIndicator === null || currentIndicator === null) {
            return;
        }
        const previousClientRect = previousIndicator.getBoundingClientRect();
        const currentClientRect = currentIndicator.getBoundingClientRect();
        const widthDelta = previousClientRect.width / currentClientRect.width;
        const xPosition = previousClientRect.left - currentClientRect.left;
        // Scale the indicator width to match the previous indicator width
        // and translate it on top of the previous indicator
        const transform = `translate3d(${xPosition}px, 0, 0) scaleX(${widthDelta})`;
        writeTask(() => {
            // Remove the transition before positioning on top of the previous indicator
            currentIndicator.classList.remove('segment-button-indicator-animated');
            currentIndicator.style.setProperty('transform', transform);
            // Force a repaint to ensure the transform happens
            currentIndicator.getBoundingClientRect();
            // Add the transition to move the indicator into place
            currentIndicator.classList.add('segment-button-indicator-animated');
            // Remove the transform to slide the indicator back to the button clicked
            currentIndicator.style.setProperty('transform', '');
            this.scrollActiveButtonIntoView(true);
        });
        this.value = current.value;
        this.setCheckedClasses();
    }
    setCheckedClasses() {
        const buttons = this.getButtons();
        const index = buttons.findIndex((button) => button.value === this.value);
        const next = index + 1;
        for (const button of buttons) {
            button.classList.remove('segment-button-after-checked');
        }
        if (next < buttons.length) {
            buttons[next].classList.add('segment-button-after-checked');
        }
    }
    getSegmentView() {
        const buttons = this.getButtons();
        // Get the first button with a contentId
        const firstContentId = buttons.find((button) => button.contentId);
        // Get the segment content with an id matching the button's contentId
        const segmentContent = document.querySelector(`ion-segment-content[id="${firstContentId === null || firstContentId === void 0 ? void 0 : firstContentId.contentId}"]`);
        // Return the segment view for that matching segment content
        return segmentContent === null || segmentContent === void 0 ? void 0 : segmentContent.closest('ion-segment-view');
    }
    handleSegmentViewScroll(ev) {
        const { scrollRatio, isManualScroll } = ev.detail;
        if (!isManualScroll) {
            return;
        }
        const dispatchedFrom = ev.target;
        const segmentViewEl = this.segmentViewEl;
        const segmentEl = this.el;
        // Only update the indicator if the event was dispatched from the correct segment view
        if (ev.composedPath().includes(segmentViewEl) || (dispatchedFrom === null || dispatchedFrom === void 0 ? void 0 : dispatchedFrom.contains(segmentEl))) {
            const buttons = this.getButtons();
            // If no buttons are found or there is no value set then do nothing
            if (!buttons.length)
                return;
            const index = buttons.findIndex((button) => button.value === this.value);
            const current = buttons[index];
            const nextIndex = Math.round(scrollRatio * (buttons.length - 1));
            if (this.lastNextIndex === undefined || this.lastNextIndex !== nextIndex) {
                this.lastNextIndex = nextIndex;
                this.triggerScrollOnValueChange = false;
                this.checkButton(current, buttons[nextIndex]);
                this.emitValueChange();
            }
        }
    }
    /**
     * Finds the related segment view and sets its current content
     * based on the selected segment button. This method
     * should be called on initial load of the segment,
     * after the gesture is completed (if dragging between segments)
     * and when a segment button is clicked directly.
     */
    updateSegmentView(smoothScroll = true) {
        const buttons = this.getButtons();
        const button = buttons.find((btn) => btn.value === this.value);
        // If the button does not have a contentId then there is
        // no associated segment view to update
        if (!(button === null || button === void 0 ? void 0 : button.contentId)) {
            return;
        }
        const segmentView = this.segmentViewEl;
        if (segmentView) {
            segmentView.setContent(button.contentId, smoothScroll);
        }
    }
    scrollActiveButtonIntoView(smoothScroll = true) {
        const { scrollable, value, el } = this;
        if (scrollable) {
            const buttons = this.getButtons();
            const activeButton = buttons.find((button) => button.value === value);
            if (activeButton !== undefined) {
                const scrollContainerBox = el.getBoundingClientRect();
                const activeButtonBox = activeButton.getBoundingClientRect();
                /**
                 * Subtract the active button x position from the scroll
                 * container x position. This will give us the x position
                 * of the active button within the scroll container.
                 */
                const activeButtonLeft = activeButtonBox.x - scrollContainerBox.x;
                /**
                 * If we just used activeButtonLeft, then the active button
                 * would be aligned with the left edge of the scroll container.
                 * Instead, we want the segment button to be centered. As a result,
                 * we subtract half of the scroll container width. This will position
                 * the left edge of the active button at the midpoint of the scroll container.
                 * We then add half of the active button width. This will position the active
                 * button such that the midpoint of the active button is at the midpoint of the
                 * scroll container.
                 */
                const centeredX = activeButtonLeft - scrollContainerBox.width / 2 + activeButtonBox.width / 2;
                /**
                 * newScrollPosition is the absolute scroll position that the
                 * container needs to move to in order to center the active button.
                 * It is calculated by adding the current scroll position
                 * (scrollLeft) to the offset needed to center the button
                 * (centeredX).
                 */
                const newScrollPosition = el.scrollLeft + centeredX;
                /**
                 * We intentionally use scrollTo here instead of scrollIntoView
                 * to avoid a WebKit bug where accelerated animations break
                 * when using scrollIntoView. Using scrollIntoView will cause the
                 * segment container to jump during the transition and then snap into place.
                 * This is because scrollIntoView can potentially cause parent element
                 * containers to also scroll. scrollTo does not have this same behavior, so
                 * we use this API instead.
                 *
                 * scrollTo is used instead of scrollBy because there is a
                 * Webkit bug that causes scrollBy to not work smoothly when
                 * the active button is near the edge of the scroll container.
                 * This leads to the buttons to jump around during the transition.
                 *
                 * Note that if there is not enough scrolling space to center the element
                 * within the scroll container, the browser will attempt
                 * to center by as much as it can.
                 */
                el.scrollTo({
                    top: 0,
                    left: newScrollPosition,
                    behavior: smoothScroll ? 'smooth' : 'instant',
                });
            }
        }
    }
    setNextIndex(detail, isEnd = false) {
        const rtl = isRTL(this.el);
        const activated = this.activated;
        const buttons = this.getButtons();
        const index = buttons.findIndex((button) => button.value === this.value);
        const previous = buttons[index];
        let current;
        let nextIndex;
        if (index === -1) {
            return;
        }
        // Get the element that the touch event started on in case
        // it was the checked button, then we will move the indicator
        const rect = previous.getBoundingClientRect();
        const left = rect.left;
        const width = rect.width;
        // Get the element that the gesture is on top of based on the currentX of the
        // gesture event and the Y coordinate of the starting element, since the gesture
        // can move up and down off of the segment
        const currentX = detail.currentX;
        const previousY = rect.top + rect.height / 2;
        /**
         * Segment can be used inside the shadow dom
         * so doing document.elementFromPoint would never
         * return a segment button in that instance.
         * We use getRootNode to which will return the parent
         * shadow root if used inside a shadow component and
         * returns document otherwise.
         */
        const root = this.el.getRootNode();
        const nextEl = root.elementFromPoint(currentX, previousY);
        const decreaseIndex = rtl ? currentX > left + width : currentX < left;
        const increaseIndex = rtl ? currentX < left : currentX > left + width;
        // If the indicator is currently activated then we have started the gesture
        // on top of the checked button so we need to slide the indicator
        // by checking the button next to it as we move
        if (activated && !isEnd) {
            // Decrease index, move left in LTR & right in RTL
            if (decreaseIndex) {
                const newIndex = index - 1;
                if (newIndex >= 0) {
                    nextIndex = newIndex;
                }
                // Increase index, moves right in LTR & left in RTL
            }
            else if (increaseIndex) {
                if (activated && !isEnd) {
                    const newIndex = index + 1;
                    if (newIndex < buttons.length) {
                        nextIndex = newIndex;
                    }
                }
            }
            if (nextIndex !== undefined && !buttons[nextIndex].disabled) {
                current = buttons[nextIndex];
            }
        }
        // If the indicator is not activated then we will just set the indicator
        // to the element where the gesture ended
        if (!activated && isEnd) {
            current = nextEl;
        }
        if (current != null) {
            /**
             * If current element is ion-segment then that means
             * user tried to select a disabled ion-segment-button,
             * and we should not update the ripple.
             */
            if (current.tagName === 'ION-SEGMENT') {
                return false;
            }
            if (previous !== current) {
                this.checkButton(previous, current);
            }
        }
        return true;
    }
    emitStyle() {
        this.ionStyle.emit({
            segment: true,
        });
    }
    onKeyDown(ev) {
        const rtl = isRTL(this.el);
        let keyDownSelectsButton = this.selectOnFocus;
        let current;
        switch (ev.key) {
            case 'ArrowRight':
                ev.preventDefault();
                current = rtl ? this.getSegmentButton('previous') : this.getSegmentButton('next');
                break;
            case 'ArrowLeft':
                ev.preventDefault();
                current = rtl ? this.getSegmentButton('next') : this.getSegmentButton('previous');
                break;
            case 'Home':
                ev.preventDefault();
                current = this.getSegmentButton('first');
                break;
            case 'End':
                ev.preventDefault();
                current = this.getSegmentButton('last');
                break;
            case ' ':
            case 'Enter':
                ev.preventDefault();
                current = document.activeElement;
                keyDownSelectsButton = true;
        }
        if (!current) {
            return;
        }
        if (keyDownSelectsButton) {
            const previous = this.checked;
            this.checkButton(previous || current, current);
            if (current !== previous) {
                this.emitValueChange();
            }
        }
        current.setFocus();
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'a64e39352050b516f7dc82ce95a4bcff8431d1d0', role: "tablist", onClick: this.onClick, class: createColorClasses(this.color, {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'segment-activated': this.activated,
                'segment-disabled': this.disabled,
                'segment-scrollable': this.scrollable,
            }) }, h("slot", { key: 'bb3f3ec30e59e0461fa620d8961ab730cc802a4e', onSlotchange: this.onSlottedItemsChange })));
    }
    get el() { return this; }
    static get watchers() { return {
        "color": ["colorChanged"],
        "swipeGesture": ["swipeGestureChanged"],
        "value": ["valueChanged"],
        "disabled": ["disabledChanged"]
    }; }
    static get style() { return {
        ios: IonSegmentIosStyle0,
        md: IonSegmentMdStyle0
    }; }
}, [33, "ion-segment", {
        "color": [513],
        "disabled": [4],
        "scrollable": [4],
        "swipeGesture": [4, "swipe-gesture"],
        "value": [1032],
        "selectOnFocus": [4, "select-on-focus"],
        "activated": [32]
    }, [[16, "ionSegmentViewScroll", "handleSegmentViewScroll"], [0, "keydown", "onKeyDown"]], {
        "color": ["colorChanged"],
        "swipeGesture": ["swipeGestureChanged"],
        "value": ["valueChanged"],
        "disabled": ["disabledChanged"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-segment"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-segment":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Segment);
            }
            break;
    } });
}

const IonSegment = Segment;
const defineCustomElement = defineCustomElement$1;

export { IonSegment, defineCustomElement };
