/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { printIonError } from "../../utils/logging/index";
/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot top - Content is placed at the top of the screen.
 * @slot bottom - Content is placed at the bottom of the screen.
 */
export class Tabs {
    constructor() {
        this.transitioning = false;
        this.onTabClicked = (ev) => {
            const { href, tab } = ev.detail;
            if (this.useRouter && href !== undefined) {
                const router = document.querySelector('ion-router');
                if (router) {
                    router.push(href);
                }
            }
            else {
                this.select(tab);
            }
        };
        this.selectedTab = undefined;
        this.useRouter = false;
    }
    async componentWillLoad() {
        if (!this.useRouter) {
            /**
             * JavaScript and StencilJS use `ion-router`, while
             * the other frameworks use `ion-router-outlet`.
             *
             * If either component is present then tabs will not use
             * a basic tab-based navigation. It will use the history
             * stack or URL updates associated with the router.
             */
            this.useRouter =
                (!!this.el.querySelector('ion-router-outlet') || !!document.querySelector('ion-router')) &&
                    !this.el.closest('[no-router]');
        }
        if (!this.useRouter) {
            const tabs = this.tabs;
            if (tabs.length > 0) {
                await this.select(tabs[0]);
            }
        }
        this.ionNavWillLoad.emit();
    }
    componentWillRender() {
        const tabBar = this.el.querySelector('ion-tab-bar');
        if (tabBar) {
            const tab = this.selectedTab ? this.selectedTab.tab : undefined;
            tabBar.selectedTab = tab;
        }
    }
    /**
     * Select a tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    async select(tab) {
        const selectedTab = getTab(this.tabs, tab);
        if (!this.shouldSwitch(selectedTab)) {
            return false;
        }
        await this.setActive(selectedTab);
        await this.notifyRouter();
        this.tabSwitch();
        return true;
    }
    /**
     * Get a specific tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    async getTab(tab) {
        return getTab(this.tabs, tab);
    }
    /**
     * Get the currently selected tab. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.
     */
    getSelected() {
        return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
    }
    /** @internal */
    async setRouteId(id) {
        const selectedTab = getTab(this.tabs, id);
        if (!this.shouldSwitch(selectedTab)) {
            return { changed: false, element: this.selectedTab };
        }
        await this.setActive(selectedTab);
        return {
            changed: true,
            element: this.selectedTab,
            markVisible: () => this.tabSwitch(),
        };
    }
    /** @internal */
    async getRouteId() {
        var _a;
        const tabId = (_a = this.selectedTab) === null || _a === void 0 ? void 0 : _a.tab;
        return tabId !== undefined ? { id: tabId, element: this.selectedTab } : undefined;
    }
    setActive(selectedTab) {
        if (this.transitioning) {
            return Promise.reject('transitioning already happening');
        }
        this.transitioning = true;
        this.leavingTab = this.selectedTab;
        this.selectedTab = selectedTab;
        this.ionTabsWillChange.emit({ tab: selectedTab.tab });
        selectedTab.active = true;
        return Promise.resolve();
    }
    tabSwitch() {
        const selectedTab = this.selectedTab;
        const leavingTab = this.leavingTab;
        this.leavingTab = undefined;
        this.transitioning = false;
        if (!selectedTab) {
            return;
        }
        if (leavingTab !== selectedTab) {
            if (leavingTab) {
                leavingTab.active = false;
            }
            this.ionTabsDidChange.emit({ tab: selectedTab.tab });
        }
    }
    notifyRouter() {
        if (this.useRouter) {
            const router = document.querySelector('ion-router');
            if (router) {
                return router.navChanged('forward');
            }
        }
        return Promise.resolve(false);
    }
    shouldSwitch(selectedTab) {
        const leavingTab = this.selectedTab;
        return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
    }
    get tabs() {
        return Array.from(this.el.querySelectorAll('ion-tab'));
    }
    render() {
        return (h(Host, { key: '20b97196d78c1b3f3faf31618a8a2347e087f06b', onIonTabButtonClick: this.onTabClicked }, h("slot", { key: 'b0823fbae6e47743cfd12c376b365ad7e32cec7c', name: "top" }), h("div", { key: 'eaffd7e4d69ab9489a387e3bbb36e3bab72203a0', class: "tabs-inner" }, h("slot", { key: '20bb66a2937e3ec473aa59c4075ce581b5411677' })), h("slot", { key: '1529dd361f050f52074f51c73b3982ba827dc3a5', name: "bottom" })));
    }
    static get is() { return "ion-tabs"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["tabs.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["tabs.css"]
        };
    }
    static get properties() {
        return {
            "useRouter": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": ""
                },
                "attribute": "use-router",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "selectedTab": {}
        };
    }
    static get events() {
        return [{
                "method": "ionNavWillLoad",
                "name": "ionNavWillLoad",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the navigation will load a component."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionTabsWillChange",
                "name": "ionTabsWillChange",
                "bubbles": false,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the navigation is about to transition to a new component."
                },
                "complexType": {
                    "original": "{ tab: string }",
                    "resolved": "{ tab: string; }",
                    "references": {}
                }
            }, {
                "method": "ionTabsDidChange",
                "name": "ionTabsDidChange",
                "bubbles": false,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the navigation has finished transitioning to a new component."
                },
                "complexType": {
                    "original": "{ tab: string }",
                    "resolved": "{ tab: string; }",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "select": {
                "complexType": {
                    "signature": "(tab: string | HTMLIonTabElement) => Promise<boolean>",
                    "parameters": [{
                            "name": "tab",
                            "type": "string | HTMLIonTabElement",
                            "docs": "The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "HTMLIonTabElement": {
                            "location": "global",
                            "id": "global::HTMLIonTabElement"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "Select a tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.",
                    "tags": [{
                            "name": "param",
                            "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                        }]
                }
            },
            "getTab": {
                "complexType": {
                    "signature": "(tab: string | HTMLIonTabElement) => Promise<HTMLIonTabElement | undefined>",
                    "parameters": [{
                            "name": "tab",
                            "type": "string | HTMLIonTabElement",
                            "docs": "The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "HTMLIonTabElement": {
                            "location": "global",
                            "id": "global::HTMLIonTabElement"
                        }
                    },
                    "return": "Promise<HTMLIonTabElement | undefined>"
                },
                "docs": {
                    "text": "Get a specific tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.",
                    "tags": [{
                            "name": "param",
                            "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                        }]
                }
            },
            "getSelected": {
                "complexType": {
                    "signature": "() => Promise<string | undefined>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<string | undefined>"
                },
                "docs": {
                    "text": "Get the currently selected tab. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router.",
                    "tags": []
                }
            },
            "setRouteId": {
                "complexType": {
                    "signature": "(id: string) => Promise<RouteWrite>",
                    "parameters": [{
                            "name": "id",
                            "type": "string",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "RouteWrite": {
                            "location": "import",
                            "path": "../router/utils/interface",
                            "id": "src/components/router/utils/interface.ts::RouteWrite"
                        }
                    },
                    "return": "Promise<RouteWrite>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            },
            "getRouteId": {
                "complexType": {
                    "signature": "() => Promise<RouteID | undefined>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "RouteID": {
                            "location": "import",
                            "path": "../router/utils/interface",
                            "id": "src/components/router/utils/interface.ts::RouteID"
                        }
                    },
                    "return": "Promise<RouteID | undefined>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
}
const getTab = (tabs, tab) => {
    const tabEl = typeof tab === 'string' ? tabs.find((t) => t.tab === tab) : tab;
    if (!tabEl) {
        printIonError(`[ion-tabs] - Tab with id: "${tabEl}" does not exist`);
    }
    return tabEl;
};
