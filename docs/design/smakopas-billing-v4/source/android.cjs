// Static Android plan and access artwork. No purchase or entitlement behavior is implemented.
module.exports = function androidBilling(h) {
  const { C, rule, text, ui, lines, button, androidStatus, androidGesture, androidIconButton } = h;

  function chrome() {
    androidStatus();
    androidIconButton('arrow_back', 8, 32, 'Back to account');
    ui(72, 65, 'Settings', 22, 500);
    ui(20, 864, 'Synthetic billing demo', 12, 400, C.muted);
    androidGesture();
  }

  function row(y, label, value, detail = '') {
    ui(20, y, label, 16, 500);
    ui(392, y, value, 16, 500, C.ink, 'text-anchor="end"');
    if (detail) ui(20, y + 25, detail, 14, 400, C.muted);
    rule(20, y + (detail ? 46 : 22), 372);
  }

  function plan() {
    text(20, 152, 'Your plan', 34, 700, C.ink, 'letter-spacing="-.8"');
    text(20, 216, 'Free sample', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 250, 'Anna · Payer · anna@example.com', 14, 400, C.muted);
    row(299, 'People', '3 of 5');
    row(357, 'Saved recipes', '8 of 10');
    row(415, 'Original storage', '34 MB of 100 MB');
    row(473, 'Image pages', '4 of 5', 'Total allowance');
    row(551, 'Audio minutes', '7 of 10', 'Total allowance');
    row(629, 'Assistant answers', '12 of 20', 'Total allowance');
    lines(20, 718, ['Sample AI allowances do not reset.', 'No countdown or automatic renewal.'], 15, 24);
    button(20, 789, 372, 'Refresh access', { height: 48 });
  }

  function usage() {
    text(20, 152, 'Household usage', 32, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 188, 'Family · Shared monthly allowances', 15, 400, C.muted);
    ui(20, 224, '15 Oct - 15 Nov 2026', 17, 500);
    ui(20, 250, 'Next reset: 15 Nov, 00:00 UTC', 14, 400, C.muted);
    row(296, 'Image pages', '14 of 50 used', '2 reserved · 34 available');
    row(375, 'Audio minutes', '18 of 60 used', '42 available');
    row(454, 'Assistant answers', '37 of 200 used', '1 reserved · 162 available');
    text(20, 540, 'Stored in your cookbook', 22, 600, C.ink, 'letter-spacing="-.3"');
    row(577, 'Recipes', '42 of 500');
    row(630, 'Original storage', '164 MB of 1 GB');
    row(683, 'People', '3 of 5');
    lines(20, 733, ['No rollover. Failed tasks release', 'their reserved units.'], 14, 23);
    button(20, 789, 372, 'Refresh usage', { height: 48 });
  }

  function subscription() {
    text(20, 152, 'Family access', 33, 700, C.ink, 'letter-spacing="-.8"');
    ui(392, 151, 'Active', 14, 600, C.accent, 'text-anchor="end"');
    ui(20, 207, 'Your household plan', 15, 400, C.muted);
    rule(20, 234, 372);
    text(20, 281, 'Anna · You', 24, 600);
    ui(20, 313, 'Payer · anna@example.com', 16, 400, C.muted);
    ui(20, 374, 'Verified access through', 15, 500, C.muted);
    text(20, 413, '20 Oct 2026', 28, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 448, 'Checked 16 Oct 2026, 09:41 UTC', 14, 400, C.muted);
    rule(20, 479, 372);
    text(20, 524, 'A separate usage schedule', 22, 600, C.ink, 'letter-spacing="-.3"');
    lines(20, 561, ['Monthly allowances reset on', '15 Nov 2026 at 00:00 UTC.'], 16, 25);
    ui(20, 636, 'Access belongs to this household.', 15, 400, C.muted);
    button(20, 692, 372, 'Refresh access', { tone: 'primary', height: 48 });
    button(20, 758, 372, 'View usage', { height: 48 });
  }

  function archive() {
    text(20, 152, 'Archive', 36, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 193, 'Paid access ended on 20 Oct 2026.', 16, 400, C.muted);
    text(20, 254, 'All 42 recipes are here.', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 286, 'All 3 members keep access.', 16, 400, C.muted);
    rule(20, 315, 372);
    text(20, 355, 'Still available', 22, 600);
    lines(20, 390, ['Read, cook and search all recipes.', 'Download originals and export.', 'Check existing shopping items, even offline.'], 15, 25, C.ink);
    text(20, 493, 'Paused', 22, 600);
    lines(20, 527, ['New recipes, uploads and edits,', 'AI and new shopping additions.'], 15, 25);
    button(20, 584, 372, 'Open cookbook', { tone: 'primary', height: 48 });
    button(20, 650, 372, 'Export cookbook', { height: 48 });
    button(20, 712, 372, 'Refresh access', { tone: 'text', height: 48 });
    lines(20, 790, ['After 12 months without online activity,', 'removal may be scheduled with prior notices.', 'Export and deletion never require payment.'], 13, 21);
  }

  function refreshError() {
    text(20, 151, 'Couldn’t refresh', 33, 700, C.ink, 'letter-spacing="-.7"');
    text(20, 191, 'access', 33, 700, C.ink, 'letter-spacing="-.7"');
    lines(20, 239, ['Check your connection and try again.', 'Your current access is not confirmed.'], 16, 25, C.muted);
    rule(20, 307, 372);
    text(20, 353, 'Last known status', 23, 600);
    ui(20, 393, 'Family · Active', 21, 500);
    ui(20, 427, 'Checked 16 Oct 2026, 09:41 UTC', 14, 400, C.muted);
    lines(20, 491, ['A connection error does not confirm', 'that your access has ended.'], 16, 25, C.warning);
    ui(20, 576, 'No purchase or plan change was made.', 15, 400, C.muted);
    button(20, 632, 372, 'Try again', { tone: 'primary', height: 48 });
    button(20, 698, 372, 'Open cookbook', { height: 48 });
    ui(20, 791, 'We’ll check the signed-in account.', 15, 400, C.muted);
  }

  return [
    { name: 'android-plan', width: 412, height: 915, platform: 'android', content: plan, chrome },
    { name: 'android-usage', width: 412, height: 915, platform: 'android', content: usage, chrome },
    { name: 'android-subscription', width: 412, height: 915, platform: 'android', content: subscription, chrome },
    { name: 'android-archive', width: 412, height: 915, platform: 'android', content: archive, chrome },
    { name: 'android-refresh-error', width: 412, height: 915, platform: 'android', content: refreshError, chrome },
  ];
};
