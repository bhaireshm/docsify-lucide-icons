# docsify-lucide-icons

A simple, clean Docsify plugin to embed [Lucide icons](https://lucide.dev/) directly in your Markdown files using a JSX-like syntax.

## Features

- **JSX-like Syntax**: Use `<Home />` or `<Settings />` directly in Markdown.
- **Attributes Support**: Customize size, color, stroke-width, and classes per icon.
- **Global Configuration**: Set default styles for all icons.
- **Auto-Rendering**: Works in main content, sidebars, and navbars.

## Installation

1. Add the Lucide library and the `docsify-lucide` plugin to your `index.html`:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script src="https://cdn.jsdelivr.net/gh/bhaireshm/docsify-lucide-icons@master/docsify-lucide.min.js"></script>
```

## Usage

Simply use the icon name in PascalCase within your Markdown files:

```markdown
# Welcome <Home size="30" color="red" />

This is a documentation page with icons.

<Settings color="#333" stroke-width="1" /> Configuration details here.
```

### Supported Attributes

- `size`: Sets both width and height (e.g., `size="24"`).
- `color`: Sets the stroke color (e.g., `color="blue"`).
- `stroke-width`: Sets the thickness of the icon lines.
- `class` / `className`: Adds custom CSS classes.

## Configuration

You can configure default settings for all icons in your Docsify setup:

```javascript
window.$docsify = {
  lucide: {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
    class: 'my-default-icon-class'
  }
};
```

## License

MIT License. See [LICENSE](LICENSE) for details.
