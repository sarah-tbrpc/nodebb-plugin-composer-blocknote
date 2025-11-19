# BlockNote Composer for NodeBB

A modern, user-friendly WYSIWYG composer plugin for NodeBB using [BlockNote](https://www.blocknotejs.org/) - providing a Notion-like editing experience for your forum users.

## Features

- **True WYSIWYG Editing** - What you see is exactly what you get, no HTML or markdown required
- **Rich Text Formatting** - Bold, italic, underline, strikethrough, code, and more
- **Image Uploads** - Drag & drop or paste images directly into posts
- **File Attachments** - Upload and share files with your community
- **Link Previews** - Add links with automatic formatting
- **Multiple Block Types**:
  - Headings (H1-H6)
  - Paragraphs
  - Bullet & numbered lists
  - Checklists/to-do lists
  - Code blocks with syntax highlighting
  - Tables
  - Images with captions
  - Videos
- **Slash Commands** - Type `/` to quickly insert different block types
- **Drag & Drop** - Reorder blocks by dragging
- **Formatting Toolbar** - Inline formatting menu appears when you select text
- **Mobile-Friendly** - Works great on all devices
- **Clean, Professional Design** - Beautiful UI that fits any forum theme

## Installation

### From npm (when published)

```bash
npm install nodebb-plugin-composer-blocknote
```

### From GitHub

1. Clone this repository into your NodeBB's `node_modules` folder:

```bash
cd /path/to/nodebb/node_modules
git clone https://github.com/sarah-tbrpc/nodebb-plugin-composer-blocknote
```

2. Install dependencies:

```bash
cd nodebb-plugin-composer-blocknote
npm install
```

3. Build the plugin:

```bash
npm run build
```

4. Restart NodeBB and activate the plugin in the Admin Control Panel (ACP):
   - Navigate to **Admin Panel → Extend → Plugins**
   - Find "BlockNote Composer" and click **Activate**
   - Rebuild & Restart NodeBB

### For Cloudron Users

1. Install the plugin using NodeBB's ACP or via the command line
2. Make sure to rebuild and restart your NodeBB instance
3. The plugin will automatically integrate with your existing setup

## Usage

Once activated, the BlockNote composer will replace the default NodeBB composer.

### Creating Posts

1. Click "New Topic" or "Reply" as usual
2. You'll see the BlockNote editor with a clean, simple interface
3. Start typing - it's just like any modern text editor!

### Formatting Text

- **Select text** to see the formatting toolbar
- Use keyboard shortcuts:
  - `Ctrl/Cmd + B` - Bold
  - `Ctrl/Cmd + I` - Italic
  - `Ctrl/Cmd + U` - Underline
  - `Ctrl/Cmd + Shift + S` - Strikethrough
  - `Ctrl/Cmd + E` - Code

### Adding Images

- **Drag & drop** an image file into the editor
- **Paste** an image from your clipboard
- **Click the image button** in the side menu
- Images are automatically uploaded and embedded

### Adding Links

1. Select the text you want to link
2. Click the link button in the formatting toolbar
3. Enter the URL
4. Done!

### Using Slash Commands

Type `/` anywhere to see a menu of block types:
- `/heading` - Add a heading
- `/image` - Upload an image
- `/list` - Create a bullet list
- `/code` - Add a code block
- And many more!

### Reordering Blocks

- Hover on the left side of any block to see the drag handle
- Click and drag to reorder blocks

## Development

### Building

```bash
npm run build
```

This compiles the React components and bundles them for use in NodeBB.

### Linting

```bash
npm run lint
```

## Compatibility

- **NodeBB Version:** 3.2.0 or higher
- **Browsers:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile:** iOS Safari, Chrome on Android

## Configuration

Currently, the plugin works out of the box with sensible defaults. Future versions will include configuration options in the ACP.

## How It Works

1. **Editor**: Uses BlockNote, a React-based block editor, similar to Notion
2. **Storage**: Posts are stored as BlockNote JSON format for perfect editing fidelity
3. **Display**: When displaying posts, JSON is converted to clean HTML
4. **Uploads**: Integrates with NodeBB's existing file upload system

## Support

- **Issues**: [GitHub Issues](https://github.com/sarah-tbrpc/nodebb-plugin-composer-blocknote/issues)
- **Documentation**: [BlockNote Docs](https://www.blocknotejs.org/)
- **NodeBB Community**: [NodeBB Forums](https://community.nodebb.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Credits

- Built with [BlockNote](https://www.blocknotejs.org/)
- For [NodeBB](https://nodebb.org/)
- Developed by [Sarah](https://github.com/sarah-tbrpc)

## Roadmap

- [ ] Admin configuration panel
- [ ] Custom theme colors
- [ ] More block types (embeds, callouts, etc.)
- [ ] Collaborative editing
- [ ] Import/export to Markdown
- [ ] Plugin API for custom blocks

---

Made with ❤️ for better forum experiences
