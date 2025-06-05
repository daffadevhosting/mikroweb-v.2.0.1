/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
// TODO(FW-2832): types
class Config {
    constructor() {
        this.m = new Map();
    }
    reset(configObj) {
        this.m = new Map(Object.entries(configObj));
    }
    get(key, fallback) {
        const value = this.m.get(key);
        return value !== undefined ? value : fallback;
    }
    getBoolean(key, fallback = false) {
        const val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    getNumber(key, fallback) {
        const val = parseFloat(this.m.get(key));
        return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    set(key, value) {
        this.m.set(key, value);
    }
}
const config = /*@__PURE__*/ new Config();
const configFromSession = (win) => {
    try {
        const configStr = win.sessionStorage.getItem(IONIC_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
};
const saveConfig = (win, c) => {
    try {
        win.sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(c));
    }
    catch (e) {
        return;
    }
};
const configFromURL = (win) => {
    const configObj = {};
    win.location.search
        .slice(1)
        .split('&')
        .map((entry) => entry.split('='))
        .map(([key, value]) => {
        try {
            return [decodeURIComponent(key), decodeURIComponent(value)];
        }
        catch (e) {
            return ['', ''];
        }
    })
        .filter(([key]) => startsWith(key, IONIC_PREFIX))
        .map(([key, value]) => [key.slice(IONIC_PREFIX.length), value])
        .forEach(([key, value]) => {
        configObj[key] = value;
    });
    return configObj;
};
const startsWith = (input, search) => {
    return input.substr(0, search.length) === search;
};
const IONIC_PREFIX = 'ionic:';
const IONIC_SESSION_KEY = 'ionic-persist-config';

var LogLevel;
(function (LogLevel) {
    LogLevel["OFF"] = "OFF";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
})(LogLevel || (LogLevel = {}));
/**
 * Logs a warning to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 */
const printIonWarning = (message, ...params) => {
    const logLevel = config.get('logLevel', LogLevel.WARN);
    if ([LogLevel.WARN].includes(logLevel)) {
        return console.warn(`[Ionic Warning]: ${message}`, ...params);
    }
};
/**
 * Logs an error to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 * @param params - Additional arguments to supply to the console.error.
 */
const printIonError = (message, ...params) => {
    const logLevel = config.get('logLevel', LogLevel.ERROR);
    if ([LogLevel.ERROR, LogLevel.WARN].includes(logLevel)) {
        return console.error(`[Ionic Error]: ${message}`, ...params);
    }
};
/**
 * Prints an error informing developers that an implementation requires an element to be used
 * within a specific selector.
 *
 * @param el The web component element this is requiring the element.
 * @param targetSelectors The selector or selectors that were not found.
 */
const printRequiredElementError = (el, ...targetSelectors) => {
    return console.error(`<${el.tagName.toLowerCase()}> must be used inside ${targetSelectors.join(' or ')}.`);
};

export { LogLevel as L, printIonWarning as a, configFromSession as b, config as c, configFromURL as d, printRequiredElementError as e, printIonError as p, saveConfig as s };
