import '../worker/userWorker';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { isIE } from '../utils/browser';
import { removeQuickCommandFromContextMenu } from '../utils/monaco';

//TODO reorganize utils/monaco and userWorker to this folder
removeQuickCommandFromContextMenu();

export type ContentChangedListener = (newContent: string) => any;

export class MonacoEditor {
  private _editor: monaco.editor.IStandaloneCodeEditor | null = null;
  constructor() {}

  initWithElement(element: HTMLElement, content?: string) {
    if (this._editor) {
      this._editor?.dispose();
    }
    this._editor = monaco.editor.create(element, {
      value: content || '',
      language: 'wgsl',
      theme: 'vs-dark',
      lineNumbers: 'on' as monaco.editor.LineNumbersType,
      minimap: {
        enabled: false,
      },
      padding: {
        top: 24,
        bottom: 24 * 4,
      },
      scrollBeyondLastLine: false,
      fontSize: 16,
      // Keep Context Menu because right-click to copy/paste broken without it.
      contextmenu: true,
    });

    const quickCommandKeys = isIE()
      ? monaco.KeyMod.Alt | monaco.KeyCode.F1
      : monaco.KeyCode.F1;
    this._editor.addCommand(quickCommandKeys, () => {});
  }

  onContentChange(listener: ContentChangedListener) {
    this._editor?.onDidChangeModelContent(
      (_event: monaco.editor.IModelContentChangedEvent) => {
        listener(this._editor?.getValue() || '');
      },
    );
  }

  layout() {
    this._editor?.layout();
  }
}
