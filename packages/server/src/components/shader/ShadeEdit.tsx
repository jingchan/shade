'use client';

import ShaderCode from 'shade-common/src/shader/shaderCode';
import RenderView from './RenderView';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { requestDeviceFromBrowser } from 'shade-common';
import ShadeEditToolbar from './ShadeEditToolbar';
const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
});

export default function ShadeEdit() {
  const [device, setDevice] = useState<GPUDevice>();
  const [renderedCode, setRenderedCode] = useState<ShaderCode>(
    ShaderCode.default(),
  );

  const [initialCode, setInitialCode] = useState<ShaderCode>();
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Load shader from server.
    setInitialCode(ShaderCode.default());

    requestDeviceFromBrowser().then(setDevice);
  }, []);

  useEffect(() => {
    setRenderedCode(initialCode);
  }, [initialCode]);

  function handleContentChanged(content: string) {
    console.log('contentchanged');
    setRenderedCode(new ShaderCode(content));
    setIsEdited(true);
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.ctrlKey && event.key === 's') {
      console.log('Save');
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleSave() {
    setIsEdited(false);
    // fetch('/api/shader/', {});
    // console.log('Save', shad);
  }

  return (
    <div className="flex h-full w-full px-8 pb-8" onKeyUp={handleKeyUp}>
      <div className="flex flex-col flex-1">
        {device && <RenderView shader_code={renderedCode} device={device} />}
      </div>
      <div className="flex flex-col flex-1">
        <ShadeEditToolbar saveEnabled={isEdited} onSaved={handleSave} />
        <Editor
          initialCode={initialCode}
          onContentChanged={handleContentChanged}
        />
      </div>
    </div>
  );
}
