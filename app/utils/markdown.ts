import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export function renderMarkdown(source: string, options: { allowRemoteImages?: boolean } = {}): string {
  if (!source.trim()) return "";
  const html = marked.parse(source, { gfm: true, async: false });

  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "li",
      "pre",
      "code",
      "em",
      "strong",
      "del",
      "s",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "a",
      "img",
      "input",
      "span",
      "details",
      "summary",
      "kbd",
      "sup",
      "sub",
      "dl",
      "dt",
      "dd",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "loading", "referrerpolicy"],
      input: ["type", "checked", "disabled"],
      code: ["class"],
      th: ["align"],
      td: ["align"],
      details: ["open"],
      span: ["title"],
    },
    allowedClasses: { code: [/^language-[a-zA-Z0-9_-]+$/] },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https", "http"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          target: attributes.href?.startsWith("#") ? "_self" : "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      img: (_tagName, attributes) => {
        const placeholder = { tagName: "span", attribs: { title: attributes.alt ?? "Image" }, text: "[Image]" };
        if (!options.allowRemoteImages) return placeholder;
        let url: URL;
        try {
          url = new URL(attributes.src ?? "");
        } catch {
          return placeholder;
        }
        if (url.protocol !== "https:" && url.protocol !== "http:") return placeholder;
        return {
          tagName: "img",
          attribs: { ...attributes, src: url.href, loading: "lazy", referrerpolicy: "no-referrer" },
        };
      },
      input: (_tagName, attributes) =>
        attributes.type?.toLowerCase() === "checkbox"
          ? {
            tagName: "input",
            attribs: { type: "checkbox", disabled: "", ...(attributes.checked !== undefined ? { checked: "" } : {}) },
          }
          : { tagName: "span", attribs: {}, text: "" },
    },
  });
}
