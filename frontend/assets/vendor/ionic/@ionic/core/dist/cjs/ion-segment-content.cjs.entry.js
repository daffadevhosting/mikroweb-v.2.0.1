/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-2e236a04.js');

const segmentContentCss = ":host{scroll-snap-align:center;scroll-snap-stop:always;-ms-flex-negative:0;flex-shrink:0;width:100%;overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none;}:host::-webkit-scrollbar{display:none}";
const IonSegmentContentStyle0 = segmentContentCss;

const SegmentContent = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return (index.h(index.Host, { key: '64b3965b14c749e77e9ce13b59f349d971e245c8' }, index.h("slot", { key: '2d0bed34f9bc93f92e713cb51e42220f3cecd8f5' })));
    }
};
SegmentContent.style = IonSegmentContentStyle0;

exports.ion_segment_content = SegmentContent;
