// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Structure only. Presentation (custom CSS, component overrides) goes here later
// via `customCss` / `components`, never in content files. See CLAUDE.md.
export default defineConfig({
	// Served from the EcolibriumNYC.github.io org Pages repo, so no `base` is needed
	// and root-relative links in content keep working.
	site: 'https://ecolibriumnyc.github.io',
	integrations: [
		starlight({
			title: 'EcolibriumNYC Learning',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/EcolibriumNYC' }],
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started' },
				{
					label: 'Sections',
					items: [
						'linux-and-your-computer',
						'embedded-systems',
						'programming-fundamentals',
						'networking',
						'software-applications',
						'reverse-engineering',
						'data-science',
						'electrical-and-power',
						'building-science-and-energy-systems',
						'community-and-ethics',
					],
				},
			],
		}),
	],
});
