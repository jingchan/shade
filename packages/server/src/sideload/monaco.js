// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId, _label) {
    // if (label === 'json') {
    //   return './json.worker.js';
    // }
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return './css.worker.js';
    // }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return './html.worker.js';
    // }
    // if (label === 'typescript' || label === 'javascript') {
    //   return './ts.worker.js';
    // }
    return './w.js';
  },
};
