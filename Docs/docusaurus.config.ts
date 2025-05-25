import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: 'EcoSense',
	tagline: 'Dinosaurs are cool',
	favicon: 'img/favicon.ico',

	// Set the production url of your site here
	url: 'https://localhost',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'Karmelki', // Usually your GitHub org/user name.
	projectName: 'EcoSense', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					routeBasePath: '/', // Set this to '/' to have the docs at the root of your site
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: 'https://github.com',
				},
				// blog: {
				//   showReadingTime: true,
				//   feedOptions: {
				//     type: ['rss', 'atom'],
				//     xslt: true,
				//   },
				//   // Please change this to your repo.
				//   // Remove this to remove the "edit this page" links.
				//   editUrl:
				//     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				//   // Useful options to enforce blogging best practices
				//   onInlineTags: 'warn',
				//   onInlineAuthors: 'warn',
				//   onUntruncatedBlogPosts: 'warn',
				// },
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			title: 'EcoSense',
			logo: {
				alt: 'EcoSense Logo',
				src: 'img/ecosense_logo.png',
			},
			items: [
				{
					type: 'doc',
					docId: 'Introduction',
					position: 'left',
					label: 'Docs',
				},
				{
					href: 'https://github.com',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Wprowadzenie',
							to: '/docs/Introduction',
						},
						{
							label: 'Instalacja',
							to: '/Getting Started/Installation',
						},
						{
							label: 'Konfiguracja',
							to: '/Getting Started/Configuration',
						},
						{
							label: 'Czujniki',
							to: '/Guides/Sensors',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Stack Overflow',
							href: 'https://stackoverflow.com',
						},
						{
							label: 'Discord',
							href: 'https://discordapp.com',
						},
						{
							label: 'X',
							href: 'https://x.com',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Karmelki. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
}

export default config
