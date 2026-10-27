import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
     loader: glob({
        pattern: ['**/*.md','**/*.mdx'],
        base: './src/content/posts'
    }),
    schema: z.object({
        titulo: z.string(),
        autor: z.string().optional(),
        fecha: z.string(),
        tags: z.array(z.string()).optional()

    })
})


export const collections = { posts }