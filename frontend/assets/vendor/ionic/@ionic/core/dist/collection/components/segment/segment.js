/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h, writeTask } from "@stencil/core";
import { raf } from "../../utils/helpers";
import { isRTL } from "../../utils/rtl/index";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class Segment {
    constructor() {
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
        this.gesture = (await import('../../utils/gesture')).createGesture({
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
            default:
                break;
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
    static get is() { return "ion-segment"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["segment.ios.scss"],
            "md": ["segment.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["segment.ios.css"],
            "md": ["segment.md.css"]
        };
    }
    static get properties() {
        return {
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Color",
                    "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
                    "references": {
                        "Color": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::Color"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
                },
                "attribute": "color",
                "reflect": true
            },
            "disabled": {
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
                    "text": "If `true`, the user cannot interact with the segment."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "scrollable": {
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
                    "text": "If `true`, the segment buttons will overflow and the user can swipe to see them.\nIn addition, this will disable the gesture to drag the indicator between the buttons\nin order to swipe to see hidden buttons."
                },
                "attribute": "scrollable",
                "reflect": false,
                "defaultValue": "false"
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
                    "text": "If `true`, users will be able to swipe between segment buttons to activate them."
                },
                "attribute": "swipe-gesture",
                "reflect": false,
                "defaultValue": "true"
            },
            "value": {
                "type": "any",
                "mutable": true,
                "complexType": {
                    "original": "SegmentValue",
                    "resolved": "number | string | undefined",
                    "references": {
                        "SegmentValue": {
                            "location": "import",
                            "path": "./segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentValue"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "the value of the segment."
                },
                "attribute": "value",
                "reflect": false
            },
            "selectOnFocus": {
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
                    "text": "If `true`, navigating to an `ion-segment-button` with the keyboard will focus and select the element.\nIf `false`, keyboard navigation will only focus the `ion-segment-button` element."
                },
                "attribute": "select-on-focus",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "activated": {}
        };
    }
    static get events() {
        return [{
                "method": "ionChange",
                "name": "ionChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the value property has changed and any dragging pointer has been released from `ion-segment`.\n\nThis event will not emit when programmatically setting the `value` property."
                },
                "complexType": {
                    "original": "SegmentChangeEventDetail",
                    "resolved": "SegmentChangeEventDetail",
                    "references": {
                        "SegmentChangeEventDetail": {
                            "location": "import",
                            "path": "./segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentChangeEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionSelect",
                "name": "ionSelect",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the value of the segment changes from user committed actions\nor from externally assigning a value."
                },
                "complexType": {
                    "original": "SegmentChangeEventDetail",
                    "resolved": "SegmentChangeEventDetail",
                    "references": {
                        "SegmentChangeEventDetail": {
                            "location": "import",
                            "path": "./segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentChangeEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionStyle",
                "name": "ionStyle",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the styles change."
                },
                "complexType": {
                    "original": "StyleEventDetail",
                    "resolved": "StyleEventDetail",
                    "references": {
                        "StyleEventDetail": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::StyleEventDetail"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "color",
                "methodName": "colorChanged"
            }, {
                "propName": "swipeGesture",
                "methodName": "swipeGestureChanged"
            }, {
                "propName": "value",
                "methodName": "valueChanged"
            }, {
                "propName": "disabled",
                "methodName": "disabledChanged"
            }];
    }
    static get listeners() {
        return [{
                "name": "ionSegmentViewScroll",
                "method": "handleSegmentViewScroll",
                "target": "body",
                "capture": false,
                "passive": false
            }, {
                "name": "keydown",
                "method": "onKeyDown",
                "target": undefined,
                "capture": false,
                "passive": false
            }];
    }
}
