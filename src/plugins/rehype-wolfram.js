import { visit } from 'unist-util-visit';

const WOLFRAM_CLOUD_REGEX = /^https?:\/\/(www\.)?wolframcloud\.com\/obj\/[^\s]+$/i;

function createWolframCard(url, title) {
  const displayTitle = title && title.toLowerCase() !== 'wolfram' ? title : 'Interactive Wolfram Notebook';

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: 'wolfram-embed-card my-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 overflow-hidden shadow-xs not-prose',
      'data-wolfram-url': url,
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          class: 'px-4 py-3 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs font-mono',
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              class: 'flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-medium',
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { class: 'inline-block w-2.5 h-2.5 rounded-full bg-red-600' },
                children: [],
              },
              {
                type: 'element',
                tagName: 'span',
                properties: { class: 'font-sans font-semibold text-neutral-900 dark:text-neutral-100' },
                children: [{ type: 'text', value: displayTitle }],
              },
            ],
          },
          {
            type: 'element',
            tagName: 'a',
            properties: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 inline-flex items-center gap-1 font-medium transition-colors',
            },
            children: [
              { type: 'text', value: 'Open in Wolfram Cloud ↗' },
            ],
          },
        ],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          class: 'wolfram-embed-container min-h-[340px] p-4 flex items-center justify-center',
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              class: 'wolfram-embed-loading text-xs font-mono text-neutral-400 flex items-center gap-2.5 py-12',
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: 'inline-block w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin',
                },
                children: [],
              },
              {
                type: 'text',
                value: 'Loading Wolfram Cloud interactive engine…',
              },
            ],
          },
        ],
      },
    ],
  };
}

export function rehypeWolfram() {
  return (tree) => {
    // Pass 1: Handle <p> that only contains an <img> pointing to wolframcloud.com/obj/...
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p' && node.children?.length === 1) {
        const child = node.children[0];
        let imgNode = null;
        if (child.tagName === 'img') {
          imgNode = child;
        } else if (child.tagName === 'a' && child.children?.length === 1 && child.children[0].tagName === 'img') {
          imgNode = child.children[0];
        }

        if (imgNode && WOLFRAM_CLOUD_REGEX.test(imgNode.properties?.src || '')) {
          const src = imgNode.properties.src;
          const alt = imgNode.properties.alt || '';
          const card = createWolframCard(src, alt);
          node.tagName = card.tagName;
          node.properties = card.properties;
          node.children = card.children;
        }
      }
    });

    // Pass 2: Handle fenced code blocks with lang `wolfram-embed` or `wolfram-cloud`
    // In hast, ```wolfram-embed produces <pre><code class="language-wolfram-embed">https://...</code></pre>
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'pre' && node.children?.length === 1) {
        const code = node.children[0];
        if (code.tagName === 'code') {
          const className = Array.isArray(code.properties?.className)
            ? code.properties.className.join(' ')
            : (code.properties?.className || '');
          if (/language-(wolfram-embed|wolfram-cloud)/i.test(className)) {
            const rawContent = (code.children?.[0]?.value || '').trim();
            const lines = rawContent.split('\n').map((l) => l.trim()).filter(Boolean);
            const urlLine = lines.find((l) => WOLFRAM_CLOUD_REGEX.test(l) || l.startsWith('http'));
            const titleLine = lines.find((l) => l.toLowerCase().startsWith('title:'))?.replace(/^title:\s*/i, '');
            if (urlLine) {
              const url = urlLine.replace(/^url:\s*/i, '').trim();
              const card = createWolframCard(url, titleLine);
              if (parent && index !== undefined) {
                parent.children[index] = card;
              }
            }
          }
        }
      }
    });

    // Pass 3: Handle standalone <img> pointing to wolframcloud.com/obj/...
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img' && WOLFRAM_CLOUD_REGEX.test(node.properties?.src || '')) {
        const src = node.properties.src;
        const alt = node.properties.alt || '';
        const card = createWolframCard(src, alt);
        if (parent && index !== undefined) {
          parent.children[index] = card;
        }
      }
    });
  };
}

