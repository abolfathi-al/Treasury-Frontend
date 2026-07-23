import { deepStrictEqual, strictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';

const angularConfig = JSON.parse(readFileSync('angular.json', 'utf8'));
const proxyConfig = JSON.parse(readFileSync('src/proxy.conf.json', 'utf8'));

const configuredProxy =
  angularConfig.projects?.web?.architect?.serve?.options?.proxyConfig;

strictEqual(
  configuredProxy,
  'src/proxy.conf.json',
  'Angular dev-server must load src/proxy.conf.json for same-origin API calls.',
);

const v1Proxy = proxyConfig['/v1'];
const expectedV1Proxy = {
  target: 'http://127.0.0.1:3000',
  secure: false,
  changeOrigin: false,
};

deepStrictEqual(
  v1Proxy,
  expectedV1Proxy,
  'The /v1 dev proxy must preserve browser origin and target Backend port 3000.',
);

console.log('Development proxy configuration is valid.');
