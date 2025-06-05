/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
export class SegmentView {
    constructor() {
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
        return (h(Host, { key: 'fa528d2d9ae0f00fc3067defe2a047dce77c814a', class: {
                'segment-view-disabled': disabled,
                'segment-view-scroll-disabled': isManualScroll === false,
            } }, h("slot", { key: '74dc8b4d073caeff1bab272d11b9ea3e1a215954' })));
    }
    static get is() { return "ion-segment-view"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["segment-view.ios.scss"],
            "md": ["segment-view.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["segment-view.ios.css"],
            "md": ["segment-view.md.css"]
        };
    }
    static get properties() {
        return {
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
                    "text": "If `true`, the segment view cannot be interacted with."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "isManualScroll": {}
        };
    }
    static get events() {
        return [{
                "method": "ionSegmentViewScroll",
                "name": "ionSegmentViewScroll",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the segment view is scrolled."
                },
                "complexType": {
                    "original": "SegmentViewScrollEvent",
                    "resolved": "SegmentViewScrollEvent",
                    "references": {
                        "SegmentViewScrollEvent": {
                            "location": "import",
                            "path": "./segment-view-interface",
                            "id": "src/components/segment-view/segment-view-interface.ts::SegmentViewScrollEvent"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "setContent": {
                "complexType": {
                    "signature": "(id: string, smoothScroll?: boolean) => Promise<void>",
                    "parameters": [{
                            "name": "id",
                            "type": "string",
                            "docs": ": The id of the segment content to display."
                        }, {
                            "name": "smoothScroll",
                            "type": "boolean",
                            "docs": ": Whether to animate the scroll transition."
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": "This method is used to programmatically set the displayed segment content\nin the segment view. Calling this method will update the `value` of the\ncorresponding segment button."
                        }, {
                            "name": "param",
                            "text": "id : The id of the segment content to display."
                        }, {
                            "name": "param",
                            "text": "smoothScroll : Whether to animate the scroll transition."
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "scroll",
                "method": "handleScroll",
                "target": undefined,
                "capture": false,
                "passive": true
            }, {
                "name": "touchstart",
                "method": "handleScrollStart",
                "target": undefined,
                "capture": false,
                "passive": true
            }, {
                "name": "touchend",
                "method": "handleTouchEnd",
                "target": undefined,
                "capture": false,
                "passive": true
            }];
    }
}
