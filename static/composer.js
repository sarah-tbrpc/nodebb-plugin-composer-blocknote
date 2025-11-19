// static/composer.js
import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Custom upload function for images and files
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('files[]', file);

  try {
    const response = await fetch('/api/post/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // NodeBB expects CSRF token
        'x-csrf-token': document.querySelector('[component="csrf-token"]')?.getAttribute('content') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    // NodeBB returns uploaded file info
    return data[0]?.url || '';
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload file. Please try again.');
    return '';
  }
}

function EditorWrapper() {
  const [content, setContent] = useState(null);

  // Create BlockNote editor with full configuration
  const editor = useCreateBlockNote({
    schema: BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
      },
    }),
    uploadFile,
    initialContent: content,
  });

  // Get content from NodeBB composer if editing existing post
  useEffect(() => {
    const loadExistingContent = () => {
      const textArea = document.querySelector('[component="composer"] textarea');
      if (textArea && textArea.value) {
        try {
          // Try to parse as BlockNote JSON first
          const parsed = JSON.parse(textArea.value);
          if (Array.isArray(parsed)) {
            setContent(parsed);
          }
        } catch (e) {
          // If not JSON, treat as plain text
          setContent([
            {
              type: 'paragraph',
              content: textArea.value,
            },
          ]);
        }
      }
    };

    loadExistingContent();
  }, []);

  // Save content back to NodeBB when editor changes
  const handleChange = async () => {
    const blocks = editor.document;
    const textArea = document.querySelector('[component="composer"] textarea');

    if (textArea) {
      // Store BlockNote JSON format for editing
      textArea.value = JSON.stringify(blocks);

      // Trigger change event so NodeBB knows content changed
      const event = new Event('input', { bubbles: true });
      textArea.dispatchEvent(event);
    }
  };

  return (
    <div
      className="blocknote-editor-wrapper"
      style={{
        background: '#fff',
        border: '1px solid #e1e4e8',
        borderRadius: '8px',
        padding: '16px',
        minHeight: '300px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="light"
        slashMenu={true}
        formattingToolbar={true}
        linkToolbar={true}
        sideMenu={true}
        filePanel={true}
      />
    </div>
  );
}

// Initialize when NodeBB composer loads
$(document).ready(() => {
  // Wait for composer to be ready
  const initComposer = () => {
    const composerContainer = document.querySelector('#blocknote-composer');
    if (composerContainer && !composerContainer.classList.contains('initialized')) {
      composerContainer.classList.add('blocknote-composer', 'initialized');

      const root = createRoot(composerContainer);
      root.render(<EditorWrapper />);
    }
  };

  // Try immediately
  initComposer();

  // Also listen for composer load event
  $(window).on('action:composer.loaded', initComposer);
});
