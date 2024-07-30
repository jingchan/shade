/**
 * Returns true if the event should be disabled.
 */
function shouldDisableKeyEvent(e: KeyboardEvent) {
  return (
    // Save
    (e.metaKey && !e.shiftKey && e.key === 's') ||
    (e.ctrlKey && !e.shiftKey && e.key === 's') ||
    // Print
    (e.metaKey && !e.shiftKey && e.key === 'p') ||
    (e.ctrlKey && !e.shiftKey && e.key === 'p')
  );
}

/**
 * Disables keys for browser keyboard shortcuts that may be easily pressed by
 * accident due to having a text-editor mindset.
 * @param window - The window to disable the keys on.
 */
export function disableKeyShortcuts(w: Window) {
  w.addEventListener('keydown', (e: KeyboardEvent) => {
    if (shouldDisableKeyEvent(e)) {
      e.preventDefault();
    }
  });
}

export default disableKeyShortcuts;
