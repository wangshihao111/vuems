import { APP_NAME, JSONP_CALLBACK_PREFIX } from '@vuems/core';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex'

export type Modules = []

export interface ExportConfig<T = Record<string, any>> {
  routes?: RouteConfig[];
  modules?: Modules;
  onInit(Vue?: any, router?: VueRouter, store?: Store<T>): void;
}

export default function exportMicro(config: ExportConfig) {
  function getPublicUrl() {
    return (<any>window).microUrls || [];
  }
  // @ts-ignore
  __webpack_public_path__ = getPublicUrl();

  (function (global: any) {
    global[`${JSONP_CALLBACK_PREFIX}${APP_NAME}`](config)
  })(window);
}