// Static design-artboard exporter. This is not application UI or a prototype.
// Run with the workspace Node runtime and its bundled sharp package on NODE_PATH.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const fontConfig = fs.mkdtempSync(path.join(os.tmpdir(), 'cookbook-artboard-fonts-'));
fs.mkdirSync(path.join(fontConfig, 'cache'));
fs.writeFileSync(path.join(fontConfig, 'fonts.conf'), `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${root}/assets</dir><cachedir>${fontConfig}/cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = path.join(fontConfig, 'fonts.conf');
process.env.FONTCONFIG_PATH = fontConfig;
const sharp = require('sharp');

const C = { ink: '#1c1e21', muted: '#5b636b', line: '#dde3e6', surface: '#eef1f2', accent: '#0e7c70', bright: '#2bb3a3' };
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const font = fs.readFileSync(path.join(root, 'assets/archivo-latin.woff2')).toString('base64');
const photos = Object.fromEntries(['shakshuka', 'greek-salad', 'tomato-soup'].map(name => [name, fs.readFileSync(path.join(root, `assets/${name}.jpg`)).toString('base64')]));
let parts = [], imageId = 0;
const add = value => parts.push(value);
function text(x, y, value, size = 17, weight = 400, color = C.ink, extra = '') {
  add(`<text x="${x}" y="${y}" font-family="Archivo" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(value)}</text>`);
}
function lines(x, y, values, size = 17, gap = 26, weight = 400, color = C.muted) {
  values.forEach((value, i) => text(x, y + i * gap, value, size, weight, color));
}
function rule(x, y, width, color = C.line) { add(`<path d="M${x} ${y}h${width}" stroke="${color}" stroke-width="1"/>`); }
function rect(x, y, width, height, fill = 'white', radius = 0, stroke = '') {
  add(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" ${stroke ? `stroke="${stroke}"` : ''}/>`);
}
function icon(name, x, y, size = 20, color = C.ink) {
  const paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
    file: '<path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6"/>',
    edit: '<path d="m4 16 12-12 4 4L8 20l-5 1ZM13 7l4 4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
  };
  add(`<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</g>`);
}
function button(x, y, width, label, { primary = false, height = 48, size = 16, arrow = false } = {}) {
  rect(x, y, width, height, primary ? C.ink : 'white', height / 2, primary ? '' : C.line);
  text(x + (arrow ? 24 : width / 2), y + height / 2 + size * .35, label, size, 600, primary ? 'white' : C.ink, arrow ? '' : 'text-anchor="middle"');
  if (arrow) icon('arrow', x + width - 42, y + (height - 20) / 2, 20, primary ? 'white' : C.ink);
}
function photo(name, x, y, width, height, radius = 8) {
  const id = `photo-${++imageId}`;
  add(`<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/></clipPath></defs><image href="data:image/jpeg;base64,${photos[name]}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`);
}
function header(mobile = false) {
  const x = mobile ? 16 : 112;
  text(x, 40, 'Family Cookbook', 20, 800, C.ink, 'letter-spacing="-.45"');
  if (mobile) { icon('menu', 346, 20, 24); return; }
  text(916, 39, 'Cookbook', 15, 600); rule(916, 49, 71, C.accent);
  text(1027, 39, 'Assistant', 15, 500, C.muted);
  text(1130, 39, 'Shopping', 15, 500, C.muted);
  add(`<circle cx="1308" cy="32" r="20" fill="${C.surface}"/>`);
  text(1308, 38, 'A', 15, 600, C.ink, 'text-anchor="middle"');
}
function search(x, y, width) {
  rect(x, y, width, 44, 'white', 6, C.line);
  icon('search', x + 14, y + 12, 20, C.muted);
  text(x + 45, y + 28, 'Find a recipe', 16, 400, C.muted);
}
function tabs(x, y, width) {
  text(x, y, 'All recipes', 15, 600); text(x + 120, y, 'Favorites', 15, 400, C.muted); text(x + 226, y, 'Drafts', 15, 400, C.muted);
  rule(x, y + 17, width); rule(x, y + 17, 75, C.accent);
}
const records = [
  { name: 'Shakshuka', photo: 'shakshuka', time: '25', summary: ['Eggs poached in a spiced pepper and tomato sauce,', 'eaten straight from the pan.'] },
  { name: 'Greek salad', photo: 'greek-salad', time: '10', summary: ['Crisp cucumber, ripe tomatoes and a slab of feta,', 'dressed right in the bowl.'] },
  { name: 'Tomato soup', photo: 'tomato-soup', time: '30', summary: ['Silky tomato soup from the store cupboard,', 'finished with cream and toasted seeds.'] },
  { name: 'Family pancakes', time: null, summary: ['Flour, eggs, milk and salt.'] },
];
function bookRow(record, y, mobile = false) {
  if (mobile) {
    if (record.photo) photo(record.photo, 16, y + 22, 88, 66, 6);
    else { icon('file', 20, y + 28, 22, C.muted); text(16, y + 75, 'Text recipe', 12, 400, C.muted); }
    text(120, y + 39, record.name, 18, 600, C.ink, 'letter-spacing="-.3"');
    text(120, y + 67, record.time ? `${record.time} min · Original text` : 'Time not specified', 14, 400, C.muted);
    text(120, y + 93, record.time ? 'Demo recipe' : 'Original text · Demo recipe', 13, 400, C.muted);
    rule(16, y + 124, 358);
    return;
  }
  if (record.photo) photo(record.photo, 112, y + 20, 144, 108, 6);
  else { icon('file', 114, y + 43, 24, C.muted); text(112, y + 94, 'Text recipe', 14, 400, C.muted); }
  text(288, y + 48, record.name, 20, 600, C.ink, 'letter-spacing="-.4"');
  lines(288, y + 79, record.summary, 16, 24);
  text(1040, y + 58, 'Original text', 14, 500, C.muted);
  text(1040, y + 84, 'Demo recipe', 13, 400, C.muted);
  if (record.time) { text(1328, y + 58, record.time, 30, 700, C.ink, 'text-anchor="end" letter-spacing="-1"'); text(1328, y + 84, 'min', 14, 400, C.muted, 'text-anchor="end"'); }
  else { lines(1240, y + 58, ['Time not', 'specified'], 14, 21); }
  rule(112, y + 148, 1216);
}
function footer(y, mobile = false) {
  const x = mobile ? 16 : 112, width = mobile ? 358 : 1216;
  rule(x, y, width);
  if (mobile) lines(x, y + 29, ['Demo content. Photo credits in the design brief.', 'Static mockup · Family Cookbook is a working name.'], 11, 18);
  else text(x, y + 32, 'Demo content · Food photos from Unsplash, credited in the design brief. Family Cookbook is a working name.', 12, 400, C.muted);
}
function bookDesktop() {
  header();
  text(112, 274, 'Our cookbook', 44, 700, C.ink, 'letter-spacing="-1.3"');
  lines(112, 317, ["Your household's recipes,", 'with their originals kept alongside.'], 18, 28);
  button(112, 390, 177, 'Add recipe', { primary: true, arrow: true });
  photo('shakshuka', 640, 112, 688, 516);
  text(640, 669, 'Shakshuka', 24, 600, C.ink, 'letter-spacing="-.5"');
  text(640, 697, 'Demo recipe · 25 min', 15, 400, C.muted);
  text(1185, 671, 'Read recipe', 16, 600); icon('arrow', 1306, 654, 22);
  search(1008, 724, 320);
  tabs(112, 754, 1216);
  records.forEach((r, i) => bookRow(r, 790 + i * 148));
  footer(1440);
}
function bookMobile() {
  header(true);
  text(16, 125, 'Our cookbook', 36, 700, C.ink, 'letter-spacing="-1.05"');
  lines(16, 166, ["Your household's recipes,", 'with their originals kept alongside.'], 17, 26);
  button(16, 220, 168, 'Add recipe', { primary: true, arrow: true, height: 44, size: 15 });
  photo('shakshuka', 16, 296, 358, 268.5);
  text(16, 601, 'Shakshuka', 24, 600, C.ink, 'letter-spacing="-.5"');
  text(16, 628, 'Demo recipe · 25 min', 15, 400, C.muted); icon('arrow', 350, 582, 22);
  search(16, 674, 358);
  tabs(16, 759, 358);
  records.forEach((r, i) => bookRow(r, 790 + i * 124, true));
  footer(1346, true);
}
const ingredients = [['2 tbsp', 'olive oil'], ['1', 'onion'], ['1', 'red pepper'], ['2 cloves', 'garlic'], ['1 tsp', 'ground cumin'], ['1 tsp', 'sweet paprika'], ['400 g', 'chopped tomatoes'], ['4', 'eggs'], ['a handful', 'parsley'], ['to serve', 'crusty bread']];
function servings(x, y, mobile = false) {
  text(x, y + 28, 'Serves', mobile ? 13 : 15, 400, C.muted);
  const start = x + (mobile ? 48 : 64), size = 44;
  add(`<circle cx="${start + size / 2}" cy="${y + 22}" r="${size / 2}" fill="${C.surface}"/>`);
  icon('minus', start + (size - 20) / 2, y + 12, 20);
  text(start + size + (mobile ? 17 : 24), y + 29, '2', 20, 600, C.ink, 'text-anchor="middle"');
  const end = start + size + (mobile ? 34 : 48);
  add(`<circle cx="${end + size / 2}" cy="${y + 22}" r="${size / 2}" fill="${C.surface}"/>`);
  icon('plus', end + (size - 20) / 2, y + 12, 20);
}
function ingredientRows(x, y, width) {
  ingredients.forEach(([amount, name], i) => {
    const top = y + i * 48;
    rule(x, top, width);
    text(x, top + 30, amount, 16, 600);
    text(x + 118, top + 30, name, 17);
  });
  rule(x, y + ingredients.length * 48, width);
}
function step(x, y, number, content, mobile = false) {
  const diameter = mobile ? 36 : 44, indent = mobile ? 52 : 68;
  add(`<circle cx="${x + diameter / 2}" cy="${y + 21}" r="${diameter / 2 - .5}" fill="white" stroke="${C.line}"/>`);
  text(x + diameter / 2, y + 27, number, mobile ? 16 : 18, 500, C.muted, 'text-anchor="middle"');
  lines(x + indent, y + 26, content, 18, 29, 400, C.ink);
}
function sourceBlock(x, y, width, mobile = false) {
  rule(x, y, width);
  icon('file', x, y + 29, 22, C.muted);
  text(x + 36, y + 40, 'Original text', 17, 600);
  text(x + 36, y + 66, 'Demo recipe · Entered manually', mobile ? 13 : 14, 400, C.muted);
  if (mobile) { text(x + 36, y + 103, 'View original', 15, 600, C.accent); icon('arrow', x + 148, y + 87, 20, C.accent); }
  else { text(x + width - 136, y + 51, 'View original', 15, 600, C.accent); icon('arrow', x + width - 24, y + 35, 20, C.accent); }
}
function recipeDesktop() {
  header(); icon('back', 112, 101, 18, C.muted); text(139, 116, 'Cookbook', 15, 500, C.muted);
  text(112, 275, 'Shakshuka', 48, 700, C.ink, 'letter-spacing="-1.44"');
  lines(112, 321, ['Eggs poached in a spiced pepper and tomato sauce,', 'eaten straight from the pan.'], 17, 27);
  text(112, 387, 'Demo recipe · Added by Alex', 14, 400, C.muted);
  text(112, 445, '25 min', 28, 700, C.ink, 'letter-spacing="-.7"');
  text(241, 443, 'Prep 5 min · Cook 20 min', 15, 400, C.muted);
  button(112, 480, 180, 'Start cooking', { primary: true });
  button(308, 480, 196, 'Add ingredients');
  icon('edit', 112, 558, 19, C.muted); text(141, 574, 'Edit recipe', 15, 500, C.muted);
  icon('bookmark', 267, 558, 19, C.muted); text(295, 574, 'Favorite', 15, 500, C.muted);
  photo('shakshuka', 640, 144, 688, 516);
  text(640, 684, 'Demo photo by Alex Bayev on Unsplash', 13, 400, C.muted);
  text(112, 784, 'Ingredients', 24, 600, C.ink, 'letter-spacing="-.6"');
  servings(288, 755);
  ingredientRows(112, 818, 373);
  text(533, 784, 'Method', 24, 600, C.ink, 'letter-spacing="-.6"');
  step(533, 814, 1, ['Slice the onion and pepper and chop the garlic.']);
  step(533, 910, 2, ['Soften the onion and pepper in the oil over medium heat.']);
  step(533, 1006, 3, ['Stir in the garlic, cumin and paprika for a minute, then add', 'the tomatoes and simmer until thick.']);
  step(533, 1131, 4, ['Make four hollows, crack in the eggs, cover and cook', 'until the whites are set.']);
  step(533, 1256, 5, ['Scatter with parsley and serve with bread.']);
  text(601, 1361, 'Ask about this recipe', 16, 600, C.accent); icon('arrow', 784, 1345, 20, C.accent);
  sourceBlock(112, 1432, 1216);
  footer(1570);
}
function recipeMobile() {
  header(true); icon('back', 16, 88, 18, C.muted); text(43, 103, 'Cookbook', 15, 500, C.muted);
  text(16, 166, 'Shakshuka', 36, 700, C.ink, 'letter-spacing="-1.08"');
  lines(16, 205, ['Eggs poached in a spiced pepper and', 'tomato sauce, eaten straight from the pan.'], 17, 26);
  text(16, 266, 'Demo recipe · Added by Alex', 14, 400, C.muted);
  text(16, 314, '25 min', 26, 700, C.ink, 'letter-spacing="-.7"');
  text(129, 312, 'Prep 5 min · Cook 20 min', 14, 400, C.muted);
  photo('shakshuka', 16, 344, 358, 268.5);
  text(16, 637, 'Demo photo by Alex Bayev on Unsplash', 12, 400, C.muted);
  button(16, 665, 166, 'Start cooking', { primary: true, height: 44, size: 15 });
  button(198, 665, 176, 'Add ingredients', { height: 44, size: 15 });
  icon('edit', 17, 740, 18, C.muted); text(44, 755, 'Edit recipe', 14, 500, C.muted);
  icon('bookmark', 192, 740, 18, C.muted); text(219, 755, 'Favorite', 14, 500, C.muted);
  text(16, 827, 'Ingredients', 24, 600, C.ink, 'letter-spacing="-.6"');
  servings(190, 798, true);
  ingredientRows(16, 861, 358);
  text(16, 1412, 'Method', 24, 600, C.ink, 'letter-spacing="-.6"');
  step(16, 1445, 1, ['Slice the onion and pepper', 'and chop the garlic.'], true);
  step(16, 1558, 2, ['Soften the onion and pepper', 'in the oil over medium heat.'], true);
  step(16, 1671, 3, ['Stir in the garlic, cumin and', 'paprika for a minute, then add', 'the tomatoes and simmer', 'until thick.'], true);
  step(16, 1842, 4, ['Make four hollows, crack in', 'the eggs, cover and cook', 'until the whites are set.'], true);
  step(16, 1984, 5, ['Scatter with parsley and', 'serve with bread.'], true);
  text(68, 2121, 'Ask about this recipe', 15, 600, C.accent); icon('arrow', 240, 2105, 19, C.accent);
  sourceBlock(16, 2182, 358, true);
  footer(2340, true);
}
const boards = [
  { name: 'desktop-cookbook', width: 1440, height: 1510, fold: 900, draw: bookDesktop },
  { name: 'desktop-recipe', width: 1440, height: 1640, fold: 900, draw: recipeDesktop },
  { name: 'mobile-cookbook', width: 390, height: 1416, fold: 844, draw: bookMobile },
  { name: 'mobile-recipe', width: 390, height: 2410, fold: 844, draw: recipeMobile },
];
async function main() {
  const requested = process.argv.slice(2);
  const captureBoards = require('./capture-artboards.cjs')({ fs, path, root, add, text, lines, rule, rect, icon, button, header, C });
  for (const board of [...boards, ...captureBoards].filter(board => !requested.length || requested.includes(board.name))) {
    parts = []; imageId = 0;
    board.draw();
    const body = parts.join('\n');
    const svg = height => `<svg xmlns="http://www.w3.org/2000/svg" width="${board.width}" height="${height}" viewBox="0 0 ${board.width} ${height}"><title>${board.name} - static design study</title><style>@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%}</style><rect width="100%" height="100%" fill="white"/>${body}</svg>`;
    fs.writeFileSync(path.join(root, `${board.name}.svg`), svg(board.height));
    const density = board.width < 500 ? 144 : 72;
    await sharp(Buffer.from(svg(board.height)), { density }).png().toFile(path.join(root, `${board.name}.png`));
    await sharp(Buffer.from(svg(board.fold)), { density }).png().toFile(path.join(root, `${board.name}-fold.png`));
    console.log(`${board.name}: ${board.width} x ${board.height}, ${density / 72}x raster export`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
