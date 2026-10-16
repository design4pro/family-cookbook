// Static assistant artboards. No native views, model calls or conversation state are implemented.
module.exports = function androidAssistant(h) {
  const { C, rect, rule, text, ui, lines, target, material, button, androidStatus, androidNav, androidIconButton } = h;

  function scope(recipe) {
    rect(20, 110, 372, 48, C.surface, 24);
    ui(36, 140, recipe ? 'Family pancakes' : 'Whole cookbook', 16, 500);
    ui(370, 140, 'Change', 14, 500, C.accent, 'text-anchor="end"');
    target(20, 110, 372, 48, 'Change conversation scope');
  }

  function composer() {
    rect(20, 724, 372, 64, 'white', 12, C.line);
    ui(36, 762, 'Ask a question…', 16, 400, C.muted);
    target(20, 724, 308, 64, 'Type a question');
    rect(336, 732, 48, 48, C.surface, 24);
    material('arrow_upward', 348, 744, 24, C.muted);
    target(336, 732, 48, 48, 'Send question; unavailable while empty', true);
  }

  function chrome() {
    androidStatus();
    rect(0, 24, 412, 64);
    text(20, 66, 'Assistant', 32, 700, C.ink, 'letter-spacing="-.8"');
    androidIconButton('add', 296, 32, 'New conversation');
    androidIconButton('account_circle', 348, 32, 'Account');
    ui(20, 98, 'Not shared with household · Synthetic demo', 12, 400, C.muted);
    composer();
    androidNav();
  }

  function prompt(y, title, subtitle) {
    text(20, y + 27, title, 18, 600);
    ui(20, y + 53, subtitle, 14, 400, C.muted);
    material('chevron_right', 360, y + 19, 24, C.muted);
    rule(20, y + 76, 372);
    target(20, y, 372, 76, title);
  }

  function start() {
    scope(false);
    text(20, 232, 'Ask your cookbook.', 29, 700, C.ink, 'letter-spacing="-.7"');
    lines(20, 271, ['A question about a recipe,', 'or ideas for what you have.'], 17, 25);
    prompt(348, 'Ask about a recipe', 'Choose a saved recipe to explore.');
    prompt(444, 'Cook with what you have', 'Start with a few ingredients.');
    lines(20, 600, ['Answers point back to saved recipes.', 'Missing details stay missing.'], 16, 25);
    ui(20, 698, 'The assistant needs an internet connection.', 12, 400, C.muted);
  }

  function question(content, height = 82) {
    rect(20, 184, 372, height, C.surface, 12);
    lines(36, 213, content, 17, 25, C.ink);
  }

  function source(y) {
    rect(20, y, 372, 106, 'white', 12, C.line);
    text(36, y + 31, 'Family pancakes', 18, 600);
    ui(36, y + 55, 'Anna · Ingredients and method', 13, 400, C.muted);
    ui(36, y + 85, '[1] View recipe', 14, 500, C.accent);
    material('arrow_forward', 352, y + 64, 24, C.accent);
    target(20, y, 372, 106, 'Open source 1: Family pancakes');
  }

  function answer() {
    scope(true);
    question(['How much flour, and how long', 'do I cook them?']);
    text(20, 314, 'Use 2½ cups of flour. [1]', 21, 600, C.ink, 'letter-spacing="-.3"');
    lines(20, 355, ['The recipe does not give a cooking', 'time. Its method only says:'], 17, 25, C.ink);
    text(20, 418, '“Cook in a pan.” [1]', 20, 500);
    source(452);
    button(8, 580, 250, 'Ask for general guidance', { tone: 'text', height: 48 });
    lines(20, 660, ['General advice is a separate request,', 'not part of the original recipe.'], 14, 21);
  }

  function meals() {
    scope(false);
    question(['What can I make with flour,', 'eggs and milk?'], 72);
    ui(20, 281, 'For this question: Flour · Eggs · Milk', 13, 400, C.muted);
    text(20, 326, 'Family pancakes', 28, 700, C.ink, 'letter-spacing="-.6"');
    ui(20, 355, 'A saved recipe using all three. [1]', 16, 400);
    [['2½ cups', 'Flour'], ['2', 'Eggs'], ['250 ml', 'Milk']].forEach(([amount, name], i) => {
      const y = 385 + i * 33;
      text(20, y, amount, 17, 600);
      text(160, y, name, 17, 400);
      rule(20, y + 12, 372);
    });
    ui(20, 490, 'Not on your list: salt', 16, 500, C.warning);
    ui(20, 513, 'Amount not specified in the recipe.', 13, 400, C.muted);
    lines(20, 548, ['Check quantities - your list does not', 'say how much you have.'], 14, 21);
    ui(20, 598, 'Original amounts · Servings not specified', 13, 400, C.muted);
    button(8, 604, 160, '[1] View recipe', { tone: 'text', height: 48 });
    button(20, 656, 372, 'Review shopping additions', { tone: 'primary', height: 48 });
  }

  function error() {
    scope(true);
    question(['How much flour, and how long', 'do I cook them?']);
    text(20, 336, 'Couldn’t get an answer', 26, 600, C.ink, 'letter-spacing="-.5"');
    lines(20, 378, ['Check your connection and try again.', 'Your question is still here.'], 17, 25);
    button(20, 458, 150, 'Try again', { tone: 'primary', height: 48 });
    button(20, 526, 150, 'Open recipe', { tone: 'secondary', height: 48 });
  }

  return [
    { name: 'android-start', width: 412, height: 915, platform: 'android', content: start, chrome },
    { name: 'android-answer', width: 412, height: 915, platform: 'android', content: answer, chrome },
    { name: 'android-meals', width: 412, height: 915, platform: 'android', content: meals, chrome },
    { name: 'android-error', width: 412, height: 915, platform: 'android', content: error, chrome },
  ];
};
