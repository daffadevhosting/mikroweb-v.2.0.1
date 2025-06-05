/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { getCapacitor } from "./capacitor";
export var Style;
(function (Style) {
    Style["Dark"] = "DARK";
    Style["Light"] = "LIGHT";
    Style["Default"] = "DEFAULT";
})(Style || (Style = {}));
export const StatusBar = {
    getEngine() {
        const capacitor = getCapacitor();
        if (capacitor === null || capacitor === void 0 ? void 0 : capacitor.isPluginAvailable('StatusBar')) {
            return capacitor.Plugins.StatusBar;
        }
        return undefined;
    },
    setStyle(options) {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        engine.setStyle(options);
    },
    getStyle: async function () {
        const engine = this.getEngine();
        if (!engine) {
            return Style.Default;
        }
        const { style } = await engine.getInfo();
        return style;
    },
};
