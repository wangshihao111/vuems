import routes from './routes';
import modules from './vuex-module'
import { exportMicro } from '../packages/client/lib';

const config = {
  routes,
  modules,
  onInit(Vue, router, store) { }
};

exportMicro(config)

// export default config;