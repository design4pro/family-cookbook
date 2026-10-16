// Static Apple artboards. Drawing instructions do not implement a native app.
module.exports = function appleShoppingArtboards(h) {
  const { C, add, rect, rule, t, ui, target, sf, button, checkbox, circleButton, phoneStatus, padStatus, home, phoneTabs, padTabs } = h;

  const items = [
    { name: 'Eggs', amount: '6', origin: 'Shakshuka · Family pancakes' },
    { name: 'Milk', amount: '750 ml', origin: 'Family pancakes · Manual' },
    { name: 'Flour', amount: '2½ cups', origin: 'Family pancakes · Original amounts' },
    { name: 'Flour', amount: '250 g', origin: 'Manual · Kept separate from cups' },
    { name: 'Bread', amount: '1 loaf', origin: 'Manual' },
    { name: 'Chopped tomatoes', amount: '400 g', origin: 'Shakshuka', checked: true },
  ];
  const additions = [
    { name: 'Flour', amount: '2½ cups', note: 'New row · Cups stay separate from grams', selected: true },
    { name: 'Eggs', amount: '2', note: 'On the list: 4 → 6', selected: true },
    { name: 'Milk', amount: '250 ml', note: 'On the list: 500 ml → 750 ml', selected: true },
    { name: 'Salt', amount: 'Not specified', note: 'Already at home · Excluded', selected: false },
  ];

  function action(x, y, w, label, { color = C.accent, size = 15, align = 'start' } = {}) {
    target(x, y, w, 44, label);
    ui(align === 'end' ? x + w : x, y + 28, label, size, 500, color, align === 'end' ? 'text-anchor="end"' : '');
  }

  function phoneRow(item, top, { offline = false } = {}) {
    const pending = offline && (item.name === 'Eggs' || item.name === 'Bread');
    const checked = Boolean(item.checked || pending);
    checkbox(20, top + 1, { checked, pending, label: `${checked ? 'Uncheck' : 'Check'} ${item.name}, ${item.amount}` });
    t(68, top + 28, item.name, 17, 500, checked ? C.muted : C.ink, checked ? 'text-decoration="line-through"' : '');
    t(373, top + 28, item.amount, 17, 500, checked ? C.muted : C.ink, 'text-anchor="end"');
    ui(68, top + 51, pending ? 'Waiting to sync' : item.origin, 12.5, 400, pending ? C.warning : C.muted);
    rule(68, top + 66, 305);
  }

  function phoneList() {
    t(20, 157, 'Shopping', 34, 700, C.ink, 'letter-spacing="-.9"');
    t(20, 190, 'One list for your household.', 17, 400, C.muted);
    ui(20, 225, '5 to buy · 1 checked', 14, 500, C.muted);
    action(249, 197, 124, 'From recipes', { align: 'end' });
    rule(20, 243, 353);
    items.forEach((item, index) => phoneRow(item, 251 + index * 72));
    ui(20, 731, 'Synthetic shopping demo', 12, 400, C.muted);
    action(252, 703, 121, 'Clear checked', { align: 'end' });
  }

  function phoneListChrome({ offline = false } = {}) {
    phoneStatus();
    circleButton('person.crop.circle', 20, 64);
    if (offline) {
      button(255, 64, 118, 'Add item', { tone: 'disabled' });
    } else {
      button(211, 64, 110, 'Add item', { tone: 'primary', glass: true });
      circleButton('ellipsis', 329, 64);
    }
    phoneTabs();
    home();
  }

  function phoneOffline() {
    t(20, 151, 'Shopping', 34, 700, C.ink, 'letter-spacing="-.9"');
    ui(20, 178, 'Cached list · Shared with your household', 14, 400, C.muted);
    rect(20, 195, 353, 63, C.surface, 12);
    ui(36, 219, 'Offline', 14, 600, C.warning);
    ui(36, 243, '2 changes waiting to sync', 16, 500);
    ui(20, 286, '3 to buy · 3 checked', 14, 500, C.muted);
    items.forEach((item, index) => phoneRow(item, 295 + index * 66, { offline: true }));
    ui(20, 719, 'Only check or uncheck offline.', 13, 400, C.muted);
    target(263, 691, 110, 44, 'Clear checked unavailable offline', true);
    ui(373, 719, 'Clear checked', 13, 500, '#8a9297', 'text-anchor="end"');
    ui(20, 741, 'Syncs when reconnected while the app is open.', 12.5, 400, C.muted);
  }

  function phoneProposalRow(item, top) {
    checkbox(20, top + 2, { checked: item.selected, label: `${item.selected ? 'Exclude' : 'Include'} ${item.name}, ${item.amount}` });
    t(68, top + 28, item.name, 18, 500, item.selected ? C.ink : C.muted);
    t(373, top + 28, item.amount, item.selected ? 17 : 14, 500, item.selected ? C.ink : C.muted, 'text-anchor="end"');
    ui(68, top + 52, item.note, 12.5, 400, C.muted);
    rule(68, top + 71, 305);
  }

  function phoneConfirm() {
    t(20, 153, 'Family pancakes', 29, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 184, 'Original amounts', 16, 500);
    ui(20, 210, 'Servings not specified · Scaling unavailable', 13, 400, C.muted);
    t(20, 260, 'Choose what to add', 24, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 286, 'Leave out anything already at home.', 14, 400, C.muted);
    additions.forEach((item, index) => phoneProposalRow(item, 307 + index * 78));
    ui(20, 651, '3 selected · 1 excluded', 16, 600);
    ui(20, 678, '1 new row · 2 updated rows', 14, 400, C.muted);
    ui(20, 714, 'Nothing changes until you confirm.', 14, 500);
    ui(20, 737, 'Recipe edits do not change this list.', 13, 400, C.muted);
  }

  function phoneConfirmChrome() {
    phoneStatus();
    circleButton('xmark', 20, 64);
    ui(205, 92, 'Add to shopping', 17, 600, C.ink, 'text-anchor="middle"');
    button(20, 766, 353, 'Confirm additions', { tone: 'primary', glass: true, height: 48 });
    home();
  }

  function padRow(item, top, selected = false) {
    if (selected) rect(52, top - 2, 630, 70, C.pale, 10);
    checkbox(52, top + 2, { checked: Boolean(item.checked), label: `${item.checked ? 'Uncheck' : 'Check'} ${item.name}, ${item.amount}` });
    target(102, top, 580, 70, `Show contributions to ${item.name}, ${item.amount}`);
    t(108, top + 29, item.name, 19, 500, item.checked ? C.muted : C.ink, item.checked ? 'text-decoration="line-through"' : '');
    t(658, top + 29, item.amount, 19, 500, item.checked ? C.muted : C.ink, 'text-anchor="end"');
    ui(108, top + 53, item.origin, 14, 400, C.muted);
    if (!selected) rule(108, top + 70, 574);
  }

  function removal(y, recipe, subtitle) {
    ui(766, y, recipe, 17, 500);
    ui(766, y + 25, subtitle, 13, 400, C.muted);
    target(1098, y - 26, 44, 44, `Remove ${recipe} addition`);
    sf('trash', 1108, y - 17, 24, 'muted');
  }

  function padList() {
    t(52, 170, 'Shopping', 44, 700, C.ink, 'letter-spacing="-1.3"');
    t(52, 208, 'One list for your household.', 18, 400, C.muted);
    ui(52, 247, '5 to buy · 1 checked', 15, 500, C.muted);
    action(530, 219, 152, 'From recipes', { size: 16, align: 'end' });
    items.forEach((item, index) => padRow(item, 270 + index * 73, item.name === 'Milk'));
    ui(52, 754, 'Synthetic shopping demo', 13, 400, C.muted);
    action(548, 726, 134, 'Clear checked', { size: 16, align: 'end' });

    add(`<path d="M722 239v527" stroke="${C.line}" stroke-width=".8"/>`);
    t(766, 288, 'Milk', 30, 600, C.ink, 'letter-spacing="-.6"');
    t(1142, 288, '750 ml', 30, 600, C.ink, 'text-anchor="end" letter-spacing="-.6"');
    ui(766, 327, 'Contributions', 14, 600, C.muted);
    ui(766, 369, 'Family pancakes', 17, 500);
    t(1142, 369, '250 ml', 17, 500, C.ink, 'text-anchor="end"');
    ui(766, 395, 'Original amounts · Servings not specified', 13, 400, C.muted);
    rule(766, 416, 376);
    ui(766, 453, 'Manual item', 17, 500);
    t(1142, 453, '500 ml', 17, 500, C.ink, 'text-anchor="end"');
    action(766, 456, 150, 'Edit manual item');
    rule(766, 505, 376);
    t(766, 546, 'Recipe additions', 24, 600, C.ink, 'letter-spacing="-.4"');
    removal(584, 'Family pancakes', 'Original amounts');
    rule(766, 628, 376);
    removal(660, 'Shakshuka', '2 servings');
    ui(766, 733, 'Recipe edits do not change this list.', 14, 400, C.muted);
    ui(766, 757, 'Remove an addition to change its portions.', 14, 400, C.muted);
  }

  function padListChrome() {
    padStatus();
    ui(32, 70, 'Family Cookbook', 17, 600);
    padTabs();
    button(957, 42, 143, 'Add item', { tone: 'primary', glass: true });
    circleButton('person.crop.circle', 1118, 42);
    home(1194, 834);
  }

  function padProposalRow(item, top) {
    checkbox(534, top + 7, { checked: item.selected, label: `${item.selected ? 'Exclude' : 'Include'} ${item.name}, ${item.amount}` });
    t(590, top + 34, item.name, 21, 500, item.selected ? C.ink : C.muted);
    t(1142, top + 34, item.amount, item.selected ? 20 : 17, 500, item.selected ? C.ink : C.muted, 'text-anchor="end"');
    ui(590, top + 63, item.note, 15, 400, C.muted);
    rule(590, top + 85, 552);
  }

  function padConfirm() {
    t(52, 157, 'Family pancakes', 36, 700, C.ink, 'letter-spacing="-1"');
    ui(52, 197, 'Original amounts', 18, 500);
    rule(52, 228, 402);
    ui(52, 264, 'Servings not specified', 17, 500);
    ui(52, 294, 'Portion scaling is unavailable.', 16, 400, C.muted);
    t(52, 365, 'Related items on your list', 24, 600, C.ink, 'letter-spacing="-.4"');
    [['Eggs', '4'], ['Milk', '500 ml'], ['Flour', '250 g']].forEach(([name, amount], index) => {
      const y = 410 + index * 46;
      ui(52, y, name, 17, 400);
      t(454, y, amount, 17, 500, C.ink, 'text-anchor="end"');
      rule(52, y + 17, 402);
    });
    ui(52, 553, 'Flour in cups stays separate from flour in grams.', 15, 400, C.muted);
    ui(52, 627, 'This addition uses a snapshot.', 17, 500);
    ui(52, 656, 'Later recipe edits do not change this list.', 16, 400, C.muted);
    ui(52, 784, 'Synthetic shopping demo', 13, 400, C.muted);

    add(`<path d="M494 128v627" stroke="${C.line}" stroke-width=".8"/>`);
    t(534, 157, 'Review additions', 30, 600, C.ink, 'letter-spacing="-.6"');
    ui(534, 192, 'Leave out anything already at home.', 17, 400, C.muted);
    additions.forEach((item, index) => padProposalRow(item, 222 + index * 94));
    ui(534, 650, '3 selected · 1 excluded', 19, 600);
    ui(534, 683, '1 new row · 2 updated rows', 17, 400, C.muted);
    rule(534, 713, 608);
    ui(534, 751, 'Nothing changes until you confirm.', 17, 500);
  }

  function padConfirmChrome() {
    padStatus();
    circleButton('xmark', 32, 42);
    ui(88, 70, 'Cancel', 17, 400);
    ui(597, 70, 'Add to shopping', 17, 600, C.ink, 'text-anchor="middle"');
    button(970, 42, 192, 'Confirm additions', { tone: 'primary', glass: true });
    home(1194, 834);
  }

  return [
    { name: 'iphone-list', width: 393, height: 852, platform: 'apple', content: phoneList, chrome: phoneListChrome },
    { name: 'iphone-confirm', width: 393, height: 852, platform: 'apple', content: phoneConfirm, chrome: phoneConfirmChrome },
    { name: 'iphone-offline', width: 393, height: 852, platform: 'apple', content: phoneOffline, chrome: () => phoneListChrome({ offline: true }) },
    { name: 'ipad-list', width: 1194, height: 834, platform: 'apple', content: padList, chrome: padListChrome },
    { name: 'ipad-confirm', width: 1194, height: 834, platform: 'apple', content: padConfirm, chrome: padConfirmChrome },
  ];
};
