import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const project = z.enum(['vpp', 'solar-map', 'thermal-camera']);

const extend = z.object({
	// How much of this page we write vs. point elsewhere. See CLAUDE.md.
	ownership: z.enum(['own', 'frame-and-link', 'link']),
	// Projects this page is relevant to.
	projects: z.array(project).min(1),
	// Projects for which this page is core (vs. helpful). Must be a subset of `projects`.
	coreFor: z.array(project).optional(),
	// GitHub handle of the person responsible for keeping this page current.
	owner: z.string().min(1),
	// Last time someone checked the content and links. YAML date, e.g. 2026-10-03.
	lastReviewed: z.coerce.date(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: (context) =>
			docsSchema({ extend })(context).superRefine((data, ctx) => {
				const extra = data.coreFor?.filter((p) => !data.projects.includes(p)) ?? [];
				if (extra.length) {
					ctx.addIssue({
						code: 'custom',
						path: ['coreFor'],
						message: `coreFor must be a subset of projects; not in projects: ${extra.join(', ')}`,
					});
				}
			}),
	}),
};
