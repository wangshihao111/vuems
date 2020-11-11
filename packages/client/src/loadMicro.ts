import jsonp from 'jsonp';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { getPublicUrls } from './configStore';
import { JSONP_CALLBACK_PREFIX } from '@vuems/core';
import { ExportConfig } from './exportMicro';

async function asyncJsonp(url: string, config: any) {
  return new Promise((resolve, reject) => {
    jsonp(url, config, (err: any, res: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  });
}

async function loadModuleMicroConfig(url = '') {
  let remote = url.endsWith('/') ? url : url + '/';
  const configUrl = url + 'microConfig.js';
  try {
    const config: any = await asyncJsonp(configUrl, { prefix: '', name: 'vue_micro_app_config', timeout: 8000 });
    const { name } = config;
    if (name) {
      if (!(<any>window).microUrls) (<any>window).microUrls = {};
      (<any>window).microUrls[name] = remote;
    }
    return config;
  } catch (error) {
    throw new Error('加载失败：' + configUrl);
  }
}

async function loadMicroModule({ name, main }: { name: string, main: string }) {
  try {
    const module = await asyncJsonp(`${(<any>window).microUrls[name]}${main}`, { prefix: '', name: `${JSONP_CALLBACK_PREFIX}${name}`, timeout: 8000 });
    return module;
  } catch (error) {
    throw new Error(`module load failed: ${name}`)
  }
}

export async function loadMicro<T = Record<string, any>>(router: VueRouter, store: Store<T>) {
  let microConfigs: any[] = [];
  let microModules: ExportConfig[] = [];
  const publicUrls = getPublicUrls() || [];
  const errorStack = [];
  for (let i = 0; i < publicUrls.length; i++) {
    try {
      const config = await loadModuleMicroConfig(publicUrls[i])
      if (config) microConfigs.push(config)
    } catch (error) {
      errorStack.push(error)
    }
  }
  microConfigs = microConfigs.filter(Boolean);
  try {
    const res: ExportConfig[] = await Promise.all(microConfigs.map((m) => loadMicroModule(m))) as ExportConfig[];
    microModules = microModules.concat(res.filter(v => v))
  } catch (error) {
    errorStack.push(error)
  }
  microModules.forEach(({ routes, modules, onInit }) => {
    if (routes && routes.length) {
      router.addRoutes(routes)
      if (toString.call(modules) === "[object Array]") {
        (modules||[]).forEach((m: any) => {
          store.registerModule(m.name, m.module)
        })
      }
      if (onInit && typeof onInit === 'function') {
        onInit(Vue, router, store)
      }
    }
  });
  if (errorStack.length) {
    return Promise.reject(errorStack)
  }
}