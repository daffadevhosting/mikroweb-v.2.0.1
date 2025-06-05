/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');
const helpers = require('./helpers-8a48fdea.js');
const ionicGlobal = require('./ionic-global-6dea5a96.js');
require('./index-cc858e97.js');

const imgCss = ":host{display:block;-o-object-fit:contain;object-fit:contain}img{display:block;width:100%;height:100%;-o-object-fit:inherit;object-fit:inherit;-o-object-position:inherit;object-position:inherit}";
const IonImgStyle0 = imgCss;

const Img = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.ionImgWillLoad = index.createEvent(this, "ionImgWillLoad", 7);
        this.ionImgDidLoad = index.createEvent(this, "ionImgDidLoad", 7);
        this.ionError = index.createEvent(this, "ionError", 7);
        this.inheritedAttributes = {};
        this.onLoad = () => {
            this.ionImgDidLoad.emit();
        };
        this.onError = () => {
            this.ionError.emit();
        };
        this.loadSrc = undefined;
        this.loadError = undefined;
        this.alt = undefined;
        this.src = undefined;
    }
    srcChanged() {
        this.addIO();
    }
    componentWillLoad() {
        this.inheritedAttributes = helpers.inheritAttributes(this.el, ['draggable']);
    }
    componentDidLoad() {
        this.addIO();
    }
    addIO() {
        if (this.src === undefined) {
            return;
        }
        if (typeof window !== 'undefined' &&
            'IntersectionObserver' in window &&
            'IntersectionObserverEntry' in window &&
            'isIntersecting' in window.IntersectionObserverEntry.prototype) {
            this.removeIO();
            this.io = new IntersectionObserver((data) => {
                /**
                 * On slower devices, it is possible for an intersection observer entry to contain multiple
                 * objects in the array. This happens when quickly scrolling an image into view and then out of
                 * view. In this case, the last object represents the current state of the component.
                 */
                if (data[data.length - 1].isIntersecting) {
                    this.load();
                    this.removeIO();
                }
            });
            this.io.observe(this.el);
        }
        else {
            // fall back to setTimeout for Safari and IE
            setTimeout(() => this.load(), 200);
        }
    }
    load() {
        this.loadError = this.onError;
        this.loadSrc = this.src;
        this.ionImgWillLoad.emit();
    }
    removeIO() {
        if (this.io) {
            this.io.disconnect();
            this.io = undefined;
        }
    }
    render() {
        const { loadSrc, alt, onLoad, loadError, inheritedAttributes } = this;
        const { draggable } = inheritedAttributes;
        return (index.h(index.Host, { key: 'da600442894427dee1974a28e545613afac69fca', class: ionicGlobal.getIonMode(this) }, index.h("img", { key: '16df0c7069af86c0fa7ce5af598bc0f63b4eb71a', decoding: "async", src: loadSrc, alt: alt, onLoad: onLoad, onError: loadError, part: "image", draggable: isDraggable(draggable) })));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "src": ["srcChanged"]
    }; }
};
/**
 * Enumerated strings must be set as booleans
 * as Stencil will not render 'false' in the DOM.
 * The need to explicitly render draggable="true"
 * as only certain elements are draggable by default.
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable.
 */
const isDraggable = (draggable) => {
    switch (draggable) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return undefined;
    }
};
Img.style = IonImgStyle0;

exports.ion_img = Img;
