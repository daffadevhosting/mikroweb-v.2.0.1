/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
/**
 * This is an extended version of Playwright's
 * page.goto method. In addition to performing
 * the normal page.goto work, this code also
 * automatically waits for the Stencil components
 * to be hydrated before proceeding with the test.
 */
export const goto = async (page, url, testInfo, originalFn, options) => {
    var _a, _b, _c, _d;
    if (options === undefined && testInfo.project.metadata.mode === undefined) {
        throw new Error(`
A config must be passed to page.goto to use a generator test:

configs().forEach(({ config, title }) => {
  test(title('example test'), async ({ page }) => {
    await page.goto('/src/components/button/test/basic', config);
  });
});`);
    }
    let mode;
    let direction;
    let palette;
    if (options == undefined) {
        mode = testInfo.project.metadata.mode;
        direction = testInfo.project.metadata.rtl ? 'rtl' : 'ltr';
        palette = testInfo.project.metadata.palette;
    }
    else {
        mode = options.mode;
        direction = options.direction;
        palette = options.palette;
    }
    const rtlString = direction === 'rtl' ? 'true' : undefined;
    const splitUrl = url.split('?');
    const paramsString = splitUrl[1];
    /**
     * This allows developers to force a
     * certain mode or LTR/RTL config per test.
     */
    const urlToParams = new URLSearchParams(paramsString);
    const formattedMode = (_a = urlToParams.get('ionic:mode')) !== null && _a !== void 0 ? _a : mode;
    const formattedRtl = (_b = urlToParams.get('rtl')) !== null && _b !== void 0 ? _b : rtlString;
    const formattedPalette = (_c = urlToParams.get('palette')) !== null && _c !== void 0 ? _c : palette;
    const ionicTesting = (_d = urlToParams.get('ionic:_testing')) !== null && _d !== void 0 ? _d : true;
    /**
     * Pass through other custom query params
     */
    urlToParams.delete('ionic:mode');
    urlToParams.delete('rtl');
    urlToParams.delete('palette');
    urlToParams.delete('ionic:_testing');
    /**
     * Convert remaining query params to a string.
     * Be sure to call decodeURIComponent to decode
     * characters such as &.
     */
    const remainingQueryParams = decodeURIComponent(urlToParams.toString());
    const remainingQueryParamsString = remainingQueryParams == '' ? '' : `&${remainingQueryParams}`;
    const formattedUrl = `${splitUrl[0]}?ionic:_testing=${ionicTesting}&ionic:mode=${formattedMode}&rtl=${formattedRtl}&palette=${formattedPalette}${remainingQueryParamsString}`;
    testInfo.annotations.push({
        type: 'mode',
        description: formattedMode,
    });
    testInfo.annotations.push({
        type: 'direction',
        description: formattedRtl === 'true' ? 'rtl' : 'ltr',
    });
    testInfo.annotations.push({
        type: 'palette',
        description: formattedPalette,
    });
    const result = await Promise.all([
        page.waitForFunction(() => window.testAppLoaded === true, { timeout: 4750 }),
        originalFn(formattedUrl, options),
    ]);
    return result[1];
};
