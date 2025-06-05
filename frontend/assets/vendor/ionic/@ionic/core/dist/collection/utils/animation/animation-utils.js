/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
let animationPrefix;
export const getAnimationPrefix = (el) => {
    if (animationPrefix === undefined) {
        const supportsUnprefixed = el.style.animationName !== undefined;
        const supportsWebkitPrefix = el.style.webkitAnimationName !== undefined;
        animationPrefix = !supportsUnprefixed && supportsWebkitPrefix ? '-webkit-' : '';
    }
    return animationPrefix;
};
export const setStyleProperty = (element, propertyName, value) => {
    const prefix = propertyName.startsWith('animation') ? getAnimationPrefix(element) : '';
    element.style.setProperty(prefix + propertyName, value);
};
export const addClassToArray = (classes = [], className) => {
    if (className !== undefined) {
        const classNameToAppend = Array.isArray(className) ? className : [className];
        return [...classes, ...classNameToAppend];
    }
    return classes;
};
