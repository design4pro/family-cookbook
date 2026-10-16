// Static Apple billing artboards. No purchase, account or allowance behavior is implemented.
module.exports = function appleBillingArtboards(h) {
  const { C, add, rect, rule, t, ui, lines, target, button, circleButton, phoneStatus, padStatus, home } = h;

  function action(x, y, width, label, size = 16) {
    target(x, y, width, 44, label);
    ui(x, y + 28, label, size, 500, C.accent);
  }

  function valueRow(x, y, width, label, value, { size = 16, reserved = '' } = {}) {
    ui(x, y, label, size, 400);
    ui(x + width, y, value, size, 500, C.ink, 'text-anchor="end"');
    if (reserved) ui(x, y + 24, reserved, 13, 400, C.muted);
    rule(x, y + (reserved ? 39 : 17), width);
  }

  function phoneChrome() {
    phoneStatus();
    circleButton('chevron.left', 20, 64);
    home();
  }

  function phoneHeading(title, size = 34) {
    t(20, 165, title, size, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 197, 'Synthetic billing demo', 12, 400, C.muted);
  }

  function phonePlan() {
    phoneHeading('Your plan');
    t(20, 245, 'Sample', 28, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 274, 'Free sample · Shared by your household', 14, 400, C.muted);
    ui(20, 300, 'No card. No auto-renewal.', 14, 400, C.muted);
    ui(20, 343, 'Household capacity', 14, 500, C.muted);
    valueRow(20, 377, 353, 'People', '3 / 5');
    valueRow(20, 421, 353, 'Recipes', '8 / 10');
    valueRow(20, 465, 353, 'Original files', '34 / 100 MB');
    t(20, 513, 'Sample AI totals', 20, 600, C.ink, 'letter-spacing="-.2"');
    valueRow(20, 548, 353, 'Photo pages', '4 / 5');
    valueRow(20, 592, 353, 'Audio minutes', '7 / 10');
    valueRow(20, 636, 353, 'Assistant answers', '12 / 20');
    lines(20, 692, ['AI limits are totals for this sample.', 'They do not reset monthly.'], 14, 24);
    action(20, 753, 353, 'Usage rules');
  }

  function phoneUsage() {
    phoneHeading('Usage');
    t(20, 245, 'Family', 28, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 274, '15 Oct - 15 Nov 2026 · Shared household', 14, 400, C.muted);
    ui(20, 312, 'Capacity · Not monthly', 14, 500, C.muted);
    valueRow(20, 346, 353, 'People', '3 / 5');
    valueRow(20, 389, 353, 'Recipes', '42 / 500');
    valueRow(20, 432, 353, 'Original files', '164 MB / 1 GB');
    t(20, 480, 'Monthly processing', 20, 600, C.ink, 'letter-spacing="-.2"');
    valueRow(20, 516, 353, 'Photo pages used', '14 / 50', { reserved: '2 pages reserved separately' });
    valueRow(20, 590, 353, 'Audio minutes used', '18 / 60');
    valueRow(20, 634, 353, 'Assistant answers used', '37 / 200', { reserved: '1 answer reserved separately' });
    ui(20, 711, 'Resets 15 Nov 2026, 00:00 UTC · No rollover', 13, 400, C.muted);
    action(20, 749, 353, 'Usage rules');
  }

  function phoneSubscription() {
    phoneHeading('Subscription');
    t(20, 251, 'Family', 29, 600, C.ink, 'letter-spacing="-.4"');
    ui(373, 247, 'Active', 16, 600, C.accent, 'text-anchor="end"');
    ui(20, 306, 'Access verified through', 16, 400, C.muted);
    t(20, 348, '20 Oct 2026', 30, 600, C.ink, 'letter-spacing="-.5"');
    rule(20, 378, 353);
    ui(20, 420, 'Payer', 14, 500, C.muted);
    ui(20, 452, 'anna@example.com', 22, 500);
    ui(20, 483, 'Anna · You · Payer', 14, 400, C.muted);
    ui(20, 523, 'Administrator: Alex', 16, 400, C.ink);
    ui(20, 576, 'Usage reset', 14, 500, C.muted);
    ui(20, 608, '15 Nov 2026, 00:00 UTC', 18, 500);
    ui(20, 636, 'Separate from your access date.', 14, 400, C.muted);
    button(20, 686, 353, 'Refresh access', { glass: true, height: 48 });
    action(20, 759, 353, 'View usage');
  }

  function phoneArchive() {
    phoneHeading('Archive');
    ui(20, 252, 'Paid access ended 20 Oct 2026.', 17, 500);
    ui(20, 282, 'As of 21 Oct 2026', 14, 400, C.muted);
    t(20, 332, 'Your cookbook remains', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 364, '42 recipes · All 3 members retained', 16, 400, C.muted);
    lines(20, 405, ['Read, search, cook, download and export.', 'Check existing shopping items offline.'], 14, 26, C.ink);
    rule(20, 454, 353);
    t(20, 493, 'Unavailable in Archive', 20, 600, C.ink, 'letter-spacing="-.2"');
    lines(20, 528, ['New recipes, edits, uploads, AI and', 'new shopping-list items.'], 15, 25);
    button(20, 587, 353, 'Open cookbook', { tone: 'primary', glass: true, height: 48 });
    button(20, 656, 353, 'Export cookbook', { glass: true, height: 44 });
    action(20, 711, 166, 'Refresh access');
    action(20, 766, 353, 'Inactivity details');
  }

  function phoneLimit() {
    phoneHeading('Photo limit reached', 32);
    t(20, 279, '50 of 50 pages used', 28, 600, C.ink, 'letter-spacing="-.5"');
    ui(20, 315, 'No pages reserved.', 16, 400, C.muted);
    rule(20, 354, 353);
    ui(20, 399, 'Next reset', 15, 500, C.muted);
    ui(20, 435, '15 Nov 2026, 00:00 UTC', 20, 500);
    ui(20, 493, 'Only photo processing is paused.', 17, 500);
    lines(20, 535, ['You can still add recipes manually,', 'cook and use your shopping list.'], 16, 27, C.muted);
    button(20, 638, 353, 'Add a recipe manually', { tone: 'primary', glass: true, height: 48 });
    button(20, 711, 353, 'Open cookbook', { glass: true, height: 44 });
    action(20, 771, 353, 'View usage');
  }

  function padChrome() {
    padStatus();
    circleButton('chevron.left', 32, 42);
    t(94, 72, 'Family Cookbook', 20, 600, C.ink, 'letter-spacing="-.3"');
    home(1194, 834);
  }

  function padSidebar(selected) {
    t(32, 157, 'Account', 28, 600, C.ink, 'letter-spacing="-.5"');
    ui(32, 185, 'Synthetic billing demo', 12, 400, C.muted);
    ['Your plan', 'Usage', 'Subscription'].forEach((label, index) => {
      const y = 217 + index * 65;
      target(20, y, 240, 52, label);
      if (label === selected) rect(20, y, 240, 52, C.pale, 14);
      ui(36, y + 33, label, 17, label === selected ? 600 : 400, label === selected ? '#0b7469' : C.ink);
    });
    add(`<path d="M284 128v652" stroke="${C.line}" stroke-width="1"/>`);
    ui(32, 685, 'anna@example.com', 15, 500);
    ui(32, 713, 'Anna · You · Payer', 13, 400, C.muted);
    action(32, 744, 228, 'Back to account');
  }

  function padHeading(title, subtitle = '') {
    t(326, 165, title, 44, 700, C.ink, 'letter-spacing="-1.2"');
    if (subtitle) ui(326, 205, subtitle, 17, 400, C.muted);
  }

  function padPlan() {
    padSidebar('Your plan');
    padHeading('Your plan', 'Sample · Shared by your household');
    ui(326, 261, 'Free sample. No card. No auto-renewal.', 18, 400, C.muted);
    t(326, 326, 'Household capacity', 24, 600, C.ink, 'letter-spacing="-.4"');
    valueRow(326, 377, 360, 'People', '3 / 5', { size: 18 });
    valueRow(326, 439, 360, 'Recipes', '8 / 10', { size: 18 });
    valueRow(326, 501, 360, 'Original files', '34 / 100 MB', { size: 18 });
    t(766, 326, 'Sample AI totals', 24, 600, C.ink, 'letter-spacing="-.4"');
    valueRow(766, 377, 376, 'Photo pages', '4 / 5', { size: 18 });
    valueRow(766, 439, 376, 'Audio minutes', '7 / 10', { size: 18 });
    valueRow(766, 501, 376, 'Assistant answers', '12 / 20', { size: 18 });
    ui(326, 594, 'Shared by all household members.', 18, 400, C.ink);
    lines(766, 579, ['AI limits are totals for this sample.', 'They do not reset monthly.'], 17, 28);
    button(326, 704, 240, 'Usage rules', { glass: true, height: 48 });
  }

  function padUsage() {
    padSidebar('Usage');
    padHeading('Usage', 'Family · Shared by your household');
    t(326, 274, 'Capacity', 25, 600, C.ink, 'letter-spacing="-.4"');
    valueRow(326, 326, 360, 'People', '3 / 5', { size: 18 });
    valueRow(326, 388, 360, 'Recipes', '42 / 500', { size: 18 });
    valueRow(326, 450, 360, 'Original files', '164 MB / 1 GB', { size: 18 });
    ui(326, 510, 'Capacity does not reset monthly.', 17, 400, C.muted);
    t(766, 274, 'Monthly processing', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(766, 312, '15 Oct - 15 Nov 2026', 16, 400, C.muted);
    valueRow(766, 364, 376, 'Photo pages used', '14 / 50', { size: 18, reserved: '2 pages reserved separately' });
    valueRow(766, 445, 376, 'Audio minutes used', '18 / 60', { size: 18 });
    valueRow(766, 507, 376, 'Assistant answers used', '37 / 200', { size: 18, reserved: '1 answer reserved separately' });
    ui(766, 596, 'Resets 15 Nov 2026, 00:00 UTC', 16, 500);
    ui(766, 630, 'Shared allowance · No rollover', 15, 400, C.muted);
    lines(326, 584, ['Reservations hold allowance while jobs run.', 'They are not included in used amounts.'], 16, 27);
    button(326, 704, 240, 'Usage rules', { glass: true, height: 48 });
  }

  function padSubscription() {
    padSidebar('Subscription');
    padHeading('Subscription', 'Verified household access');
    t(326, 281, 'Family', 32, 600, C.ink, 'letter-spacing="-.5"');
    ui(814, 277, 'Active', 17, 600, C.accent, 'text-anchor="end"');
    ui(326, 338, 'Access verified through', 17, 400, C.muted);
    t(326, 382, '20 Oct 2026', 32, 600, C.ink, 'letter-spacing="-.5"');
    rule(326, 415, 488);
    ui(326, 460, 'Payer', 15, 500, C.muted);
    ui(326, 497, 'anna@example.com', 24, 500);
    ui(326, 532, 'Anna · You · Payer', 16, 400, C.muted);
    ui(326, 577, 'Administrator: Alex', 17, 400);
    t(866, 281, 'Usage reset', 24, 600, C.ink, 'letter-spacing="-.4"');
    ui(866, 327, '15 Nov 2026', 22, 500);
    ui(866, 360, '00:00 UTC', 18, 400, C.muted);
    lines(866, 420, ['This date is separate', 'from your verified', 'access date.'], 17, 28);
    button(326, 660, 280, 'Refresh access', { glass: true, height: 48 });
    action(866, 660, 276, 'View usage', 17);
  }

  function padArchive() {
    padSidebar('Subscription');
    padHeading('Archive', 'Paid access ended 20 Oct 2026 · As of 21 Oct 2026');
    t(326, 284, 'Your cookbook remains', 27, 600, C.ink, 'letter-spacing="-.4"');
    ui(326, 324, '42 recipes · All 3 members retained', 18, 400, C.muted);
    lines(326, 389, ['Read, search, cook, download and export.', 'Check existing shopping items offline.'], 18, 32, C.ink);
    t(866, 284, 'Unavailable', 27, 600, C.ink, 'letter-spacing="-.4"');
    lines(866, 338, ['New recipes and edits.', 'Uploads and AI processing.', 'New shopping-list items.'], 17, 33, C.muted);
    rule(326, 509, 816);
    button(326, 579, 240, 'Open cookbook', { tone: 'primary', glass: true, height: 48 });
    button(598, 579, 240, 'Export cookbook', { glass: true, height: 48 });
    button(866, 579, 276, 'Refresh access', { glass: true, height: 48 });
    action(326, 695, 816, 'Inactivity details', 17);
  }

  function padGrace() {
    padSidebar('Subscription');
    padHeading('Temporary access', 'Verified grace access');
    t(326, 281, 'Family', 32, 600, C.ink, 'letter-spacing="-.5"');
    ui(326, 332, 'Verified grace access is active.', 20, 500);
    ui(326, 375, 'The end time is not available.', 19, 400, C.muted);
    rule(326, 414, 488);
    lines(326, 462, ['Your cookbook remains available while', 'this verified temporary access is active.'], 18, 31, C.ink);
    t(866, 281, 'Account', 27, 600, C.ink, 'letter-spacing="-.4"');
    ui(866, 331, 'anna@example.com', 21, 500);
    ui(866, 365, 'Anna · You · Payer', 15, 400, C.muted);
    ui(866, 419, 'Administrator: Alex', 16, 400);
    button(326, 609, 280, 'Refresh access', { glass: true, height: 48 });
    button(866, 609, 276, 'Open cookbook', { tone: 'primary', glass: true, height: 48 });
    ui(326, 719, 'Refresh access to check the latest status.', 17, 400, C.muted);
  }

  return [
    { name: 'iphone-plan', width: 393, height: 852, platform: 'apple', content: phonePlan, chrome: phoneChrome },
    { name: 'iphone-usage', width: 393, height: 852, platform: 'apple', content: phoneUsage, chrome: phoneChrome },
    { name: 'iphone-subscription', width: 393, height: 852, platform: 'apple', content: phoneSubscription, chrome: phoneChrome },
    { name: 'iphone-archive', width: 393, height: 852, platform: 'apple', content: phoneArchive, chrome: phoneChrome },
    { name: 'iphone-limit', width: 393, height: 852, platform: 'apple', content: phoneLimit, chrome: phoneChrome },
    { name: 'ipad-plan', width: 1194, height: 834, platform: 'apple', content: padPlan, chrome: padChrome },
    { name: 'ipad-usage', width: 1194, height: 834, platform: 'apple', content: padUsage, chrome: padChrome },
    { name: 'ipad-subscription', width: 1194, height: 834, platform: 'apple', content: padSubscription, chrome: padChrome },
    { name: 'ipad-archive', width: 1194, height: 834, platform: 'apple', content: padArchive, chrome: padChrome },
    { name: 'ipad-grace', width: 1194, height: 834, platform: 'apple', content: padGrace, chrome: padChrome },
  ];
};
