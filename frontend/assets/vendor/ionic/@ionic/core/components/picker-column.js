/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { d as doc } from './index6.js';
import { r as raf, g as getElementRoot } from './helpers.js';
import { a as hapticSelectionStart, b as hapticSelectionChanged, h as hapticSelectionEnd } from './haptic.js';
import { a as isPlatform, b as getIonMode } from './ionic-global.js';
import { c as createColorClasses } from './theme.js';

const pickerColumnCss = ":host{display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;max-width:100%;height:200px;font-size:22px;text-align:center}.assistive-focusable{left:0;right:0;top:0;bottom:0;position:absolute;z-index:1;pointer-events:none}.assistive-focusable:focus{outline:none}.picker-opts{-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:0px;padding-bottom:0px;min-width:26px;max-height:200px;outline:none;text-align:inherit;-webkit-scroll-snap-type:y mandatory;-ms-scroll-snap-type:y mandatory;scroll-snap-type:y mandatory;overflow-x:hidden;overflow-y:scroll;scrollbar-width:none}.picker-item-empty{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;height:34px;border:0px;outline:none;background:transparent;color:inherit;font-family:var(--ion-font-family, inherit);font-size:inherit;line-height:34px;text-align:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.picker-opts::-webkit-scrollbar{display:none}::slotted(ion-picker-column-option){display:block;scroll-snap-align:center}.picker-item-empty,:host(:not([disabled])) ::slotted(ion-picker-column-option.option-disabled){scroll-snap-align:none}::slotted([slot=prefix]),::slotted([slot=suffix]){max-width:200px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}::slotted([slot=prefix]){-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:0;padding-bottom:0;-ms-flex-pack:end;justify-content:end}::slotted([slot=suffix]){-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px;padding-top:0;padding-bottom:0;-ms-flex-pack:start;justify-content:start}:host(.picker-column-disabled) .picker-opts{overflow-y:hidden}:host(.picker-column-disabled) ::slotted(ion-picker-column-option){cursor:default;opacity:0.4;pointer-events:none}@media (any-hover: hover){:host(:focus) .picker-opts{outline:none;background:rgba(var(--ion-color-base-rgb), 0.2)}}";
const IonPickerColumnStyle0 = pickerColumnCss;

const PickerColumn = /*@__PURE__*/ proxyCustomElement(class PickerColumn extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.ionChange = createEvent(this, "ionChange", 7);
        this.isScrolling = false;
        this.isColumnVisible = false;
        this.canExitInputMode = true;
        this.updateValueTextOnScroll = false;
        this.centerPickerItemInView = (target, smooth = true, canExitInputMode = true) => {
            const { isColumnVisible, scrollEl } = this;
            if (isColumnVisible && scrollEl) {
                // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
                const top = target.offsetTop - 3 * target.clientHeight + target.clientHeight / 2;
                if (scrollEl.scrollTop !== top) {
                    /**
                     * Setting this flag prevents input
                     * mode from exiting in the picker column's
                     * scroll callback. This is useful when the user manually
                     * taps an item or types on the keyboard as both
                     * of these can cause a scroll to occur.
                     */
                    this.canExitInputMode = canExitInputMode;
                    this.updateValueTextOnScroll = false;
                    scrollEl.scroll({
                        top,
                        left: 0,
                        behavior: smooth ? 'smooth' : undefined,
                    });
                }
            }
        };
        this.setPickerItemActiveState = (item, isActive) => {
            if (isActive) {
                item.classList.add(PICKER_ITEM_ACTIVE_CLASS);
            }
            else {
                item.classList.remove(PICKER_ITEM_ACTIVE_CLASS);
            }
        };
        /**
         * When ionInputModeChange is emitted, each column
         * needs to check if it is the one being made available
         * for text entry.
         */
        this.inputModeChange = (ev) => {
            if (!this.numericInput) {
                return;
            }
            const { useInputMode, inputModeColumn } = ev.detail;
            /**
             * If inputModeColumn is undefined then this means
             * all numericInput columns are being selected.
             */
            const isColumnActive = inputModeColumn === undefined || inputModeColumn === this.el;
            if (!useInputMode || !isColumnActive) {
                this.setInputModeActive(false);
                return;
            }
            this.setInputModeActive(true);
        };
        /**
         * Setting isActive will cause a re-render.
         * As a result, we do not want to cause the
         * re-render mid scroll as this will cause
         * the picker column to jump back to
         * whatever value was selected at the
         * start of the scroll interaction.
         */
        this.setInputModeActive = (state) => {
            if (this.isScrolling) {
                this.scrollEndCallback = () => {
                    this.isActive = state;
                };
                return;
            }
            this.isActive = state;
        };
        /**
         * When the column scrolls, the component
         * needs to determine which item is centered
         * in the view and will emit an ionChange with
         * the item object.
         */
        this.initializeScrollListener = () => {
            /**
             * The haptics for the wheel picker are
             * an iOS-only feature. As a result, they should
             * be disabled on Android.
             */
            const enableHaptics = isPlatform('ios');
            const { el, scrollEl } = this;
            let timeout;
            let activeEl = this.activeItem;
            const scrollCallback = () => {
                raf(() => {
                    var _a;
                    if (!scrollEl)
                        return;
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = undefined;
                    }
                    if (!this.isScrolling) {
                        enableHaptics && hapticSelectionStart();
                        this.isScrolling = true;
                    }
                    /**
                     * Select item in the center of the column
                     * which is the month/year that we want to select
                     */
                    const bbox = scrollEl.getBoundingClientRect();
                    const centerX = bbox.x + bbox.width / 2;
                    const centerY = bbox.y + bbox.height / 2;
                    /**
                     * elementFromPoint returns the top-most element.
                     * This means that if an ion-backdrop is overlaying the
                     * picker then the appropriate picker column option will
                     * not be selected. To account for this, we use elementsFromPoint
                     * and use an Array.find to find the appropriate column option
                     * at that point.
                     *
                     * Additionally, the picker column could be used in the
                     * Shadow DOM (i.e. in ion-datetime) so we need to make
                     * sure we are choosing the correct host otherwise
                     * the elements returns by elementsFromPoint will be
                     * retargeted. To account for this, we check to see
                     * if the picker column has a parent shadow root. If
                     * so, we use that shadow root when doing elementsFromPoint.
                     * Otherwise, we just use the document.
                     */
                    const rootNode = el.getRootNode();
                    const hasParentShadow = rootNode instanceof ShadowRoot;
                    const referenceNode = hasParentShadow ? rootNode : doc;
                    /**
                     * If the reference node is undefined
                     * then it's likely that doc is undefined
                     * due to being in an SSR environment.
                     */
                    if (referenceNode === undefined) {
                        return;
                    }
                    const elementsAtPoint = referenceNode.elementsFromPoint(centerX, centerY);
                    /**
                     * elementsFromPoint can returns multiple elements
                     * so find the relevant picker column option if one exists.
                     */
                    const newActiveElement = elementsAtPoint.find((el) => el.tagName === 'ION-PICKER-COLUMN-OPTION');
                    if (activeEl !== undefined) {
                        this.setPickerItemActiveState(activeEl, false);
                    }
                    if (newActiveElement === undefined || newActiveElement.disabled) {
                        return;
                    }
                    /**
                     * If we are selecting a new value,
                     * we need to run haptics again.
                     */
                    if (newActiveElement !== activeEl) {
                        enableHaptics && hapticSelectionChanged();
                        if (this.canExitInputMode) {
                            /**
                             * The native iOS wheel picker
                             * only dismisses the keyboard
                             * once the selected item has changed
                             * as a result of a swipe
                             * from the user. If `canExitInputMode` is
                             * `false` then this means that the
                             * scroll is happening as a result of
                             * the `value` property programmatically changing
                             * either by an application or by the user via the keyboard.
                             */
                            this.exitInputMode();
                        }
                    }
                    activeEl = newActiveElement;
                    this.setPickerItemActiveState(newActiveElement, true);
                    /**
                     * Set the aria-valuetext even though the value prop has not been updated yet.
                     * This enables some screen readers to announce the value as the users drag
                     * as opposed to when their release their pointer from the screen.
                     *
                     * When the value is programmatically updated, we will smoothly scroll
                     * to the new option. However, we do not want to update aria-valuetext mid-scroll
                     * as that can cause the old value to be briefly set before being set to the
                     * correct option. This will cause some screen readers to announce the old value
                     * again before announcing the new value. The correct valuetext will be set on render.
                     */
                    if (this.updateValueTextOnScroll) {
                        (_a = this.assistiveFocusable) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-valuetext', this.getOptionValueText(newActiveElement));
                    }
                    timeout = setTimeout(() => {
                        this.isScrolling = false;
                        this.updateValueTextOnScroll = true;
                        enableHaptics && hapticSelectionEnd();
                        /**
                         * Certain tasks (such as those that
                         * cause re-renders) should only be done
                         * once scrolling has finished, otherwise
                         * flickering may occur.
                         */
                        const { scrollEndCallback } = this;
                        if (scrollEndCallback) {
                            scrollEndCallback();
                            this.scrollEndCallback = undefined;
                        }
                        /**
                         * Reset this flag as the
                         * next scroll interaction could
                         * be a scroll from the user. In this
                         * case, we should exit input mode.
                         */
                        this.canExitInputMode = true;
                        this.setValue(newActiveElement.value);
                    }, 250);
                });
            };
            /**
             * Wrap this in an raf so that the scroll callback
             * does not fire when component is initially shown.
             */
            raf(() => {
                if (!scrollEl)
                    return;
                scrollEl.addEventListener('scroll', scrollCallback);
                this.destroyScrollListener = () => {
                    scrollEl.removeEventListener('scroll', scrollCallback);
                };
            });
        };
        /**
         * Tells the parent picker to
         * exit text entry mode. This is only called
         * when the selected item changes during scroll, so
         * we know that the user likely wants to scroll
         * instead of type.
         */
        this.exitInputMode = () => {
            const { parentEl } = this;
            if (parentEl == null)
                return;
            parentEl.exitInputMode();
            /**
             * setInputModeActive only takes
             * effect once scrolling stops to avoid
             * a component re-render while scrolling.
             * However, we want the visual active
             * indicator to go away immediately, so
             * we call classList.remove here.
             */
            this.el.classList.remove('picker-column-active');
        };
        /**
         * Find the next enabled option after the active option.
         * @param stride - How many options to "jump" over in order to select the next option.
         * This can be used to implement PageUp/PageDown behaviors where pressing these keys
         * scrolls the picker by more than 1 option. For example, a stride of 5 means select
         * the enabled option 5 options after the active one. Note that the actual option selected
         * may be past the stride if the option at the stride is disabled.
         */
        this.findNextOption = (stride = 1) => {
            const { activeItem } = this;
            if (!activeItem)
                return null;
            let prevNode = activeItem;
            let node = activeItem.nextElementSibling;
            while (node != null) {
                if (stride > 0) {
                    stride--;
                }
                if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
                    return node;
                }
                prevNode = node;
                // Use nextElementSibling instead of nextSibling to avoid text/comment nodes
                node = node.nextElementSibling;
            }
            return prevNode;
        };
        /**
         * Find the next enabled option after the active option.
         * @param stride - How many options to "jump" over in order to select the next option.
         * This can be used to implement PageUp/PageDown behaviors where pressing these keys
         * scrolls the picker by more than 1 option. For example, a stride of 5 means select
         * the enabled option 5 options before the active one. Note that the actual option selected
         *  may be past the stride if the option at the stride is disabled.
         */
        this.findPreviousOption = (stride = 1) => {
            const { activeItem } = this;
            if (!activeItem)
                return null;
            let nextNode = activeItem;
            let node = activeItem.previousElementSibling;
            while (node != null) {
                if (stride > 0) {
                    stride--;
                }
                if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
                    return node;
                }
                nextNode = node;
                // Use previousElementSibling instead of previousSibling to avoid text/comment nodes
                node = node.previousElementSibling;
            }
            return nextNode;
        };
        this.onKeyDown = (ev) => {
            /**
             * The below operations should be inverted when running on a mobile device.
             * For example, swiping up will dispatch an "ArrowUp" event. On desktop,
             * this should cause the previous option to be selected. On mobile, swiping
             * up causes a view to scroll down. As a result, swiping up on mobile should
             * cause the next option to be selected. The Home/End operations remain
             * unchanged because those always represent the first/last options, respectively.
             */
            const mobile = isPlatform('mobile');
            let newOption = null;
            switch (ev.key) {
                case 'ArrowDown':
                    newOption = mobile ? this.findPreviousOption() : this.findNextOption();
                    break;
                case 'ArrowUp':
                    newOption = mobile ? this.findNextOption() : this.findPreviousOption();
                    break;
                case 'PageUp':
                    newOption = mobile ? this.findNextOption(5) : this.findPreviousOption(5);
                    break;
                case 'PageDown':
                    newOption = mobile ? this.findPreviousOption(5) : this.findNextOption(5);
                    break;
                case 'Home':
                    /**
                     * There is no guarantee that the first child will be an ion-picker-column-option,
                     * so we do not use firstElementChild.
                     */
                    newOption = this.el.querySelector('ion-picker-column-option:first-of-type');
                    break;
                case 'End':
                    /**
                     * There is no guarantee that the last child will be an ion-picker-column-option,
                     * so we do not use lastElementChild.
                     */
                    newOption = this.el.querySelector('ion-picker-column-option:last-of-type');
                    break;
            }
            if (newOption !== null) {
                this.setValue(newOption.value);
                // This stops any default browser behavior such as scrolling
                ev.preventDefault();
            }
        };
        /**
         * Utility to generate the correct text for aria-valuetext.
         */
        this.getOptionValueText = (el) => {
            var _a;
            return el ? (_a = el.getAttribute('aria-label')) !== null && _a !== void 0 ? _a : el.innerText : '';
        };
        /**
         * Render an element that overlays the column. This element is for assistive
         * tech to allow users to navigate the column up/down. This element should receive
         * focus as it listens for synthesized keyboard events as required by the
         * slider role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
         */
        this.renderAssistiveFocusable = () => {
            const { activeItem } = this;
            const valueText = this.getOptionValueText(activeItem);
            /**
             * When using the picker, the valuetext provides important context that valuenow
             * does not. Additionally, using non-zero valuemin/valuemax values can cause
             * WebKit to incorrectly announce numeric valuetext values (such as a year
             * like "2024") as percentages: https://bugs.webkit.org/show_bug.cgi?id=273126
             */
            return (h("div", { ref: (el) => (this.assistiveFocusable = el), class: "assistive-focusable", role: "slider", tabindex: this.disabled ? undefined : 0, "aria-label": this.ariaLabel, "aria-valuemin": 0, "aria-valuemax": 0, "aria-valuenow": 0, "aria-valuetext": valueText, "aria-orientation": "vertical", onKeyDown: (ev) => this.onKeyDown(ev) }));
        };
        this.ariaLabel = null;
        this.isActive = false;
        this.disabled = false;
        this.value = undefined;
        this.color = 'primary';
        this.numericInput = false;
    }
    ariaLabelChanged(newValue) {
        this.ariaLabel = newValue;
    }
    valueChange() {
        if (this.isColumnVisible) {
            /**
             * Only scroll the active item into view when the picker column
             * is actively visible to the user.
             */
            this.scrollActiveItemIntoView(true);
        }
    }
    /**
     * Only setup scroll listeners
     * when the picker is visible, otherwise
     * the container will have a scroll
     * height of 0px.
     */
    componentWillLoad() {
        /**
         * We cache parentEl in a local variable
         * so we don't need to keep accessing
         * the class variable (which comes with
         * a small performance hit)
         */
        const parentEl = (this.parentEl = this.el.closest('ion-picker'));
        const visibleCallback = (entries) => {
            /**
             * Browsers will sometimes group multiple IO events into a single callback.
             * As a result, we want to grab the last/most recent event in case there are multiple events.
             */
            const ev = entries[entries.length - 1];
            if (ev.isIntersecting) {
                const { activeItem, el } = this;
                this.isColumnVisible = true;
                /**
                 * Because this initial call to scrollActiveItemIntoView has to fire before
                 * the scroll listener is set up, we need to manage the active class manually.
                 */
                const oldActive = getElementRoot(el).querySelector(`.${PICKER_ITEM_ACTIVE_CLASS}`);
                if (oldActive) {
                    this.setPickerItemActiveState(oldActive, false);
                }
                this.scrollActiveItemIntoView();
                if (activeItem) {
                    this.setPickerItemActiveState(activeItem, true);
                }
                this.initializeScrollListener();
            }
            else {
                this.isColumnVisible = false;
                if (this.destroyScrollListener) {
                    this.destroyScrollListener();
                    this.destroyScrollListener = undefined;
                }
            }
        };
        /**
         * Set the root to be the parent picker element
         * This causes the IO callback
         * to be fired in WebKit as soon as the element
         * is visible. If we used the default root value
         * then WebKit would only fire the IO callback
         * after any animations (such as a modal transition)
         * finished, and there would potentially be a flicker.
         */
        new IntersectionObserver(visibleCallback, { threshold: 0.001, root: this.parentEl }).observe(this.el);
        if (parentEl !== null) {
            // TODO(FW-2832): type
            parentEl.addEventListener('ionInputModeChange', (ev) => this.inputModeChange(ev));
        }
    }
    componentDidRender() {
        const { el, activeItem, isColumnVisible, value } = this;
        if (isColumnVisible && !activeItem) {
            const firstOption = el.querySelector('ion-picker-column-option');
            /**
             * If the picker column does not have an active item and the current value
             * does not match the first item in the picker column, that means
             * the value is out of bounds. In this case, we assign the value to the
             * first item to match the scroll position of the column.
             *
             */
            if (firstOption !== null && firstOption.value !== value) {
                this.setValue(firstOption.value);
            }
        }
    }
    /** @internal  */
    async scrollActiveItemIntoView(smooth = false) {
        const activeEl = this.activeItem;
        if (activeEl) {
            this.centerPickerItemInView(activeEl, smooth, false);
        }
    }
    /**
     * Sets the value prop and fires the ionChange event.
     * This is used when we need to fire ionChange from
     * user-generated events that cannot be caught with normal
     * input/change event listeners.
     * @internal
     */
    async setValue(value) {
        if (this.disabled === true || this.value === value) {
            return;
        }
        this.value = value;
        this.ionChange.emit({ value });
    }
    /**
     * Sets focus on the scrollable container within the picker column.
     * Use this method instead of the global `pickerColumn.focus()`.
     */
    async setFocus() {
        if (this.assistiveFocusable) {
            this.assistiveFocusable.focus();
        }
    }
    connectedCallback() {
        var _a;
        this.ariaLabel = (_a = this.el.getAttribute('aria-label')) !== null && _a !== void 0 ? _a : 'Select a value';
    }
    get activeItem() {
        const { value } = this;
        const options = Array.from(this.el.querySelectorAll('ion-picker-column-option'));
        return options.find((option) => {
            /**
             * If the whole picker column is disabled, the current value should appear active
             * If the current value item is specifically disabled, it should not appear active
             */
            if (!this.disabled && option.disabled) {
                return false;
            }
            return option.value === value;
        });
    }
    render() {
        const { color, disabled, isActive, numericInput } = this;
        const mode = getIonMode(this);
        return (h(Host, { key: 'a221dc10f1eb7c41637a16d2c7167c16939822fd', class: createColorClasses(color, {
                [mode]: true,
                ['picker-column-active']: isActive,
                ['picker-column-numeric-input']: numericInput,
                ['picker-column-disabled']: disabled,
            }) }, this.renderAssistiveFocusable(), h("slot", { key: '81b0656f606856f3dc0a657bf167d81a5011405e', name: "prefix" }), h("div", { key: '71b9de67c04150255dd66592601c9d926db0c31c', "aria-hidden": "true", class: "picker-opts", ref: (el) => {
                this.scrollEl = el;
            },
            /**
             * When an element has an overlay scroll style and
             * a fixed height, Firefox will focus the scrollable
             * container if the content exceeds the container's
             * dimensions.
             *
             * This causes keyboard navigation to focus to this
             * element instead of going to the next element in
             * the tab order.
             *
             * The desired behavior is for the user to be able to
             * focus the assistive focusable element and tab to
             * the next element in the tab order. Instead of tabbing
             * to this element.
             *
             * To prevent this, we set the tabIndex to -1. This
             * will match the behavior of the other browsers.
             */
            tabIndex: -1 }, h("div", { key: 'ebdc2f08c83db0cf17b4be29f28fcb00f529601e', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '04ab56fcb8e6a7d6af00204c4560feb99ff34a56', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '6cf8f538903faf0fe1e4130f3eaf7b4e2e17cb52', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("slot", { key: '1cc392307b70c576be5b81b5226ceba735957f0f' }), h("div", { key: '23e3f28e2a99b9aa8b7c8f68ad9583e3ca63e9e2', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '8a0563f09780c3116af0caebe4f40587ec1f041f', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '13207e248fc0009f37e0c90a3ee2bac2f130b856', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0")), h("slot", { key: '55ecf2ab5f214f936c2468cbdb7952daf89416b8', name: "suffix" })));
    }
    get el() { return this; }
    static get watchers() { return {
        "aria-label": ["ariaLabelChanged"],
        "value": ["valueChange"]
    }; }
    static get style() { return IonPickerColumnStyle0; }
}, [1, "ion-picker-column", {
        "disabled": [4],
        "value": [1032],
        "color": [513],
        "numericInput": [4, "numeric-input"],
        "ariaLabel": [32],
        "isActive": [32],
        "scrollActiveItemIntoView": [64],
        "setValue": [64],
        "setFocus": [64]
    }, undefined, {
        "aria-label": ["ariaLabelChanged"],
        "value": ["valueChange"]
    }]);
const PICKER_ITEM_ACTIVE_CLASS = 'option-active';
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-picker-column"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-picker-column":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, PickerColumn);
            }
            break;
    } });
}

export { PickerColumn as P, defineCustomElement as d };
