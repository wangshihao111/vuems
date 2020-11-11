import routes from './routes';
import modules from './vuex-module'
import { exportMicro } from '../packages/client/lib';

const config = {
  routes,
  modules,
  onInit(Vue, router, store) { }
};

exportMicro(require('./package.json').name, config)

// export default config;