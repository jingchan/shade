import DocumentArrowUp from '../icons/docArrowUp';
import DocumentCopy from '../icons/docCopy';

export default function ShadeEditToolbar({
  saveEnabled,
  onSaved,
}: {
  saveEnabled: boolean;
  onSaved: () => void;
}) {
  return (
    <div className="flex justify-end bg-[#1e1e1e]">
      <div className="flex mx-1 my-1 gap-1">
        <button
          type="button"
          className="btn sm"
          // :disabled="!isEdited"
          // @click="handleSaveButtonPressed"
        >
          <DocumentCopy className="size-5 mr-1" /> Copy
        </button>
        <button
          type="button"
          className="btn sm green"
          disabled={!saveEnabled}
          onClick={onSaved}
        >
          <DocumentArrowUp className="size-5 mr-1" /> Save
        </button>
        {/* <button type="button" class="btn">Config</button> */}
      </div>
    </div>
  );
}
