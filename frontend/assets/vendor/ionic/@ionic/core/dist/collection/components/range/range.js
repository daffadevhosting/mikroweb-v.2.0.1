/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { findClosestIonContent, disableContentScrollY, resetContentScrollY } from "../../utils/content/index";
import { inheritAriaAttributes, clamp, debounceEvent, renderHiddenInput, isSafeNumber } from "../../utils/helpers";
import { printIonWarning } from "../../utils/logging/index";
import { isRTL } from "../../utils/rtl/index";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
import { roundToMaxDecimalPlaces } from "../../utils/floating-point";
// TODO(FW-2832): types
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot label - The label text to associate with the range. Use the "labelPlacement" property to control where the label is placed relative to the range.
 * @slot start - Content is placed to the left of the range slider in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the range slider in LTR, and to the left in RTL.
 *
 * @part tick - An inactive tick mark.
 * @part tick-active - An active tick mark.
 * @part pin - The counter that appears above a knob.
 * @part knob - The handle that is used to drag the range.
 * @part bar - The inactive part of the bar.
 * @part bar-active - The active part of the bar.
 * @part label - The label text describing the range.
 */
export class Range {
    constructor() {
        this.rangeId = `ion-r-${rangeIds++}`;
        this.didLoad = false;
        this.noUpdate = false;
        this.hasFocus = false;
        this.inheritedAttributes = {};
        this.contentEl = null;
        this.initialContentScrollY = true;
        /**
         * Compares two RangeValue inputs to determine if they are different.
         *
         * @param newVal - The new value.
         * @param oldVal - The old value.
         * @returns `true` if the values are different, `false` otherwise.
         */
        this.compareValues = (newVal, oldVal) => {
            if (typeof newVal === 'object' && typeof oldVal === 'object') {
                return newVal.lower !== oldVal.lower || newVal.upper !== oldVal.upper;
            }
            return newVal !== oldVal;
        };
        this.clampBounds = (value) => {
            return clamp(this.min, value, this.max);
        };
        this.ensureValueInBounds = (value) => {
            if (this.dualKnobs) {
                return {
                    lower: this.clampBounds(value.lower),
                    upper: this.clampBounds(value.upper),
                };
            }
            else {
                return this.clampBounds(value);
            }
        };
        this.setupGesture = async () => {
            const rangeSlider = this.rangeSlider;
            if (rangeSlider) {
                this.gesture = (await import('../../utils/gesture')).createGesture({
                    el: rangeSlider,
                    gestureName: 'range',
                    gesturePriority: 100,
                    /**
                     * Provide a threshold since the drag movement
                     * might be a user scrolling the view.
                     * If this is true, then the range
                     * should not move.
                     */
                    threshold: 10,
                    onStart: () => this.onStart(),
                    onMove: (ev) => this.onMove(ev),
                    onEnd: (ev) => this.onEnd(ev),
                });
                this.gesture.enable(!this.disabled);
            }
        };
        this.handleKeyboard = (knob, isIncrease) => {
            const { ensureValueInBounds } = this;
            let step = this.step;
            step = step > 0 ? step : 1;
            step = step / (this.max - this.min);
            if (!isIncrease) {
                step *= -1;
            }
            if (knob === 'A') {
                this.ratioA = clamp(0, this.ratioA + step, 1);
            }
            else {
                this.ratioB = clamp(0, this.ratioB + step, 1);
            }
            this.ionKnobMoveStart.emit({ value: ensureValueInBounds(this.value) });
            this.updateValue();
            this.emitValueChange();
            this.ionKnobMoveEnd.emit({ value: ensureValueInBounds(this.value) });
        };
        this.onBlur = () => {
            if (this.hasFocus) {
                this.hasFocus = false;
                this.ionBlur.emit();
            }
        };
        this.onFocus = () => {
            if (!this.hasFocus) {
                this.hasFocus = true;
                this.ionFocus.emit();
            }
        };
        this.ratioA = 0;
        this.ratioB = 0;
        this.pressedKnob = undefined;
        this.color = undefined;
        this.debounce = undefined;
        this.name = this.rangeId;
        this.label = undefined;
        this.dualKnobs = false;
        this.min = 0;
        this.max = 100;
        this.pin = false;
        this.pinFormatter = (value) => Math.round(value);
        this.snaps = false;
        this.step = 1;
        this.ticks = true;
        this.activeBarStart = undefined;
        this.disabled = false;
        this.value = 0;
        this.labelPlacement = 'start';
    }
    debounceChanged() {
        const { ionInput, debounce, originalIonInput } = this;
        /**
         * If debounce is undefined, we have to manually revert the ionInput emitter in case
         * debounce used to be set to a number. Otherwise, the event would stay debounced.
         */
        this.ionInput = debounce === undefined ? originalIonInput !== null && originalIonInput !== void 0 ? originalIonInput : ionInput : debounceEvent(ionInput, debounce);
    }
    minChanged(newValue) {
        if (!isSafeNumber(newValue)) {
            this.min = 0;
        }
        if (!this.noUpdate) {
            this.updateRatio();
        }
    }
    maxChanged(newValue) {
        if (!isSafeNumber(newValue)) {
            this.max = 100;
        }
        if (!this.noUpdate) {
            this.updateRatio();
        }
    }
    stepChanged(newValue) {
        if (!isSafeNumber(newValue)) {
            this.step = 1;
        }
    }
    activeBarStartChanged() {
        const { activeBarStart } = this;
        if (activeBarStart !== undefined) {
            if (activeBarStart > this.max) {
                printIonWarning(`[ion-range] - The value of activeBarStart (${activeBarStart}) is greater than the max (${this.max}). Valid values are greater than or equal to the min value and less than or equal to the max value.`, this.el);
                this.activeBarStart = this.max;
            }
            else if (activeBarStart < this.min) {
                printIonWarning(`[ion-range] - The value of activeBarStart (${activeBarStart}) is less than the min (${this.min}). Valid values are greater than or equal to the min value and less than or equal to the max value.`, this.el);
                this.activeBarStart = this.min;
            }
        }
    }
    disabledChanged() {
        if (this.gesture) {
            this.gesture.enable(!this.disabled);
        }
    }
    valueChanged(newValue, oldValue) {
        const valuesChanged = this.compareValues(newValue, oldValue);
        if (valuesChanged) {
            this.ionInput.emit({ value: this.value });
        }
        if (!this.noUpdate) {
            this.updateRatio();
        }
    }
    componentWillLoad() {
        /**
         * If user has custom ID set then we should
         * not assign the default incrementing ID.
         */
        if (this.el.hasAttribute('id')) {
            this.rangeId = this.el.getAttribute('id');
        }
        this.inheritedAttributes = inheritAriaAttributes(this.el);
        // If min, max, or step are not safe, set them to 0, 100, and 1, respectively.
        // Each watch does this, but not before the initial load.
        this.min = isSafeNumber(this.min) ? this.min : 0;
        this.max = isSafeNumber(this.max) ? this.max : 100;
        this.step = isSafeNumber(this.step) ? this.step : 1;
    }
    componentDidLoad() {
        this.originalIonInput = this.ionInput;
        this.setupGesture();
        this.updateRatio();
        this.didLoad = true;
    }
    connectedCallback() {
        var _a;
        this.updateRatio();
        this.debounceChanged();
        this.disabledChanged();
        this.activeBarStartChanged();
        /**
         * If we have not yet rendered
         * ion-range, then rangeSlider is not defined.
         * But if we are moving ion-range via appendChild,
         * then rangeSlider will be defined.
         */
        if (this.didLoad) {
            this.setupGesture();
        }
        const ionContent = findClosestIonContent(this.el);
        this.contentEl = (_a = ionContent === null || ionContent === void 0 ? void 0 : ionContent.querySelector('.ion-content-scroll-host')) !== null && _a !== void 0 ? _a : ionContent;
    }
    disconnectedCallback() {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
    }
    getValue() {
        var _a;
        const value = (_a = this.value) !== null && _a !== void 0 ? _a : 0;
        if (this.dualKnobs) {
            if (typeof value === 'object') {
                return value;
            }
            return {
                lower: 0,
                upper: value,
            };
        }
        else {
            if (typeof value === 'object') {
                return value.upper;
            }
            return value;
        }
    }
    /**
     * Emits an `ionChange` event.
     *
     * This API should be called for user committed changes.
     * This API should not be used for external value changes.
     */
    emitValueChange() {
        this.value = this.ensureValueInBounds(this.value);
        this.ionChange.emit({ value: this.value });
    }
    /**
     * The value should be updated on touch end or
     * when the component is being dragged.
     * This follows the native behavior of mobile devices.
     *
     * For example: When the user lifts their finger from the
     * screen after tapping the bar or dragging the bar or knob.
     */
    onStart() {
        this.ionKnobMoveStart.emit({ value: this.ensureValueInBounds(this.value) });
    }
    /**
     * The value should be updated while dragging the
     * bar or knob.
     *
     * While the user is dragging, the view
     * should not scroll. This is to prevent the user from
     * feeling disoriented while dragging.
     *
     * The user can scroll on the view if the knob or
     * bar is not being dragged.
     *
     * @param detail The details of the gesture event.
     */
    onMove(detail) {
        const { contentEl, pressedKnob } = this;
        const currentX = detail.currentX;
        /**
         * Since the user is dragging on the bar or knob, the view should not scroll.
         *
         * This only needs to be done once.
         */
        if (contentEl && this.pressedKnob === undefined) {
            this.initialContentScrollY = disableContentScrollY(contentEl);
        }
        /**
         * The `pressedKnob` can be undefined if the user just
         * started dragging the knob.
         *
         * This is necessary to determine which knob the user is dragging,
         * especially when it's a dual knob.
         * Plus, it determines when to apply certain styles.
         *
         * This only needs to be done once since the knob won't change
         * while the user is dragging.
         */
        if (pressedKnob === undefined) {
            this.setPressedKnob(currentX);
        }
        this.update(currentX);
    }
    /**
     * The value should be updated on touch end:
     * - When the user lifts their finger from the screen after
     * tapping the bar.
     *
     * @param detail The details of the gesture or mouse event.
     */
    onEnd(detail) {
        var _a;
        const { contentEl, initialContentScrollY } = this;
        const currentX = (_a = detail.currentX) !== null && _a !== void 0 ? _a : detail.clientX;
        /**
         * The `pressedKnob` can be undefined if the user never
         * dragged the knob. They just tapped on the bar.
         *
         * This is necessary to determine which knob the user is changing,
         * especially when it's a dual knob.
         * Plus, it determines when to apply certain styles.
         */
        if (this.pressedKnob === undefined) {
            this.setPressedKnob(currentX);
        }
        /**
         * The user is no longer dragging the bar or
         * knob (if they were dragging it).
         *
         * The user can now scroll on the view in the next gesture event.
         */
        if (contentEl && this.pressedKnob !== undefined) {
            resetContentScrollY(contentEl, initialContentScrollY);
        }
        // update the active knob's position
        this.update(currentX);
        /**
         * Reset the pressed knob to undefined since the user
         * may start dragging a different knob in the next gesture event.
         */
        this.pressedKnob = undefined;
        this.emitValueChange();
        this.ionKnobMoveEnd.emit({ value: this.ensureValueInBounds(this.value) });
    }
    update(currentX) {
        // figure out where the pointer is currently at
        // update the knob being interacted with
        const rect = this.rect;
        let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        if (isRTL(this.el)) {
            ratio = 1 - ratio;
        }
        if (this.snaps) {
            // snaps the ratio to the current value
            ratio = valueToRatio(ratioToValue(ratio, this.min, this.max, this.step), this.min, this.max);
        }
        // update which knob is pressed
        if (this.pressedKnob === 'A') {
            this.ratioA = ratio;
        }
        else {
            this.ratioB = ratio;
        }
        // Update input value
        this.updateValue();
    }
    setPressedKnob(currentX) {
        const rect = (this.rect = this.rangeSlider.getBoundingClientRect());
        // figure out which knob they started closer to
        let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        if (isRTL(this.el)) {
            ratio = 1 - ratio;
        }
        this.pressedKnob = !this.dualKnobs || Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio) ? 'A' : 'B';
        this.setFocus(this.pressedKnob);
    }
    get valA() {
        return ratioToValue(this.ratioA, this.min, this.max, this.step);
    }
    get valB() {
        return ratioToValue(this.ratioB, this.min, this.max, this.step);
    }
    get ratioLower() {
        if (this.dualKnobs) {
            return Math.min(this.ratioA, this.ratioB);
        }
        const { activeBarStart } = this;
        if (activeBarStart == null) {
            return 0;
        }
        return valueToRatio(activeBarStart, this.min, this.max);
    }
    get ratioUpper() {
        if (this.dualKnobs) {
            return Math.max(this.ratioA, this.ratioB);
        }
        return this.ratioA;
    }
    updateRatio() {
        const value = this.getValue();
        const { min, max } = this;
        if (this.dualKnobs) {
            this.ratioA = valueToRatio(value.lower, min, max);
            this.ratioB = valueToRatio(value.upper, min, max);
        }
        else {
            this.ratioA = valueToRatio(value, min, max);
        }
    }
    updateValue() {
        this.noUpdate = true;
        const { valA, valB } = this;
        this.value = !this.dualKnobs
            ? valA
            : {
                lower: Math.min(valA, valB),
                upper: Math.max(valA, valB),
            };
        this.noUpdate = false;
    }
    setFocus(knob) {
        if (this.el.shadowRoot) {
            const knobEl = this.el.shadowRoot.querySelector(knob === 'A' ? '.range-knob-a' : '.range-knob-b');
            if (knobEl) {
                knobEl.focus();
            }
        }
    }
    /**
     * Returns true if content was passed to the "start" slot
     */
    get hasStartSlotContent() {
        return this.el.querySelector('[slot="start"]') !== null;
    }
    /**
     * Returns true if content was passed to the "end" slot
     */
    get hasEndSlotContent() {
        return this.el.querySelector('[slot="end"]') !== null;
    }
    get hasLabel() {
        return this.label !== undefined || this.el.querySelector('[slot="label"]') !== null;
    }
    renderRangeSlider() {
        var _a;
        const { min, max, step, handleKeyboard, pressedKnob, disabled, pin, ratioLower, ratioUpper, pinFormatter, inheritedAttributes, } = this;
        let barStart = `${ratioLower * 100}%`;
        let barEnd = `${100 - ratioUpper * 100}%`;
        const rtl = isRTL(this.el);
        const start = rtl ? 'right' : 'left';
        const end = rtl ? 'left' : 'right';
        const tickStyle = (tick) => {
            return {
                [start]: tick[start],
            };
        };
        if (this.dualKnobs === false) {
            /**
             * When the value is less than the activeBarStart or the min value,
             * the knob will display at the start of the active bar.
             */
            if (this.valA < ((_a = this.activeBarStart) !== null && _a !== void 0 ? _a : this.min)) {
                /**
                 * Sets the bar positions relative to the upper and lower limits.
                 * Converts the ratio values into percentages, used as offsets for left/right styles.
                 *
                 * The ratioUpper refers to the knob position on the bar.
                 * The ratioLower refers to the end position of the active bar (the value).
                 */
                barStart = `${ratioUpper * 100}%`;
                barEnd = `${100 - ratioLower * 100}%`;
            }
            else {
                /**
                 * Otherwise, the knob will display at the end of the active bar.
                 *
                 * The ratioLower refers to the start position of the active bar (the value).
                 * The ratioUpper refers to the knob position on the bar.
                 */
                barStart = `${ratioLower * 100}%`;
                barEnd = `${100 - ratioUpper * 100}%`;
            }
        }
        const barStyle = {
            [start]: barStart,
            [end]: barEnd,
        };
        const ticks = [];
        if (this.snaps && this.ticks) {
            for (let value = min; value <= max; value += step) {
                const ratio = valueToRatio(value, min, max);
                const ratioMin = Math.min(ratioLower, ratioUpper);
                const ratioMax = Math.max(ratioLower, ratioUpper);
                const tick = {
                    ratio,
                    /**
                     * Sets the tick mark as active when the tick is between the min bounds and the knob.
                     * When using activeBarStart, the tick mark will be active between the knob and activeBarStart.
                     */
                    active: ratio >= ratioMin && ratio <= ratioMax,
                };
                tick[start] = `${ratio * 100}%`;
                ticks.push(tick);
            }
        }
        return (h("div", { class: "range-slider", ref: (rangeEl) => (this.rangeSlider = rangeEl),
            /**
             * Since the gesture has a threshold, the value
             * won't change until the user has dragged past
             * the threshold. This is to prevent the range
             * from moving when the user is scrolling.
             *
             * This results in the value not being updated
             * and the event emitters not being triggered
             * if the user taps on the range. This is why
             * we need to listen for the "pointerUp" event.
             */
            onPointerUp: (ev) => {
                /**
                 * If the user drags the knob on the web
                 * version (does not occur on mobile),
                 * the "pointerUp" event will be triggered
                 * along with the gesture's events.
                 * This leads to duplicate events.
                 *
                 * By checking if the pressedKnob is undefined,
                 * we can determine if the "pointerUp" event was
                 * triggered by a tap or a drag. If it was
                 * dragged, the pressedKnob will be defined.
                 */
                if (this.pressedKnob === undefined) {
                    this.onStart();
                    this.onEnd(ev);
                }
            } }, ticks.map((tick) => (h("div", { style: tickStyle(tick), role: "presentation", class: {
                'range-tick': true,
                'range-tick-active': tick.active,
            }, part: tick.active ? 'tick-active' : 'tick' }))), h("div", { class: "range-bar-container" }, h("div", { class: "range-bar", role: "presentation", part: "bar" }), h("div", { class: {
                'range-bar': true,
                'range-bar-active': true,
                'has-ticks': ticks.length > 0,
            }, role: "presentation", style: barStyle, part: "bar-active" })), renderKnob(rtl, {
            knob: 'A',
            pressed: pressedKnob === 'A',
            value: this.valA,
            ratio: this.ratioA,
            pin,
            pinFormatter,
            disabled,
            handleKeyboard,
            min,
            max,
            inheritedAttributes,
        }), this.dualKnobs &&
            renderKnob(rtl, {
                knob: 'B',
                pressed: pressedKnob === 'B',
                value: this.valB,
                ratio: this.ratioB,
                pin,
                pinFormatter,
                disabled,
                handleKeyboard,
                min,
                max,
                inheritedAttributes,
            })));
    }
    render() {
        const { disabled, el, hasLabel, rangeId, pin, pressedKnob, labelPlacement, label } = this;
        const inItem = hostContext('ion-item', el);
        /**
         * If there is no start content then the knob at
         * the min value will be cut off by the item margin.
         */
        const hasStartContent = (hasLabel && (labelPlacement === 'start' || labelPlacement === 'fixed')) || this.hasStartSlotContent;
        const needsStartAdjustment = inItem && !hasStartContent;
        /**
         * If there is no end content then the knob at
         * the max value will be cut off by the item margin.
         */
        const hasEndContent = (hasLabel && labelPlacement === 'end') || this.hasEndSlotContent;
        const needsEndAdjustment = inItem && !hasEndContent;
        const mode = getIonMode(this);
        renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);
        return (h(Host, { key: '3e065039ee048f1f70d97dba5dae98fa1315d867', onFocusin: this.onFocus, onFocusout: this.onBlur, id: rangeId, class: createColorClasses(this.color, {
                [mode]: true,
                'in-item': inItem,
                'range-disabled': disabled,
                'range-pressed': pressedKnob !== undefined,
                'range-has-pin': pin,
                [`range-label-placement-${labelPlacement}`]: true,
                'range-item-start-adjustment': needsStartAdjustment,
                'range-item-end-adjustment': needsEndAdjustment,
            }) }, h("label", { key: '27ff22842c9ea79a1b9495302b926f70c9080a95', class: "range-wrapper", id: "range-label" }, h("div", { key: 'da1f9784be02dfe87d2fef34931d8b7f2148189e', class: {
                'label-text-wrapper': true,
                'label-text-wrapper-hidden': !hasLabel,
            }, part: "label" }, label !== undefined ? h("div", { class: "label-text" }, label) : h("slot", { name: "label" })), h("div", { key: '4389bf30b08214f5b5917fc30976b38f7bcdd29b', class: "native-wrapper" }, h("slot", { key: 'ad1b2745f8b061ee189617bb5c567e4f1d02250c', name: "start" }), this.renderRangeSlider(), h("slot", { key: 'c6dec9e843e232af2a5f16a0f8ee56439c545d7a', name: "end" })))));
    }
    static get is() { return "ion-range"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["range.ios.scss"],
            "md": ["range.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["range.ios.css"],
            "md": ["range.md.css"]
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
            "debounce": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "How long, in milliseconds, to wait to trigger the\n`ionInput` event after each change in the range value."
                },
                "attribute": "debounce",
                "reflect": false
            },
            "name": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The name of the control, which is submitted with the form data."
                },
                "attribute": "name",
                "reflect": false,
                "defaultValue": "this.rangeId"
            },
            "label": {
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
                    "text": "The text to display as the control's label. Use this over the `label` slot if\nyou only need plain text. The `label` property will take priority over the\n`label` slot if both are used."
                },
                "attribute": "label",
                "reflect": false
            },
            "dualKnobs": {
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
                    "text": "Show two knobs."
                },
                "attribute": "dual-knobs",
                "reflect": false,
                "defaultValue": "false"
            },
            "min": {
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
                    "text": "Minimum integer value of the range."
                },
                "attribute": "min",
                "reflect": false,
                "defaultValue": "0"
            },
            "max": {
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
                    "text": "Maximum integer value of the range."
                },
                "attribute": "max",
                "reflect": false,
                "defaultValue": "100"
            },
            "pin": {
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
                    "text": "If `true`, a pin with integer value is shown when the knob\nis pressed."
                },
                "attribute": "pin",
                "reflect": false,
                "defaultValue": "false"
            },
            "pinFormatter": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "PinFormatter",
                    "resolved": "(value: number) => string | number",
                    "references": {
                        "PinFormatter": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::PinFormatter"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "A callback used to format the pin text.\nBy default the pin text is set to `Math.round(value)`.\n\nSee https://ionicframework.com/docs/troubleshooting/runtime#accessing-this\nif you need to access `this` from within the callback."
                },
                "defaultValue": "(value: number): number => Math.round(value)"
            },
            "snaps": {
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
                    "text": "If `true`, the knob snaps to tick marks evenly spaced based\non the step property value."
                },
                "attribute": "snaps",
                "reflect": false,
                "defaultValue": "false"
            },
            "step": {
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
                    "text": "Specifies the value granularity."
                },
                "attribute": "step",
                "reflect": false,
                "defaultValue": "1"
            },
            "ticks": {
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
                    "text": "If `true`, tick marks are displayed based on the step value.\nOnly applies when `snaps` is `true`."
                },
                "attribute": "ticks",
                "reflect": false,
                "defaultValue": "true"
            },
            "activeBarStart": {
                "type": "number",
                "mutable": true,
                "complexType": {
                    "original": "number",
                    "resolved": "number | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The start position of the range active bar. This feature is only available with a single knob (dualKnobs=\"false\").\nValid values are greater than or equal to the min value and less than or equal to the max value."
                },
                "attribute": "active-bar-start",
                "reflect": false
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
                    "text": "If `true`, the user cannot interact with the range."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "value": {
                "type": "number",
                "mutable": true,
                "complexType": {
                    "original": "RangeValue",
                    "resolved": "number | { lower: number; upper: number; }",
                    "references": {
                        "RangeValue": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::RangeValue"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "the value of the range."
                },
                "attribute": "value",
                "reflect": false,
                "defaultValue": "0"
            },
            "labelPlacement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end' | 'fixed' | 'stacked'",
                    "resolved": "\"end\" | \"fixed\" | \"stacked\" | \"start\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Where to place the label relative to the range.\n`\"start\"`: The label will appear to the left of the range in LTR and to the right in RTL.\n`\"end\"`: The label will appear to the right of the range in LTR and to the left in RTL.\n`\"fixed\"`: The label has the same behavior as `\"start\"` except it also has a fixed width. Long text will be truncated with ellipses (\"...\").\n`\"stacked\"`: The label will appear above the range regardless of the direction."
                },
                "attribute": "label-placement",
                "reflect": false,
                "defaultValue": "'start'"
            }
        };
    }
    static get states() {
        return {
            "ratioA": {},
            "ratioB": {},
            "pressedKnob": {}
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
                    "text": "The `ionChange` event is fired for `<ion-range>` elements when the user\nmodifies the element's value:\n- When the user releases the knob after dragging;\n- When the user moves the knob with keyboard arrows\n\nThis event will not emit when programmatically setting the `value` property."
                },
                "complexType": {
                    "original": "RangeChangeEventDetail",
                    "resolved": "RangeChangeEventDetail",
                    "references": {
                        "RangeChangeEventDetail": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::RangeChangeEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionInput",
                "name": "ionInput",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "The `ionInput` event is fired for `<ion-range>` elements when the value\nis modified. Unlike `ionChange`, `ionInput` is fired continuously\nwhile the user is dragging the knob."
                },
                "complexType": {
                    "original": "RangeChangeEventDetail",
                    "resolved": "RangeChangeEventDetail",
                    "references": {
                        "RangeChangeEventDetail": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::RangeChangeEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionFocus",
                "name": "ionFocus",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the range has focus."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionBlur",
                "name": "ionBlur",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the range loses focus."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionKnobMoveStart",
                "name": "ionKnobMoveStart",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the user starts moving the range knob, whether through\nmouse drag, touch gesture, or keyboard interaction."
                },
                "complexType": {
                    "original": "RangeKnobMoveStartEventDetail",
                    "resolved": "RangeKnobMoveStartEventDetail",
                    "references": {
                        "RangeKnobMoveStartEventDetail": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::RangeKnobMoveStartEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionKnobMoveEnd",
                "name": "ionKnobMoveEnd",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the user finishes moving the range knob, whether through\nmouse drag, touch gesture, or keyboard interaction."
                },
                "complexType": {
                    "original": "RangeKnobMoveEndEventDetail",
                    "resolved": "RangeKnobMoveEndEventDetail",
                    "references": {
                        "RangeKnobMoveEndEventDetail": {
                            "location": "import",
                            "path": "./range-interface",
                            "id": "src/components/range/range-interface.ts::RangeKnobMoveEndEventDetail"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "debounce",
                "methodName": "debounceChanged"
            }, {
                "propName": "min",
                "methodName": "minChanged"
            }, {
                "propName": "max",
                "methodName": "maxChanged"
            }, {
                "propName": "step",
                "methodName": "stepChanged"
            }, {
                "propName": "activeBarStart",
                "methodName": "activeBarStartChanged"
            }, {
                "propName": "disabled",
                "methodName": "disabledChanged"
            }, {
                "propName": "value",
                "methodName": "valueChanged"
            }];
    }
}
const renderKnob = (rtl, { knob, value, ratio, min, max, disabled, pressed, pin, handleKeyboard, pinFormatter, inheritedAttributes }) => {
    const start = rtl ? 'right' : 'left';
    const knobStyle = () => {
        const style = {};
        style[start] = `${ratio * 100}%`;
        return style;
    };
    // The aria label should be preferred over visible text if both are specified
    const ariaLabel = inheritedAttributes['aria-label'];
    return (h("div", { onKeyDown: (ev) => {
            const key = ev.key;
            if (key === 'ArrowLeft' || key === 'ArrowDown') {
                handleKeyboard(knob, false);
                ev.preventDefault();
                ev.stopPropagation();
            }
            else if (key === 'ArrowRight' || key === 'ArrowUp') {
                handleKeyboard(knob, true);
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, class: {
            'range-knob-handle': true,
            'range-knob-a': knob === 'A',
            'range-knob-b': knob === 'B',
            'range-knob-pressed': pressed,
            'range-knob-min': value === min,
            'range-knob-max': value === max,
            'ion-activatable': true,
            'ion-focusable': true,
        }, style: knobStyle(), role: "slider", tabindex: disabled ? -1 : 0, "aria-label": ariaLabel !== undefined ? ariaLabel : null, "aria-labelledby": ariaLabel === undefined ? 'range-label' : null, "aria-valuemin": min, "aria-valuemax": max, "aria-disabled": disabled ? 'true' : null, "aria-valuenow": value }, pin && (h("div", { class: "range-pin", role: "presentation", part: "pin" }, pinFormatter(value))), h("div", { class: "range-knob", role: "presentation", part: "knob" })));
};
const ratioToValue = (ratio, min, max, step) => {
    let value = (max - min) * ratio;
    if (step > 0) {
        // round to nearest multiple of step, then add min
        value = Math.round(value / step) * step + min;
    }
    const clampedValue = clamp(min, value, max);
    return roundToMaxDecimalPlaces(clampedValue, min, max, step);
};
const valueToRatio = (value, min, max) => {
    return clamp(0, (value - min) / (max - min), 1);
};
let rangeIds = 0;
