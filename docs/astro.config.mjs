import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black';
import fleur_grammar from './fleur.tmLanguage.json';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Fleur',
   logo: {
      src: './src/assets/fleur-logo.png',
    },
			favicon: '/favicon.svg',
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				shiki: {
					langs: [fleur_grammar],
     langAlias: {
      'flr': 'fleur'
     },
				},
			},
			plugins: [starlightThemeBlack({})],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/fleur-lang/fleur' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting Started', slug: 'guides/getting-started' },
						{ label: 'Language Basics', slug: 'guides/basics' },
						{ label: 'Control Flow', slug: 'guides/control-flow' },
						{ label: 'Functions & Procedures', slug: 'guides/functions' },
						{ label: 'Data Structures', items: [
								{ label: 'Arrays', slug: 'guides/arrays' },
								{ label: 'Sets', slug: 'guides/sets' },
								{ label: 'Maps', slug: 'guides/maps' },
								{ label: 'Structs', slug: 'guides/structs' },
							] },
						{ label: 'Built-in Structs / Literals', items: [
								{ label: 'Ranges', slug: 'guides/ranges' },
								{ label: 'Errors', slug: 'guides/errors' },
							] },
						{ label: 'Standard Library', items: [
								{ label: 'Overview', slug: 'guides/stdlib' },
								{ label: 'io', slug: 'guides/stdlib/io' },
								{ label: 'math', slug: 'guides/stdlib/math' },
								{ label: 'str', slug: 'guides/stdlib/str' },
								{ label: 'file', slug: 'guides/stdlib/file' },
								{ label: 'type', slug: 'guides/stdlib/type' },
								{ label: 'os', slug: 'guides/stdlib/os' },
								{ label: 'time', slug: 'guides/stdlib/time' },
								{ label: 'regex', slug: 'guides/stdlib/regex' },
								{ label: 'reflect', slug: 'guides/stdlib/reflect' },
								{ label: 'crypto', slug: 'guides/stdlib/crypto' },
							] },
						{ label: 'Advanced Features', items: [
								{ label: 'Deep Equality', slug: 'guides/advanced' },
								{ label: 'Modules & Imports', slug: 'guides/modules' },
								{ label: 'Error Handling', slug: 'guides/errors' },
							] },
					],
				},
			],
		}),
	],
});