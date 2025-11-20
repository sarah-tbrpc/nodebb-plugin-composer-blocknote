'use strict';

/**
 * BlockNote Composer Client-Side Integration
 * This file integrates the BlockNote editor with NodeBB's composer
 */

(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define('composer/blocknote', factory);
	}
}(function () {
	const Composer = {};

	/**
	 * Initialize the BlockNote editor
	 */
	Composer.init = function (postContainer, postData) {
		const $postContainer = $(postContainer);
		const textarea = $postContainer.find('textarea');

		if (!textarea.length) {
			return;
		}

		// Hide the textarea, we'll use BlockNote instead
		textarea.hide();

		// Create container for BlockNote
		const editorContainer = $('<div class="blocknote-editor-container"></div>');
		textarea.after(editorContainer);

		// Load existing content if editing
		let initialContent = null;
		if (postData && postData.body) {
			try {
				initialContent = JSON.parse(postData.body);
			} catch (e) {
				// If not JSON, create a simple paragraph
				initialContent = [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: postData.body }],
					},
				];
			}
		}

		// Initialize BlockNote editor via the bundled React component
		// The actual React rendering happens in the bundle
		if (window.BlockNoteComposer && window.BlockNoteComposer.render) {
			window.BlockNoteComposer.render(editorContainer[0], {
				initialContent: initialContent,
				onChange: (content) => {
					// Update the hidden textarea with JSON content
					textarea.val(JSON.stringify(content));
					// Trigger change event for NodeBB
					textarea.trigger('input');
				},
			});
		}
	};

	/**
	 * Get editor content
	 */
	Composer.getContent = function (postContainer) {
		const $postContainer = $(postContainer);
		const textarea = $postContainer.find('textarea');
		return textarea.val();
	};

	/**
	 * Set editor content
	 */
	Composer.setContent = function (postContainer, content) {
		const $postContainer = $(postContainer);
		const textarea = $postContainer.find('textarea');
		textarea.val(content);
		textarea.trigger('input');
	};

	/**
	 * Destroy editor instance
	 */
	Composer.destroy = function (postContainer) {
		const $postContainer = $(postContainer);
		const editorContainer = $postContainer.find('.blocknote-editor-container');

		if (editorContainer.length && window.BlockNoteComposer && window.BlockNoteComposer.unmount) {
			window.BlockNoteComposer.unmount(editorContainer[0]);
		}

		editorContainer.remove();
	};

	/**
	 * Focus the editor
	 */
	Composer.focus = function (postContainer) {
		const $postContainer = $(postContainer);
		const editorContainer = $postContainer.find('.blocknote-editor-container');

		if (editorContainer.length && window.BlockNoteComposer && window.BlockNoteComposer.focus) {
			window.BlockNoteComposer.focus(editorContainer[0]);
		}
	};

	/**
	 * Check if editor is active
	 */
	Composer.isActive = function (postContainer) {
		const $postContainer = $(postContainer);
		return $postContainer.find('.blocknote-editor-container').length > 0;
	};

	return Composer;
}));
