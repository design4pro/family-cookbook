// Static web design artboards. These drawing instructions are not application UI.
module.exports = function webArtboards(h) {
  const { C, add, rect, rule, text, lines, target, icon, button } = h;

  function header(isMobile = false) {
    const x = isMobile ? 16 : 112;
    text(x, 40, 'Family Cookbook', 20, 800, C.ink, 'letter-spacing="-.45"');
    target(x, 10, 206, 44, 'Open Cookbook');
    const accountX = isMobile ? 300 : 1308;
    add(`<circle cx="${accountX}" cy="32" r="20" fill="${C.pale}"/>`);
    text(accountX, 38, 'A', 15, 600, C.accent, 'text-anchor="middle"');
    target(accountX - 22, 10, 44, 44, 'Open Anna’s account');
    if (isMobile) {
      icon('menu', 346, 20, 24);
      target(336, 10, 44, 44, 'Open navigation');
    } else {
      [['Cookbook', 916], ['Assistant', 1027], ['Shopping', 1130]].forEach(([label, navX]) => {
        text(navX, 39, label, 15, 500, C.muted);
        target(navX - 10, 10, 96, 44, `Open ${label}`);
      });
    }
  }

  function footer(y, isMobile = false) {
    const x = isMobile ? 16 : 112;
    rule(x, y, isMobile ? 358 : 1216);
    if (isMobile) lines(x, y + 24, ['Synthetic billing demo · Static design', 'Family Cookbook is a working name.'], 11, 18, C.muted);
    else text(x, y + 27, 'Synthetic billing demo · Static design · Family Cookbook is a working name.', 12, 400, C.muted);
  }

  function action(x, y, width, label, arrow = false) {
    text(x, y + 28, label, 14, 600, C.accent);
    if (arrow) icon('arrow', x + width - 20, y + 13, 18, C.accent);
    target(x, y, width, 44, label);
  }

  function nav(selected, isMobile = false) {
    const x = isMobile ? 16 : 112, y = isMobile ? 224 : 212;
    const entries = [['Plan', 0, 56], ['Usage', 94, 64], ['Subscription', 194, 110]];
    entries.forEach(([label, offset, width]) => {
      text(x + offset, y + 28, label, 15, label === selected ? 600 : 500, label === selected ? C.ink : C.muted);
      target(x + offset - 4, y, width + 8, 44, `Open ${label}`);
      if (label === selected) rule(x + offset, y + 44, width, C.accent);
    });
    rule(x, y + 45, isMobile ? 358 : 1216);
  }

  function pageTitle(title, subtitle, selected, isMobile = false) {
    const x = isMobile ? 16 : 112;
    text(x, isMobile ? 147 : 137, title, isMobile ? 35 : 44, 700, C.ink, 'letter-spacing="-1.05"');
    text(x, isMobile ? 190 : 175, subtitle, isMobile ? 15 : 18, 400, C.muted);
    nav(selected, isMobile);
  }

  function back(label, isMobile = false) {
    const x = isMobile ? 16 : 112;
    icon('back', x, 85, 18, C.muted);
    text(x + 27, 100, label, 14, 500, C.muted);
    target(x - 6, 72, 174, 44, `Return to ${label}`);
  }

  function billingChoice(x, y, width, label, price, selected) {
    add(`<circle cx="${x + 14}" cy="${y + 25}" r="10" fill="white" stroke="${selected ? C.accent : C.muted}" stroke-width="1.5"/>`);
    if (selected) add(`<circle cx="${x + 14}" cy="${y + 25}" r="5" fill="${C.accent}"/>`);
    text(x + 42, y + 31, label, 18, 500);
    text(x + 42, y + 59, price, 17, 400, C.muted);
    rule(x, y + 80, width);
    target(x, y, width, 80, `Choose ${label.toLowerCase()} billing`);
  }

  function comparison(isMobile = false) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 768;
    const sampleX = isMobile ? 198 : 560, familyX = isMobile ? 374 : 880;
    const headerY = isMobile ? 329 : 315;
    text(sampleX, headerY, 'Sample', isMobile ? 15 : 18, 600, C.ink, 'text-anchor="end"');
    text(familyX, headerY, 'Family', isMobile ? 15 : 18, 600, C.ink, 'text-anchor="end"');
    rule(x, headerY + 22, width);
    let y = isMobile ? 352 : 350;
    const rows = [
      ['People', '3 / 5', ['5']],
      ['Saved recipes', '8 / 10', ['500']],
      ['Storage', '34 / 100 MB', ['1 GB']],
      ['Photo pages', '4 / 5', isMobile ? ['200 first paid month', 'then 50 / month'] : ['200 in the first paid month', 'then 50 / month']],
      ['Audio minutes', '7 / 10', ['60 / month']],
      ['AI answers', '12 / 20', ['200 / month']],
    ];
    rows.forEach(([label, sample, family]) => {
      const height = family.length > 1 ? (isMobile ? 108 : 98) : (isMobile ? 76 : 70);
      text(x, y + 34, label, isMobile ? 16 : 19, 500);
      text(sampleX, y + 34, sample, isMobile ? 14 : 18, 400, C.ink, 'text-anchor="end"');
      family.forEach((value, index) => text(familyX, y + 34 + index * 28, value, isMobile ? 13 : 17, index ? 400 : 500, index ? C.muted : C.ink, 'text-anchor="end"'));
      rule(x, y + height, width);
      y += height;
    });
  }

  function desktopPlan() {
    pageTitle('Plan and allowance', 'Current access: Sample', 'Plan');
    comparison();
    text(112, 844, 'Sample AI allowances are totals, with no monthly reset.', 16, 500);
    text(112, 876, 'No card required. No automatic renewal.', 15, 400, C.muted);
    text(112, 942, 'Your household’s first paid-month allowance is granted only once.', 14, 400, C.muted);

    text(976, 315, 'Family', 32, 600, C.ink, 'letter-spacing="-.6"');
    text(976, 353, 'One plan for your household.', 17, 400, C.muted);
    billingChoice(976, 385, 352, 'Monthly', 'EUR 4.99 / month', true);
    billingChoice(976, 465, 352, 'Yearly', 'EUR 39 / year', false);
    lines(976, 584, ['Pilot reference prices; final price', 'and tax in Polar.'], 14, 23, C.muted);
    text(976, 674, 'Anna · Designated payer', 17, 500);
    text(976, 704, 'anna@example.com', 14, 400, C.muted);
    button(976, 748, 352, 'Review purchase', { tone: 'primary', height: 48 });
    lines(976, 846, ['200 photo pages applies only in your', 'household’s first paid month.', 'Later months include 50 pages.'], 14, 24, C.muted);
    footer(1048);
  }

  function mobilePlan() {
    pageTitle('Plan and allowance', 'Current access: Sample', 'Plan', true);
    comparison(true);
    lines(16, 877, ['Sample AI allowances are totals.', 'No monthly reset, card or automatic renewal.'], 14, 24, C.muted);
    text(16, 968, 'Family', 29, 600, C.ink, 'letter-spacing="-.6"');
    billingChoice(16, 1007, 358, 'Monthly', 'EUR 4.99 / month', true);
    billingChoice(16, 1087, 358, 'Yearly', 'EUR 39 / year', false);
    lines(16, 1208, ['Pilot reference prices; final price', 'and tax in Polar.'], 14, 24, C.muted);
    text(16, 1288, 'Anna · Designated payer', 17, 500);
    text(16, 1318, 'anna@example.com', 14, 400, C.muted);
    button(16, 1354, 358, 'Review purchase', { tone: 'primary', height: 48 });
    lines(16, 1450, ['200 photo pages applies only in your', 'household’s first paid month.', 'Later months include 50 pages.'], 14, 23, C.muted);
    footer(1544, true);
  }

  function usageRow(x, y, width, label, value, detail = '', height = 84) {
    text(x, y + 34, label, 18, 500);
    text(x + width, y + 34, value, 20, 600, C.ink, 'text-anchor="end" letter-spacing="-.3"');
    if (detail) text(x, y + 64, detail, 14, 400, C.muted);
    rule(x, y + height, width);
  }

  function desktopUsage() {
    pageTitle('Usage', 'Family · Active · Later paid month', 'Usage');
    text(112, 316, 'Monthly allowances', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(112, 353, '15 Oct - 15 Nov 2026', 17, 400, C.muted);
    usageRow(112, 382, 768, 'Photo pages', '14 / 50', '+ 2 reserved for pending jobs', 104);
    usageRow(112, 486, 768, 'Audio minutes', '18 / 60');
    usageRow(112, 570, 768, 'AI answers', '37 / 200', '+ 1 reserved for a pending job', 104);
    text(112, 734, 'Reserved amounts are held while jobs run.', 16, 400, C.muted);
    lines(112, 770, ['Failed jobs release their reservations.', 'Automatic retries do not use extra units.'], 15, 25, C.muted);

    text(976, 316, 'Next reset', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(976, 358, '15 Nov 2026', 23, 500);
    text(976, 391, '00:00 UTC', 16, 400, C.muted);
    text(976, 433, 'Unused allowances do not roll over.', 14, 400, C.muted);
    text(976, 520, 'Stored capacity', 24, 600, C.ink, 'letter-spacing="-.4"');
    usageRow(976, 550, 352, 'Saved recipes', '42 / 500', '', 76);
    usageRow(976, 626, 352, 'Storage', '164 MB / 1 GB', '', 76);
    text(976, 777, 'Household places', 24, 600, C.ink, 'letter-spacing="-.4"');
    usageRow(976, 813, 352, 'Members', '3 / 5', '', 76);
    footer(948);
  }

  function mobileUsage() {
    pageTitle('Usage', 'Family · Active · Later paid month', 'Usage', true);
    text(16, 326, 'Monthly allowances', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 363, '15 Oct - 15 Nov 2026', 17, 400, C.muted);
    usageRow(16, 396, 358, 'Photo pages', '14 / 50', '+ 2 reserved for pending jobs', 104);
    usageRow(16, 500, 358, 'Audio minutes', '18 / 60');
    usageRow(16, 584, 358, 'AI answers', '37 / 200', '+ 1 reserved for a pending job', 104);
    text(16, 752, 'Next reset', 23, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 791, '15 Nov 2026 · 00:00 UTC', 18, 500);
    text(16, 827, 'Unused allowances do not roll over.', 14, 400, C.muted);
    text(16, 900, 'Stored capacity', 24, 600, C.ink, 'letter-spacing="-.4"');
    usageRow(16, 933, 358, 'Saved recipes', '42 / 500', '', 76);
    usageRow(16, 1009, 358, 'Storage', '164 MB / 1 GB', '', 76);
    text(16, 1148, 'Household places', 24, 600, C.ink, 'letter-spacing="-.4"');
    usageRow(16, 1180, 358, 'Members', '3 / 5', '', 76);
    lines(16, 1311, ['Reservations are held while jobs run.', 'Failed jobs release them. Automatic retries', 'do not use extra units.'], 14, 24, C.muted);
    footer(1444, true);
  }

  function desktopSubscription() {
    pageTitle('Subscription', 'Verified billing status for your household', 'Subscription');
    text(112, 321, 'Family · Active', 32, 600, C.ink, 'letter-spacing="-.6"');
    text(112, 362, 'Monthly subscription · Paid by Anna', 17, 400, C.muted);
    rule(112, 394, 768);
    text(112, 441, 'Next renewal', 16, 400, C.muted);
    text(112, 478, '20 Oct 2026', 26, 500, C.ink, 'letter-spacing="-.4"');
    text(112, 546, 'Usage resets separately', 16, 400, C.muted);
    text(112, 582, '15 Nov 2026 · 00:00 UTC', 23, 500, C.ink, 'letter-spacing="-.3"');
    button(112, 656, 248, 'Manage in Polar', { tone: 'primary', height: 48 });
    action(400, 658, 170, 'Stop renewal');
    action(112, 738, 180, 'Refresh access');

    text(976, 321, 'Your billing account', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(976, 365, 'Anna · Designated payer', 17, 500);
    text(976, 396, 'anna@example.com', 15, 400, C.muted);
    text(976, 454, 'Alex · Administrator', 17, 500);
    text(976, 487, '3 household members', 15, 400, C.muted);
    lines(976, 582, ['This purchase stays permanently linked', 'to this household. It cannot move to', 'another household.'], 15, 25, C.muted);
    footer(948);
  }

  function mobileSubscription() {
    pageTitle('Subscription', 'Verified billing status', 'Subscription', true);
    text(16, 330, 'Family · Active', 30, 600, C.ink, 'letter-spacing="-.6"');
    text(16, 371, 'Monthly subscription · Paid by Anna', 15, 400, C.muted);
    text(16, 401, 'anna@example.com', 14, 400, C.muted);
    rule(16, 432, 358);
    text(16, 479, 'Next renewal', 15, 400, C.muted);
    text(16, 516, '20 Oct 2026', 25, 500, C.ink, 'letter-spacing="-.4"');
    text(16, 581, 'Usage resets separately', 15, 400, C.muted);
    text(16, 616, '15 Nov 2026 · 00:00 UTC', 20, 500);
    button(16, 666, 358, 'Manage in Polar', { tone: 'primary', height: 48 });
    action(16, 739, 160, 'Stop renewal');
    action(16, 801, 180, 'Refresh access');
    text(16, 920, 'One household, one purchase', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 963, ['This purchase stays permanently linked', 'to this household. It cannot move', 'to another household.'], 15, 25, C.muted);
    footer(1144, true);
  }

  function archiveItem(x, y, width, heading, detail) {
    text(x, y + 31, heading, 20, 500);
    text(x, y + 60, detail, 14, 400, C.muted);
    rule(x, y + 90, width);
  }

  function desktopArchive() {
    pageTitle('Archive', 'Access ended 20 Oct 2026 · As of 21 Oct 2026', 'Plan');
    text(112, 321, 'Your cookbook is still here', 30, 600, C.ink, 'letter-spacing="-.6"');
    text(112, 363, '42 recipes with their originals · 3 members', 17, 400, C.muted);
    rule(112, 400, 768);
    archiveItem(112, 418, 768, 'Read, cook and search', 'Everyone in the household can use the saved recipes.');
    archiveItem(112, 508, 768, 'Download and export', 'Keep copies of your recipes and their original files.');
    archiveItem(112, 598, 768, 'Check your existing shopping list', 'Check and uncheck items already on the list.');
    button(112, 754, 224, 'Export archive', { tone: 'primary', height: 48 });
    action(374, 756, 200, 'Open cookbook', true);
    lines(112, 884, ['After 12 months without signed-in online activity, removal may be scheduled.', 'Notices arrive 30 and 7 days before. Open the cookbook online or request an export to cancel it.', 'Offline use does not extend this period.'], 14, 24, C.muted);

    text(976, 321, 'Family access has ended', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(976, 366, ['New recipes, editing, uploads, AI and', 'shopping-list additions are unavailable.'], 15, 25, C.muted);
    text(976, 477, 'Anna · Designated payer', 17, 500);
    button(976, 520, 352, 'Renew with Polar', { tone: 'secondary', height: 48 });
    lines(976, 617, ['Renewing does not restart Sample access', 'or grant another first paid-month', 'photo allowance.'], 14, 24, C.muted);
    footer(1048);
  }

  function mobileArchive() {
    pageTitle('Archive', 'As of 21 Oct 2026 · Access ended 20 Oct', 'Plan', true);
    text(16, 326, 'Your cookbook is still here', 26, 600, C.ink, 'letter-spacing="-.5"');
    text(16, 368, '42 recipes with their originals', 16, 400, C.muted);
    text(16, 399, '3 household members', 15, 400, C.muted);
    rule(16, 430, 358);
    archiveItem(16, 451, 358, 'Read, cook and search', 'Use the saved recipes.');
    archiveItem(16, 541, 358, 'Download and export', 'Keep recipes and original files.');
    archiveItem(16, 631, 358, 'Check the existing list', 'Check and uncheck its items.');
    text(16, 798, 'Family access has ended', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 842, ['New recipes, editing, uploads, AI and', 'shopping-list additions are unavailable.'], 15, 25, C.muted);
    text(16, 928, 'Anna · Designated payer', 17, 500);
    button(16, 966, 358, 'Renew with Polar', { tone: 'secondary', height: 48 });
    button(16, 1038, 358, 'Export archive', { tone: 'primary', height: 48 });
    action(16, 1106, 358, 'Open cookbook', true);
    lines(16, 1216, ['After 12 months without signed-in', 'online activity, removal may be scheduled.', 'Notices arrive 30 and 7 days before.', 'Open the cookbook online or request', 'an export to cancel the removal.'], 14, 24, C.muted);
    footer(1344, true);
  }

  function desktopCheckout() {
    back('Plan');
    text(112, 181, 'Review your purchase', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 224, 'Sample access · No active subscription', 18, 400, C.muted);
    text(112, 321, 'This purchase belongs here', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(112, 376, 'Designated payer', 15, 400, C.muted);
    text(112, 411, 'Anna · anna@example.com', 22, 500);
    rule(112, 446, 768);
    text(112, 492, 'Your household', 15, 400, C.muted);
    text(112, 528, '3 members · Alex is the administrator', 21, 500);
    rule(112, 566, 768);
    lines(112, 620, ['The purchase will stay permanently linked to this household.', 'It cannot be moved to another household.'], 17, 28, C.muted);
    action(112, 748, 180, 'Back to plan');

    text(976, 321, 'Family · Yearly', 30, 600, C.ink, 'letter-spacing="-.6"');
    text(976, 372, 'EUR 39 / year', 27, 500, C.ink, 'letter-spacing="-.4"');
    lines(976, 419, ['Pilot reference price; final price', 'and tax in Polar.'], 14, 24, C.muted);
    text(976, 513, 'Recurring yearly', 17, 500);
    lines(976, 550, ['Review the final price and renewal terms', 'in Polar before purchasing.'], 15, 25, C.muted);
    button(976, 630, 352, 'Continue to Polar', { tone: 'primary', height: 48 });
    text(976, 726, 'You have not purchased yet.', 14, 400, C.muted);
    footer(948);
  }

  function mobilePending() {
    back('Plan', true);
    text(16, 161, 'Checking your', 35, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 203, 'subscription', 35, 700, C.ink, 'letter-spacing="-1.05"');
    lines(16, 253, ['You have returned from Polar.', 'We still need to verify your subscription.'], 16, 25, C.muted);
    text(16, 370, 'Current access', 15, 400, C.muted);
    text(16, 410, 'Sample', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(16, 453, 'Purchase not yet confirmed', 17, 500);
    text(16, 486, 'Anna · anna@example.com', 14, 400, C.muted);
    button(16, 554, 358, 'Refresh status', { tone: 'primary', height: 48 });
    action(16, 630, 358, 'Open cookbook', true);
    lines(16, 745, ['Access changes only after the subscription', 'is verified. You can keep using Sample', 'access within its remaining limits.'], 15, 25, C.muted);
    footer(944, true);
  }

  function mobileCancel() {
    back('Subscription', true);
    text(16, 161, 'Stop renewal?', 35, 700, C.ink, 'letter-spacing="-1.05"');
    lines(16, 209, ['Family stays active until 20 Oct 2026.', 'You are reviewing this change.'], 16, 25, C.muted);
    text(16, 340, 'What changes', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 385, ['The monthly subscription will not renew.', 'Paid access continues until 20 Oct 2026.', 'After it ends, the household enters Archive.'], 15, 26, C.ink);
    lines(16, 511, ['Saved recipes and original files remain', 'available to read, cook and export.', 'New additions and AI become unavailable.'], 15, 26, C.muted);
    button(16, 669, 358, 'Stop renewal', { tone: 'primary', height: 48 });
    button(16, 741, 358, 'Keep plan', { tone: 'secondary', height: 48 });
    text(16, 861, 'Nothing changes until you confirm.', 14, 400, C.muted);
    footer(1044, true);
  }

  function mobileCancelled() {
    back('Subscription', true);
    text(16, 161, 'Renewal is off', 35, 700, C.ink, 'letter-spacing="-1.05"');
    lines(16, 209, ['Family remains active until 20 Oct 2026.', 'Verified subscription status.'], 16, 25, C.muted);
    text(16, 340, 'Family · Active', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(16, 385, 'No further renewal is scheduled.', 17, 500);
    text(16, 447, 'Paid access ends', 15, 400, C.muted);
    text(16, 486, '20 Oct 2026', 26, 500, C.ink, 'letter-spacing="-.4"');
    lines(16, 555, ['The household enters Archive after expiry.', 'You can then read, cook, search, download', 'and export your saved recipes.'], 15, 25, C.muted);
    button(16, 681, 358, 'Open cookbook', { tone: 'primary', height: 48 });
    action(16, 757, 180, 'Refresh access');
    action(16, 821, 358, 'Manage in Polar', true);
    footer(1044, true);
  }

  function desktopPayerChange() {
    back('Subscription');
    text(112, 181, 'Payer change in progress', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 225, 'Sam has accepted the new payer designation.', 18, 400, C.muted);
    text(112, 322, 'Current payer', 15, 400, C.muted);
    text(112, 358, 'Anna · anna@example.com', 24, 500, C.ink, 'letter-spacing="-.3"');
    rule(112, 396, 768);
    text(112, 443, 'Incoming payer · Accepted', 15, 400, C.muted);
    text(112, 479, 'Sam · sam@example.com', 24, 500, C.ink, 'letter-spacing="-.3"');
    rule(112, 517, 768);
    text(112, 575, 'Previous subscription: renewal off', 22, 500);
    text(112, 615, 'Family access remains active until 20 Oct 2026.', 17, 400, C.muted);
    lines(112, 699, ['A new purchase is unavailable while paid access or a grace period remains.', 'Sam can purchase only after access checks confirm that period has ended.'], 16, 28, C.muted);
    button(112, 842, 230, 'Refresh access', { tone: 'primary', height: 48 });
    action(382, 844, 200, 'Open cookbook', true);

    text(976, 322, 'The purchase stays attached', 24, 600, C.ink, 'letter-spacing="-.4"');
    lines(976, 367, ['Anna’s purchase remains permanently', 'linked to this household.', 'Payment details are not copied to Sam.'], 15, 25, C.muted);
    lines(976, 520, ['Changing payer does not restart', 'allowances or grant another first', 'paid-month photo allowance.'], 15, 25, C.muted);
    lines(976, 669, ['There is no automatic new charge.', 'Eligibility is checked before a new', 'purchase can begin.'], 15, 25, C.muted);
    footer(1048);
  }

  return [
    { name: 'web-desktop-plan', width: 1440, height: 1100, platform: 'web', content: desktopPlan, chrome() { header(); } },
    { name: 'web-mobile-plan', width: 390, height: 1600, platform: 'web', content: mobilePlan, chrome() { header(true); } },
    { name: 'web-desktop-usage', width: 1440, height: 1000, platform: 'web', content: desktopUsage, chrome() { header(); } },
    { name: 'web-mobile-usage', width: 390, height: 1500, platform: 'web', content: mobileUsage, chrome() { header(true); } },
    { name: 'web-desktop-subscription', width: 1440, height: 1000, platform: 'web', content: desktopSubscription, chrome() { header(); } },
    { name: 'web-mobile-subscription', width: 390, height: 1200, platform: 'web', content: mobileSubscription, chrome() { header(true); } },
    { name: 'web-desktop-archive', width: 1440, height: 1100, platform: 'web', content: desktopArchive, chrome() { header(); } },
    { name: 'web-mobile-archive', width: 390, height: 1400, platform: 'web', content: mobileArchive, chrome() { header(true); } },
    { name: 'web-desktop-checkout', width: 1440, height: 1000, platform: 'web', content: desktopCheckout, chrome() { header(); } },
    { name: 'web-mobile-pending', width: 390, height: 1000, platform: 'web', content: mobilePending, chrome() { header(true); } },
    { name: 'web-mobile-cancel', width: 390, height: 1100, platform: 'web', content: mobileCancel, chrome() { header(true); } },
    { name: 'web-mobile-cancelled', width: 390, height: 1100, platform: 'web', content: mobileCancelled, chrome() { header(true); } },
    { name: 'web-desktop-payer-change', width: 1440, height: 1100, platform: 'web', content: desktopPayerChange, chrome() { header(); } },
  ];
};
