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
	_type == "faqSection" => {
		items[]{
			...,
			answer[]{
				${portableTextFields}
			}
		}
	},
`;

// PROJET : projections des sections propres au client (références, images...).
// SEUL bloc à modifier pour brancher une nouvelle section.
const projectSectionProjections = /* groq */ ``;

// Projection de l'objet `pageHeader` : ses liens (boutons) sont résolus
// pour que <PageHeader>/<UPageHeader> reçoive des cibles prêtes à l'emploi.
const pageHeaderFields = /* groq */ `
	pageHeader{
		...,
		links[]${buttonFields}
	}
`;

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
			"ogImage": coverImage.asset->url
		}`);

export const pageQuery = defineQuery(/* groq */ `
		*[_type == "page" && defined(slug.current) && slug.current == $slug][0]{
			...,
			${pageHeaderFields},
			${pageBuilderFields}
		}`);

// Page « Contact » (si elle existe) : sert à afficher le lien dans le menu.
export const contactPageQuery = defineQuery(/* groq */ `
		*[_type == "page" && slug.current == "contact"][0]{
			name,
			"slug": slug.current
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
			"light": light.value,
			"foreground": foreground.value,
			"muted": muted.value,
			"border": border.value,
			"success": success.value,
			"warning": warning.value,
			"error": error.value,
			fontDisplay,
			fontBody,
			fontAccent,
			fontHeadline,
			typeScale,
			headingWeight,
			headlineWeight,
			accentWeight,
			displayCase,
			accentCase,
			headlineCase,
			radius,
			contentWidth,
			density,
			siteMaxWidth
		}`);

export const settingsQuery = defineQuery(/* groq */ `
		*[_type == "settings"][0]{
			title,
			description,
			phone,
			email,
			address,
			seoTitle,
			seoDescription,
			"ogImage": ogImage.asset->url,
			"logo": logo.asset->url,
			"logoHome": logoHome.asset->url,
			"logoBlog": logoBlog.asset->url,
			"logoFooter": logoFooter.asset->url,
			"favicon": favicon.asset->url,
			socialLinks,
			shareNetworks,
			cookieConsent,
			analytics,
			blog,
			gallery
		}`);

export const navigationQuery = defineQuery(/* groq */ `
		*[_type == "navigation"][0]{
			headerMenu[]{
				_key,
				label,
				${linkFields},
				children[]{
					_key,
					label,
					${linkFields}
				}
			},
			footerLinks[]{
				_key,
				label,
				${linkFields}
			}
		}`);

export const legalTextsQuery = defineQuery(/* groq */ `
		*[_type == "legalTexts"][0]{
			editorName,
			editorLegalForm,
			editorSiret,
			editorRcs,
			editorVat,
			editorAddress,
			editorEmail,
			editorPhone,
			editorPublicationDirector,
			hostName,
			hostAddress,
			hostWebsite,
			legalNoticeTitle,
			legalNoticeIntro,
			legalNoticeContent[]{
				${portableTextFields}
			},
			privacyTitle,
			privacyIntro,
			privacyContent[]{
				${portableTextFields}
			},
			termsTitle,
			termsIntro,
			termsContent[]{
				${portableTextFields}
			},
			cookiesTitle,
			cookiesContent[]{
				${portableTextFields}
			}
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

export const redirectsQuery = defineQuery(/* groq */ `
		*[_type == "redirects"][0].entries[]{
			source,
			destination,
			"permanent": coalesce(permanent, true)
		}`);
