const key = "__VUE__MICRO__CONFIG__STORE__";

export interface ConfigStore {
  microUrls?: string[]
}

export function modifyConfig(config: ConfigStore) {
  (<any>window)[key] = Object.assign({}, (<any>window)[key] || {}, config || {})
}

export function getConfig(): ConfigStore {
  return (<any>window)[key] || {};
}

export function resetPublicUrls(urls: string[]) {
  if (!(<any>window)[key]) {
    (<any>window)[key] = {};
  }
  (<any>window)[key]['microUrls'] = urls;
}

export function getPublicUrls(): string[] {
  return getConfig()['microUrls'] || [];
}