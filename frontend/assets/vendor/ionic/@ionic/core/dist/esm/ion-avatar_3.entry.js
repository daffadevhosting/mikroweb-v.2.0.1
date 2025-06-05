/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, h, e as Host } from './index-527b9e34.js';
import { b as getIonMode } from './ionic-global-b26f573e.js';
import { c as createColorClasses } from './theme-01f3f29c.js';
import './index-cfd9c1f2.js';

const avatarIosCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:48px;height:48px}";
const IonAvatarIosStyle0 = avatarIosCss;

const avatarMdCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:64px;height:64px}";
const IonAvatarMdStyle0 = avatarMdCss;

const Avatar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: '998217066084f966bf5d356fed85bcbd451f675a', class: getIonMode(this) }, h("slot", { key: '1a6f7c9d4dc6a875f86b5b3cda6d59cb39587f22' })));
    }
};
Avatar.style = {
    ios: IonAvatarIosStyle0,
    md: IonAvatarMdStyle0
};

const badgeIosCss = ":host{--background:var(--ion-color-primary, #0054e9);--color:var(--ion-color-primary-contrast, #fff);--padding-top:3px;--padding-end:8px;--padding-bottom:3px;--padding-start:8px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:inline-block;min-width:10px;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);font-size:0.8125rem;font-weight:bold;line-height:1;text-align:center;white-space:nowrap;contain:content;vertical-align:baseline}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(:empty){display:none}:host{border-radius:10px;font-size:max(13px, 0.8125rem)}";
const IonBadgeIosStyle0 = badgeIosCss;

const badgeMdCss = ":host{--background:var(--ion-color-primary, #0054e9);--color:var(--ion-color-primary-contrast, #fff);--padding-top:3px;--padding-end:8px;--padding-bottom:3px;--padding-start:8px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:inline-block;min-width:10px;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);font-size:0.8125rem;font-weight:bold;line-height:1;text-align:center;white-space:nowrap;contain:content;vertical-align:baseline}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(:empty){display:none}:host{--padding-top:3px;--padding-end:4px;--padding-bottom:4px;--padding-start:4px;border-radius:4px}";
const IonBadgeMdStyle0 = badgeMdCss;

const Badge = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.color = undefined;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: '1a2d39c5deec771a2f2196447627b62a7d4c8389', class: createColorClasses(this.color, {
                [mode]: true,
            }) }, h("slot", { key: 'fc1b6587f1ed24715748eb6785e7fb7a57cdd5cd' })));
    }
};
Badge.style = {
    ios: IonBadgeIosStyle0,
    md: IonBadgeMdStyle0
};

const thumbnailCss = ":host{--size:48px;--border-radius:0;border-radius:var(--border-radius);display:block;width:var(--size);height:var(--size)}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}";
const IonThumbnailStyle0 = thumbnailCss;

const Thumbnail = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: '7f5fd6c056da2d82feb2c3c33f3e6dec898787f5', class: getIonMode(this) }, h("slot", { key: 'd15fd2b6cdc03777edc1930be95ad838e1b376c8' })));
    }
};
Thumbnail.style = IonThumbnailStyle0;

export { Avatar as ion_avatar, Badge as ion_badge, Thumbnail as ion_thumbnail };
