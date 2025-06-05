/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { focusVisibleElement } from "./helpers";
/**
 * This query string selects elements that
 * are eligible to receive focus. We select
 * interactive elements that meet the following
 * criteria:
 * 1. Element does not have a negative tabindex
 * 2. Element does not have `hidden`
 * 3. Element does not have `disabled` for non-Ionic components.
 * 4. Element does not have `disabled` or `disabled="true"` for Ionic components.
 * Note: We need this distinction because `disabled="false"` is
 * valid usage for the disabled property on ion-button.
 */
export const focusableQueryString = '[tabindex]:not([tabindex^="-"]):not([hidden]):not([disabled]), input:not([type=hidden]):not([tabindex^="-"]):not([hidden]):not([disabled]), textarea:not([tabindex^="-"]):not([hidden]):not([disabled]), button:not([tabindex^="-"]):not([hidden]):not([disabled]), select:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-checkbox:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-radio:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable[disabled="false"]:not([tabindex^="-"]):not([hidden])';
/**
 * Focuses the first descendant in a context
 * that can receive focus. If none exists,
 * a fallback element will be focused.
 * This fallback is typically an ancestor
 * container such as a menu or overlay so focus does not
 * leave the container we are trying to trap focus in.
 *
 * If no fallback is specified then we focus the container itself.
 */
export const focusFirstDescendant = (ref, fallbackElement) => {
    const firstInput = ref.querySelector(focusableQueryString);
    focusElementInContext(firstInput, fallbackElement !== null && fallbackElement !== void 0 ? fallbackElement : ref);
};
/**
 * Focuses the last descendant in a context
 * that can receive focus. If none exists,
 * a fallback element will be focused.
 * This fallback is typically an ancestor
 * container such as a menu or overlay so focus does not
 * leave the container we are trying to trap focus in.
 *
 * If no fallback is specified then we focus the container itself.
 */
export const focusLastDescendant = (ref, fallbackElement) => {
    const inputs = Array.from(ref.querySelectorAll(focusableQueryString));
    const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    focusElementInContext(lastInput, fallbackElement !== null && fallbackElement !== void 0 ? fallbackElement : ref);
};
/**
 * Focuses a particular element in a context. If the element
 * doesn't have anything focusable associated with it then
 * a fallback element will be focused.
 *
 * This fallback is typically an ancestor
 * container such as a menu or overlay so focus does not
 * leave the container we are trying to trap focus in.
 * This should be used instead of the focus() method
 * on most elements because the focusable element
 * may not be the host element.
 *
 * For example, if an ion-button should be focused
 * then we should actually focus the native <button>
 * element inside of ion-button's shadow root, not
 * the host element itself.
 */
const focusElementInContext = (hostToFocus, fallbackElement) => {
    let elementToFocus = hostToFocus;
    const shadowRoot = hostToFocus === null || hostToFocus === void 0 ? void 0 : hostToFocus.shadowRoot;
    if (shadowRoot) {
        // If there are no inner focusable elements, just focus the host element.
        elementToFocus = shadowRoot.querySelector(focusableQueryString) || hostToFocus;
    }
    if (elementToFocus) {
        const radioGroup = elementToFocus.closest('ion-radio-group');
        if (radioGroup) {
            radioGroup.setFocus();
        }
        else {
            focusVisibleElement(elementToFocus);
        }
    }
    else {
        // Focus fallback element instead of letting focus escape
        fallbackElement.focus();
    }
};
