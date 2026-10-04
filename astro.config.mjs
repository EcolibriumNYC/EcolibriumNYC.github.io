// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';

// Presentation lives here, in src/styles/, and in src/components/, never in
// content files. See CLAUDE.md.
export default defineConfig({
	// Served from the EcolibriumNYC.github.io org Pages repo, so no `base` is needed
	// and root-relative links in content keep working.
	site: 'https://ecolibriumnyc.github.io',
	// Old URLs of renamed sections, so shared links keep working.
	redirects: {
		'/software-applications/': '/computing-stack/',
	},
	integrations: [
		starlight({
			title: 'EcolibriumNYC Learning',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/EcolibriumNYC' }],
			editLink: {
				baseUrl: 'https://github.com/EcolibriumNYC/EcolibriumNYC.github.io/edit/main/',
			},
			customCss: [
				'@fontsource-variable/atkinson-hyperlegible-next',
				'@fontsource-variable/fraunces',
				'@fontsource-variable/jetbrains-mono',
				'./src/styles/theme.css',
			],
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			expressiveCode: {
				styleOverrides: {
					codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
				},
			},
			plugins: [starlightImageZoom(), starlightLinksValidator()],
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started' },
				{
					label: 'Sections',
					items: [
						{
							slug: 'linux-and-your-computer',
							badge: { text: 'Draft', variant: 'caution' },
						},
						'embedded-systems',
						'programming-fundamentals',
						'networking',
						'computing-stack',
						'reverse-engineering',
						'data-science',
						{
							slug: 'building-science-and-energy-systems',
							badge: { text: 'Draft', variant: 'caution' },
						},
					],
				},
			],
		}),
	],
});
