/* @ts-expect-error Importing monaco internals to remove quick command menu option. */
import * as actions from 'monaco-editor/esm/vs/platform/actions/common/actions';
/* @ts-expect-error Importing monaco internals to remove quick command menu option. */
import { LinkedList } from 'monaco-editor/esm/vs/base/common/linkedList';

/**
 * Hacky way to remove Quick Command Menu from the right-click menu.
 **/
export function removeQuickCommandFromContextMenu() {
  const menuItemsToRemove = ['editor.action.quickCommand'];
  const menuItems = actions.MenuRegistry._menuItems;
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
