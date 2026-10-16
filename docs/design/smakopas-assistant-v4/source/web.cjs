// Static web design artboards. These drawing instructions are not application UI.
module.exports = function webArtboards(h) {
  const { C, add, rect, rule, text, lines, target, icon, button } = h;
  const desktop = { x: 112, width: 1216 };
  const mobile = { x: 16, width: 358 };

  function header(isMobile = false) {
    const x = isMobile ? 16 : 112;
    text(x, 40, 'Family Cookbook', 20, 800, C.ink, 'letter-spacing="-.45"');
    target(x, 10, 206, 44, 'Open Cookbook');
    if (isMobile) {
      icon('menu', 346, 20, 24);
      target(336, 10, 44, 44, 'Open navigation');
      return;
    }
    text(916, 39, 'Cookbook', 15, 500, C.muted);
    text(1027, 39, 'Assistant', 15, 600);
    text(1130, 39, 'Shopping', 15, 500, C.muted);
    rule(1027, 49, 68, C.accent);
    target(906, 10, 91, 44, 'Open Cookbook');
    target(1017, 10, 86, 44, 'Open Assistant');
    target(1120, 10, 91, 44, 'Open Shopping');
    add(`<circle cx="1308" cy="32" r="20" fill="${C.surface}"/>`);
    text(1308, 38, 'A', 15, 600, C.ink, 'text-anchor="middle"');
    target(1286, 10, 44, 44, 'Open account');
  }

  function footer(y, isMobile = false) {
    const { x, width } = isMobile ? mobile : desktop;
    rule(x, y, width);
    if (isMobile) {
      lines(x, y + 24, ['Synthetic assistant demo · Static design', 'Family Cookbook is a working name.'], 11, 18, C.muted);
    } else {
      text(x, y + 27, 'Synthetic assistant demo · Static design · Family Cookbook is a working name.', 12, 400, C.muted);
    }
  }

  function textAction(x, y, width, label, arrow = false) {
    text(x, y + 28, label, 14, 600, C.accent);
    if (arrow) icon('arrow', x + width - 20, y + 13, 18, C.accent);
    target(x, y, width, 44, label);
  }

  function scope(y, recipe = false, isMobile = false) {
    const x = isMobile ? 16 : 112;
    const label = recipe ? 'Family pancakes' : 'Whole cookbook';
    text(x, y + 28, 'In', 14, 400, C.muted);
    const selectorX = x + 28, width = recipe ? 206 : 202;
    rect(selectorX, y, width, 44, 'white', 22, C.line);
    text(selectorX + 16, y + 28, label, 15, 600);
    icon('down', selectorX + width - 34, y + 13, 18, C.muted);
    target(selectorX, y, width, 44, 'Change conversation scope');
    if (!isMobile) textAction(710, y, 170, 'New conversation');
  }

  function composer(x, y, width, { isMobile = false, height = 112, placeholder = 'Ask about your cookbook…' } = {}) {
    rect(x, y, width, height, 'white', 12, C.line);
    text(x + 18, y + 32, placeholder, isMobile ? 15 : 17, 400, C.muted);
    target(x + 8, y + 6, width - 16, 48, 'Type a question');
    button(x + width - 100, y + height - 56, 84, 'Send', { tone: 'disabled', height: 44 });
    text(x, y + height + 28, 'Not shared with your household.', isMobile ? 13 : 14, 400, C.muted);
  }

  function title(isMobile = false) {
    const x = isMobile ? 16 : 112;
    text(x, isMobile ? 114 : 137, 'Cooking assistant', isMobile ? 33 : 44, 700, C.ink, 'letter-spacing="-1.1"');
    if (!isMobile) text(x, 174, 'Questions, grounded in your cookbook.', 18, 400, C.muted);
  }

  function question(values, y, { isMobile = false, height = 88 } = {}) {
    const x = isMobile ? 44 : 192, width = isMobile ? 330 : 688;
    rect(x, y, width, height, C.surface, 12);
    lines(x + 20, y + 34, values, isMobile ? 19 : 21, 27, C.ink);
  }

  function recipeReference(y = 292) {
    const x = 976, width = 352;
    text(x, y + 7, 'Family pancakes', 27, 600, C.ink, 'letter-spacing="-.6"');
    text(x, y + 38, 'Anna · Saved recipe', 14, 400, C.muted);
    rule(x, y + 63, width);
    text(x, y + 101, 'Ingredients', 21, 600, C.ink, 'letter-spacing="-.3"');
    const ingredients = [['Flour', '2½ cups'], ['Eggs', '2'], ['Milk', '250 ml'], ['Salt', 'Not specified']];
    ingredients.forEach(([name, amount], i) => {
      text(x, y + 140 + i * 39, name, 16, 400);
      text(x + width, y + 140 + i * 39, amount, 16, 500, C.ink, 'text-anchor="end"');
    });
    rule(x, y + 281, width);
    text(x, y + 320, 'Method', 21, 600, C.ink, 'letter-spacing="-.3"');
    text(x, y + 358, '1. Mix the ingredients.', 16, 400);
    text(x, y + 391, '2. Cook in a pan.', 16, 400);
    textAction(x, y + 417, width, '[1] Open saved recipe', true);
    text(x, y + 489, 'Original amounts · Servings not specified', 13, 400, C.muted);
  }

  function sourceLink(y) {
    rule(16, y, 358);
    text(16, y + 34, 'Family pancakes', 18, 600);
    text(16, y + 59, 'Ingredients and method', 14, 400, C.muted);
    textAction(16, y + 68, 358, '[1] Open saved recipe', true);
    rule(16, y + 119, 358);
  }

  function startRow(y, heading, description, isMobile = false) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 768;
    const height = isMobile ? 134 : 112;
    rule(x, y, width);
    text(x, y + 42, heading, isMobile ? 22 : 26, 600, C.ink, 'letter-spacing="-.5"');
    lines(x, y + 73, description, isMobile ? 15 : 17, 23, C.muted);
    icon('arrow', x + width - 24, y + 25, 22, C.accent);
    target(x, y + 8, width, height - 16, heading);
  }

  function desktopStart() {
    title();
    scope(212);
    startRow(330, 'Ask about a recipe', ['Find an amount, a step or a detail in a saved recipe.']);
    startRow(454, 'Cook with what you have', ['Tell me your ingredients. I’ll look in your cookbook.']);
    rule(112, 566, 768);
    composer(112, 666, 768);
    footer(948);
  }

  function mobileStart() {
    title(true);
    lines(16, 153, ['Ask about a saved recipe, or find', 'something to cook with what you have.'], 16, 25, C.muted);
    scope(210, false, true);
    startRow(324, 'Ask about a recipe', ['Find an amount, a step or a detail', 'in a saved recipe.'], true);
    startRow(458, 'Cook with what you have', ['Tell me your ingredients.', 'I’ll look in your cookbook.'], true);
    rule(16, 592, 358);
    composer(16, 692, 358, { isMobile: true, height: 124 });
    footer(944, true);
  }

  function desktopAnswer() {
    title();
    scope(212, true);
    question(['How much flour, and how long do I cook them?'], 300);
    text(112, 442, 'Use 2½ cups of flour.', 28, 500, C.ink, 'letter-spacing="-.4"');
    text(385, 442, '[1]', 18, 600, C.accent);
    target(375, 415, 44, 44, 'Source 1: Family pancakes ingredients');
    text(112, 490, 'The recipe does not give a cooking time.', 21, 400);
    text(112, 539, 'Its method only says:', 18, 400, C.muted);
    text(112, 576, '“Cook in a pan.”', 24, 400);
    text(302, 576, '[1]', 18, 600, C.accent);
    target(292, 548, 44, 44, 'Source 1: Family pancakes method');
    textAction(112, 621, 248, 'Ask for general guidance');
    composer(112, 738, 768, { placeholder: 'Ask about this recipe…' });
    recipeReference();
    footer(948);
  }

  function mobileAnswer() {
    title(true);
    scope(148, true, true);
    textAction(16, 194, 170, 'New conversation');
    question(['How much flour, and how', 'long do I cook them?'], 238, { isMobile: true, height: 98 });
    text(16, 392, 'Use 2½ cups of flour.', 24, 500, C.ink, 'letter-spacing="-.3"');
    text(250, 392, '[1]', 16, 600, C.accent);
    target(240, 364, 44, 44, 'Source 1: Family pancakes ingredients');
    lines(16, 438, ['The recipe does not give a', 'cooking time.'], 19, 28, C.ink);
    text(16, 514, 'Its method only says:', 17, 400, C.muted);
    text(16, 549, '“Cook in a pan.”', 21, 400);
    text(183, 549, '[1]', 16, 600, C.accent);
    target(173, 522, 44, 44, 'Source 1: Family pancakes method');
    sourceLink(584);
    textAction(16, 725, 248, 'Ask for general guidance');
    composer(16, 803, 358, { isMobile: true, height: 124, placeholder: 'Ask about this recipe…' });
    footer(1044, true);
  }

  function desktopMeals() {
    title();
    scope(212);
    question(['What can I make with flour, eggs and milk?'], 286, { height: 74 });
    text(112, 393, 'For this conversation: Flour · Eggs · Milk', 14, 400, C.muted);
    text(112, 447, 'Family pancakes', 30, 600, C.ink, 'letter-spacing="-.6"');
    text(112, 479, 'A saved recipe using flour, eggs and milk.', 18, 400);
    text(112, 517, 'Check quantities. Your list does not say how much you have.', 16, 400, C.muted);
    rule(112, 543, 768);
    text(112, 578, 'Salt', 19, 600);
    text(880, 578, 'Not specified', 16, 500, C.ink, 'text-anchor="end"');
    text(112, 607, 'Also in this recipe, but not on your ingredient list.', 15, 400, C.muted);
    text(112, 649, 'Original amounts · Servings not specified', 15, 400, C.muted);
    button(112, 674, 284, 'Review shopping additions', { tone: 'primary', height: 48 });
    text(112, 754, 'Review first. Nothing is added until you confirm.', 14, 400, C.muted);
    composer(112, 790, 768);
    recipeReference(292);
    footer(948);
  }

  function mobileMeals() {
    title(true);
    scope(148, false, true);
    textAction(16, 194, 170, 'New conversation');
    question(['What can I make with', 'flour, eggs and milk?'], 238, { isMobile: true, height: 98 });
    text(16, 368, 'For this conversation: Flour · Eggs · Milk', 13, 400, C.muted);
    text(16, 429, 'Family pancakes', 28, 600, C.ink, 'letter-spacing="-.5"');
    icon('arrow', 346, 409, 22, C.accent);
    target(16, 400, 358, 48, 'Open saved Family pancakes recipe');
    text(16, 458, 'Anna · Saved recipe', 14, 400, C.muted);
    text(16, 494, 'Uses the ingredients you listed.', 17, 400);
    lines(16, 531, ['Check quantities. Your list does not', 'say how much you have.'], 15, 23, C.muted);
    rule(16, 580, 358);
    text(16, 616, 'Salt', 19, 600);
    text(374, 616, 'Not specified', 15, 500, C.ink, 'text-anchor="end"');
    lines(16, 645, ['Also in this recipe, but not on your', 'ingredient list.'], 14, 22, C.muted);
    text(16, 710, 'Original amounts · Servings not specified', 14, 400, C.muted);
    button(16, 742, 358, 'Review shopping additions', { tone: 'primary', height: 48 });
    lines(16, 822, ['Review first. Nothing is added', 'until you confirm.'], 14, 22, C.muted);
    composer(16, 891, 358, { isMobile: true, height: 124 });
    footer(1144, true);
  }

  function mobileNoMatch() {
    title(true);
    scope(148, false, true);
    textAction(16, 194, 170, 'New conversation');
    question(['What can I make with', 'chickpeas, coconut milk', 'and rice?'], 238, { isMobile: true, height: 123 });
    lines(16, 425, ['No matching', 'saved recipe.'], 28, 34, C.ink);
    lines(16, 504, ['Try different ingredients, or browse', 'the recipes already in your cookbook.'], 16, 25, C.muted);
    button(16, 575, 358, 'Browse cookbook', { tone: 'primary', height: 48 });
    button(16, 639, 358, 'Change ingredients', { tone: 'secondary', height: 48 });
    textAction(16, 700, 358, 'Add a recipe', true);
    composer(16, 799, 358, { isMobile: true, height: 124 });
    footer(1044, true);
  }

  return [
    { name: 'web-desktop-start', width: 1440, height: 1000, platform: 'web', content: desktopStart, chrome() { header(); } },
    { name: 'web-mobile-start', width: 390, height: 1000, platform: 'web', content: mobileStart, chrome() { header(true); } },
    { name: 'web-desktop-answer', width: 1440, height: 1000, platform: 'web', content: desktopAnswer, chrome() { header(); } },
    { name: 'web-mobile-answer', width: 390, height: 1100, platform: 'web', content: mobileAnswer, chrome() { header(true); } },
    { name: 'web-desktop-meals', width: 1440, height: 1000, platform: 'web', content: desktopMeals, chrome() { header(); } },
    { name: 'web-mobile-meals', width: 390, height: 1200, platform: 'web', content: mobileMeals, chrome() { header(true); } },
    { name: 'web-mobile-no-match', width: 390, height: 1100, platform: 'web', content: mobileNoMatch, chrome() { header(true); } },
  ];
};
