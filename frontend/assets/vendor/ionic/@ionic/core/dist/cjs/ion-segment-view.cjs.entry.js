/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');

const segmentViewIosCss = ":host{display:-ms-flexbox;display:flex;height:100%;overflow-x:scroll;-webkit-scroll-snap-type:x mandatory;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none}:host::-webkit-scrollbar{display:none}:host(.segment-view-disabled){-ms-touch-action:none;touch-action:none;overflow-x:hidden}:host(.segment-view-scroll-disabled){pointer-events:none}:host(.segment-view-disabled){opacity:0.3}";
const IonSegmentViewIosStyle0 = segmentViewIosCss;

const segmentViewMdCss = ":host{display:-ms-flexbox;display:flex;height:100%;overflow-x:scroll;-webkit-scroll-snap-type:x mandatory;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none}:host::-webkit-scrollbar{display:none}:host(.segment-view-disabled){-ms-touch-action:none;touch-action:none;overflow-x:hidden}:host(.segment-view-scroll-disabled){pointer-events:none}:host(.segment-view-disabled){opacity:0.3}";
const IonSegmentViewMdStyle0 = segmentViewMdCss;

const SegmentView = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.ionSegmentViewScroll = index.createEvent(this, "ionSegmentViewScroll", 7);
        this.scrollEndTimeout = null;
        this.isTouching = false;
        this.disabled = false;
        this.isManualScroll = undefined;
    }
    handleScroll(ev) {
        var _a;
        const { scrollLeft, scrollWidth, clientWidth } = ev.target;
        const scrollRatio = scrollLeft / (scrollWidth - clientWidth);
        this.ionSegmentViewScroll.emit({
            scrollRatio,
            isManualScroll: (_a = this.isManualScroll) !== null && _a !== void 0 ? _a : true,
        });
        // Reset the timeout to check for scroll end
        this.resetScrollEndTimeout();
    }
    /**
     * Handle touch start event to know when the user is actively dragging the segment view.
     */
    handleScrollStart() {
        if (this.scrollEndTimeout) {
            clearTimeout(this.scrollEndTimeout);
            this.scrollEndTimeout = null;
        }
        this.isTouching = true;
    }
    /**
     * Handle touch end event to know when the user is no longer dragging the segment view.
     */
    handleTouchEnd() {
        this.isTouching = false;
    }
    /**
     * Reset the scroll end detection timer. This is called on every scroll event.
     */
    resetScrollEndTimeout() {
        if (this.scrollEndTimeout) {
            clearTimeout(this.scrollEndTimeout);
            this.scrollEndTimeout = null;
        }
        this.scrollEndTimeout = setTimeout(() => {
            this.checkForScrollEnd();
        }, 
        // Setting this to a lower value may result in inconsistencies in behavior
        // across browsers (particularly Firefox).
        // Ideally, all of this logic is removed once the scroll end event is
        // supported on all browsers (https://caniuse.com/?search=scrollend)
        100);
    }
    /**
     * Check if the scroll has ended and the user is not actively touching.
     * If the conditions are met (active content is enabled and no active touch),
     * reset the scroll position and emit the scroll end event.
     */
    checkForScrollEnd() {
        // Only emit scroll end event if the active content is not disabled and
        // the user is not touching the segment view
        if (!this.isTouching) {
            this.isManualScroll = undefined;
        }
    }
    /**
     * @internal
     *
     * This method is used to programmatically set the displayed segment content
     * in the segment view. Calling this method will update the `value` of the
     * corresponding segment button.
     *
     * @param id: The id of the segment content to display.
     * @param smoothScroll: Whether to animate the scroll transition.
     */
    async setContent(id, smoothScroll = true) {
        const contents = this.getSegmentContents();
        const index = contents.findIndex((content) => content.id === id);
        if (index === -1)
            return;
        this.isManualScroll = false;
        this.resetScrollEndTimeout();
        const contentWidth = this.el.offsetWidth;
        this.el.scrollTo({
            top: 0,
            left: index * contentWidth,
            behavior: smoothScroll ? 'smooth' : 'instant',
        });
    }
    getSegmentContents() {
        return Array.from(this.el.querySelectorAll('ion-segment-content'));
    }
    render() {
        const { disabled, isManualScroll } = this;
        return (index.h(index.Host, { key: 'fa528d2d9ae0f00fc3067defe2a047dce77c814a', class: {
                'segment-view-disabled': disabled,
                'segment-view-scroll-disabled': isManualScroll === false,
            } }, index.h("slot", { key: '74dc8b4d073caeff1bab272d11b9ea3e1a215954' })));
    }
    get el() { return index.getElement(this); }
};
SegmentView.style = {
    ios: IonSegmentViewIosStyle0,
    md: IonSegmentViewMdStyle0
};

exports.ion_segment_view = SegmentView;
