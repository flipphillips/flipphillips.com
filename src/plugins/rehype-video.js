import { visit } from 'unist-util-visit';

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i;

function getMimeType(src) {
  const match = src.match(VIDEO_EXTENSIONS);
  const ext = match ? match[1].toLowerCase() : 'mp4';
  if (ext === 'mov') return 'video/quicktime';
  if (ext === 'm4v') return 'video/mp4';
  return `video/${ext}`;
}

function createVideoElement(src, alt) {
  return {
    type: 'element',
    tagName: 'video',
    properties: {
      controls: true,
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: true,
      class: 'w-full rounded-xl shadow-md my-6',
      ...(alt ? { 'aria-label': alt, title: alt } : {}),
    },
    children: [
      {
        type: 'element',
        tagName: 'source',
        properties: { src, type: getMimeType(src) },
        children: [],
      },
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [
          { type: 'text', value: 'Your browser does not support the video tag. ' },
          {
            type: 'element',
            tagName: 'a',
            properties: { href: src },
            children: [{ type: 'text', value: 'Direct link to video' }],
          },
        ],
      },
    ],
  };
}

export function rehypeVideo() {
  return (tree) => {
    // Pass 1: Replace <p> that only contains an <img> (or <a href=...><img ...></a>) pointing to a video
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p' && node.children?.length === 1) {
        const child = node.children[0];
        let imgNode = null;
        if (child.tagName === 'img') {
          imgNode = child;
        } else if (child.tagName === 'a' && child.children?.length === 1 && child.children[0].tagName === 'img') {
          imgNode = child.children[0];
        }

        if (imgNode && VIDEO_EXTENSIONS.test(imgNode.properties?.src || '')) {
          const src = imgNode.properties.src;
          const alt = imgNode.properties.alt || '';
          const video = createVideoElement(src, alt);
          node.tagName = video.tagName;
          node.properties = video.properties;
          node.children = video.children;
        }
      }
    });

    // Pass 2: Handle any remaining standalone <img> nodes with video extensions
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img' && VIDEO_EXTENSIONS.test(node.properties?.src || '')) {
        const src = node.properties.src;
        const alt = node.properties.alt || '';
        const video = createVideoElement(src, alt);
        if (parent && index !== undefined) {
          parent.children[index] = video;
        }
      }
    });
  };
}

