'use client';
import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { isIE } from 'shade-common';
/* @ts-expect-error Importing monaco internals to remove quick command menu option. */
import { MenuRegistry } from 'monaco-editor/esm/vs/platform/actions/common/actions';
/* @ts-expect-error Importing monaco internals to remove quick command menu option. */
import { LinkedList } from 'monaco-editor/esm/vs/base/common/linkedList';
import ShaderCode from 'shade-common/src/shader/shaderCode';
import useWindowSize from '@/hooks/useWindowSize';

/**
 * Hacky way to remove Quick Command Menu from the right-click menu.
 **/
export function removeQuickCommandFromContextMenu() {
  const menuItemsToRemove = ['editor.action.quickCommand'];
  const menuItems = MenuRegistry._menuItems;
  /* eslint-disable */
  for (let [key, menuItem] of menuItems) {
    let ll = new LinkedList();
    for (let mi of menuItem) {
      if (!menuItemsToRemove.includes(mi.command?.id)) {
        ll.push(mi);
      }
    }
    menuItems.set(key, ll);
  }
  /* eslint-enable */
}

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, _label: string) {
    // if (label === 'json') {
    //   return './json.worker.bundle.js';
    // }
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return './css.worker.bundle.js';
    // }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return './html.worker.bundle.js';
    // }
    // if (label === 'typescript' || label === 'javascript') {
    //   return './ts.worker.bundle.js';
    // }
    // return './editor.worker.bundle.js';
    // return './static/w.js';

    // This is 'editor.worker.bundle.js', but served from public directory.
    return '/w.js';
  },
};

// TODO: Fix slow loading.
export default function Editor({
  initialCode,
  onContentChanged = () => {},
}: {
  initialCode: ShaderCode;
  onContentChanged?: (content: string) => void;
}) {
  const windowSize = useWindowSize();
  const divEl = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (divEl.current) {
      const editor = monaco.editor.create(divEl.current, {
        // value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
        //   '\n',
        // ),
        // language: 'typescript',

        // value: content || '',
        value: initialCode.userSource,
        language: 'wgsl',
        theme: 'vs-dark',
        lineNumbers: 'on' as monaco.editor.LineNumbersType,
        minimap: {
          enabled: false,
        },
        padding: {
          // Don't need padding after adding save button toolbar.
          // top: 24,
          bottom: 24 * 4,
        },
        scrollBeyondLastLine: false,
        fontSize: 16,
        // Keep Context Menu because right-click to copy/paste broken without it.
        contextmenu: true,
      });

      // Disable `F1` keyboard shortcut to open Quick Command popup.
      const quickCommandKeys = isIE()
        ? monaco.KeyMod.Alt | monaco.KeyCode.F1
        : monaco.KeyCode.F1;
      editor.addCommand(quickCommandKeys, () => {});
      // const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS;
      // editor.addCommand(cmdS, handleSave());
      editor.onDidChangeModelContent(() => {
        onContentChanged(editor.getValue());
      });
      setEditor(editor);
      return () => {
        editor.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editor) {
      editor.layout();
    }
  }, [windowSize]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full select-none" ref={divEl}></div>
      {/* <Script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.23.0/min/vs/loader.js" /> */}
      {/* <Script src="/assets/m.js" /> */}
    </div>
  );
}

// initWithElement(element: HTMLElement, content?: string) {
//   if (this._editor) {
//     this._editor?.dispose();
//   }
//   this._editor = monaco.editor.create(element, {
//     value: content || '',
//     language: 'wgsl',
//     theme: 'vs-dark',
//     lineNumbers: 'on' as monaco.editor.LineNumbersType,
//     minimap: {
//       enabled: false,
//     },
//     padding: {
//       // Don't need padding after adding save button toolbar.
//       // top: 24,
//       bottom: 24 * 4,
//     },
//     scrollBeyondLastLine: false,
//     fontSize: 16,
//     // Keep Context Menu because right-click to copy/paste broken without it.
//     contextmenu: true,
//   });

//   const quickCommandKeys = isIE()
//     ? monaco.KeyMod.Alt | monaco.KeyCode.F1
//     : monaco.KeyCode.F1;
//   this._editor.addCommand(quickCommandKeys, () => {});
// }
