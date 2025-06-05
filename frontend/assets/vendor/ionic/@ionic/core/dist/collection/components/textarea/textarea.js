/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Build, Host, forceUpdate, h, writeTask, } from "@stencil/core";
import { createNotchController } from "../../utils/forms/index";
import { inheritAriaAttributes, debounceEvent, inheritAttributes, componentOnReady } from "../../utils/helpers";
import { createSlotMutationController } from "../../utils/slot-mutation-controller";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
import { getCounterText } from "../input/input.utils";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot label - The label text to associate with the textarea. Use the `labelPlacement` property to control where the label is placed relative to the textarea. Use this if you need to render a label with custom HTML. (EXPERIMENTAL)
 * @slot start - Content to display at the leading edge of the textarea. (EXPERIMENTAL)
 * @slot end - Content to display at the trailing edge of the textarea. (EXPERIMENTAL)
 */
export class Textarea {
    constructor() {
        this.inputId = `ion-textarea-${textareaIds++}`;
        this.helperTextId = `${this.inputId}-helper-text`;
        this.errorTextId = `${this.inputId}-error-text`;
        /**
         * `true` if the textarea was cleared as a result of the user typing
         * with `clearOnEdit` enabled.
         *
         * Resets when the textarea loses focus.
         */
        this.didTextareaClearOnEdit = false;
        this.inheritedAttributes = {};
        // `Event` type is used instead of `InputEvent`
        // since the types from Stencil are not derived
        // from the element (e.g. textarea and input
        // should be InputEvent, but all other elements
        // should be Event).
        this.onInput = (ev) => {
            const input = ev.target;
            if (input) {
                this.value = input.value || '';
            }
            this.emitInputChange(ev);
        };
        this.onChange = (ev) => {
            this.emitValueChange(ev);
        };
        this.onFocus = (ev) => {
            this.hasFocus = true;
            this.focusedValue = this.value;
            this.ionFocus.emit(ev);
        };
        this.onBlur = (ev) => {
            this.hasFocus = false;
            if (this.focusedValue !== this.value) {
                /**
                 * Emits the `ionChange` event when the textarea value
                 * is different than the value when the textarea was focused.
                 */
                this.emitValueChange(ev);
            }
            this.didTextareaClearOnEdit = false;
            this.ionBlur.emit(ev);
        };
        this.onKeyDown = (ev) => {
            this.checkClearOnEdit(ev);
        };
        /**
         * Stops propagation when the label is clicked,
         * otherwise, two clicks will be triggered.
         */
        this.onLabelClick = (ev) => {
            // Only stop propagation if the click was directly on the label
            // and not on the input or other child elements
            if (ev.target === ev.currentTarget) {
                ev.stopPropagation();
            }
        };
        this.hasFocus = false;
        this.color = undefined;
        this.autocapitalize = 'none';
        this.autofocus = false;
        this.clearOnEdit = false;
        this.debounce = undefined;
        this.disabled = false;
        this.fill = undefined;
        this.inputmode = undefined;
        this.enterkeyhint = undefined;
        this.maxlength = undefined;
        this.minlength = undefined;
        this.name = this.inputId;
        this.placeholder = undefined;
        this.readonly = false;
        this.required = false;
        this.spellcheck = false;
        this.cols = undefined;
        this.rows = undefined;
        this.wrap = undefined;
        this.autoGrow = false;
        this.value = '';
        this.counter = false;
        this.counterFormatter = undefined;
        this.errorText = undefined;
        this.helperText = undefined;
        this.label = undefined;
        this.labelPlacement = 'start';
        this.shape = undefined;
    }
    debounceChanged() {
        const { ionInput, debounce, originalIonInput } = this;
        /**
         * If debounce is undefined, we have to manually revert the ionInput emitter in case
         * debounce used to be set to a number. Otherwise, the event would stay debounced.
         */
        this.ionInput = debounce === undefined ? originalIonInput !== null && originalIonInput !== void 0 ? originalIonInput : ionInput : debounceEvent(ionInput, debounce);
    }
    /**
     * Update the native input element when the value changes
     */
    valueChanged() {
        const nativeInput = this.nativeInput;
        const value = this.getValue();
        if (nativeInput && nativeInput.value !== value) {
            nativeInput.value = value;
        }
        this.runAutoGrow();
    }
    /**
     * dir is a globally enumerated attribute.
     * As a result, creating these as properties
     * can have unintended side effects. Instead, we
     * listen for attribute changes and inherit them
     * to the inner `<textarea>` element.
     */
    onDirChanged(newValue) {
        this.inheritedAttributes = Object.assign(Object.assign({}, this.inheritedAttributes), { dir: newValue });
        forceUpdate(this);
    }
    /**
     * This prevents the native input from emitting the click event.
     * Instead, the click event from the ion-textarea is emitted.
     */
    onClickCapture(ev) {
        const nativeInput = this.nativeInput;
        if (nativeInput && ev.target === nativeInput) {
            ev.stopPropagation();
            this.el.click();
        }
    }
    connectedCallback() {
        const { el } = this;
        this.slotMutationController = createSlotMutationController(el, ['label', 'start', 'end'], () => forceUpdate(this));
        this.notchController = createNotchController(el, () => this.notchSpacerEl, () => this.labelSlot);
        this.debounceChanged();
        if (Build.isBrowser) {
            document.dispatchEvent(new CustomEvent('ionInputDidLoad', {
                detail: el,
            }));
        }
    }
    disconnectedCallback() {
        if (Build.isBrowser) {
            document.dispatchEvent(new CustomEvent('ionInputDidUnload', {
                detail: this.el,
            }));
        }
        if (this.slotMutationController) {
            this.slotMutationController.destroy();
            this.slotMutationController = undefined;
        }
        if (this.notchController) {
            this.notchController.destroy();
            this.notchController = undefined;
        }
    }
    componentWillLoad() {
        this.inheritedAttributes = Object.assign(Object.assign({}, inheritAriaAttributes(this.el)), inheritAttributes(this.el, ['data-form-type', 'title', 'tabindex', 'dir']));
    }
    componentDidLoad() {
        this.originalIonInput = this.ionInput;
        this.runAutoGrow();
    }
    componentDidRender() {
        var _a;
        (_a = this.notchController) === null || _a === void 0 ? void 0 : _a.calculateNotchWidth();
    }
    /**
     * Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global
     * `textarea.focus()`.
     *
     * See [managing focus](/docs/developing/managing-focus) for more information.
     */
    async setFocus() {
        if (this.nativeInput) {
            this.nativeInput.focus();
        }
    }
    /**
     * Returns the native `<textarea>` element used under the hood.
     */
    async getInputElement() {
        /**
         * If this gets called in certain early lifecycle hooks (ex: Vue onMounted),
         * nativeInput won't be defined yet with the custom elements build, so wait for it to load in.
         */
        if (!this.nativeInput) {
            await new Promise((resolve) => componentOnReady(this.el, resolve));
        }
        return Promise.resolve(this.nativeInput);
    }
    /**
     * Emits an `ionChange` event.
     *
     * This API should be called for user committed changes.
     * This API should not be used for external value changes.
     */
    emitValueChange(event) {
        const { value } = this;
        // Checks for both null and undefined values
        const newValue = value == null ? value : value.toString();
        // Emitting a value change should update the internal state for tracking the focused value
        this.focusedValue = newValue;
        this.ionChange.emit({ value: newValue, event });
    }
    /**
     * Emits an `ionInput` event.
     */
    emitInputChange(event) {
        const { value } = this;
        this.ionInput.emit({ value, event });
    }
    runAutoGrow() {
        if (this.nativeInput && this.autoGrow) {
            writeTask(() => {
                var _a;
                if (this.textareaWrapper) {
                    // Replicated value is an attribute to be used in the stylesheet
                    // to set the inner contents of a pseudo element.
                    this.textareaWrapper.dataset.replicatedValue = (_a = this.value) !== null && _a !== void 0 ? _a : '';
                }
            });
        }
    }
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     */
    checkClearOnEdit(ev) {
        if (!this.clearOnEdit) {
            return;
        }
        /**
         * The following keys do not modify the
         * contents of the input. As a result, pressing
         * them should not edit the textarea.
         *
         * We can't check to see if the value of the textarea
         * was changed because we call checkClearOnEdit
         * in a keydown listener, and the key has not yet
         * been added to the textarea.
         *
         * Unlike ion-input, the "Enter" key does modify the
         * textarea by adding a new line, so "Enter" is not
         * included in the IGNORED_KEYS array.
         */
        const IGNORED_KEYS = ['Tab', 'Shift', 'Meta', 'Alt', 'Control'];
        const pressedIgnoredKey = IGNORED_KEYS.includes(ev.key);
        /**
         * Clear the textarea if the control has not been previously cleared
         * during focus.
         */
        if (!this.didTextareaClearOnEdit && this.hasValue() && !pressedIgnoredKey) {
            this.value = '';
            this.emitInputChange(ev);
        }
        /**
         * Pressing an IGNORED_KEYS first and
         * then an allowed key will cause the input to not
         * be cleared.
         */
        if (!pressedIgnoredKey) {
            this.didTextareaClearOnEdit = true;
        }
    }
    hasValue() {
        return this.getValue() !== '';
    }
    getValue() {
        return this.value || '';
    }
    renderLabel() {
        const { label } = this;
        return (h("div", { class: {
                'label-text-wrapper': true,
                'label-text-wrapper-hidden': !this.hasLabel,
            } }, label === undefined ? h("slot", { name: "label" }) : h("div", { class: "label-text" }, label)));
    }
    /**
     * Gets any content passed into the `label` slot,
     * not the <slot> definition.
     */
    get labelSlot() {
        return this.el.querySelector('[slot="label"]');
    }
    /**
     * Returns `true` if label content is provided
     * either by a prop or a content. If you want
     * to get the plaintext value of the label use
     * the `labelText` getter instead.
     */
    get hasLabel() {
        return this.label !== undefined || this.labelSlot !== null;
    }
    /**
     * Renders the border container when fill="outline".
     */
    renderLabelContainer() {
        const mode = getIonMode(this);
        const hasOutlineFill = mode === 'md' && this.fill === 'outline';
        if (hasOutlineFill) {
            /**
             * The outline fill has a special outline
             * that appears around the textarea and the label.
             * Certain stacked and floating label placements cause the
             * label to translate up and create a "cut out"
             * inside of that border by using the notch-spacer element.
             */
            return [
                h("div", { class: "textarea-outline-container" }, h("div", { class: "textarea-outline-start" }), h("div", { class: {
                        'textarea-outline-notch': true,
                        'textarea-outline-notch-hidden': !this.hasLabel,
                    } }, h("div", { class: "notch-spacer", "aria-hidden": "true", ref: (el) => (this.notchSpacerEl = el) }, this.label)), h("div", { class: "textarea-outline-end" })),
                this.renderLabel(),
            ];
        }
        /**
         * If not using the outline style,
         * we can render just the label.
         */
        return this.renderLabel();
    }
    /**
     * Renders the helper text or error text values
     */
    renderHintText() {
        const { helperText, errorText, helperTextId, errorTextId } = this;
        return [
            h("div", { id: helperTextId, class: "helper-text" }, helperText),
            h("div", { id: errorTextId, class: "error-text" }, errorText),
        ];
    }
    getHintTextID() {
        const { el, helperText, errorText, helperTextId, errorTextId } = this;
        if (el.classList.contains('ion-touched') && el.classList.contains('ion-invalid') && errorText) {
            return errorTextId;
        }
        if (helperText) {
            return helperTextId;
        }
        return undefined;
    }
    renderCounter() {
        const { counter, maxlength, counterFormatter, value } = this;
        if (counter !== true || maxlength === undefined) {
            return;
        }
        return h("div", { class: "counter" }, getCounterText(value, maxlength, counterFormatter));
    }
    /**
     * Responsible for rendering helper text,
     * error text, and counter. This element should only
     * be rendered if hint text is set or counter is enabled.
     */
    renderBottomContent() {
        const { counter, helperText, errorText, maxlength } = this;
        /**
         * undefined and empty string values should
         * be treated as not having helper/error text.
         */
        const hasHintText = !!helperText || !!errorText;
        const hasCounter = counter === true && maxlength !== undefined;
        if (!hasHintText && !hasCounter) {
            return;
        }
        return (h("div", { class: "textarea-bottom" }, this.renderHintText(), this.renderCounter()));
    }
    render() {
        const { inputId, disabled, fill, shape, labelPlacement, el, hasFocus } = this;
        const mode = getIonMode(this);
        const value = this.getValue();
        const inItem = hostContext('ion-item', this.el);
        const shouldRenderHighlight = mode === 'md' && fill !== 'outline' && !inItem;
        const hasValue = this.hasValue();
        const hasStartEndSlots = el.querySelector('[slot="start"], [slot="end"]') !== null;
        /**
         * If the label is stacked, it should always sit above the textarea.
         * For floating labels, the label should move above the textarea if
         * the textarea has a value, is focused, or has anything in either
         * the start or end slot.
         *
         * If there is content in the start slot, the label would overlap
         * it if not forced to float. This is also applied to the end slot
         * because with the default or solid fills, the textarea is not
         * vertically centered in the container, but the label is. This
         * causes the slots and label to appear vertically offset from each
         * other when the label isn't floating above the input. This doesn't
         * apply to the outline fill, but this was not accounted for to keep
         * things consistent.
         *
         * TODO(FW-5592): Remove hasStartEndSlots condition
         */
        const labelShouldFloat = labelPlacement === 'stacked' || (labelPlacement === 'floating' && (hasValue || hasFocus || hasStartEndSlots));
        return (h(Host, { key: '7eb390b79de0d671a785bbb783f97e09169472f9', class: createColorClasses(this.color, {
                [mode]: true,
                'has-value': hasValue,
                'has-focus': hasFocus,
                'label-floating': labelShouldFloat,
                [`textarea-fill-${fill}`]: fill !== undefined,
                [`textarea-shape-${shape}`]: shape !== undefined,
                [`textarea-label-placement-${labelPlacement}`]: true,
                'textarea-disabled': disabled,
            }) }, h("label", { key: 'f5835d8d56fadbd24637fc063a84834064aefc6d', class: "textarea-wrapper", htmlFor: inputId, onClick: this.onLabelClick }, this.renderLabelContainer(), h("div", { key: '7ca9391a0cdcf47991bd529bfd38d06a3f92d6ec', class: "textarea-wrapper-inner" }, h("div", { key: '12e893e7c4b56f5e9f91ff81cdaf8d76f68988fe', class: "start-slot-wrapper" }, h("slot", { key: 'd9ff42e8989eb1462747fe67575f6c3478f4f8b3', name: "start" })), h("div", { key: '0b9f575368c9c4d990761c390c163825eb311963', class: "native-wrapper", ref: (el) => (this.textareaWrapper = el) }, h("textarea", Object.assign({ key: '2c80fc07518265458f27201e15af9578e372fbcf', class: "native-textarea", ref: (el) => (this.nativeInput = el), id: inputId, disabled: disabled, autoCapitalize: this.autocapitalize, autoFocus: this.autofocus, enterKeyHint: this.enterkeyhint, inputMode: this.inputmode, minLength: this.minlength, maxLength: this.maxlength, name: this.name, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, spellcheck: this.spellcheck, cols: this.cols, rows: this.rows, wrap: this.wrap, onInput: this.onInput, onChange: this.onChange, onBlur: this.onBlur, onFocus: this.onFocus, onKeyDown: this.onKeyDown, "aria-describedby": this.getHintTextID(), "aria-invalid": this.getHintTextID() === this.errorTextId }, this.inheritedAttributes), value)), h("div", { key: '6647296719b79eb3ebe7146f9bfd77a6c37f6c30', class: "end-slot-wrapper" }, h("slot", { key: 'ec3ec3feb6b35ffe11bdcab94b521922b2f7e91f', name: "end" }))), shouldRenderHighlight && h("div", { key: '49e7dca783bc2eee320631859264772be876eaba', class: "textarea-highlight" })), this.renderBottomContent()));
    }
    static get is() { return "ion-textarea"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "ios": ["textarea.ios.scss"],
            "md": ["textarea.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["textarea.ios.css"],
            "md": ["textarea.md.css"]
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
            "autocapitalize": {
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
                    "text": "Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.\nAvailable options: `\"off\"`, `\"none\"`, `\"on\"`, `\"sentences\"`, `\"words\"`, `\"characters\"`."
                },
                "attribute": "autocapitalize",
                "reflect": false,
                "defaultValue": "'none'"
            },
            "autofocus": {
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
                    "text": "Sets the [`autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) on the native input element.\n\nThis may not be sufficient for the element to be focused on page load. See [managing focus](/docs/developing/managing-focus) for more information."
                },
                "attribute": "autofocus",
                "reflect": false,
                "defaultValue": "false"
            },
            "clearOnEdit": {
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
                    "text": "If `true`, the value will be cleared after focus upon edit."
                },
                "attribute": "clear-on-edit",
                "reflect": false,
                "defaultValue": "false"
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
                    "text": "Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke."
                },
                "attribute": "debounce",
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
                    "text": "If `true`, the user cannot interact with the textarea."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "fill": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'outline' | 'solid'",
                    "resolved": "\"outline\" | \"solid\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The fill for the item. If `\"solid\"` the item will have a background. If\n`\"outline\"` the item will be transparent with a border. Only available in `md` mode."
                },
                "attribute": "fill",
                "reflect": false
            },
            "inputmode": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'",
                    "resolved": "\"decimal\" | \"email\" | \"none\" | \"numeric\" | \"search\" | \"tel\" | \"text\" | \"url\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "A hint to the browser for which keyboard to display.\nPossible values: `\"none\"`, `\"text\"`, `\"tel\"`, `\"url\"`,\n`\"email\"`, `\"numeric\"`, `\"decimal\"`, and `\"search\"`."
                },
                "attribute": "inputmode",
                "reflect": false
            },
            "enterkeyhint": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
                    "resolved": "\"done\" | \"enter\" | \"go\" | \"next\" | \"previous\" | \"search\" | \"send\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "A hint to the browser for which enter key to display.\nPossible values: `\"enter\"`, `\"done\"`, `\"go\"`, `\"next\"`,\n`\"previous\"`, `\"search\"`, and `\"send\"`."
                },
                "attribute": "enterkeyhint",
                "reflect": false
            },
            "maxlength": {
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
                    "text": "This attribute specifies the maximum number of characters that the user can enter."
                },
                "attribute": "maxlength",
                "reflect": false
            },
            "minlength": {
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
                    "text": "This attribute specifies the minimum number of characters that the user can enter."
                },
                "attribute": "minlength",
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
                "defaultValue": "this.inputId"
            },
            "placeholder": {
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
                    "text": "Instructional text that shows before the input has a value."
                },
                "attribute": "placeholder",
                "reflect": false
            },
            "readonly": {
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
                    "text": "If `true`, the user cannot modify the value."
                },
                "attribute": "readonly",
                "reflect": false,
                "defaultValue": "false"
            },
            "required": {
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
                    "text": "If `true`, the user must fill in a value before submitting a form."
                },
                "attribute": "required",
                "reflect": false,
                "defaultValue": "false"
            },
            "spellcheck": {
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
                    "text": "If `true`, the element will have its spelling and grammar checked."
                },
                "attribute": "spellcheck",
                "reflect": false,
                "defaultValue": "false"
            },
            "cols": {
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
                    "text": "The visible width of the text control, in average character widths. If it is specified, it must be a positive integer."
                },
                "attribute": "cols",
                "reflect": true
            },
            "rows": {
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
                    "text": "The number of visible text lines for the control."
                },
                "attribute": "rows",
                "reflect": false
            },
            "wrap": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'hard' | 'soft' | 'off'",
                    "resolved": "\"hard\" | \"off\" | \"soft\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Indicates how the control wraps text."
                },
                "attribute": "wrap",
                "reflect": false
            },
            "autoGrow": {
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
                    "text": "If `true`, the textarea container will grow and shrink based\non the contents of the textarea."
                },
                "attribute": "auto-grow",
                "reflect": true,
                "defaultValue": "false"
            },
            "value": {
                "type": "string",
                "mutable": true,
                "complexType": {
                    "original": "string | null",
                    "resolved": "null | string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The value of the textarea."
                },
                "attribute": "value",
                "reflect": false,
                "defaultValue": "''"
            },
            "counter": {
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
                    "text": "If `true`, a character counter will display the ratio of characters used and the total character limit.\nDevelopers must also set the `maxlength` property for the counter to be calculated correctly."
                },
                "attribute": "counter",
                "reflect": false,
                "defaultValue": "false"
            },
            "counterFormatter": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(inputLength: number, maxLength: number) => string",
                    "resolved": "((inputLength: number, maxLength: number) => string) | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "A callback used to format the counter text.\nBy default the counter text is set to \"itemLength / maxLength\".\n\nSee https://ionicframework.com/docs/troubleshooting/runtime#accessing-this\nif you need to access `this` from within the callback."
                }
            },
            "errorText": {
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
                    "text": "Text that is placed under the textarea and displayed when an error is detected."
                },
                "attribute": "error-text",
                "reflect": false
            },
            "helperText": {
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
                    "text": "Text that is placed under the textarea and displayed when no error is detected."
                },
                "attribute": "helper-text",
                "reflect": false
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
                    "text": "The visible label associated with the textarea.\n\nUse this if you need to render a plaintext label.\n\nThe `label` property will take priority over the `label` slot if both are used."
                },
                "attribute": "label",
                "reflect": false
            },
            "labelPlacement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end' | 'floating' | 'stacked' | 'fixed'",
                    "resolved": "\"end\" | \"fixed\" | \"floating\" | \"stacked\" | \"start\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Where to place the label relative to the textarea.\n`\"start\"`: The label will appear to the left of the textarea in LTR and to the right in RTL.\n`\"end\"`: The label will appear to the right of the textarea in LTR and to the left in RTL.\n`\"floating\"`: The label will appear smaller and above the textarea when the textarea is focused or it has a value. Otherwise it will appear on top of the textarea.\n`\"stacked\"`: The label will appear smaller and above the textarea regardless even when the textarea is blurred or has no value.\n`\"fixed\"`: The label has the same behavior as `\"start\"` except it also has a fixed width. Long text will be truncated with ellipses (\"...\")."
                },
                "attribute": "label-placement",
                "reflect": false,
                "defaultValue": "'start'"
            },
            "shape": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'round'",
                    "resolved": "\"round\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The shape of the textarea. If \"round\" it will have an increased border radius."
                },
                "attribute": "shape",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "hasFocus": {}
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
                    "text": "The `ionChange` event is fired when the user modifies the textarea's value.\nUnlike the `ionInput` event, the `ionChange` event is fired when\nthe element loses focus after its value has been modified.\n\nThis event will not emit when programmatically setting the `value` property."
                },
                "complexType": {
                    "original": "TextareaChangeEventDetail",
                    "resolved": "TextareaChangeEventDetail",
                    "references": {
                        "TextareaChangeEventDetail": {
                            "location": "import",
                            "path": "./textarea-interface",
                            "id": "src/components/textarea/textarea-interface.ts::TextareaChangeEventDetail"
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
                    "text": "The `ionInput` event is fired each time the user modifies the textarea's value.\nUnlike the `ionChange` event, the `ionInput` event is fired for each alteration\nto the textarea's value. This typically happens for each keystroke as the user types.\n\nWhen `clearOnEdit` is enabled, the `ionInput` event will be fired when\nthe user clears the textarea by performing a keydown event."
                },
                "complexType": {
                    "original": "TextareaInputEventDetail",
                    "resolved": "TextareaInputEventDetail",
                    "references": {
                        "TextareaInputEventDetail": {
                            "location": "import",
                            "path": "./textarea-interface",
                            "id": "src/components/textarea/textarea-interface.ts::TextareaInputEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionBlur",
                "name": "ionBlur",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the input loses focus."
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
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
                    "text": "Emitted when the input has focus."
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "setFocus": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global\n`textarea.focus()`.\n\nSee [managing focus](/docs/developing/managing-focus) for more information.",
                    "tags": []
                }
            },
            "getInputElement": {
                "complexType": {
                    "signature": "() => Promise<HTMLTextAreaElement>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "HTMLTextAreaElement": {
                            "location": "global",
                            "id": "global::HTMLTextAreaElement"
                        }
                    },
                    "return": "Promise<HTMLTextAreaElement>"
                },
                "docs": {
                    "text": "Returns the native `<textarea>` element used under the hood.",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "debounce",
                "methodName": "debounceChanged"
            }, {
                "propName": "value",
                "methodName": "valueChanged"
            }, {
                "propName": "dir",
                "methodName": "onDirChanged"
            }];
    }
    static get listeners() {
        return [{
                "name": "click",
                "method": "onClickCapture",
                "target": undefined,
                "capture": true,
                "passive": false
            }];
    }
}
let textareaIds = 0;
