// Static web design artboards. These drawing instructions are not application UI.
module.exports = function webArtboards(h) {
  const { C, add, rect, rule, text, lines, target, icon, button, checkbox } = h;
  const desktop = { x: 112, width: 1216 };
  const mobile = { x: 16, width: 358 };
  const items = [
    { name: 'Eggs', amount: '6', source: 'Shakshuka + Family pancakes' },
    { name: 'Milk', amount: '750 ml', source: 'Manual item + Family pancakes', selected: true },
    { name: 'Flour', amount: '2½ cups', source: 'Family pancakes · Original amounts' },
    { name: 'Flour', amount: '250 g', source: 'Manual item · Kept separate from cups' },
    { name: 'Bread', amount: '1 loaf', source: 'Manual item' },
    { name: 'Chopped tomatoes', amount: '400 g', source: 'Shakshuka', checked: true },
  ];
  const proposals = [
    { name: 'Flour', amount: '2½ cups', selected: true, note: 'New separate row', detail: 'Cups and grams stay separate.' },
    { name: 'Eggs', amount: '2', selected: true, note: 'Current 4 → 6', detail: 'Added to the existing Eggs row.' },
    { name: 'Milk', amount: '250 ml', selected: true, note: 'Current 500 ml → 750 ml', detail: 'Added to the existing Milk row.' },
    { name: 'Salt', amount: 'Not specified', selected: false, note: 'Already at home', detail: 'Excluded from this addition.' },
  ];

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
    text(1027, 39, 'Assistant', 15, 500, C.muted);
    text(1130, 39, 'Shopping', 15, 600);
    rule(1130, 49, 69, C.accent);
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
      lines(x, y + 24, ['Synthetic shopping demo · Static design', 'Family Cookbook is a working name.'], 11, 18, C.muted);
    } else {
      text(x, y + 27, 'Synthetic shopping demo · Static design · Family Cookbook is a working name.', 12, 400, C.muted);
    }
  }

  function textAction(x, y, width, label, { disabled = false, arrow = false } = {}) {
    text(x, y + 28, label, 14, 600, disabled ? C.muted : C.accent);
    if (arrow) icon('arrow', x + width - 20, y + 13, 18, disabled ? C.muted : C.accent);
    if (!disabled) target(x, y, width, 44, label);
  }

  function listRow(item, y, { isMobile = false, offline = false, stale = false } = {}) {
    const x = isMobile ? 16 : 112;
    const width = isMobile ? 358 : 768;
    const height = isMobile ? 88 : (stale ? 80 : 90);
    const pending = offline && ['Eggs', 'Bread'].includes(item.name);
    const checked = item.checked || pending;
    const selected = item.selected && !isMobile;
    const amount = stale && item.name === 'Milk' ? '500 ml' : item.amount;
    const source = stale && item.name === 'Milk' ? 'Manual item · Updated' : item.source;
    if (selected) {
      rect(x, y, width, height, C.pale, 0);
    }
    checkbox(x + (isMobile ? -4 : 4), y + 12, { checked, pending, label: `${checked ? 'Uncheck' : 'Check'} ${item.name} ${amount}` });
    const labelX = x + (isMobile ? 44 : 60);
    const valueX = x + width - (isMobile ? 0 : 24);
    text(labelX, y + 35, item.name, isMobile ? 18 : 20, 600, checked ? C.muted : C.ink, checked ? 'text-decoration="line-through"' : '');
    text(valueX, y + 35, amount, isMobile ? 19 : 22, 600, checked ? C.muted : C.ink, 'text-anchor="end" letter-spacing="-.3"');
    if (pending) {
      text(labelX, y + 61, 'Waiting to sync', 13, 500, C.warning);
    } else if (isMobile && item.name === 'Flour' && amount === '250 g') {
      text(labelX, y + 61, 'Manual item · Separate from cups', 12, 400, C.muted);
    } else {
      text(labelX, y + 61, source, isMobile ? 12 : 14, 400, C.muted);
    }
    if (!offline) target(labelX, y + 7, width - (isMobile ? 44 : 68), 66, `View ${item.name} ${amount} details`);
    rule(x, y + height, width);
  }

  function milkDetails(stale = false) {
    const x = 976, width = 352;
    add(`<path d="M944 210v676" stroke="${C.line}" stroke-width="1"/>`);
    text(x, 284, 'Milk', 32, 600, C.ink, 'letter-spacing="-.8"');
    text(x + width, 284, stale ? '500 ml' : '750 ml', 32, 600, C.ink, 'text-anchor="end" letter-spacing="-.8"');
    text(x, 319, stale ? '1 manual contribution' : '2 contributions', 14, 400, C.muted);
    rule(x, 345, width);
    if (!stale) {
      text(x, 379, 'Family pancakes', 17, 600);
      text(x + width, 379, '250 ml', 17, 600, C.ink, 'text-anchor="end"');
      text(x, 406, 'Original amounts · Servings not specified', 13, 400, C.muted);
      rule(x, 430, width);
    }
    const manualY = stale ? 379 : 466;
    text(x, manualY, 'Manual item', 17, 600);
    text(x + width, manualY, '500 ml', 17, 600, C.ink, 'text-anchor="end"');
    textAction(x, manualY + 6, 150, 'Edit manual item');
    rule(x, manualY + 66, width);
    const additionsY = stale ? 500 : 586;
    text(x, additionsY, 'Recipe additions', 22, 600, C.ink, 'letter-spacing="-.4"');
    text(x, additionsY + 28, 'Confirmed amounts stay with the list.', 13, 400, C.muted);
    text(x, additionsY + 77, 'Shakshuka', 16, 600);
    text(x, additionsY + 101, '2 servings', 13, 400, C.muted);
    textAction(x + 232, additionsY + 59, 120, 'Remove addition');
    rule(x, additionsY + 121, width);
    text(x, additionsY + 157, 'Family pancakes', 16, 600);
    text(x, additionsY + 181, 'Original amounts', 13, 400, C.muted);
    textAction(x + 232, additionsY + 139, 120, 'Remove addition');
    rule(x, additionsY + 201, width);
    textAction(x, additionsY + 214, width, 'View recipe additions', { arrow: true });
  }

  function desktopList(stale = false) {
    text(112, 137, 'Shopping list', 44, 700, C.ink, 'letter-spacing="-1.3"');
    text(112, 174, 'One shared list for your household.', 18, 400, C.muted);
    text(112, 243, '5 to buy', 22, 600, C.ink, 'letter-spacing="-.4"');
    text(210, 243, '· 1 checked', 16, 400, C.muted);
    button(536, 214, 168, 'From recipes', { tone: 'secondary', height: 44 });
    button(728, 214, 152, 'Add item', { tone: 'primary', height: 44 });
    let top = 290;
    if (stale) {
      rect(112, 278, 768, 80, C.surface, 6);
      icon('refresh', 128, 295, 20, C.muted);
      lines(162, 303, ['Milk changed to 500 ml. Your pending check was not applied.', 'Review the updated item.'], 15, 23, C.ink);
      top = 378;
    }
    items.forEach((item, i) => listRow(item, top + i * (stale ? 80 : 90), { stale }));
    const actionsY = stale ? 886 : 850;
    textAction(112, actionsY, 196, 'Clear checked items');
    text(880, actionsY + 28, 'Changes are shared with your household.', 13, 400, C.muted, 'text-anchor="end"');
    milkDetails(stale);
    footer(948);
  }

  function mobileList(offline = false) {
    text(16, 123, 'Shopping list', 36, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 158, 'One shared list for your household.', 16, 400, C.muted);
    let top;
    if (offline) {
      rect(16, 186, 358, 104, C.surface, 6);
      text(32, 214, 'You are offline', 16, 600);
      text(32, 240, '2 changes waiting to sync', 15, 600, C.warning);
      text(32, 266, 'You can still check and uncheck items.', 14, 400, C.muted);
      text(16, 338, '3 to buy', 22, 600, C.ink, 'letter-spacing="-.4"');
      text(109, 338, '· 3 checked', 14, 400, C.muted);
      button(260, 309, 114, 'Add item', { tone: 'disabled', height: 44 });
      top = 378;
    } else {
      text(16, 220, '5 to buy', 22, 600, C.ink, 'letter-spacing="-.4"');
      text(109, 220, '· 1 checked', 14, 400, C.muted);
      button(260, 191, 114, 'Add item', { tone: 'primary', height: 44 });
      textAction(16, 228, 140, 'From recipes');
      top = 268;
    }
    items.forEach((item, i) => listRow(item, top + i * 88, { isMobile: true, offline }));
    if (offline) {
      textAction(16, 923, 175, 'Clear checked items', { disabled: true });
      lines(16, 985, ['Add, edit and clear are available online.', 'Sync resumes when this app is open online.'], 13, 21, C.muted);
      footer(1044, true);
    } else {
      textAction(16, 810, 358, 'View recipe additions', { arrow: true });
      textAction(16, 865, 190, 'Clear checked items');
      footer(944, true);
    }
  }

  function backToList(isMobile = false) {
    const x = isMobile ? 16 : 112;
    icon('back', x, 87, 18, C.muted);
    text(x + 27, 102, 'Shopping list', 14, 500, C.muted);
    target(x - 6, 74, 150, 44, 'Return to Shopping list');
  }

  function proposalRow(item, y, isMobile = false) {
    const x = isMobile ? 16 : 112;
    const width = isMobile ? 358 : 768;
    const height = isMobile ? 108 : 100;
    const amountX = x + width - (isMobile ? 0 : 20);
    checkbox(x + (isMobile ? -4 : 4), y + 10, { checked: item.selected, label: `${item.selected ? 'Exclude' : 'Include'} ${item.name}` });
    const labelX = x + (isMobile ? 44 : 60);
    text(labelX, y + 34, item.name, isMobile ? 18 : 20, 600, item.selected ? C.ink : C.muted);
    text(amountX, y + 34, item.amount, item.amount === 'Not specified' ? 14 : (isMobile ? 19 : 22), 600, item.selected ? C.ink : C.muted, 'text-anchor="end"');
    text(labelX, y + 61, item.note, isMobile ? 14 : 15, item.selected ? 500 : 400, item.selected ? C.accent : C.muted);
    text(labelX, y + 83, item.detail, isMobile ? 12 : 13, 400, C.muted);
    rule(x, y + height, width);
  }

  function desktopConfirm() {
    backToList();
    text(112, 181, 'Add to shopping', 44, 700, C.ink, 'letter-spacing="-1.3"');
    text(112, 221, 'Review the ingredients before adding them to your shared list.', 18, 400, C.muted);
    text(112, 306, 'Choose ingredients', 24, 600, C.ink, 'letter-spacing="-.5"');
    text(880, 305, '3 selected · 1 excluded', 15, 400, C.muted, 'text-anchor="end"');
    rule(112, 331, 768);
    proposals.forEach((item, i) => proposalRow(item, 332 + i * 100));
    text(112, 774, 'Your list will have 1 new row and 2 updated rows.', 16, 500);
    text(112, 804, 'The existing Flour 250 g row will stay separate.', 14, 400, C.muted);

    add(`<path d="M944 280v570" stroke="${C.line}" stroke-width="1"/>`);
    text(976, 353, 'Family pancakes', 27, 600, C.ink, 'letter-spacing="-.6"');
    text(976, 388, 'Original amounts', 17, 600);
    text(976, 417, 'Servings not specified', 15, 400, C.muted);
    rule(976, 445, 352);
    lines(976, 481, ['This recipe does not specify servings.', 'Its original ingredient amounts are used.'], 15, 24, C.muted);
    lines(976, 551, ['Confirmed amounts are saved with the list.', 'Later recipe edits will not change them.'], 14, 23, C.muted);
    button(976, 624, 352, 'Confirm additions', { tone: 'primary', height: 48 });
    text(1152, 705, 'Nothing changes until you confirm.', 14, 400, C.muted, 'text-anchor="middle"');
    textAction(976, 731, 100, 'Cancel');
    footer(948);
  }

  function mobileConfirm() {
    backToList(true);
    text(16, 159, 'Add to shopping', 34, 700, C.ink, 'letter-spacing="-1"');
    text(16, 209, 'Family pancakes', 22, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 239, 'Original amounts · Servings not specified', 14, 400, C.muted);
    rect(16, 264, 358, 80, C.surface, 6);
    lines(32, 293, ['This recipe does not specify servings.', 'Its original ingredient amounts are used.'], 14, 23, C.muted);
    text(16, 389, 'Choose ingredients', 21, 600, C.ink, 'letter-spacing="-.4"');
    rule(16, 412, 358);
    proposals.forEach((item, i) => proposalRow(item, 413 + i * 108, true));
    text(16, 876, '3 selected · 1 excluded', 15, 600);
    text(16, 902, '1 new row · 2 updated rows', 14, 400, C.muted);
    button(16, 929, 358, 'Confirm additions', { tone: 'primary', height: 48 });
    text(195, 1007, 'Nothing changes until you confirm.', 13, 400, C.muted, 'text-anchor="middle"');
    footer(1044, true);
  }

  return [
    { name: 'web-desktop-list', width: 1440, height: 1000, platform: 'web', content() { desktopList(); }, chrome() { header(); } },
    { name: 'web-mobile-list', width: 390, height: 1000, platform: 'web', content() { mobileList(); }, chrome() { header(true); } },
    { name: 'web-desktop-confirm', width: 1440, height: 1000, platform: 'web', content: desktopConfirm, chrome() { header(); } },
    { name: 'web-mobile-confirm', width: 390, height: 1100, platform: 'web', content: mobileConfirm, chrome() { header(true); } },
    { name: 'web-mobile-offline', width: 390, height: 1100, platform: 'web', content() { mobileList(true); }, chrome() { header(true); } },
    { name: 'web-desktop-updated', width: 1440, height: 1000, platform: 'web', content() { desktopList(true); }, chrome() { header(); } },
  ];
};
