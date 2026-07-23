#!/usr/bin/env node
// Bakes partials/nav.html and partials/footer.html into the mount points
// (<nav id="site-nav">, <footer id="site-footer">) of each page, and sets
// aria-current="page" on the matching top-nav link. Safe to re-run any
// time the partials change — re-run with `node scripts/build.js`.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  { file: 'index.html', route: '/index.html' },
  { file: 'about.html', route: '/about.html' },
  { file: 'case-studies/cherish.html', route: '/case-studies/cherish.html' },
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withActiveLink(navHtml, route) {
  const escapedRoute = escapeRegExp(route);
  return navHtml.replace(
    /<ul class="top-nav-links">[\s\S]*?<\/ul>/,
    (listHtml) => listHtml.replace(
      new RegExp(`(<a href="${escapedRoute}")>`),
      '$1 aria-current="page">'
    )
  );
}

function replaceMount(html, mountId, content) {
  const re = new RegExp(
    `(<([a-zA-Z][a-zA-Z0-9]*)[^>]*\\bid="${mountId}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`
  );
  if (!re.test(html)) {
    throw new Error(`Mount point id="${mountId}" not found`);
  }
  return html.replace(re, (match, openTag, tagName, closeTag) => (
    `${openTag}\n${content.trim()}\n${closeTag}`
  ));
}

const navPartial = fs.readFileSync(path.join(ROOT, 'partials/nav.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(ROOT, 'partials/footer.html'), 'utf8');

for (const { file, route } of PAGES) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  html = replaceMount(html, 'site-nav', withActiveLink(navPartial, route));
  html = replaceMount(html, 'site-footer', footerPartial);

  fs.writeFileSync(filePath, html);
  console.log(`Built ${file}`);
}
