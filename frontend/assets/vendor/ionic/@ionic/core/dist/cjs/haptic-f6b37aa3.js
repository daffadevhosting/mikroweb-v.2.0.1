/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

const capacitor = require('./capacitor-c04564bf.js');

exports.ImpactStyle = void 0;
(function (ImpactStyle) {
    /**
     * A collision between large, heavy user interface elements
     *
     * @since 1.0.0
     */
    ImpactStyle["Heavy"] = "HEAVY";
    /**
     * A collision between moderately sized user interface elements
     *
     * @since 1.0.0
     */
    ImpactStyle["Medium"] = "MEDIUM";
    /**
     * A collision between small, light user interface elements
     *
     * @since 1.0.0
     */
    ImpactStyle["Light"] = "LIGHT";
})(exports.ImpactStyle || (exports.ImpactStyle = {}));
var NotificationType;
(function (NotificationType) {
    /**
     * A notification feedback type indicating that a task has completed successfully
     *
     * @since 1.0.0
     */
    NotificationType["Success"] = "SUCCESS";
    /**
     * A notification feedback type indicating that a task has produced a warning
     *
     * @since 1.0.0
     */
    NotificationType["Warning"] = "WARNING";
    /**
     * A notification feedback type indicating that a task has failed
     *
     * @since 1.0.0
     */
    NotificationType["Error"] = "ERROR";
})(NotificationType || (NotificationType = {}));
const HapticEngine = {
    getEngine() {
        const capacitor$1 = capacitor.getCapacitor();
        if (capacitor$1 === null || capacitor$1 === void 0 ? void 0 : capacitor$1.isPluginAvailable('Haptics')) {
            // Capacitor
            return capacitor$1.Plugins.Haptics;
        }
        return undefined;
    },
    available() {
        const engine = this.getEngine();
        if (!engine) {
            return false;
        }
        const capacitor$1 = capacitor.getCapacitor();
        /**
         * Developers can manually import the
         * Haptics plugin in their app which will cause
         * getEngine to return the Haptics engine. However,
         * the Haptics engine will throw an error if
         * used in a web browser that does not support
         * the Vibrate API. This check avoids that error
         * if the browser does not support the Vibrate API.
         */
        if ((capacitor$1 === null || capacitor$1 === void 0 ? void 0 : capacitor$1.getPlatform()) === 'web') {
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            return typeof navigator !== 'undefined' && navigator.vibrate !== undefined;
        }
        return true;
    },
    impact(options) {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.impact({ style: options.style });
    },
    notification(options) {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.notification({ type: options.type });
    },
    selection() {
        this.impact({ style: exports.ImpactStyle.Light });
    },
    selectionStart() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.selectionStart();
    },
    selectionChanged() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.selectionChanged();
    },
    selectionEnd() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.selectionEnd();
    },
};
/**
 * Check to see if the Haptic Plugin is available
 * @return Returns `true` or false if the plugin is available
 */
const hapticAvailable = () => {
    return HapticEngine.available();
};
/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
const hapticSelection = () => {
    hapticAvailable() && HapticEngine.selection();
};
/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
const hapticSelectionStart = () => {
    hapticAvailable() && HapticEngine.selectionStart();
};
/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
const hapticSelectionChanged = () => {
    hapticAvailable() && HapticEngine.selectionChanged();
};
/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
const hapticSelectionEnd = () => {
    hapticAvailable() && HapticEngine.selectionEnd();
};
/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: ImpactStyle.LIGHT }` (or `MEDIUM`/`HEAVY`)
 */
const hapticImpact = (options) => {
    hapticAvailable() && HapticEngine.impact(options);
};

exports.hapticImpact = hapticImpact;
exports.hapticSelection = hapticSelection;
exports.hapticSelectionChanged = hapticSelectionChanged;
exports.hapticSelectionEnd = hapticSelectionEnd;
exports.hapticSelectionStart = hapticSelectionStart;
