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
			"pageBuilder": pageBuilder[]{
				...,
				_type == "callToAction" => {
					${linkFields},
				},
				_type == "infoSection" => {
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
					}
				},
			}
		}`);

export const themeSettingsQuery = defineQuery(/* groq */ `
		*[_type == "themeSettings"][0]{
			"primary": primary.value,
			"secondary": secondary.value,
			"accent": accent.value,
			"bgMain": bgMain.value,
			"bgSurface": bgSurface.value,
			"textMain": textMain.value,
			"textMuted": textMuted.value,
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
		*[_type in ["page", "post"] && defined(slug.current) && noIndex != true]{
			_type,
			"slug": slug.current,
			_updatedAt
		}`);
