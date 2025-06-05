/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { printIonWarning } from "../../../utils/logging/index";
/**
 * If a time zone is provided in the format options, the rendered text could
 * differ from what was selected in the Datetime, which could cause
 * confusion.
 */
export const warnIfTimeZoneProvided = (el, formatOptions) => {
    var _a, _b, _c, _d;
    if (((_a = formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.date) === null || _a === void 0 ? void 0 : _a.timeZone) ||
        ((_b = formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.date) === null || _b === void 0 ? void 0 : _b.timeZoneName) ||
        ((_c = formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.time) === null || _c === void 0 ? void 0 : _c.timeZone) ||
        ((_d = formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.time) === null || _d === void 0 ? void 0 : _d.timeZoneName)) {
        printIonWarning('[ion-datetime] - "timeZone" and "timeZoneName" are not supported in "formatOptions".', el);
    }
};
export const checkForPresentationFormatMismatch = (el, presentation, formatOptions) => {
    // formatOptions is not required
    if (!formatOptions)
        return;
    // If formatOptions is provided, the date and/or time objects are required, depending on the presentation
    switch (presentation) {
        case 'date':
        case 'month-year':
        case 'month':
        case 'year':
            if (formatOptions.date === undefined) {
                printIonWarning(`[ion-datetime] - The '${presentation}' presentation requires a date object in formatOptions.`, el);
            }
            break;
        case 'time':
            if (formatOptions.time === undefined) {
                printIonWarning(`[ion-datetime] - The 'time' presentation requires a time object in formatOptions.`, el);
            }
            break;
        case 'date-time':
        case 'time-date':
            if (formatOptions.date === undefined && formatOptions.time === undefined) {
                printIonWarning(`[ion-datetime] - The '${presentation}' presentation requires either a date or time object (or both) in formatOptions.`, el);
            }
            break;
    }
};
