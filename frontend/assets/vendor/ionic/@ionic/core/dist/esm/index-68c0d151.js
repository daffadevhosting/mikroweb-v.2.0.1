/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { c as config, p as printIonWarning } from './index-cfd9c1f2.js';
import { w as writeTask, B as Build } from './index-527b9e34.js';
import { r as raf } from './helpers-d94bc8ad.js';

const LIFECYCLE_WILL_ENTER = 'ionViewWillEnter';
const LIFECYCLE_DID_ENTER = 'ionViewDidEnter';
const LIFECYCLE_WILL_LEAVE = 'ionViewWillLeave';
const LIFECYCLE_DID_LEAVE = 'ionViewDidLeave';
const LIFECYCLE_WILL_UNLOAD = 'ionViewWillUnload';

/**
 * Moves focus to a specified element. Note that we do not remove the tabindex
 * because that can result in an unintentional blur. Non-focusables can't be
 * focused, so the body will get focused again.
 */
const moveFocus = (el) => {
    el.tabIndex = -1;
    el.focus();
};
/**
 * Elements that are hidden using `display: none` should not be focused even if
 * they are present in the DOM.
 */
const isVisible = (el) => {
    return el.offsetParent !== null;
};
/**
 * The focus controller allows us to manage focus within a view so assistive
 * technologies can inform users of changes to the navigation state. Traditional
 * native apps have a way of informing assistive technology about a navigation
 * state change. Mobile browsers have this too, but only when doing a full page
 * load. In a single page app we do not do that, so we need to build this
 * integration ourselves.
 */
const createFocusController = () => {
    const saveViewFocus = (referenceEl) => {
        const focusManagerEnabled = config.get('focusManagerPriority', false);
        /**
         * When going back to a previously visited page focus should typically be moved
         * back to the element that was last focused when the user was on this view.
         */
        if (focusManagerEnabled) {
            const activeEl = document.activeElement;
            if (activeEl !== null && (referenceEl === null || referenceEl === void 0 ? void 0 : referenceEl.contains(activeEl))) {
                activeEl.setAttribute(LAST_FOCUS, 'true');
            }
        }
    };
    const setViewFocus = (referenceEl) => {
        const focusManagerPriorities = config.get('focusManagerPriority', false);
        /**
         * If the focused element is a descendant of the referenceEl then it's possible
         * that the app developer manually moved focus, so we do not want to override that.
         * This can happen with inputs the are focused when a view transitions in.
         */
        if (Array.isArray(focusManagerPriorities) && !referenceEl.contains(document.activeElement)) {
            /**
             * When going back to a previously visited view focus should always be moved back
             * to the element that the user was last focused on when they were on this view.
             */
            const lastFocus = referenceEl.querySelector(`[${LAST_FOCUS}]`);
            if (lastFocus && isVisible(lastFocus)) {
                moveFocus(lastFocus);
                return;
            }
            for (const priority of focusManagerPriorities) {
                /**
                 * For each recognized case (excluding the default case) make sure to return
                 * so that the fallback focus behavior does not run.
                 *
                 * We intentionally query for specific roles/semantic elements so that the
                 * transition manager can work with both Ionic and non-Ionic UI components.
                 *
                 * If new selectors are added, be sure to remove the outline ring by adding
                 * new selectors to rule in core.scss.
                 */
                switch (priority) {
                    case 'content':
                        const content = referenceEl.querySelector('main, [role="main"]');
                        if (content && isVisible(content)) {
                            moveFocus(content);
                            return;
                        }
                        break;
                    case 'heading':
                        const headingOne = referenceEl.querySelector('h1, [role="heading"][aria-level="1"]');
                        if (headingOne && isVisible(headingOne)) {
                            moveFocus(headingOne);
                            return;
                        }
                        break;
                    case 'banner':
                        const header = referenceEl.querySelector('header, [role="banner"]');
                        if (header && isVisible(header)) {
                            moveFocus(header);
                            return;
                        }
                        break;
                    default:
                        printIonWarning(`Unrecognized focus manager priority value ${priority}`);
                        break;
                }
            }
            /**
             * If there is nothing to focus then focus the page so focus at least moves to
             * the correct view. The browser will then determine where within the page to
             * move focus to.
             */
            moveFocus(referenceEl);
        }
    };
    return {
        saveViewFocus,
        setViewFocus,
    };
};
const LAST_FOCUS = 'ion-last-focus';

const iosTransitionAnimation = () => import('./ios.transition-4047cb68.js');
const mdTransitionAnimation = () => import('./md.transition-30ce8d1b.js');
const focusController = createFocusController();
// TODO(FW-2832): types
const transition = (opts) => {
    return new Promise((resolve, reject) => {
        writeTask(() => {
            beforeTransition(opts);
            runTransition(opts).then((result) => {
                if (result.animation) {
                    result.animation.destroy();
                }
                afterTransition(opts);
                resolve(result);
            }, (error) => {
                afterTransition(opts);
                reject(error);
            });
        });
    });
};
const beforeTransition = (opts) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    focusController.saveViewFocus(leavingEl);
    setZIndex(enteringEl, leavingEl, opts.direction);
    if (opts.showGoBack) {
        enteringEl.classList.add('can-go-back');
    }
    else {
        enteringEl.classList.remove('can-go-back');
    }
    setPageHidden(enteringEl, false);
    /**
     * When transitioning, the page should not
     * respond to click events. This resolves small
     * issues like users double tapping the ion-back-button.
     * These pointer events are removed in `afterTransition`.
     */
    enteringEl.style.setProperty('pointer-events', 'none');
    if (leavingEl) {
        setPageHidden(leavingEl, false);
        leavingEl.style.setProperty('pointer-events', 'none');
    }
};
const runTransition = async (opts) => {
    const animationBuilder = await getAnimationBuilder(opts);
    const ani = animationBuilder && Build.isBrowser ? animation(animationBuilder, opts) : noAnimation(opts); // fast path for no animation
    return ani;
};
const afterTransition = (opts) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    enteringEl.classList.remove('ion-page-invisible');
    enteringEl.style.removeProperty('pointer-events');
    if (leavingEl !== undefined) {
        leavingEl.classList.remove('ion-page-invisible');
        leavingEl.style.removeProperty('pointer-events');
    }
    focusController.setViewFocus(enteringEl);
};
const getAnimationBuilder = async (opts) => {
    if (!opts.leavingEl || !opts.animated || opts.duration === 0) {
        return undefined;
    }
    if (opts.animationBuilder) {
        return opts.animationBuilder;
    }
    const getAnimation = opts.mode === 'ios'
        ? (await iosTransitionAnimation()).iosTransitionAnimation
        : (await mdTransitionAnimation()).mdTransitionAnimation;
    return getAnimation;
};
const animation = async (animationBuilder, opts) => {
    await waitForReady(opts, true);
    const trans = animationBuilder(opts.baseEl, opts);
    fireWillEvents(opts.enteringEl, opts.leavingEl);
    const didComplete = await playTransition(trans, opts);
    if (opts.progressCallback) {
        opts.progressCallback(undefined);
    }
    if (didComplete) {
        fireDidEvents(opts.enteringEl, opts.leavingEl);
    }
    return {
        hasCompleted: didComplete,
        animation: trans,
    };
};
const noAnimation = async (opts) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    const focusManagerEnabled = config.get('focusManagerPriority', false);
    /**
     * If the focus manager is enabled then we need to wait for Ionic components to be
     * rendered otherwise the component to focus may not be focused because it is hidden.
     */
    await waitForReady(opts, focusManagerEnabled);
    fireWillEvents(enteringEl, leavingEl);
    fireDidEvents(enteringEl, leavingEl);
    return {
        hasCompleted: true,
    };
};
const waitForReady = async (opts, defaultDeep) => {
    const deep = opts.deepWait !== undefined ? opts.deepWait : defaultDeep;
    if (deep) {
        await Promise.all([deepReady(opts.enteringEl), deepReady(opts.leavingEl)]);
    }
    await notifyViewReady(opts.viewIsReady, opts.enteringEl);
};
const notifyViewReady = async (viewIsReady, enteringEl) => {
    if (viewIsReady) {
        await viewIsReady(enteringEl);
    }
};
const playTransition = (trans, opts) => {
    const progressCallback = opts.progressCallback;
    const promise = new Promise((resolve) => {
        trans.onFinish((currentStep) => resolve(currentStep === 1));
    });
    // cool, let's do this, start the transition
    if (progressCallback) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        trans.progressStart(true);
        progressCallback(trans);
    }
    else {
        // only the top level transition should actually start "play"
        // kick it off and let it play through
        // ******** DOM WRITE ****************
        trans.play();
    }
    // create a callback for when the animation is done
    return promise;
};
const fireWillEvents = (enteringEl, leavingEl) => {
    lifecycle(leavingEl, LIFECYCLE_WILL_LEAVE);
    lifecycle(enteringEl, LIFECYCLE_WILL_ENTER);
};
const fireDidEvents = (enteringEl, leavingEl) => {
    lifecycle(enteringEl, LIFECYCLE_DID_ENTER);
    lifecycle(leavingEl, LIFECYCLE_DID_LEAVE);
};
const lifecycle = (el, eventName) => {
    if (el) {
        const ev = new CustomEvent(eventName, {
            bubbles: false,
            cancelable: false,
        });
        el.dispatchEvent(ev);
    }
};
/**
 * Wait two request animation frame loops.
 * This allows the framework implementations enough time to mount
 * the user-defined contents. This is often needed when using inline
 * modals and popovers that accept user components. For popover,
 * the contents must be mounted for the popover to be sized correctly.
 * For modals, the contents must be mounted for iOS to run the
 * transition correctly.
 *
 * On Angular and React, a single raf is enough time, but for Vue
 * we need to wait two rafs. As a result we are using two rafs for
 * all frameworks to ensure contents are mounted.
 */
const waitForMount = () => {
    return new Promise((resolve) => raf(() => raf(() => resolve())));
};
const deepReady = async (el) => {
    const element = el;
    if (element) {
        if (element.componentOnReady != null) {
            // eslint-disable-next-line custom-rules/no-component-on-ready-method
            const stencilEl = await element.componentOnReady();
            if (stencilEl != null) {
                return;
            }
            /**
             * Custom elements in Stencil will have __registerHost.
             */
        }
        else if (element.__registerHost != null) {
            /**
             * Non-lazy loaded custom elements need to wait
             * one frame for component to be loaded.
             */
            const waitForCustomElement = new Promise((resolve) => raf(resolve));
            await waitForCustomElement;
            return;
        }
        await Promise.all(Array.from(element.children).map(deepReady));
    }
};
const setPageHidden = (el, hidden) => {
    if (hidden) {
        el.setAttribute('aria-hidden', 'true');
        el.classList.add('ion-page-hidden');
    }
    else {
        el.hidden = false;
        el.removeAttribute('aria-hidden');
        el.classList.remove('ion-page-hidden');
    }
};
const setZIndex = (enteringEl, leavingEl, direction) => {
    if (enteringEl !== undefined) {
        enteringEl.style.zIndex = direction === 'back' ? '99' : '101';
    }
    if (leavingEl !== undefined) {
        leavingEl.style.zIndex = '100';
    }
};
const getIonPageElement = (element) => {
    if (element.classList.contains('ion-page')) {
        return element;
    }
    const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
    if (ionPage) {
        return ionPage;
    }
    // idk, return the original element so at least something animates and we don't have a null pointer
    return element;
};

export { LIFECYCLE_WILL_ENTER as L, LIFECYCLE_DID_ENTER as a, LIFECYCLE_WILL_LEAVE as b, LIFECYCLE_DID_LEAVE as c, LIFECYCLE_WILL_UNLOAD as d, deepReady as e, getIonPageElement as g, lifecycle as l, setPageHidden as s, transition as t, waitForMount as w };
