// Static capture/review artwork, using the same drawing primitives as the reading studies.
module.exports = function captureArtboards(h) {
  const { fs, path, root, add, text, lines, rule, rect, icon, button, header, C } = h;
  const warning = '#855119';
  const sourceImages = [1, 2].map(index => fs.readFileSync(path.join(root, `assets/sample-page-0${index}.png`)).toString('base64'));
  function page(index, x, y, width) {
    add(`<image href="data:image/png;base64,${sourceImages[index]}" x="${x}" y="${y}" width="${width}" height="${width * 760 / 600}"/>`);
  }
  function link(x, y, label, size = 15, color = C.accent) { text(x, y, label, size, 600, color); }
  function heading(title, subtitle, mobile = false, review = false) {
    header(mobile);
    const x = mobile ? 16 : 112;
    icon('back', x, mobile ? 88 : 101, 18, C.muted);
    text(x + 27, mobile ? 103 : 116, review ? 'Cookbook' : 'Add recipe', 15, 500, C.muted);
    text(x, mobile ? 166 : 192, title, mobile ? 36 : 48, 700, C.ink, 'letter-spacing="-1.1"');
    lines(x, mobile ? 205 : 236, subtitle, 17, 26);
  }
  function footer(y, mobile = false) {
    const x = mobile ? 16 : 112;
    rule(x, y, mobile ? 358 : 1216);
    text(x, y + 29, 'Synthetic demo · Static design study', 12, 400, C.muted);
  }
  function input(x, y, width, value, { height = 48, muted = false, issue = false, size = 17 } = {}) {
    rect(x, y, width, height, 'white', 6, issue ? warning : C.line);
    text(x + 14, y + 30, value, size, 400, muted ? C.muted : C.ink);
  }
  function field(x, y, width, label, value, options = {}) {
    text(x, y, label, 14, 600); input(x, y + 15, width, value, options);
  }
  function removeControl(x, y) {
    add(`<g transform="translate(${x + 13} ${y + 15})" fill="none" stroke="${C.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h14M6 4V1h6v3M4 4l1 13h8l1-13M7 7v7M11 7v7"/></g>`);
  }
  function selectedRow(index, x, y, width, mobile = false) {
    const thumb = mobile ? 56 : 72, bodyX = x + (mobile ? 76 : 100);
    rect(x, y, thumb, thumb * 760 / 600, 'white', 0, C.line); page(index, x + 1, y + 1, thumb - 2);
    text(bodyX, y + 23, `Photo ${index + 1}`, 17, 600);
    text(bodyX, y + 49, `sample-page-0${index + 1}.png`, mobile ? 13 : 14, 400, C.muted);
    link(bodyX, y + 88, index ? 'Move up' : 'Move down', 14, C.muted);
    link(x + width - 58, y + 88, 'Remove', 14, C.muted);
    rule(x, y + 111, width);
  }
  function addDesktop() {
    heading('Add photos', ['One recipe, up to 5 photos. Keep every page readable.']);
    rect(112, 296, 592, 590, C.surface, 8);
    page(0, 201, 320, 414);
    text(112, 922, 'Photo 1 of 2', 15, 600);
    link(584, 922, 'Open original');
    text(112, 953, 'Preview the complete page before uploading.', 15, 400, C.muted);
    text(768, 326, 'Selected photos', 24, 600, C.ink, 'letter-spacing="-.5"');
    text(768, 355, '2 of 5 photos · Not uploaded', 15, 400, C.muted);
    selectedRow(0, 768, 382, 560); selectedRow(1, 768, 518, 560);
    button(768, 674, 190, 'Choose photos');
    link(990, 704, 'Enter manually', 16);
    text(768, 758, 'Uses 2 image pages. You review the draft before saving.', 15, 400, C.muted);
    text(768, 790, 'Keep this page open until the upload finishes.', 15, 400, C.muted);
    button(768, 828, 268, 'Upload & transcribe', { primary: true, arrow: true });
    footer(1000);
  }
  function addMobile() {
    heading('Add photos', ['One recipe, up to 5 photos.', 'Keep every page readable.'], true);
    button(16, 263, 174, 'Choose photos', { height: 44, size: 15 });
    button(206, 263, 168, 'Take photo', { height: 44, size: 15 });
    text(16, 351, '2 of 5 photos · Not uploaded', 15, 400, C.muted);
    selectedRow(0, 16, 376, 358, true); selectedRow(1, 16, 512, 358, true);
    text(16, 660, 'Uses 2 image pages.', 15, 400, C.muted);
    text(16, 684, 'You review the draft before saving.', 15, 400, C.muted);
    lines(16, 714, ['Keep this page open until upload finishes.', 'Then processing can finish after you leave.'], 14, 23);
    button(16, 764, 358, 'Upload & transcribe', { primary: true, height: 48, arrow: true });
    text(16, 872, 'Photo 1 of 2', 15, 600); link(258, 872, 'Open original', 14);
    rect(16, 896, 358, 408, C.surface, 8); page(0, 50, 916, 290);
    link(16, 1348, 'Enter manually');
    footer(1395, true);
  }
  function reviewHeader(mobile = false) {
    heading('Review recipe', mobile ? ['Check every field against the original,', 'including fields without a warning.'] : ['Check every field against the original, including fields without a warning.'], mobile, true);
    text(mobile ? 16 : 112, mobile ? 267 : 273, 'AI draft · Not yet in your cookbook', 14, 500, C.muted);
  }
  function mobileTabs(source = false) {
    text(16, 317, 'Source', 16, source ? 600 : 400, source ? C.ink : C.muted);
    text(135, 317, 'Draft', 16, source ? 400 : 600, source ? C.muted : C.ink);
    rule(16, 335, 358); rule(source ? 16 : 135, 335, source ? 57 : 42, C.accent);
    text(291, 317, '2 photos', 14, 400, C.muted);
  }
  function sourceControls(x, y, mobile = false) {
    text(x, y, 'Photo 1 of 2', 15, 600);
    const nextX = x + (mobile ? 206 : 384);
    link(nextX, y, 'Next photo', 14); icon('arrow', nextX + 94, y - 16, 18, C.accent);
  }
  function ingredients(x, y, mobile = false) {
    const amountWidth = mobile ? 126 : 154, gap = 12, nameWidth = mobile ? 176 : 414;
    text(x, y, 'Ingredients', 24, 600, C.ink, 'letter-spacing="-.5"');
    text(x, y + 38, 'Amount', 13, 600, C.muted); text(x + amountWidth + gap, y + 38, 'Ingredient', 13, 600, C.muted);
    [['2½ cups', 'flour'], ['2', 'eggs'], ['250 ml', 'milk'], ['Not specified', 'salt']].forEach(([amount, ingredient], i) => {
      const rowY = y + 52 + i * 60;
      input(x, rowY, amountWidth, amount, { size: mobile ? 15 : 16, issue: i === 3, muted: i === 3 });
      input(x + amountWidth + gap, rowY, nameWidth, ingredient);
      removeControl(x + amountWidth + gap + nameWidth, rowY);
    });
    const message = mobile ? ['Salt amount is missing in the original.', 'Keep it unknown or correct it.'] : ['Salt amount is missing in the original. Keep it unknown or correct it.'];
    lines(x, y + 307, message, 14, 23, 400, warning);
    link(x, y + (mobile ? 370 : 354), 'Add ingredient', 15);
  }
  function method(x, y, width, mobile = false) {
    text(x, y, 'Method', 24, 600, C.ink, 'letter-spacing="-.5"');
    text(x, y + 30, 'Check against photo 2.', 14, 400, C.muted);
    ['Mix the ingredients.', 'Cook in a pan.'].forEach((value, i) => {
      const top = y + 50 + i * 84;
      text(x, top + 31, i + 1, 17, 600, C.muted);
      input(x + 30, top, width - 74, value, { height: 64, size: mobile ? 16 : 17 });
      removeControl(x + width - 44, top + 8);
    });
    link(x + 30, y + 238, 'Add step');
  }
  function reviewDesktop() {
    reviewHeader();
    text(112, 337, 'Original', 24, 600, C.ink, 'letter-spacing="-.5"');
    link(528, 337, 'Open original');
    rect(112, 364, 536, 666, C.surface, 8); page(0, 132, 384, 496);
    sourceControls(112, 1068);
    text(112, 1110, 'Uploaded by Alex · Synthetic demo', 14, 400, C.muted);
    lines(112, 1141, ['Editing the recipe does not change these originals.'], 14, 23);
    field(704, 337, 624, 'Recipe title', 'Family pancakes');
    field(704, 441, 392, 'Recipe by', 'Anna');
    field(1120, 441, 208, 'Servings', 'Not specified', { muted: true });
    text(704, 527, 'Servings are absent from the original. Portion scaling stays off.', 14, 400, C.muted);
    field(704, 575, 624, 'Family note (optional)', 'Add a note', { height: 72, muted: true });
    ingredients(704, 718);
    method(704, 1132, 624);
    rule(112, 1414, 1216);
    text(112, 1454, 'Last edited by Alex · Synthetic demo', 14, 400, C.muted);
    text(112, 1483, 'Saving makes this recipe available to your household.', 15, 400, C.muted);
    button(1132, 1441, 196, 'Save recipe', { primary: true });
    footer(1540);
  }
  function reviewMobile() {
    reviewHeader(true); mobileTabs();
    field(16, 379, 358, 'Recipe title', 'Family pancakes');
    field(16, 481, 358, 'Recipe by', 'Anna');
    field(16, 583, 358, 'Servings', 'Not specified', { muted: true });
    lines(16, 669, ['Servings are absent from the original.', 'Portion scaling stays off.'], 14, 23);
    field(16, 746, 358, 'Family note (optional)', 'Add a note', { height: 72, muted: true });
    ingredients(16, 900, true);
    method(16, 1332, 358, true);
    rule(16, 1623, 358);
    text(16, 1657, 'Last edited by Alex · Synthetic demo', 13, 400, C.muted);
    lines(16, 1694, ['Saving makes this recipe available', 'to your household.'], 15, 24);
    button(16, 1746, 358, 'Save recipe', { primary: true });
    footer(1830, true);
  }
  function reviewSourceMobile() {
    reviewHeader(true); mobileTabs(true);
    sourceControls(16, 381, true);
    rect(16, 406, 358, 445, C.surface, 8); page(0, 32, 422, 326);
    link(16, 893, 'Open original', 15);
    text(16, 935, 'Uploaded by Alex · Synthetic demo', 13, 400, C.muted);
    lines(16, 971, ['Editing the recipe does not change', 'these originals.'], 15, 24);
    button(16, 1032, 358, 'Back to draft', { height: 48 });
    footer(1120, true);
  }
  return [
    { name: 'desktop-add-photos', width: 1440, height: 1070, fold: 900, draw: addDesktop },
    { name: 'mobile-add-photos', width: 390, height: 1465, fold: 844, draw: addMobile },
    { name: 'desktop-review', width: 1440, height: 1610, fold: 900, draw: reviewDesktop },
    { name: 'mobile-review', width: 390, height: 1900, fold: 844, draw: reviewMobile },
    { name: 'mobile-review-source', width: 390, height: 1190, fold: 844, draw: reviewSourceMobile },
  ];
};
