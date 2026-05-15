import type { CollectionConfig } from 'payload'
import {
  convertLexicalToHTML,
  convertLexicalNodesToHTML,
  defaultHTMLConverters,
} from '@payloadcms/richtext-lexical'
import type { HTMLConverter } from '@payloadcms/richtext-lexical'
import { ALL_BLOCKS } from '../blocks'
import { revalidate } from '../lib/revalidate'

// Reusable helper — converts a node's children to an HTML string
async function childrenToHTML(args: any): Promise<string> {
  return convertLexicalNodesToHTML({
    converters: args.converters,
    currentDepth: args.currentDepth,
    depth: args.depth,
    draft: args.draft,
    lexicalNodes: args.node.children ?? [],
    overrideAccess: args.overrideAccess,
    parent: { ...args.node, parent: args.parent },
    req: args.req,
    showHiddenFields: args.showHiddenFields,
  })
}

const HeadingConverter: HTMLConverter<any> = {
  nodeTypes: ['heading'],
  converter: async (args) => {
    const tag = args.node.tag || 'h2'
    return `<${tag}>${await childrenToHTML(args)}</${tag}>`
  },
}

const ListConverter: HTMLConverter<any> = {
  nodeTypes: ['list'],
  converter: async (args) => {
    const tag = args.node.tag || 'ul'
    return `<${tag}>${await childrenToHTML(args)}</${tag}>`
  },
}

const ListItemConverter: HTMLConverter<any> = {
  nodeTypes: ['listitem'],
  converter: async (args) => `<li>${await childrenToHTML(args)}</li>`,
}

const LinkConverter: HTMLConverter<any> = {
  nodeTypes: ['link'],
  converter: async (args) => {
    const url = args.node.fields?.url || args.node.url || '#'
    const newTab = args.node.fields?.newTab
    const rel = newTab ? ' rel="noopener noreferrer"' : ''
    const target = newTab ? ' target="_blank"' : ''
    return `<a href="${url}"${target}${rel}>${await childrenToHTML(args)}</a>`
  },
}

const pageConverters: HTMLConverter<any>[] = [
  ...defaultHTMLConverters,
  HeadingConverter,
  ListConverter,
  ListItemConverter,
  LinkConverter,
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Pages',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Block-based pages. Each page is a slug + an ordered list of blocks.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.LME_SITE_URL || 'http://localhost:3000'}/preview/${data?.slug ?? ''}`,
    },
  },
  access: { read: () => true },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.blocks) return data
        data.blocks = await Promise.all(
          data.blocks.map(async (block: any) => {
            if (block.blockType === 'rich-text' && block.content && typeof block.content !== 'string') {
              try {
                block.content = await convertLexicalToHTML({
                  converters: pageConverters,
                  data: block.content,
                  req,
                  depth: 1,
                  overrideAccess: true,
                })
              } catch (err) {
                console.error('[Pages] Lexical → HTML conversion failed:', err)
              }
            }
            return block
          })
        )
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        await revalidate({ collection: 'pages', slug: doc.slug })
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path without leading slash. e.g. "services/ev-chargers" or "about-loch-monster"',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: ALL_BLOCKS,
      admin: { description: 'Build the page by adding and reordering blocks.' },
    },
    // SEO tab
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            {
              name: 'noIndex',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
