/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { expect } from "@playwright/test";
export class SelectModalPage {
    constructor(page) {
        this.options = [];
        this.page = page;
    }
    async setup(config, options, multiple = false) {
        const { page } = this;
        await page.setContent(`
    <ion-modal>
      <ion-select-modal></ion-select-modal>
    </ion-modal>
    <script>
      const selectModal = document.querySelector('ion-select-modal');
      selectModal.options = ${JSON.stringify(options)};
      selectModal.multiple = ${multiple};
    </script>
    `, config);
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
        this.ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
        this.modal = page.locator('ion-modal');
        this.selectModal = page.locator('ion-select-modal');
        this.multiple = multiple;
        this.options = options;
        await this.modal.evaluate((modal) => modal.present());
        await ionModalDidPresent.next();
    }
    async screenshot(screenshot, name) {
        await expect(this.selectModal).toHaveScreenshot(screenshot(name));
    }
    async clickOption(value) {
        const option = this.getOption(value);
        await option.click();
    }
    async pressSpaceOnOption(value) {
        const option = this.getOption(value);
        await option.press('Space');
    }
    getOption(value) {
        const { multiple, selectModal } = this;
        const selector = multiple ? 'ion-checkbox' : 'ion-radio';
        const index = this.options.findIndex((o) => o.value === value);
        return selectModal.locator(selector).nth(index);
    }
}
