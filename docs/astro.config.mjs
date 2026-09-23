import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black';
import fleur_grammar from './fleur.tmLanguage.json';

export default defineConfig({
    base:          '/fleur-lang/',
    trailingSlash: 'always',
    integrations:  [
        starlight({
            title:          'Fleur',
            logo:           {
                src: './src/assets/fleur-logo.png',
            },
            favicon:        '/favicon.svg',
            customCss:      ['./src/styles/custom.css'],
            expressiveCode: {
                shiki: {
                    langs:     [fleur_grammar],
                    langAlias: {
                        'flr': 'fleur'
                    },
                },
            },
            plugins:        [starlightThemeBlack({})],
            social:         [{icon: 'github', label: 'GitHub', href: 'https://github.com/fleur-lang/fleur'}],
            sidebar:        [
                {
                    label: 'Guides',
                    items: [
                        {label: 'Getting Started', slug: 'guides/getting-started'},
                        {label: 'Language Basics', slug: 'guides/basics'},
                        {label: 'Control Flow', slug: 'guides/control-flow'},
                        {label: 'Functions & Procedures', slug: 'guides/functions'},
                        {
                            label: 'Data Structures', items: [
                                {label: 'Arrays', slug: 'guides/arrays'},
                                {label: 'Sets', slug: 'guides/sets'},
                                {label: 'Maps', slug: 'guides/maps'},
                                {label: 'Structs', slug: 'guides/structs'},
                            ]
                        },
                        {
                            label: 'Built-in Structs / Literals', items: [
                                {label: 'Ranges', slug: 'guides/ranges'},
                                {label: 'Errors', slug: 'guides/errors'},
                            ]
                        },
                        {
                            label: 'Standard Library', items: [
                                {label: 'Overview', slug: 'guides/stdlib'},
                                {label: 'crypto', slug: 'guides/stdlib/crypto'},
                                {label: 'file', slug: 'guides/stdlib/file'},
                                {label: 'http', slug: 'guides/stdlib/http'},
                                {label: 'io', slug: 'guides/stdlib/io'},
                                {label: 'json', slug: 'guides/stdlib/json'},
                                {label: 'math', slug: 'guides/stdlib/math'},
                                {label: 'os', slug: 'guides/stdlib/os'},
                                {label: 'reflect', slug: 'guides/stdlib/reflect'},
                                {label: 'regex', slug: 'guides/stdlib/regex'},
                                {label: 'str', slug: 'guides/stdlib/str'},
                                {label: 'test', slug: 'guides/stdlib/test'},
                                {label: 'time', slug: 'guides/stdlib/time'},
                                {label: 'type', slug: 'guides/stdlib/type'},
                            ]
                        },
                        {
                            label: 'Advanced Features', items: [
                                {label: 'Deep Equality', slug: 'guides/deep-equality'},
                                {label: 'Modules & Imports', slug: 'guides/modules'},
                                {label: 'Error Handling', slug: 'guides/errors'},
                                {label: 'Type Annotations', slug: 'guides/type-annotations'},
                            ]
                        },
                    ],
                },
            ],
        }),
    ],
});