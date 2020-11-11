import { uniq } from 'lodash';

const clientEnvList = [
  "MICRO_PUBLIC_URL"
]

export function getClientEnv(envs:string[] = []) {
  const result: Record<string, string> = {};
  const list = envs.concat(clientEnvList);
  const envList = uniq(list)
  envList.forEach((e: string) => {
    result[`process.env.${e}`] = JSON.stringify(process.env[e])
  });
  return result;
}