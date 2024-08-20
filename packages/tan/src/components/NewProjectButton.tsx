'use client';

export default function NewProjectButton() {
  function handleClick(_ev: React.MouseEvent<HTMLButtonElement>) {
    fetch('/api/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'New Project' }),
    });
  }

  return (
    <button
      type="button"
      className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 active:ring-4"
      onClick={handleClick}
    >
      New Project
    </button>
  );
}
