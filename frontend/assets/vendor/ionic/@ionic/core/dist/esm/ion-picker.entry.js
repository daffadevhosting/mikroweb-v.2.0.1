/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, c as createEvent, h, e as Host, f as getElement } from './index-527b9e34.js';
import { g as getElementRoot } from './helpers-d94bc8ad.js';
import './index-cfd9c1f2.js';

const pickerIosCss = ":host{display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:200px;direction:ltr;z-index:0}:host .picker-before,:host .picker-after{position:absolute;width:100%;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:1;pointer-events:none}:host .picker-before{top:0;height:83px}:host .picker-before{inset-inline-start:0}:host .picker-after{top:116px;height:84px}:host .picker-after{inset-inline-start:0}:host .picker-highlight{border-radius:var(--highlight-border-radius, 8px);left:0;right:0;top:50%;bottom:0;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;margin-top:0;margin-bottom:0;position:absolute;width:calc(100% - 16px);height:34px;-webkit-transform:translateY(-50%);transform:translateY(-50%);background:var(--highlight-background);z-index:-1}:host input{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}:host ::slotted(ion-picker-column:first-of-type){text-align:start}:host ::slotted(ion-picker-column:last-of-type){text-align:end}:host ::slotted(ion-picker-column:only-child){text-align:center}:host .picker-before{background:-webkit-gradient(linear, left top, left bottom, color-stop(20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1)), to(rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0.8)));background:linear-gradient(to bottom, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1) 20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0.8) 100%)}:host .picker-after{background:-webkit-gradient(linear, left bottom, left top, color-stop(20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1)), to(rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0.8)));background:linear-gradient(to top, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1) 20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0.8) 100%)}:host .picker-highlight{background:var(--highlight-background, var(--ion-color-step-150, var(--ion-background-color-step-150, #eeeeef)))}";
const IonPickerIosStyle0 = pickerIosCss;

const pickerMdCss = ":host{display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:200px;direction:ltr;z-index:0}:host .picker-before,:host .picker-after{position:absolute;width:100%;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:1;pointer-events:none}:host .picker-before{top:0;height:83px}:host .picker-before{inset-inline-start:0}:host .picker-after{top:116px;height:84px}:host .picker-after{inset-inline-start:0}:host .picker-highlight{border-radius:var(--highlight-border-radius, 8px);left:0;right:0;top:50%;bottom:0;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;margin-top:0;margin-bottom:0;position:absolute;width:calc(100% - 16px);height:34px;-webkit-transform:translateY(-50%);transform:translateY(-50%);background:var(--highlight-background);z-index:-1}:host input{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}:host ::slotted(ion-picker-column:first-of-type){text-align:start}:host ::slotted(ion-picker-column:last-of-type){text-align:end}:host ::slotted(ion-picker-column:only-child){text-align:center}:host .picker-before{background:-webkit-gradient(linear, left top, left bottom, color-stop(20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1)), color-stop(90%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0)));background:linear-gradient(to bottom, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1) 20%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0) 90%)}:host .picker-after{background:-webkit-gradient(linear, left bottom, left top, color-stop(30%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1)), color-stop(90%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0)));background:linear-gradient(to top, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 1) 30%, rgba(var(--fade-background-rgb, var(--background-rgb, var(--ion-background-color-rgb, 255, 255, 255))), 0) 90%)}";
const IonPickerMdStyle0 = pickerMdCss;

const Picker = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.ionInputModeChange = createEvent(this, "ionInputModeChange", 7);
        this.useInputMode = false;
        this.isInHighlightBounds = (ev) => {
            const { highlightEl } = this;
            if (!highlightEl) {
                return false;
            }
            const bbox = highlightEl.getBoundingClientRect();
            /**
             * Check to see if the user clicked
             * outside the bounds of the highlight.
             */
            const outsideX = ev.clientX < bbox.left || ev.clientX > bbox.right;
            const outsideY = ev.clientY < bbox.top || ev.clientY > bbox.bottom;
            if (outsideX || outsideY) {
                return false;
            }
            return true;
        };
        /**
         * If we are no longer focused
         * on a picker column, then we should
         * exit input mode. An exception is made
         * for the input in the picker since having
         * that focused means we are still in input mode.
         */
        this.onFocusOut = (ev) => {
            // TODO(FW-2832): type
            const { relatedTarget } = ev;
            if (!relatedTarget || (relatedTarget.tagName !== 'ION-PICKER-COLUMN' && relatedTarget !== this.inputEl)) {
                this.exitInputMode();
            }
        };
        /**
         * When picker columns receive focus
         * the parent picker needs to determine
         * whether to enter/exit input mode.
         */
        this.onFocusIn = (ev) => {
            // TODO(FW-2832): type
            const { target } = ev;
            /**
             * Due to browser differences in how/when focus
             * is dispatched on certain elements, we need to
             * make sure that this function only ever runs when
             * focusing a picker column.
             */
            if (target.tagName !== 'ION-PICKER-COLUMN') {
                return;
            }
            /**
             * If we have actionOnClick
             * then this means the user focused
             * a picker column via mouse or
             * touch (i.e. a PointerEvent). As a result,
             * we should not enter/exit input mode
             * until the click event has fired, which happens
             * after the `focusin` event.
             *
             * Otherwise, the user likely focused
             * the column using their keyboard and
             * we should enter/exit input mode automatically.
             */
            if (!this.actionOnClick) {
                const columnEl = target;
                const allowInput = columnEl.numericInput;
                if (allowInput) {
                    this.enterInputMode(columnEl, false);
                }
                else {
                    this.exitInputMode();
                }
            }
        };
        /**
         * On click we need to run an actionOnClick
         * function that has been set in onPointerDown
         * so that we enter/exit input mode correctly.
         */
        this.onClick = () => {
            const { actionOnClick } = this;
            if (actionOnClick) {
                actionOnClick();
                this.actionOnClick = undefined;
            }
        };
        /**
         * Clicking a column also focuses the column on
         * certain browsers, so we use onPointerDown
         * to tell the onFocusIn function that users
         * are trying to click the column rather than
         * focus the column using the keyboard. When the
         * user completes the click, the onClick function
         * runs and runs the actionOnClick callback.
         */
        this.onPointerDown = (ev) => {
            const { useInputMode, inputModeColumn, el } = this;
            if (this.isInHighlightBounds(ev)) {
                /**
                 * If we were already in
                 * input mode, then we should determine
                 * if we tapped a particular column and
                 * should switch to input mode for
                 * that specific column.
                 */
                if (useInputMode) {
                    /**
                     * If we tapped a picker column
                     * then we should either switch to input
                     * mode for that column or all columns.
                     * Otherwise we should exit input mode
                     * since we just tapped the highlight and
                     * not a column.
                     */
                    if (ev.target.tagName === 'ION-PICKER-COLUMN') {
                        /**
                         * If user taps 2 different columns
                         * then we should just switch to input mode
                         * for the new column rather than switching to
                         * input mode for all columns.
                         */
                        if (inputModeColumn && inputModeColumn === ev.target) {
                            this.actionOnClick = () => {
                                this.enterInputMode();
                            };
                        }
                        else {
                            this.actionOnClick = () => {
                                this.enterInputMode(ev.target);
                            };
                        }
                    }
                    else {
                        this.actionOnClick = () => {
                            this.exitInputMode();
                        };
                    }
                    /**
                     * If we were not already in
                     * input mode, then we should
                     * enter input mode for all columns.
                     */
                }
                else {
                    /**
                     * If there is only 1 numeric input column
                     * then we should skip multi column input.
                     */
                    const columns = el.querySelectorAll('ion-picker-column.picker-column-numeric-input');
                    const columnEl = columns.length === 1 ? ev.target : undefined;
                    this.actionOnClick = () => {
                        this.enterInputMode(columnEl);
                    };
                }
                return;
            }
            this.actionOnClick = () => {
                this.exitInputMode();
            };
        };
        /**
         * Enters input mode to allow
         * for text entry of numeric values.
         * If on mobile, we focus a hidden input
         * field so that the on screen keyboard
         * is brought up. When tabbing using a
         * keyboard, picker columns receive an outline
         * to indicate they are focused. As a result,
         * we should not focus the hidden input as it
         * would cause the outline to go away, preventing
         * users from having any visual indication of which
         * column is focused.
         */
        this.enterInputMode = (columnEl, focusInput = true) => {
            const { inputEl, el } = this;
            if (!inputEl) {
                return;
            }
            /**
             * Only active input mode if there is at
             * least one column that accepts numeric input.
             */
            const hasInputColumn = el.querySelector('ion-picker-column.picker-column-numeric-input');
            if (!hasInputColumn) {
                return;
            }
            /**
             * If columnEl is undefined then
             * it is assumed that all numeric pickers
             * are eligible for text entry.
             * (i.e. hour and minute columns)
             */
            this.useInputMode = true;
            this.inputModeColumn = columnEl;
            /**
             * Users with a keyboard and mouse can
             * activate input mode where the input is
             * focused as well as when it is not focused,
             * so we need to make sure we clean up any
             * old listeners.
             */
            if (focusInput) {
                if (this.destroyKeypressListener) {
                    this.destroyKeypressListener();
                    this.destroyKeypressListener = undefined;
                }
                inputEl.focus();
            }
            else {
                // TODO FW-5900 Use keydown instead
                el.addEventListener('keypress', this.onKeyPress);
                this.destroyKeypressListener = () => {
                    el.removeEventListener('keypress', this.onKeyPress);
                };
            }
            this.emitInputModeChange();
        };
        this.onKeyPress = (ev) => {
            const { inputEl } = this;
            if (!inputEl) {
                return;
            }
            const parsedValue = parseInt(ev.key, 10);
            /**
             * Only numbers should be allowed
             */
            if (!Number.isNaN(parsedValue)) {
                inputEl.value += ev.key;
                this.onInputChange();
            }
        };
        this.selectSingleColumn = () => {
            const { inputEl, inputModeColumn, singleColumnSearchTimeout } = this;
            if (!inputEl || !inputModeColumn) {
                return;
            }
            const options = Array.from(inputModeColumn.querySelectorAll('ion-picker-column-option')).filter((el) => el.disabled !== true);
            /**
             * If users pause for a bit, the search
             * value should be reset similar to how a
             * <select> behaves. So typing "34", waiting,
             * then typing "5" should select "05".
             */
            if (singleColumnSearchTimeout) {
                clearTimeout(singleColumnSearchTimeout);
            }
            this.singleColumnSearchTimeout = setTimeout(() => {
                inputEl.value = '';
                this.singleColumnSearchTimeout = undefined;
            }, 1000);
            /**
             * For values that are longer than 2 digits long
             * we should shift the value over 1 character
             * to the left. So typing "456" would result in "56".
             * TODO: If we want to support more than just
             * time entry, we should update this value to be
             * the max length of all of the picker items.
             */
            if (inputEl.value.length >= 3) {
                const startIndex = inputEl.value.length - 2;
                const newString = inputEl.value.substring(startIndex);
                inputEl.value = newString;
                this.selectSingleColumn();
                return;
            }
            /**
             * Checking the value of the input gets priority
             * first. For example, if the value of the input
             * is "1" and we entered "2", then the complete value
             * is "12" and we should select hour 12.
             *
             * Regex removes any leading zeros from values like "02",
             * but it keeps a single zero if there are only zeros in the string.
             * 0+(?=[1-9]) --> Match 1 or more zeros that are followed by 1-9
             * 0+(?=0$) --> Match 1 or more zeros that must be followed by one 0 and end.
             */
            const findItemFromCompleteValue = options.find(({ textContent }) => {
                /**
                 * Keyboard entry is currently only used inside of Datetime
                 * where we guarantee textContent is set.
                 * If we end up exposing this feature publicly we should revisit this assumption.
                 */
                const parsedText = textContent.replace(/^0+(?=[1-9])|0+(?=0$)/, '');
                return parsedText === inputEl.value;
            });
            if (findItemFromCompleteValue) {
                inputModeColumn.setValue(findItemFromCompleteValue.value);
                return;
            }
            /**
             * If we typed "56" to get minute 56, then typed "7",
             * we should select "07" as "567" is not a valid minute.
             */
            if (inputEl.value.length === 2) {
                const changedCharacter = inputEl.value.substring(inputEl.value.length - 1);
                inputEl.value = changedCharacter;
                this.selectSingleColumn();
            }
        };
        /**
         * Searches a list of column items for a particular
         * value. This is currently used for numeric values.
         * The zeroBehavior can be set to account for leading
         * or trailing zeros when looking at the item text.
         */
        this.searchColumn = (colEl, value, zeroBehavior = 'start') => {
            if (!value) {
                return false;
            }
            const behavior = zeroBehavior === 'start' ? /^0+/ : /0$/;
            value = value.replace(behavior, '');
            const option = Array.from(colEl.querySelectorAll('ion-picker-column-option')).find((el) => {
                return el.disabled !== true && el.textContent.replace(behavior, '') === value;
            });
            if (option) {
                colEl.setValue(option.value);
            }
            return !!option;
        };
        /**
         * Attempts to intelligently search the first and second
         * column as if they're number columns for the provided numbers
         * where the first two numbers are the first column
         * and the last 2 are the last column. Tries to allow for the first
         * number to be ignored for situations where typos occurred.
         */
        this.multiColumnSearch = (firstColumn, secondColumn, input) => {
            if (input.length === 0) {
                return;
            }
            const inputArray = input.split('');
            const hourValue = inputArray.slice(0, 2).join('');
            // Try to find a match for the first two digits in the first column
            const foundHour = this.searchColumn(firstColumn, hourValue);
            // If we have more than 2 digits and found a match for hours,
            // use the remaining digits for the second column (minutes)
            if (inputArray.length > 2 && foundHour) {
                const minuteValue = inputArray.slice(2, 4).join('');
                this.searchColumn(secondColumn, minuteValue);
            }
            // If we couldn't find a match for the two-digit hour, try single digit approaches
            else if (!foundHour && inputArray.length >= 1) {
                // First try the first digit as a single-digit hour
                let singleDigitHour = inputArray[0];
                let singleDigitFound = this.searchColumn(firstColumn, singleDigitHour);
                // If that didn't work, try the second digit as a single-digit hour
                // (handles case where user made a typo in the first digit, or they typed over themselves)
                if (!singleDigitFound) {
                    inputArray.shift();
                    singleDigitHour = inputArray[0];
                    singleDigitFound = this.searchColumn(firstColumn, singleDigitHour);
                }
                // If we found a single-digit hour and have remaining digits,
                // use up to 2 of the remaining digits for the second column
                if (singleDigitFound && inputArray.length > 1) {
                    const remainingDigits = inputArray.slice(1, 3).join('');
                    this.searchColumn(secondColumn, remainingDigits);
                }
            }
        };
        this.selectMultiColumn = () => {
            const { inputEl, el } = this;
            if (!inputEl) {
                return;
            }
            const numericPickers = Array.from(el.querySelectorAll('ion-picker-column')).filter((col) => col.numericInput);
            const firstColumn = numericPickers[0];
            const lastColumn = numericPickers[1];
            let value = inputEl.value;
            if (value.length > 4) {
                const startIndex = inputEl.value.length - 4;
                const newString = inputEl.value.substring(startIndex);
                inputEl.value = newString;
                value = newString;
            }
            this.multiColumnSearch(firstColumn, lastColumn, value);
        };
        /**
         * Searches the value of the active column
         * to determine which value users are trying
         * to select
         */
        this.onInputChange = () => {
            const { useInputMode, inputEl, inputModeColumn } = this;
            if (!useInputMode || !inputEl) {
                return;
            }
            if (inputModeColumn) {
                this.selectSingleColumn();
            }
            else {
                this.selectMultiColumn();
            }
        };
        /**
         * Emit ionInputModeChange. Picker columns
         * listen for this event to determine whether
         * or not their column is "active" for text input.
         */
        this.emitInputModeChange = () => {
            const { useInputMode, inputModeColumn } = this;
            this.ionInputModeChange.emit({
                useInputMode,
                inputModeColumn,
            });
        };
    }
    /**
     * When the picker is interacted with
     * we need to prevent touchstart so other
     * gestures do not fire. For example,
     * scrolling on the wheel picker
     * in ion-datetime should not cause
     * a card modal to swipe to close.
     */
    preventTouchStartPropagation(ev) {
        ev.stopPropagation();
    }
    componentWillLoad() {
        getElementRoot(this.el).addEventListener('focusin', this.onFocusIn);
        getElementRoot(this.el).addEventListener('focusout', this.onFocusOut);
    }
    /**
     * @internal
     * Exits text entry mode for the picker
     * This method blurs the hidden input
     * and cause the keyboard to dismiss.
     */
    async exitInputMode() {
        const { inputEl, useInputMode } = this;
        if (!useInputMode || !inputEl) {
            return;
        }
        this.useInputMode = false;
        this.inputModeColumn = undefined;
        inputEl.blur();
        inputEl.value = '';
        if (this.destroyKeypressListener) {
            this.destroyKeypressListener();
            this.destroyKeypressListener = undefined;
        }
        this.emitInputModeChange();
    }
    render() {
        return (h(Host, { key: '28f81e4ed44a633178561757c5199c2c98f94b74', onPointerDown: (ev) => this.onPointerDown(ev), onClick: () => this.onClick() }, h("input", { key: 'abb3d1ad25ef63856af7804111175a4d50008bc0', "aria-hidden": "true", tabindex: -1, inputmode: "numeric", type: "number", onKeyDown: (ev) => {
                var _a;
                /**
                 * The "Enter" key represents
                 * the user submitting their time
                 * selection, so we should blur the
                 * input (and therefore close the keyboard)
                 *
                 * Updating the picker's state to no longer
                 * be in input mode is handled in the onBlur
                 * callback below.
                 */
                if (ev.key === 'Enter') {
                    (_a = this.inputEl) === null || _a === void 0 ? void 0 : _a.blur();
                }
            }, ref: (el) => (this.inputEl = el), onInput: () => this.onInputChange(), onBlur: () => this.exitInputMode() }), h("div", { key: '334a5abdc02e6b127c57177f626d7e4ff5526183', class: "picker-before" }), h("div", { key: 'ffd6271931129e88fc7c820e919d684899e420c5', class: "picker-after" }), h("div", { key: '78d1d95fd09e04f154ea59f24a1cece72c47ed7b', class: "picker-highlight", ref: (el) => (this.highlightEl = el) }), h("slot", { key: '0bd5b9f875d3c71f6cbbde2054baeb1b0a2e8cd5' })));
    }
    get el() { return getElement(this); }
};
Picker.style = {
    ios: IonPickerIosStyle0,
    md: IonPickerMdStyle0
};

export { Picker as ion_picker };
