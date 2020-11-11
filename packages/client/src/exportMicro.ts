import { APP_NAME, JSONP_CALLBACK_PREFIX } from '@vuems/core';
import VueRouter, { RouteRecord } from 'vue-router';
import { Store } from 'vuex'

export interface ExportConfig<T = {}> {
  routes?: RouteRecord[];
  store?: Store<T>;
  onLoad<T = {}>(router: VueRouter, store: Store<T>): void;
}

export default function exportMicro(packageName?: string | ExportConfig, config?: ExportConfig) {
  if (packageName && !config) {
    config = packageName as ExportConfig;
  }
  function getPublicUrl() {
    const microUrls = (<any>window).microUrls;
    if (typeof microUrls == 'string') {
      return microUrls;
    } else if (typeof microUrls === 'object') {
      return microUrls[APP_NAME] || './'
    } else {
      return './'
    }
  }
  // @ts-ignore
  __webpack_public_path__ = getPublicUrl();

  ; (function (global: any) {
    global[`${JSONP_CALLBACK_PREFIX}${APP_NAME}`](config)
  })(window);
}