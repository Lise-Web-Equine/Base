import { defineQuery } from "groq";

const linkReference = /* groq */ `
_type == "link" => {
	"page": page->slug.current,
	"post": post->slug.current
}
`;

const linkFields = /* groq */ `
link {
	...,
	${linkReference}
	}
`;

// Projection d'un objet `button` : tous ses champs + le lien résolu.
const buttonFields = /* groq */ `{
	...,
	${linkFields}
}`;

// Projection Portable Text : résout les liens dans les `markDefs`.
const portableTextFields = /* groq */ `
	...,
	markDefs[]{
		...,
		_type == "link" => {
			"link": {
				...,
				${linkReference}
			}
		},
	}
`;

// --- Projections des sections du Page Builder ---
// CŒUR : sections génériques. Ne pas modifier pour un projet.
const coreSectionProjections = /* groq */ `
	_type == "callToAction" => {
		primaryButton ${buttonFields},
		secondaryButton ${buttonFields},
	},
	_type == "infoSection" => {
		content[]{
			${portableTextFields}
		}
	},
`;

// PROJET : projections des sections propres au client (références, images...).
// SEUL bloc à modifier pour brancher une nouvelle section.
const projectSectionProjections = /* groq */ ``;

// Projection complète du champ `pageBuilder`.
const pageBuilderFields = /* groq */ `
	"pageBuilder": pageBuilder[]{
		...,
		${coreSectionProjections}
		${projectSectionProjections}
	}
`;

export const postsQuery =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
		...
	}`);
export const somePostsQuery = defineQuery(/* groq */ `
		*[_type == "post" && slug.current != $skip][0...$limit] | order(date desc, _updatedAt desc) {
			...
		}`);
export const postQuery = defineQuery(/* groq */ `
		*[_type == "post" && defined(slug.current) && slug.current == $slug][0]{
			...,
			content[]{
						...,
						markDefs[]{
							...,
							_type == "link" => {
								"link": {
									...,
									${linkReference}
								}
							},
						}
					},
			"author": author->{..., "picture": picture.asset._ref},
			"ogImage": coverImage.asset->url
		}`);

export const pageQuery = defineQuery(/* groq */ `
		*[_type == "page" && defined(slug.current) && slug.current == $slug][0]{
			...,
			${pageBuilderFields}
		}`);

export const homeQuery = defineQuery(/* groq */ `
		*[_type == "homePage"][0]{
			...,
			${pageBuilderFields}
		}`);

export const themeSettingsQuery = defineQuery(/* groq */ `
		*[_type == "themeSettings"][0]{
			"primary": primary.value,
			"secondary": secondary.value,
			"accent": accent.value,
			"background": background.value,
			"surface": surface.value,
			"foreground": foreground.value,
			"muted": muted.value,
			"border": border.value,
			fontDisplay,
			fontBody,
			fontAccent
		}`);

export const settingsQuery = defineQuery(/* groq */ `
		*[_type == "settings"][0]{
			title,
			description[]{
						...,
						markDefs[]{
							...,
							_type == "link" => {
								"link": {
									...,
									${linkReference}
								}
							},
						}
					},
			metaDescription,
			"ogImage": ogImage.asset->url,
			"logo": logo.asset->url,
			socialLinks
		}`);

export const sitemapQuery = defineQuery(/* groq */ `
		*[
			((_type in ["page", "post"] && defined(slug.current)) || _type == "homePage")
			&& noIndex != true
		]{
			_type,
			"slug": slug.current,
			_updatedAt
		}`);
