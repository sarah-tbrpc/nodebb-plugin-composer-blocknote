// static/composer.js - BlockNote React Bundle
import { createRoot } from 'react-dom/client';
import React, { useEffect, useRef } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Store editor instances by container
const editorInstances = new Map();

// Custom upload function for images and files
async function uploadFile(file) {
	const formData = new FormData();
	formData.append('files[]', file);

	try {
		const response = await fetch('/api/post/upload', {
			method: 'POST',
			body: formData,
			headers: {
				'x-csrf-token': document.querySelector('[component="csrf-token"]')?.getAttribute('content') || '',
			},
		});

		if (!response.ok) {
			throw new Error('Upload failed');
		}

		const data = await response.json();
		return data[0]?.url || '';
	} catch (error) {
		console.error('Upload error:', error);
		alert('Failed to upload file. Please try again.');
		return '';
	}
}

function BlockNoteEditor({ initialContent, onChange }) {
	const editorRef = useRef(null);

	const editor = useCreateBlockNote({
		schema: BlockNoteSchema.create({
			blockSpecs: {
				...defaultBlockSpecs,
			},
		}),
		uploadFile,
		initialContent: initialContent || [{ type: 'paragraph' }],
	});

	// Store editor ref for external access
	useEffect(() => {
		editorRef.current = editor;
	}, [editor]);

	// Handle content changes
	const handleChange = () => {
		if (onChange && editor) {
			onChange(editor.document);
		}
	};

	return (
		<div className="blocknote-editor-wrapper">
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

// Export API for integration
window.BlockNoteComposer = {
	render(container, options = {}) {
		if (!container) return;

		const root = createRoot(container);
		const reactComponent = (
			<BlockNoteEditor
				initialContent={options.initialContent}
				onChange={options.onChange}
			/>
		);

		root.render(reactComponent);
		editorInstances.set(container, root);
	},

	unmount(container) {
		const root = editorInstances.get(container);
		if (root) {
			root.unmount();
			editorInstances.delete(container);
		}
	},

	focus(container) {
		// Focus the editor in the container
		const editorElement = container.querySelector('[contenteditable="true"]');
		if (editorElement) {
			editorElement.focus();
		}
	},
};
