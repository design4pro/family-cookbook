// Static iPad artwork. These drawing instructions do not implement application UI.
module.exports = function iPadArtboards(h) {
  const { t, ui, lines, rect, rule, icon, photo, source, button, circleButton, padStatus, padTabs, home, C } = h;
  const warning = '#855119';
  const width = 1194;
  const height = 834;

  function input(x, y, w, value, { muted = false, issue = false, height: inputHeight = 44 } = {}) {
    rect(x, y, w, inputHeight, 'white', 8, issue ? warning : C.line);
    t(x + 12, y + inputHeight / 2 + 6, value, 17, 400, muted ? C.muted : C.ink);
  }

  function field(x, y, w, label, value, options = {}) {
    ui(x, y, label, 13, 500, C.muted);
    input(x, y + 12, w, value, options);
  }

  function textAction(x, y, w, label, symbol, { color = C.accent, variant = 'accent' } = {}) {
    // A transparent 44pt region records the intended target without adding a card.
    rect(x, y, w, 44, 'transparent');
    if (symbol) icon(symbol, x + 8, y + 11, 22, variant);
    ui(x + (symbol ? 38 : 12), y + 28, label, 17, 500, color);
  }

  function remove(x, y) {
    rect(x, y, 44, 44, 'transparent');
    icon('trash', x + 12, y + 11, 21, 'muted');
  }

  function chrome({ modal = false, review = false, recipe = false } = {}) {
    padStatus();
    if (modal) {
      circleButton('xmark', 32, 42);
      ui(88, 70, 'Cancel', 17, 400, C.ink);
      ui(597, 70, review ? 'Review recipe' : 'Add photos', 17, 600, C.ink, 'text-anchor="middle"');
      if (review) button(1008, 42, 154, 'Save recipe', { material: true });
    } else {
      padTabs();
      if (recipe) {
        circleButton('chevron.left', 32, 42);
        ui(88, 70, 'Cookbook', 17, 400, C.ink);
      } else {
        ui(32, 70, 'Family Cookbook', 17, 600, C.ink);
      }
      circleButton('person.crop.circle', 1118, 42);
    }
    home(width, height);
  }

  function cookbook() {
    t(52, 170, 'Our cookbook', 44, 700, C.ink, 'letter-spacing="-1.4"');
    lines(52, 211, ["Your household's recipes,", 'with their originals kept alongside.'], 17, 26);

    rect(52, 272, 430, 44, C.surface, 11);
    icon('magnifyingglass', 66, 284, 20, 'muted');
    ui(98, 300, 'Find a recipe', 17, 400, C.muted);

    // Native segmented filtering is subordinate to the three destination tabs.
    rect(52, 332, 430, 44, C.surface, 10);
    rect(55, 335, 140, 38, 'white', 8);
    ui(125, 360, 'All recipes', 17, 600, C.ink, 'text-anchor="middle"');
    ui(267, 360, 'Favorites', 17, 400, C.muted, 'text-anchor="middle"');
    ui(410, 360, 'Drafts', 17, 400, C.muted, 'text-anchor="middle"');

    [
      { title: 'Greek salad', image: 'greek-salad', time: '10 min', y: 411 },
      { title: 'Tomato soup', image: 'tomato-soup', time: '30 min', y: 555 },
    ].forEach(record => {
      photo(record.image, 52, record.y, 116, 87, 8);
      t(188, record.y + 28, record.title, 23, 600, C.ink, 'letter-spacing="-.45"');
      t(188, record.y + 60, `${record.time} · Original text`, 17, 400, C.muted);
      ui(188, record.y + 85, 'Demo recipe', 13, 400, C.muted);
      icon('chevron.right', 455, record.y + 34, 19, 'muted');
      rule(52, record.y + 114, 430);
    });
    button(52, 719, 170, 'Add recipe');

    photo('shakshuka', 530, 128, 612, 459, 8);
    t(530, 629, 'Shakshuka', 29, 600, C.ink, 'letter-spacing="-.65"');
    t(530, 662, 'Demo recipe · 25 min', 17, 400, C.muted);
    textAction(983, 604, 159, 'Read recipe', 'arrow.right');
    ui(530, 704, 'Demo photo · Alex Bayev / Unsplash', 13, 400, C.muted);
    ui(530, 733, 'Family Cookbook is a working name.', 13, 400, C.muted);
  }

  function selectedPhoto(index, y) {
    source(index, 582, y, 72);
    t(678, y + 24, `Photo ${index + 1}`, 20, 600);
    ui(678, y + 51, `sample-page-0${index + 1}.png`, 13, 400, C.muted);
    textAction(670, y + 62, 174, index ? 'Move up' : 'Move down', index ? 'arrow.up' : 'arrow.down', { color: C.muted, variant: 'muted' });
    textAction(1018, y + 62, 124, 'Remove', 'trash', { color: C.muted, variant: 'muted' });
    rule(582, y + 119, 560);
  }

  function addPhotos() {
    t(52, 149, 'One recipe, up to 5 photos.', 26, 600, C.ink, 'letter-spacing="-.5"');
    rect(52, 177, 482, 526, C.surface, 8);
    source(0, 101, 197, 384);
    ui(52, 742, 'Photo 1 of 2', 17, 600, C.ink);
    textAction(237, 714, 146, 'Next photo', 'chevron.right');
    textAction(391, 714, 143, 'Open original');
    t(52, 781, 'Preview the complete page before uploading.', 17, 400, C.muted);

    t(582, 149, 'Selected photos', 26, 600, C.ink, 'letter-spacing="-.5"');
    t(582, 183, '2 of 5 photos · Not uploaded', 17, 400, C.muted);
    selectedPhoto(0, 215);
    selectedPhoto(1, 365);

    button(582, 530, 160, 'Take photo', { tone: 'plain' });
    button(754, 530, 190, 'Choose photos', { tone: 'plain' });
    button(956, 530, 186, 'Enter manually', { tone: 'plain' });
    t(582, 622, 'Uses 2 image pages.', 17, 600);
    t(582, 650, 'You review the draft before saving.', 17, 400, C.muted);
    lines(582, 691, ['Keep this screen open until upload finishes.', 'Then processing can finish after you leave.'], 17, 26);
    button(582, 746, 560, 'Upload & transcribe');
  }

  function review() {
    t(32, 140, 'Original', 24, 600, C.ink, 'letter-spacing="-.45"');
    textAction(246, 118, 140, 'Open original');
    rect(32, 166, 354, 450, C.surface, 8);
    source(0, 42, 177, 334);
    ui(32, 650, 'Photo 1 of 2', 17, 600, C.ink);
    textAction(238, 622, 148, 'Next photo', 'chevron.right');
    t(32, 693, 'Uploaded by Alex', 17, 500);
    ui(32, 718, 'Synthetic demo', 13, 400, C.muted);
    lines(32, 751, ['Editing the recipe does not change', 'these originals.'], 17, 26);

    t(424, 133, 'AI draft · Not yet in your cookbook', 17, 600, C.ink);
    t(424, 159, 'Check every field, including fields without a warning.', 17, 400, C.muted);
    field(424, 186, 738, 'Recipe title', 'Family pancakes');
    field(424, 266, 286, 'Recipe by', 'Anna');
    field(730, 266, 184, 'Servings', 'Not specified', { muted: true });
    field(934, 266, 228, 'Family note (optional)', 'Add a note', { muted: true });

    t(424, 366, 'Ingredients', 24, 600, C.ink, 'letter-spacing="-.45"');
    ui(424, 397, 'Amount', 13, 500, C.muted);
    ui(577, 397, 'Ingredient', 13, 500, C.muted);
    [['2½ cups', 'flour'], ['2', 'eggs'], ['250 ml', 'milk'], ['Not specified', 'salt']].forEach(([amount, ingredient], index) => {
      const y = 409 + index * 54;
      input(424, y, 143, amount, { muted: index === 3, issue: index === 3 });
      input(577, y, 161, ingredient);
      remove(740, y);
    });
    lines(424, 642, ['Salt amount is missing in the original.', 'Keep it unknown or correct it.'], 17, 25, 400, warning);
    textAction(416, 679, 196, 'Add ingredient', 'plus');

    t(824, 366, 'Method', 24, 600, C.ink, 'letter-spacing="-.45"');
    t(824, 397, 'Check against photo 2.', 17, 400, C.muted);
    ['Mix the ingredients.', 'Cook in a pan.'].forEach((value, index) => {
      const y = 419 + index * 90;
      ui(824, y + 38, index + 1, 17, 600, C.muted);
      input(850, y, 268, value, { height: 64 });
      remove(1118, y + 10);
    });
    textAction(842, 591, 154, 'Add step', 'plus');
    lines(824, 671, ['Servings are not specified.', 'Portion scaling stays off.'], 17, 26);

    rule(424, 745, 738);
    ui(424, 766, 'Last edited by Alex · Synthetic demo', 13, 400, C.muted);
    t(424, 789, 'Saving makes this recipe available to your household.', 17, 400, C.muted);
  }

  function recipe() {
    t(52, 169, 'Family pancakes', 44, 700, C.ink, 'letter-spacing="-1.3"');
    t(52, 208, 'Recipe by Anna', 20, 500);
    ui(52, 239, 'Uploaded by Alex · Last edited by Alex · Synthetic demo', 13, 400, C.muted);

    button(52, 274, 184, 'Start cooking');
    button(252, 274, 196, 'Add ingredients', { tone: 'plain' });
    button(464, 274, 234, 'Ask about this recipe', { tone: 'plain' });
    textAction(779, 274, 84, 'Edit', 'square.and.pencil');
    textAction(866, 274, 126, 'Favorite', 'bookmark');
    textAction(995, 274, 147, 'Download', 'square.and.arrow.down');
    t(52, 348, 'Review the proposed shopping additions before confirming.', 17, 400, C.muted);

    t(52, 410, 'Ingredients', 26, 600, C.ink, 'letter-spacing="-.5"');
    t(52, 446, 'Servings not specified', 17, 500);
    t(52, 473, 'Portion scaling is off.', 17, 400, C.muted);
    [['2½ cups', 'flour'], ['2', 'eggs'], ['250 ml', 'milk'], ['Not specified', 'salt']].forEach(([amount, ingredient], index) => {
      const y = 497 + index * 49;
      rule(52, y, 430);
      t(52, y + 31, amount, 17, index === 3 ? 400 : 600, index === 3 ? C.muted : C.ink);
      t(224, y + 31, ingredient, 17);
    });
    rule(52, 693, 430);
    t(52, 731, 'No family note added.', 17, 400, C.muted);

    t(550, 410, 'Method', 26, 600, C.ink, 'letter-spacing="-.5"');
    ['Mix the ingredients.', 'Cook in a pan.'].forEach((value, index) => {
      const y = 445 + index * 70;
      ui(550, y + 27, `${index + 1}.`, 17, 600, C.muted);
      t(588, y + 27, value, 20, 400, C.ink);
    });

    rule(550, 602, 592);
    t(550, 639, 'Original photos', 24, 600, C.ink, 'letter-spacing="-.4"');
    source(0, 550, 660, 64);
    source(1, 634, 660, 64);
    t(726, 684, '2 original photos', 17, 500);
    textAction(714, 699, 184, 'View originals', 'doc.text');
    t(550, 779, 'Your original pages stay unchanged.', 17, 400, C.muted);
  }

  return [
    { name: 'ipad-01-cookbook', width, height, content: cookbook, chrome: () => chrome() },
    { name: 'ipad-02-add-photos', width, height, content: addPhotos, chrome: () => chrome({ modal: true }) },
    { name: 'ipad-03-review', width, height, content: review, chrome: () => chrome({ modal: true, review: true }) },
    { name: 'ipad-04-recipe', width, height, content: recipe, chrome: () => chrome({ recipe: true }) },
  ];
};
