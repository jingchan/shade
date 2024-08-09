// import * as monaco from 'monaco-editor';
import stub from './w.js?worker';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// monaco;
self.MonacoEnvironment = {
  getWorker(_workerId: string, _label: string) {
    // console.log('getworker');
    // if (label === 'json') {
    //   return new jsonWorker();
    // }
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return new cssWorker();
    // }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return new htmlWorker();
    // }
    // if (label === 'typescript' || label === 'javascript') {
    //   return new tsWorker();
    // }
    return new stub();
  },
};

// monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
