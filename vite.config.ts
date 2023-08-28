import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import {nodePolyfills} from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  },
  plugins: [react(), tsconfigPaths(), nodePolyfills({
    exclude: [
      "assert",
      "child_process",
      "console",
      "constants",
      "crypto",
      "dgram",
      "dns",
      "events",
      "fs",
      "http",
      "http2",
      "https",
      "net",
      "os",
      "path",
      "process",
      "querystring",
      "readline",
      "repl",
      "stream",
      "string_decoder",
      "timers",
      "tls",
      "tty",
      "url",
      "util",
      "vm",
      "zlib"
  ],
    globals: {
      Buffer: true,
    }
  })],
  assetsInclude: ['**/*.sqlite'],
});
