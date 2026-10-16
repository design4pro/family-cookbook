// Static Android design drawings; no settings or membership behavior is implemented.
module.exports = function androidHousehold(h) {
  const { C, rect, rule, text, ui, lines, target, material, button, androidStatus, androidGesture, androidIconButton } = h;
  const danger = '#a12b29';

  function chrome(title = 'Settings', selected = null) {
    androidStatus();
    rect(0, 24, 412, 64);
    androidIconButton('arrow_back', 8, 32, 'Back');
    ui(72, 65, title, 22, 500);
    if (selected) {
      [['Household', 0], ['Account', 206]].forEach(([label, x]) => {
        ui(x + 103, 120, label, 15, 600, selected === label ? C.accent : C.muted, 'text-anchor="middle"');
        target(x, 88, 206, 48, `Open ${label.toLowerCase()} settings`);
        if (selected === label) rect(x + 67, 133, 72, 3, C.accent, 1.5);
      });
      rule(0, 136, 412);
    }
    androidGesture();
  }

  function actionRow(y, title, detail, { color = C.ink, height = 66 } = {}) {
    ui(20, y + 24, title, 17, 500, color);
    if (detail) ui(20, y + 47, detail, 13, 400, C.muted);
    material('chevron_right', 364, y + 16, 24, color);
    target(20, y, 372, height, title);
    rule(20, y + height, 372);
  }

  function person(y, name, email, role, removable = false) {
    text(20, y + 25, name, 20, 600);
    ui(20, y + 51, email, 14, 400, C.muted);
    ui(392, y + 25, role, 13, 500, C.muted, 'text-anchor="end"');
    if (removable) {
      ui(392, y + 58, 'Remove', 14, 500, danger, 'text-anchor="end"');
      target(310, y + 27, 82, 48, `Review removal of ${name}`);
    }
    rule(20, y + 79, 372);
  }

  function household() {
    text(20, 190, 'Household', 34, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 221, 'One private cookbook · 3 of 5 members', 15, 400, C.muted);
    button(20, 244, 180, 'Invite a member', { tone: 'primary', height: 48 });
    person(314, 'Alex · You', 'alex@example.com', 'Administrator');
    person(394, 'Anna', 'anna@example.com', 'Member · Payer', true);
    person(474, 'Sam', 'sam@example.com', 'Member', true);
    text(20, 604, 'Pending invitation', 21, 600);
    ui(20, 638, 'jordan@example.com', 17, 400);
    ui(20, 664, 'Expires in 7 days', 14, 400, C.muted);
    ui(392, 659, 'Revoke', 14, 500, danger, 'text-anchor="end"');
    target(310, 628, 82, 48, 'Review revocation of invitation');
    ui(20, 707, 'An invitation does not reserve a place.', 14, 400, C.muted);
    rule(20, 734, 372);
    actionRow(749, 'Transfer administration', 'Payment stays with Anna.');
    ui(20, 856, 'Synthetic household demo', 12, 400, C.muted);
  }

  function invite() {
    text(20, 149, 'Invitation ready', 32, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 179, 'Synthetic household demo', 12, 400, C.muted);
    ui(20, 238, 'For this email only', 14, 500, C.muted);
    text(20, 274, 'jordan@example.com', 23, 600);
    ui(20, 305, 'Joins as a member · Expires in 7 days', 15, 400, C.muted);
    rule(20, 337, 372);
    text(20, 386, 'Share the invitation', 24, 600);
    lines(20, 423, ['No email sent. Copy and share the link.', 'Jordan must sign in with this email.'], 16, 26);
    rect(20, 488, 372, 62, 'white', 4, C.muted);
    ui(36, 525, 'Private invitation link', 17, 400);
    button(20, 570, 372, 'Copy invitation link', { tone: 'primary', height: 48 });
    lines(20, 650, ['Copy before leaving. You cannot retrieve', 'this link later. No place is reserved.'], 15, 24);
    button(20, 730, 372, 'Done', { height: 48 });
    ui(206, 826, 'Revoke invitation', 14, 500, danger, 'text-anchor="middle"');
    target(106, 794, 200, 48, 'Review revocation of invitation');
  }

  function account() {
    text(20, 190, 'Your account', 34, 700, C.ink, 'letter-spacing="-.8"');
    text(20, 241, 'Alex', 23, 600);
    ui(20, 269, 'alex@example.com · Verified', 15, 400, C.muted);
    ui(20, 295, 'Household administrator', 14, 400, C.muted);
    rule(20, 319, 372);
    text(20, 357, 'Family access', 22, 600);
    ui(392, 354, 'Active', 14, 500, C.accent, 'text-anchor="end"');
    ui(20, 385, 'Anna pays for the household.', 15, 400, C.muted);
    ui(20, 428, 'Refresh access', 14, 500, C.accent);
    target(20, 397, 140, 48, 'Refresh verified household access');
    actionRow(459, 'View allowances', 'Shared household usage');
    actionRow(525, 'Export cookbook', 'Originals, JSON and offline HTML');
    actionRow(591, 'Leave household', 'Transfer administration first.');
    actionRow(657, 'Delete account', 'Review your data before confirming.', { color: danger });
    button(20, 755, 372, 'Sign out', { height: 48 });
    ui(20, 856, 'Synthetic household demo', 12, 400, C.muted);
  }

  function join() {
    text(20, 149, 'Join the household', 31, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 179, 'Synthetic household demo', 12, 400, C.muted);
    ui(20, 239, 'Signed in and verified', 14, 500, C.muted);
    text(20, 276, 'jordan@example.com', 23, 600);
    rule(20, 310, 372);
    ui(20, 350, 'Invitation link or code', 14, 500, C.muted);
    rect(20, 367, 372, 58, 'white', 4, C.muted);
    ui(36, 402, 'Private invitation code', 17, 400);
    target(20, 367, 372, 58, 'Edit pasted invitation link or code');
    lines(20, 457, ['Use a link shared by your household.', 'Your email must match the invitation.'], 15, 24);
    text(20, 546, 'You’ll join as a member', 21, 600);
    lines(20, 581, ['Read, add and edit shared recipes.', 'Use the household shopping list.'], 16, 26);
    lines(20, 660, ['One active household per account.', 'We check the link and available space', 'when you join.'], 15, 24);
    button(20, 747, 372, 'Join household', { tone: 'primary', height: 48 });
    button(20, 810, 372, 'Not now', { tone: 'text', height: 48 });
  }

  function remove() {
    text(20, 149, 'Remove Sam?', 32, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 181, 'Review member removal', 16, 400, C.muted);
    text(20, 253, 'Sam', 24, 600);
    ui(20, 282, 'sam@example.com · Member', 16, 400, C.muted);
    rule(20, 317, 372);
    text(20, 367, 'Access ends immediately', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(20, 407, ['Sam will lose access to this household', 'and its shared cookbook.'], 16, 26, C.ink);
    text(20, 493, 'What stays', 21, 600);
    lines(20, 530, ['Sam’s account and contributions remain.', 'This does not cancel a subscription.', 'Previously downloaded exports cannot', 'be recalled.'], 16, 26);
    ui(20, 670, 'Synthetic household demo', 12, 400, C.muted);
    button(20, 747, 372, 'Keep Sam', { height: 48 });
    rect(20, 810, 372, 48, danger, 24);
    ui(206, 839, 'Remove Sam', 14, 500, 'white', 'text-anchor="middle"');
    target(20, 810, 372, 48, 'Confirm removal of Sam from household');
  }

  return [
    { name: 'android-household', width: 412, height: 915, platform: 'android', content: household, chrome: () => chrome('Settings', 'Household') },
    { name: 'android-invite', width: 412, height: 915, platform: 'android', content: invite, chrome: () => chrome('Invitation') },
    { name: 'android-account', width: 412, height: 915, platform: 'android', content: account, chrome: () => chrome('Settings', 'Account') },
    { name: 'android-join', width: 412, height: 915, platform: 'android', content: join, chrome: () => chrome('Invitation') },
    { name: 'android-remove', width: 412, height: 915, platform: 'android', content: remove, chrome: () => chrome('Household') },
  ];
};
