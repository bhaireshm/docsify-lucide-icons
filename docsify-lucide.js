(function () {
  const install = function (hook, vm) {
    const config = Object.assign(
      {
        size: 24,
        color: 'currentColor',
        strokeWidth: 2,
        class: '',
      },
      vm.config.lucide || {}
    );

    // Helper to convert PascalCase to kebab-case
    const toKebab = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // Helper to parse attributes from a string
    const parseAttrs = (attrsString) => {
      const attrs = {};
      const attrRegex = /([a-z-]+)=["']([^"']*)["']/g;
      let match;
      while ((match = attrRegex.exec(attrsString)) !== null) {
        attrs[match[1]] = match[2];
      }
      return attrs;
    };

    // Inject default styles for proper inline alignment
    const style = document.createElement('style');
    style.textContent = `
      .lucide {
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.25em;
      }
    `;
    document.head.appendChild(style);

    // Use beforeEach to handle main content Markdown before it's parsed into HTML.
    // This allows us to work with the raw PascalCase syntax reliably.
    hook.beforeEach(function (markdown) {
      const regex = /<([A-Z][a-zA-Z0-9]+)\s*([^>]*)\/>/g;
      return markdown.replace(regex, function (match, iconName, attrsString) {
        const lucideName = toKebab(iconName);
        const attrs = parseAttrs(attrsString);
        const mergedAttrs = Object.assign({}, config, attrs);

        let htmlAttrs = `data-lucide="${lucideName}"`;
        if (mergedAttrs.size) htmlAttrs += ` width="${mergedAttrs.size}" height="${mergedAttrs.size}"`;
        if (mergedAttrs.color) htmlAttrs += ` stroke="${mergedAttrs.color}"`;
        const sw = mergedAttrs.strokeWidth || mergedAttrs['stroke-width'];
        if (sw) htmlAttrs += ` stroke-width="${sw}"`;
        const className = ((mergedAttrs.class || "") + " " + (mergedAttrs.className || "")).trim();
        if (className) htmlAttrs += ` class="${className}"`;

        return `<i ${htmlAttrs}></i>`;
      });
    });

    // Handle Sidebar and Navbar which aren't processed by beforeEach.
    hook.doneEach(function () {
      const targetElements = document.querySelectorAll('.sidebar-nav, .app-nav');
      
      targetElements.forEach(container => {
        const allElements = container.getElementsByTagName('*');
        const lucideIconKeys = window.lucide && window.lucide.icons ? Object.keys(window.lucide.icons) : [];

        // Snapshot to avoid live collection mutation issues
        Array.from(allElements).forEach(el => {
          const tagName = el.tagName.toLowerCase();
          const iconKey = lucideIconKeys.find(key => key.toLowerCase() === tagName);

          if (iconKey) {
            const lucideName = toKebab(iconKey);
            const i = document.createElement('i');
            i.setAttribute('data-lucide', lucideName);

            // Merge attributes from DOM element and global config
            const mergedAttrs = Object.assign({}, config);
            Array.from(el.attributes).forEach(attr => {
              if (attr.name !== '/') mergedAttrs[attr.name] = attr.value;
            });

            if (mergedAttrs.size) {
              i.setAttribute('width', mergedAttrs.size);
              i.setAttribute('height', mergedAttrs.size);
            }
            if (mergedAttrs.color) i.setAttribute('stroke', mergedAttrs.color);
            const sw = mergedAttrs.strokeWidth || mergedAttrs['stroke-width'];
            if (sw) i.setAttribute('stroke-width', sw);
            const className = ((mergedAttrs.class || "") + " " + (mergedAttrs.className || "")).trim();
            if (className) i.setAttribute('class', className);

            // Crucial: Move children out of the custom tag before replacing it.
            // This prevents "swallowing" sibling content that the browser might have nested.
            const fragment = document.createDocumentFragment();
            while (el.firstChild) {
              fragment.appendChild(el.firstChild);
            }

            // Check if the first element in the fragment is a link (common in sidebar)
            const firstLink = fragment.querySelector('a');
            if (firstLink) {
              // If there's a link, put the icon INSIDE the link (prepend it)
              // This fixes the issue where sidebar links are display:block and force a new line
              firstLink.insertBefore(i, firstLink.firstChild);
              // Ensure a space between icon and text if not present
              // if (firstLink.firstChild.nextSibling && firstLink.firstChild.nextSibling.nodeType === 3) {
              //   firstLink.firstChild.nextSibling.textContent = " " + firstLink.firstChild.nextSibling.textContent.trimLeft();
              // }
              el.parentNode.insertBefore(fragment, el);
            } else {
              // Otherwise, just place icon and content side-by-side
              el.parentNode.insertBefore(i, el);
              if (fragment.childNodes.length > 0) {
                el.parentNode.insertBefore(fragment, el);
              }
            }
            
            el.parentNode.removeChild(el);
          }
        });
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], install);
})();
