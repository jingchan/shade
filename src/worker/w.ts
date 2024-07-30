/**
 * WebWorker stub for Monaco Editor
 */
// Usually would import the webworker like this, but we create a stub for
// flexiblity, such as:
// 1. Being able to combine other statically served code.
// 2. If we create use our own worker.
// 3. If we want to rename the imported file.
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';

/* @ts-expect-error importing from internal for WebWorker separation. */
import { SimpleWorkerServer } from 'monaco-editor/esm/vs/base/common/worker/simpleWorker.js';
/* @ts-expect-error importing from internal for WebWorker separation. */
import { EditorSimpleWorker } from 'monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js';
// import { SimpleWorkerServer } from '../base/common/worker/simpleWorker.js';
// import { EditorSimpleWorker } from './common/services/editorSimpleWorker.js';
let initialized = false;
export function initialize(foreignModule: unknown) {
  if (initialized) {
    return;
  }
  initialized = true;
  const simpleWorker = new SimpleWorkerServer(
    (msg: string) => {
      globalThis.postMessage(msg);
    },
    (host: string) => new EditorSimpleWorker(host, foreignModule),
  );
  globalThis.onmessage = (e) => {
    simpleWorker.onmessage(e.data);
  };
}
globalThis.onmessage = (_e) => {
  // Ignore first message in this case and initialize if not yet initialized
  if (!initialized) {
    initialize(null);
  }
};
