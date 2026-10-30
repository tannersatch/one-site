import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown } from "../app/utils/markdown.ts";

test("renders headings, emphasis, lists, and block quotes", () => {
  const html = renderMarkdown("# Project notes\n\n**Bold** and *emphasis*.\n\n- One\n- Two\n\n> A quote");
  for (const tag of ["h1", "strong", "em", "ul", "li", "blockquote"]) assert.match(html, new RegExp(`<${tag}[ >]`));
});

test("renders GFM tables and strikethrough", () => {
  const html = renderMarkdown("| Name | State |\n| --- | --- |\n| Preview | Ready |\n\n~~old~~");
  assert.match(html, /<table>/);
  assert.match(html, /<th>Name<\/th>/);
  assert.match(html, /<del>old<\/del>/);
});

test("escapes code rather than interpreting it as HTML", () => {
  const html = renderMarkdown("```html\n<script>alert(1)</script>\n```\n\n`<img onerror=\"alert(1)\">`");
  assert.match(html, /class="language-html"/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script|<img/i);
});

test("removes executable elements and event attributes", () => {
  const html = renderMarkdown(
    "<script>alert(1)</script><iframe src=\"https://example.com\"></iframe><object data=\"data:text/html,hi\"></object><svg onload=\"alert(1)\"></svg><p onclick=\"alert(1)\" style=\"position:fixed\">Safe</p>",
  );
  assert.doesNotMatch(html, /<script|<iframe|<object|<svg|onclick=|onload=|style=/i);
  assert.match(html, /<p>Safe<\/p>/);
});

test("removes unsafe URL protocols including encoded JavaScript links", () => {
  for (
    const source of [
      "[bad](javascript:alert(1))",
      "<a href=\"&#x6a;avascript:alert(1)\">bad</a>",
      "<a href=\"data:text/html,hello\">bad</a>",
      "<a href=\"vbscript:msgbox(1)\">bad</a>",
      "<a href=\"//example.com\">relative protocol</a>",
    ]
  ) {
    assert.doesNotMatch(renderMarkdown(source), /href=/i);
  }
});

test("protects external links and preserves safe link titles", () => {
  const html = renderMarkdown("[Docs](https://example.com \"Reference\")");
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer nofollow"/);
  assert.match(html, /title="Reference"/);
});

test("allows mail links and keeps fragment links in the current document", () => {
  assert.match(renderMarkdown("[Mail](mailto:hello@example.com)"), /href="mailto:hello@example.com"/);
  assert.match(renderMarkdown("[Section](#section)"), /target="_self"/);
});

test("blocks image requests by default and safely retains alternative text", () => {
  const html = renderMarkdown("![Example](https://example.com/image.png)");
  assert.doesNotMatch(html, /<img|src=/i);
  assert.match(html, /title="Example"/);
  assert.match(html, /\[Image\]/);
});

test("allows explicit HTTP images only after opting in", () => {
  const html = renderMarkdown("![Example](https://example.com/image.png)", { allowRemoteImages: true });
  assert.match(html, /src="https:\/\/example.com\/image.png"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /referrerpolicy="no-referrer"/);
});

test("rejects relative, data, and unsafe image sources even when opted in", () => {
  for (const src of ["/api/action", "//example.com/image.png", "data:image/svg+xml,bad", "javascript:alert(1)"]) {
    assert.doesNotMatch(
      renderMarkdown(`<img src="${src}" onerror="alert(1)">`, { allowRemoteImages: true }),
      /<img|src=|onerror=/i,
    );
  }
});

test("image alternative text cannot inject markup or attributes", () => {
  const html = renderMarkdown("<img src=\"https://example.com/image.png\" alt=\"&quot; onerror=&quot;alert(1)\">");
  assert.doesNotMatch(html, /<img|<script/);
  assert.doesNotMatch(html, /\sonerror="/);
});

test("task checkboxes remain disabled and other input types are removed", () => {
  const html = renderMarkdown(
    "- [x] Done\n- [ ] Pending\n\n<input type=\"password\" autofocus><input type=\"checkbox\" onchange=\"alert(1)\">",
  );
  assert.match(html, /type="checkbox"/);
  assert.match(html, /disabled/);
  assert.doesNotMatch(html, /password|autofocus|onchange=/i);
});

test("removes IDs, named elements, and arbitrary styling hooks", () => {
  const html = renderMarkdown(
    "<a id=\"constructor\" name=\"__proto__\" href=\"https://example.com\">Link</a><p class=\"sidebar\" style=\"display:none\">Text</p>",
  );
  assert.doesNotMatch(html, /\sid=|\sname=|class="sidebar"|style=/i);
});

test("handles incomplete Markdown and clears blank input", () => {
  assert.match(renderMarkdown("**still editing"), /still editing/);
  assert.equal(renderMarkdown(" \n\t "), "");
});
