// Static Apple artboards. These drawing instructions do not implement an app.
module.exports = function appleAssistantArtboards(h) {
  const { C, add, rect, rule, t, ui, lines, target, sf, button, glass, circleButton, phoneStatus, padStatus, home, phoneTabs, padTabs } = h;

  function action(x, y, w, label, { size = 16, align = 'start' } = {}) {
    target(x, y, w, 44, label);
    ui(align === 'end' ? x + w : x, y + 28, label, size, 500, C.accent, align === 'end' ? 'text-anchor="end"' : '');
  }

  function scope(x, y, label, w = 209) {
    target(x, y, w, 44, `Change scope: ${label}`);
    glass(x, y, w, 44, 22);
    sf('book.closed', x + 12, y + 11, 22, 'muted');
    ui(x + 42, y + 28, label, 15, 500);
    sf('chevron.right', x + w - 29, y + 14, 16, 'muted');
  }

  function composer(x, y, w, { placeholder = 'Ask your cookbook…', height = 54, disabled = false } = {}) {
    rect(x, y, w, height, disabled ? C.surface : 'white', height / 2, C.line);
    target(x + 10, y + (height - 44) / 2, w - 66, 44, disabled ? 'Assistant input unavailable' : placeholder, disabled);
    ui(x + 20, y + height / 2 + 6, disabled ? 'Assistant unavailable' : placeholder, 16, 400, C.muted);
    if (!disabled) {
      const sendX = x + w - 49;
      const sendY = y + (height - 44) / 2;
      target(sendX, sendY, 44, 44, 'Send unavailable until a message is entered', true);
      rect(sendX, sendY, 44, 44, C.surface, 22);
      sf('arrow.up', sendX + 10, sendY + 10, 24, 'muted');
    }
  }

  function newConversation(x, y) {
    target(x, y, 44, 44, 'New conversation');
    glass(x, y, 44, 44, 22);
    sf('square.and.pencil', x + 8, y + 8, 28);
  }

  function phoneChrome({ recipeScope = false, disabled = false } = {}) {
    phoneStatus();
    circleButton('person.crop.circle', 20, 64);
    newConversation(329, 64);
    scope(20, 174, recipeScope ? 'Family pancakes' : 'Whole cookbook');
    composer(20, 691, 353, { placeholder: recipeScope ? 'Ask a follow-up…' : 'Ask your cookbook…', disabled });
    phoneTabs();
    home();
  }

  function phoneHeading() {
    t(20, 153, 'Assistant', 34, 700, C.ink, 'letter-spacing="-.9"');
    ui(373, 146, 'Synthetic assistant demo', 11, 400, C.muted, 'text-anchor="end"');
  }

  function phoneSuggestion(y, label, detail) {
    target(20, y, 353, 80, label);
    t(20, y + 28, label, 20, 600, C.ink, 'letter-spacing="-.3"');
    ui(20, y + 54, detail, 14, 400, C.muted);
    sf('chevron.right', 349, y + 22, 20, 'muted');
    rule(20, y + 79, 353);
  }

  function phoneStart() {
    phoneHeading();
    t(20, 299, 'What’s cooking?', 32, 600, C.ink, 'letter-spacing="-.7"');
    lines(20, 336, ['Find an answer in your recipes,', 'or start with what you have.'], 17, 26);
    phoneSuggestion(410, 'Ask about a recipe', 'Ingredients, amounts and method');
    phoneSuggestion(506, 'Cook with what you have', 'Find a saved recipe for your ingredients');
    ui(20, 657, 'Not shared with your household.', 14, 400, C.muted);
  }

  function phoneQuestion(first, second) {
    rect(54, 237, 319, 76, C.surface, 18);
    ui(70, 265, first, 17, 400);
    ui(70, 291, second, 17, 400);
  }

  function phoneAnswer() {
    phoneHeading();
    phoneQuestion('How much flour, and how long', 'do I cook them?');
    t(20, 353, 'Use 2½ cups of flour. [1]', 20, 600, C.ink, 'letter-spacing="-.2"');
    lines(20, 392, ['The recipe does not give a', 'cooking time.'], 17, 26, C.ink);
    lines(20, 457, ['Its method only says:', '“Cook in a pan.” [1]'], 17, 26, C.ink);
    rule(20, 507, 353);
    sf('doc.text', 20, 526, 25, 'muted');
    ui(56, 540, 'Family pancakes · Anna', 16, 600);
    ui(56, 565, 'Ingredients and method', 13, 400, C.muted);
    action(56, 570, 150, 'View recipe');
    action(20, 625, 304, 'Ask for general guidance', { size: 16 });
  }

  function phoneMeals() {
    phoneHeading();
    phoneQuestion('What can I make with flour,', 'eggs and milk?');
    ui(20, 340, 'Your ingredients', 14, 500, C.muted);
    t(20, 366, 'Flour · Eggs · Milk', 18, 500);
    ui(20, 389, 'Temporary list · Not a pantry', 13, 400, C.muted);
    rule(20, 407, 353);
    target(20, 414, 353, 44, 'View Family pancakes recipe');
    t(20, 441, 'Family pancakes', 27, 600, C.ink, 'letter-spacing="-.5"');
    sf('chevron.right', 349, 424, 20, 'muted');
    ui(20, 467, 'Anna · Saved in your cookbook', 14, 400, C.muted);
    ui(20, 492, 'Original amounts · Servings not specified', 13, 400, C.muted);
    ui(20, 530, 'Salt is not on your list.', 17, 500);
    ui(20, 553, 'Amount not specified.', 14, 400, C.muted);
    lines(20, 585, ['Check quantities. Your list does not', 'say how much you have.'], 14, 21, C.muted);
    button(20, 621, 353, 'Review shopping additions', { tone: 'primary', glass: true });
    ui(20, 683, 'Nothing is added until you review and confirm.', 12, 400, C.muted);
  }

  function phoneLimit() {
    phoneHeading();
    t(20, 303, 'Assistant allowance', 28, 600, C.ink, 'letter-spacing="-.5"');
    t(20, 340, 'reached', 28, 600, C.ink, 'letter-spacing="-.5"');
    lines(20, 388, ['You can still browse recipes', 'and use your shopping list.'], 17, 27, C.ink);
    button(20, 462, 353, 'Open Cookbook', { tone: 'primary', glass: true, height: 48 });
    action(20, 527, 353, 'View allowance', { size: 17 });
  }

  function padChrome({ recipeScope = false } = {}) {
    padStatus();
    ui(32, 70, 'Family Cookbook', 17, 600);
    padTabs();
    newConversation(1058, 42);
    circleButton('person.crop.circle', 1118, 42);
    scope(52, 191, recipeScope ? 'Family pancakes' : 'Whole cookbook');
    composer(52, 715, 630, { placeholder: recipeScope ? 'Ask a follow-up…' : 'Ask your cookbook…', height: 64 });
    home(1194, 834);
  }

  function padHeading() {
    t(52, 166, 'Assistant', 44, 700, C.ink, 'letter-spacing="-1.3"');
    ui(682, 166, 'Synthetic assistant demo', 12, 400, C.muted, 'text-anchor="end"');
    add(`<path d="M722 128v652" stroke="${C.line}" stroke-width=".8"/>`);
  }

  function recipePanel() {
    t(766, 166, 'Family pancakes', 30, 600, C.ink, 'letter-spacing="-.6"');
    ui(766, 199, 'Anna · Saved recipe [1]', 16, 400, C.muted);
    ui(766, 242, 'Original amounts · Servings not specified', 14, 400, C.muted);
    t(766, 292, 'Ingredients', 22, 600, C.ink, 'letter-spacing="-.3"');
    [['Flour', '2½ cups'], ['Eggs', '2'], ['Milk', '250 ml'], ['Salt', 'Not specified']].forEach(([name, amount], index) => {
      const y = 331 + index * 44;
      ui(766, y, name, 17, 400);
      t(1142, y, amount, 17, 500, amount === 'Not specified' ? C.muted : C.ink, 'text-anchor="end"');
      rule(766, y + 16, 376);
    });
    t(766, 527, 'Method', 22, 600, C.ink, 'letter-spacing="-.3"');
    ui(766, 565, '1. Mix the ingredients.', 17, 400);
    ui(766, 598, '2. Cook in a pan.', 17, 400);
    ui(766, 641, 'Cooking time is not specified.', 14, 400, C.muted);
    button(766, 715, 376, 'View recipe', { tone: 'secondary', glass: true, height: 48 });
  }

  function padSuggestion(y, label, detail) {
    target(52, y, 630, 83, label);
    t(52, y + 30, label, 23, 600, C.ink, 'letter-spacing="-.3"');
    ui(52, y + 60, detail, 16, 400, C.muted);
    sf('chevron.right', 654, y + 27, 24, 'muted');
    rule(52, y + 82, 630);
  }

  function padStart() {
    padHeading();
    t(52, 320, 'What’s cooking?', 38, 600, C.ink, 'letter-spacing="-.9"');
    ui(52, 362, 'Ask your cookbook or start with what you have.', 19, 400, C.muted);
    padSuggestion(408, 'Ask about a recipe', 'Find ingredients, amounts and instructions in a saved recipe.');
    padSuggestion(510, 'Cook with what you have', 'Use a temporary list of ingredients to find a saved recipe.');
    ui(52, 675, 'Not shared with your household.', 15, 400, C.muted);
    t(766, 166, 'Recipe reference', 26, 600, C.ink, 'letter-spacing="-.4"');
    lines(766, 214, ['Choose a recipe to see its', 'ingredients and method here.'], 17, 27);
    button(766, 276, 170, 'Choose recipe', { tone: 'secondary', glass: true });
  }

  function padQuestion(first, second) {
    rect(181, 256, 501, 80, C.surface, 20);
    ui(201, 288, first, 19, 400);
    ui(201, 316, second, 19, 400);
  }

  function padAnswer() {
    padHeading();
    padQuestion('How much flour, and how long', 'do I cook them?');
    t(52, 386, 'Use 2½ cups of flour. [1]', 26, 600, C.ink, 'letter-spacing="-.4"');
    ui(52, 435, 'The recipe does not give a cooking time.', 20, 400);
    ui(52, 482, 'Its method only says: “Cook in a pan.” [1]', 20, 400);
    rule(52, 514, 630);
    sf('doc.text', 52, 538, 29, 'muted');
    ui(96, 557, 'Family pancakes · Anna', 18, 600);
    ui(96, 585, 'Ingredients and method', 15, 400, C.muted);
    action(518, 535, 164, 'View recipe', { size: 17, align: 'end' });
    action(52, 624, 314, 'Ask for general guidance', { size: 17 });
    recipePanel();
  }

  function padMeals() {
    padHeading();
    padQuestion('What can I make with flour, eggs', 'and milk?');
    ui(52, 374, 'Your ingredients', 15, 500, C.muted);
    t(52, 407, 'Flour · Eggs · Milk', 23, 500);
    ui(52, 436, 'Temporary list · Not a pantry', 14, 400, C.muted);
    rule(52, 459, 630);
    t(52, 502, 'Family pancakes', 29, 600, C.ink, 'letter-spacing="-.5"');
    ui(52, 531, 'Anna · Saved in your cookbook', 15, 400, C.muted);
    ui(52, 560, 'Original amounts · Servings not specified', 15, 400, C.muted);
    ui(52, 598, 'Salt is not on your list. Its amount is not specified.', 17, 500);
    ui(52, 628, 'Check quantities. Your list does not say how much you have.', 16, 400, C.muted);
    button(52, 652, 296, 'Review shopping additions', { tone: 'primary', glass: true, height: 44 });
    lines(370, 669, ['Nothing is added until you', 'review and confirm.'], 13, 19, C.muted);
    recipePanel();
  }

  return [
    { name: 'iphone-start', width: 393, height: 852, platform: 'apple', content: phoneStart, chrome: phoneChrome },
    { name: 'iphone-answer', width: 393, height: 852, platform: 'apple', content: phoneAnswer, chrome: () => phoneChrome({ recipeScope: true }) },
    { name: 'iphone-meals', width: 393, height: 852, platform: 'apple', content: phoneMeals, chrome: phoneChrome },
    { name: 'iphone-limit', width: 393, height: 852, platform: 'apple', content: phoneLimit, chrome: () => phoneChrome({ disabled: true }) },
    { name: 'ipad-start', width: 1194, height: 834, platform: 'apple', content: padStart, chrome: padChrome },
    { name: 'ipad-answer', width: 1194, height: 834, platform: 'apple', content: padAnswer, chrome: () => padChrome({ recipeScope: true }) },
    { name: 'ipad-meals', width: 1194, height: 834, platform: 'apple', content: padMeals, chrome: padChrome },
  ];
};
