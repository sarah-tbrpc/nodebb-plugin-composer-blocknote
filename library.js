'use strict';

const controllers = require('./lib/controllers');

const plugin = {};

/**
 * Initialize the plugin
 */
plugin.init = async function (params) {
	const { router, middleware } = params;

	// Admin routes
	router.get('/admin/plugins/composer-blocknote', middleware.admin.buildHeader, controllers.renderAdmin);
	router.get('/api/admin/plugins/composer-blocknote', controllers.renderAdmin);
};

/**
 * Add admin navigation item
 */
plugin.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/composer-blocknote',
		icon: 'fa-edit',
		name: 'BlockNote Composer',
	});

	return header;
};

/**
 * Build composer - inject our composer interface
 */
plugin.build = async function (data) {
	// Return our composer data
	return data;
};

/**
 * Sanitize and process content
 * Converts BlockNote JSON to HTML for storage/display
 */
plugin.sanitize = async function (data) {
	if (!data || !data.content) {
		return data;
	}

	try {
		// Try to parse as BlockNote JSON
		const blocks = JSON.parse(data.content);

		if (Array.isArray(blocks)) {
			// Convert BlockNote JSON to HTML
			data.content = blockNoteToHTML(blocks);
		}
	} catch (e) {
		// If not JSON, leave as-is
		// This handles cases where other composers or plain text is used
	}

	return data;
};

/**
 * Convert BlockNote JSON to HTML for display
 */
function blockNoteToHTML(blocks) {
	if (!blocks || !Array.isArray(blocks)) {
		return '';
	}

	return blocks.map((block) => {
		const content = block.content || [];
		const textContent = Array.isArray(content) ?
			content.map((item) => {
				if (typeof item === 'string') return escapeHtml(item);
				if (item.type === 'text') {
					let text = escapeHtml(item.text || '');
					const styles = item.styles || {};

					if (styles.bold) text = `<strong>${text}</strong>`;
					if (styles.italic) text = `<em>${text}</em>`;
					if (styles.underline) text = `<u>${text}</u>`;
					if (styles.strike) text = `<s>${text}</s>`;
					if (styles.code) text = `<code>${text}</code>`;

					if (item.styles?.textColor) {
						text = `<span style="color: ${sanitizeColor(item.styles.textColor)}">${text}</span>`;
					}
					if (item.styles?.backgroundColor) {
						text = `<span style="background-color: ${sanitizeColor(item.styles.backgroundColor)}">${text}</span>`;
					}

					return text;
				}
				if (item.type === 'link') {
					const href = sanitizeUrl(item.href || '');
					const linkText = item.content?.[0]?.text || href;
					return `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkText)}</a>`;
				}
				return '';
			}).join('') :
			'';

		switch (block.type) {
			case 'paragraph':
				return `<p>${textContent || '<br>'}</p>`;
			case 'heading': {
				const level = Math.min(6, Math.max(1, parseInt(block.props?.level) || 1));
				return `<h${level}>${textContent}</h${level}>`;
			}
			case 'bulletListItem':
				return `<ul><li>${textContent}</li></ul>`;
			case 'numberedListItem':
				return `<ol><li>${textContent}</li></ol>`;
			case 'checkListItem': {
				const checked = block.props?.checked ? 'checked' : '';
				return `<p><input type="checkbox" ${checked} disabled> ${textContent}</p>`;
			}
			case 'image': {
				const imageUrl = sanitizeUrl(block.props?.url || '');
				const caption = escapeHtml(block.props?.caption || '');
				return `<figure><img src="${imageUrl}" alt="${caption}" style="max-width: 100%; height: auto;"><figcaption>${caption}</figcaption></figure>`;
			}
			case 'video': {
				const videoUrl = sanitizeUrl(block.props?.url || '');
				return `<video src="${videoUrl}" controls style="max-width: 100%;"></video>`;
			}
			case 'file': {
				const fileUrl = sanitizeUrl(block.props?.url || '');
				const fileName = escapeHtml(block.props?.name || 'Download file');
				return `<p><a href="${fileUrl}" download>${fileName}</a></p>`;
			}
			case 'codeBlock': {
				const code = escapeHtml(textContent);
				const language = escapeHtml(block.props?.language || '');
				return `<pre><code class="language-${language}">${code}</code></pre>`;
			}
			case 'table':
				return `<table>${textContent}</table>`;
			default:
				return `<p>${textContent}</p>`;
		}
	}).join('\n');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Sanitize color values
 */
function sanitizeColor(color) {
	// Only allow hex colors, rgb, rgba, and named colors
	if (/^#[0-9A-Fa-f]{3,6}$/.test(color)) return color;
	if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) return color;
	if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) return color;

	// List of safe named colors
	const safeColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey'];
	if (safeColors.includes(color.toLowerCase())) return color;

	return 'inherit';
}

/**
 * Sanitize URLs
 */
function sanitizeUrl(url) {
	try {
		const parsed = new URL(url, 'http://example.com');
		// Only allow http, https, and relative URLs
		if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || url.startsWith('/')) {
			return escapeHtml(url);
		}
	} catch (e) {
		// Invalid URL
	}
	return '';
}

module.exports = plugin;
