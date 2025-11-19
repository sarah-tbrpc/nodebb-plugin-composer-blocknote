'use strict';

const plugin = {};

plugin.init = async function () {
	// Optional: Add any plugin init logic here
};

plugin.initClient = async function ({ router, middleware }) {
	router.get('/admin/plugins/composer-blocknote', middleware.admin.buildHeader, (req, res) => {
		res.render('admin/plugins/composer-blocknote', {});
	});

	router.get('/api/admin/plugins/composer-blocknote', (req, res) => {
		res.json({ status: 'OK' });
	});
};

// Convert BlockNote JSON to HTML for display
function blockNoteToHTML(blocks) {
	if (!blocks || !Array.isArray(blocks)) {
		return '';
	}

	return blocks.map((block) => {
		const content = block.content || [];
		const textContent = Array.isArray(content) ?
			content.map((item) => {
				if (typeof item === 'string') return item;
				if (item.type === 'text') {
					let text = item.text || '';
					const styles = item.styles || {};

					if (styles.bold) text = `<strong>${text}</strong>`;
					if (styles.italic) text = `<em>${text}</em>`;
					if (styles.underline) text = `<u>${text}</u>`;
					if (styles.strike) text = `<s>${text}</s>`;
					if (styles.code) text = `<code>${text}</code>`;

					if (item.styles?.textColor) {
						text = `<span style="color: ${item.styles.textColor}">${text}</span>`;
					}
					if (item.styles?.backgroundColor) {
						text = `<span style="background-color: ${item.styles.backgroundColor}">${text}</span>`;
					}

					return text;
				}
				if (item.type === 'link') {
					return `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.content?.[0]?.text || item.href}</a>`;
				}
				return '';
			}).join('') :
			'';

		switch (block.type) {
			case 'paragraph':
				return `<p>${textContent || '<br>'}</p>`;
			case 'heading': {
				const level = block.props?.level || 1;
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
				const imageUrl = block.props?.url || '';
				const caption = block.props?.caption || '';
				return `<figure><img src="${imageUrl}" alt="${caption}" style="max-width: 100%; height: auto;"><figcaption>${caption}</figcaption></figure>`;
			}
			case 'video': {
				const videoUrl = block.props?.url || '';
				return `<video src="${videoUrl}" controls style="max-width: 100%;"></video>`;
			}
			case 'file': {
				const fileUrl = block.props?.url || '';
				const fileName = block.props?.name || 'Download file';
				return `<p><a href="${fileUrl}" download>${fileName}</a></p>`;
			}
			case 'codeBlock': {
				const code = textContent;
				const language = block.props?.language || '';
				return `<pre><code class="language-${language}">${code}</code></pre>`;
			}
			case 'table':
			// Basic table support
				return `<table>${textContent}</table>`;
			default:
				return `<p>${textContent}</p>`;
		}
	}).join('\n');
}

plugin.parseBlocknoteContent = async function (data) {
	if (!data || !data.postData || !data.postData.content) {
		return data;
	}

	try {
		// Try to parse BlockNote JSON
		const blocks = JSON.parse(data.postData.content);
		if (Array.isArray(blocks)) {
			// Convert to HTML for display
			data.postData.content = blockNoteToHTML(blocks);
		}
	} catch (e) {
		// If not JSON, leave as-is (might be plain text or HTML)
	}

	return data;
};

plugin.getFormattingOptions = async function (data) {
	// We're using BlockNote's built-in toolbar, so disable NodeBB's default toolbar
	data.options = [];
	return data;
};

module.exports = plugin;
