/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { c as createColorClasses } from './theme.js';
import { b as getIonMode } from './ionic-global.js';

const noteIosCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-350, var(--ion-text-color-step-650, #a6a6a6));font-size:max(14px, 1rem)}";
const IonNoteIosStyle0 = noteIosCss;

const noteMdCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, var(--ion-text-color-step-400, #666666));font-size:0.875rem}";
const IonNoteMdStyle0 = noteMdCss;

const Note = /*@__PURE__*/ proxyCustomElement(class Note extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.color = undefined;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '3c3d9b2aa805c0bc1fdc6270a2bbf4dcc1b96c5b', class: createColorClasses(this.color, {
                [mode]: true,
            }) }, h("slot", { key: '39e34682009fcb705ecafe51825162734bdf14d3' })));
    }
    static get style() { return {
        ios: IonNoteIosStyle0,
        md: IonNoteMdStyle0
    }; }
}, [33, "ion-note", {
        "color": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["ion-note"];
    components.forEach(tagName => { switch (tagName) {
        case "ion-note":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Note);
            }
            break;
    } });
}

const IonNote = Note;
const defineCustomElement = defineCustomElement$1;

export { IonNote, defineCustomElement };
