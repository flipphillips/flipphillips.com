import { visit } from 'unist-util-visit';

const WOLFRAM_CLOUD_REGEX = /^https?:\/\/(www\.)?wolframcloud\.com\/obj\/[^\s]+$/i;
const WOLFRAM_COMMUNITY_REGEX = /^https?:\/\/community\.wolfram\.com\/t\/([^/]+)\/(\d+)/i;

const KNOWN_COMMUNITY_TOPICS = {
  '28600': {
    title: 'Training a neural radiance field (NeRF) from scratch in Wolfram Language: the classic Lego bulldozer',
    isStaffPick: true,
    description: 'Selected by the Wolfram Editorial Board for Staff Picks and Publication Materials.',
    notebookUrl: 'https://www.wolframcloud.com/obj/c19ba5bf-c364-46f4-b009-f06a27c122e0',
    downloadUrl: 'https://community.wolfram.com/uploads/short-url/ph9lHENjEcaz6OKGY52d9z5dgrR.nb',
  },
};

function unslugify(slug) {
  return slug
    .split('-')
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'nerf') return 'NeRF';
      if (lower === 'wl') return 'WL';
      if (lower === 'mma') return 'MMA';
      if (['a', 'an', 'the', 'in', 'on', 'of', 'from', 'to'].includes(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function createWolframCommunityCard(url, customTitle) {
  const match = url.match(WOLFRAM_COMMUNITY_REGEX);
  const slug = match ? match[1] : '';
  const topicId = match ? match[2] : '';
  const known = KNOWN_COMMUNITY_TOPICS[topicId] || {};

  const title = (customTitle && customTitle !== url)
    ? customTitle
    : (known.title || unslugify(slug) || 'Wolfram Community Article');

  const isStaffPick = known.isStaffPick ?? true;
  const description = known.description || 'Wolfram Community Discussion & Publication Materials';
  const notebookUrl = known.notebookUrl || null;
  const downloadUrl = known.downloadUrl || null;

  const actionButtons = [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors',
      },
      children: [
        { type: 'text', value: 'Read on Community →' },
      ],
    },
  ];

  if (notebookUrl) {
    actionButtons.push({
      type: 'element',
      tagName: 'a',
      properties: {
        href: notebookUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 font-medium inline-flex items-center gap-1.5 shadow-xs transition-opacity',
      },
      children: [
        { type: 'text', value: '☁️ Open in Cloud ↗' },
      ],
    });
  }

  if (downloadUrl) {
    actionButtons.push({
      type: 'element',
      tagName: 'a',
      properties: {
        href: downloadUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 inline-flex items-center gap-1.5 font-medium transition-colors',
      },
      children: [
        { type: 'text', value: '💾 Download .nb (15 MB)' },
      ],
    });
  }

  const badgeChildren = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        class: 'inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] shadow-xs shrink-0',
      },
      children: [{ type: 'text', value: 'W' }],
    },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        class: 'text-xs font-mono font-semibold uppercase tracking-wider text-red-700 dark:text-red-400',
      },
      children: [{ type: 'text', value: 'Wolfram Community' }],
    },
  ];

  if (isStaffPick) {
    badgeChildren.push(
      {
        type: 'element',
        tagName: 'span',
        properties: { class: 'text-xs text-neutral-400' },
        children: [{ type: 'text', value: '•' }],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-sans font-medium text-[11px] inline-flex items-center gap-1',
        },
        children: [{ type: 'text', value: '★ Staff Pick' }],
      }
    );
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: 'wolfram-community-card my-8 p-6 rounded-2xl border border-red-200/80 dark:border-red-950/60 bg-linear-to-br from-red-50/40 via-neutral-50/50 to-neutral-100/40 dark:from-red-950/20 dark:via-neutral-900/40 dark:to-neutral-950/50 shadow-xs not-prose',
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          class: 'flex flex-wrap items-center gap-2 mb-3',
        },
        children: badgeChildren,
      },
      {
        type: 'element',
        tagName: 'h3',
        properties: {
          class: 'text-lg md:text-xl font-serif font-bold text-neutral-900 dark:text-neutral-50 leading-snug mb-2',
        },
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'hover:text-red-600 dark:hover:text-red-400 transition-colors',
            },
            children: [{ type: 'text', value: title }],
          },
        ],
      },
      {
        type: 'element',
        tagName: 'p',
        properties: {
          class: 'text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-sans mb-4 leading-relaxed',
        },
        children: [{ type: 'text', value: description }],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          class: 'flex flex-wrap items-center gap-2.5 font-mono text-xs pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60',
        },
        children: actionButtons,
      },
    ],
  };
}

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
    // Pass 1: Handle standalone paragraphs
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p') {
        const meaningfulChildren = (node.children || []).filter(
          (c) => !(c.type === 'text' && !c.value.trim())
        );

        // Check if paragraph contains only an <img> or <a><img></a> pointing to wolframcloud.com/obj/...
        let imgNode = null;
        if (meaningfulChildren.length === 1) {
          const child = meaningfulChildren[0];
          if (child.tagName === 'img') {
            imgNode = child;
          } else if (child.tagName === 'a' && child.children?.length === 1 && child.children[0].tagName === 'img') {
            imgNode = child.children[0];
          }
        }

        if (imgNode && WOLFRAM_CLOUD_REGEX.test(imgNode.properties?.src || '')) {
          const src = imgNode.properties.src;
          const alt = imgNode.properties.alt || '';
          const card = createWolframCard(src, alt);
          node.tagName = card.tagName;
          node.properties = card.properties;
          node.children = card.children;
          return;
        }

        // Check if paragraph contains only an <a> pointing to community.wolfram.com/t/...
        if (meaningfulChildren.length === 1 && meaningfulChildren[0].tagName === 'a') {
          const aNode = meaningfulChildren[0];
          const href = aNode.properties?.href || '';
          if (WOLFRAM_COMMUNITY_REGEX.test(href)) {
            const linkText = (aNode.children || []).map((c) => c.value || '').join('').trim();
            const card = createWolframCommunityCard(href, linkText);
            node.tagName = card.tagName;
            node.properties = card.properties;
            node.children = card.children;
            return;
          }
        }
      }
    });

    // Pass 2: Handle fenced code blocks with lang `wolfram-embed`, `wolfram-cloud`, or `wolfram-community`
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
          } else if (/language-(wolfram-community)/i.test(className)) {
            const rawContent = (code.children?.[0]?.value || '').trim();
            const lines = rawContent.split('\n').map((l) => l.trim()).filter(Boolean);
            const urlLine = lines.find((l) => WOLFRAM_COMMUNITY_REGEX.test(l) || l.startsWith('http'));
            const titleLine = lines.find((l) => l.toLowerCase().startsWith('title:'))?.replace(/^title:\s*/i, '');
            if (urlLine) {
              const url = urlLine.replace(/^url:\s*/i, '').trim();
              const card = createWolframCommunityCard(url, titleLine);
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
