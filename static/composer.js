// static/composer.js
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BlockNoteViewEditor, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

function EditorWrapper() {
  const editor = useCreateBlockNote();
  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", padding: "1rem" }}>
      <BlockNoteViewEditor editor={editor} />
    </div>
  );
}

$(document).ready(() => {
  const composerContainer = document.querySelector('#blocknote-composer');
  if (composerContainer) {
    composerContainer.innerHTML = '';
    const root = createRoot(composerContainer);
    root.render(<EditorWrapper />);
  }
});
