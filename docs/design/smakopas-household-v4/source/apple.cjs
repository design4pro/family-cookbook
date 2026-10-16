// Static Apple artboards. These drawings do not implement account or household features.
module.exports = function appleHouseholdArtboards(h) {
  const { C, add, rect, rule, t, ui, lines, target, sf, button, glass, circleButton, phoneStatus, padStatus, home } = h;
  const members = [
    { email: 'alex@example.com', detail: 'Alex · You · Administrator' },
    { email: 'anna@example.com', detail: 'Anna · Member · Payer' },
    { email: 'sam@example.com', detail: 'Sam · Member' },
  ];

  function action(x, y, width, label, color = C.accent, size = 16) {
    target(x, y, width, 44, label);
    ui(x, y + 28, label, size, 500, color);
  }

  function phoneChrome({ account = false, join = false } = {}) {
    phoneStatus();
    circleButton(join ? 'xmark' : 'chevron.left', 20, 64);
    if (!join && !account) circleButton('person.crop.circle', 329, 64);
    home();
  }

  function phoneTitle(title) {
    t(20, 153, title, 33, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 182, 'Synthetic household demo', 12, 400, C.muted);
  }

  function phoneMember(member, y, manage = true) {
    ui(20, y + 28, member.email, 17, 500);
    ui(20, y + 52, manage ? member.detail : member.detail.replace(' · You', ''), 13, 400, C.muted);
    if (manage && member.email !== 'alex@example.com') {
      target(329, y + 13, 44, 44, `Manage ${member.email}`);
      sf('ellipsis', 339, y + 23, 24, 'muted');
    }
    rule(20, y + 73, 353);
  }

  function phoneHousehold() {
    phoneTitle('Household');
    t(20, 235, 'Members', 23, 600, C.ink, 'letter-spacing="-.3"');
    ui(373, 232, '3 of 5', 15, 500, C.muted, 'text-anchor="end"');
    members.forEach((member, index) => phoneMember(member, 251 + index * 80));
    t(20, 525, 'Pending invitation', 20, 600, C.ink, 'letter-spacing="-.2"');
    ui(20, 555, 'jordan@example.com', 17, 500);
    ui(20, 580, 'Expires in 7 days · Member', 14, 400, C.muted);
    action(20, 591, 180, 'Revoke invitation', C.warning);
    ui(20, 652, 'Invitations do not reserve a place.', 13, 400, C.muted);
    button(20, 671, 353, 'Invite a member', { tone: 'primary', glass: true, height: 48 });
    action(20, 739, 353, 'Transfer administration');
  }

  function phoneInvite() {
    phoneTitle('Invite a member');
    sf('checkmark', 20, 232, 26, 'accent');
    t(58, 253, 'Invitation ready', 24, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 300, 'Invited email', 14, 500, C.muted);
    ui(20, 332, 'jordan@example.com', 21, 500);
    rule(20, 354, 353);
    ui(20, 389, 'Private invitation link', 17, 500);
    lines(20, 421, ['No email sent.', 'Copy and share the link.'], 17, 26, C.ink);
    button(20, 477, 353, 'Copy invitation link', { tone: 'primary', glass: true, height: 48 });
    lines(20, 550, ['Copy before leaving. You cannot', 'retrieve this link later.'], 14, 23);
    lines(20, 624, ['Expires in 7 days. Only the verified', 'email above can use this invitation.'], 15, 24);
    ui(20, 697, 'A place is checked again when Jordan joins.', 13, 400, C.muted);
    action(20, 730, 353, 'Revoke invitation', C.warning);
  }

  function accountRow(x, y, width, label, detail = '', { disabled = false, color = C.ink } = {}) {
    const height = detail ? 64 : 52;
    target(x, y, width, height, label, disabled);
    ui(x, y + 25, label, 17, 500, disabled ? C.muted : color);
    if (detail) ui(x, y + 48, detail, 12, 400, C.muted);
    if (!disabled) sf('chevron.right', x + width - 22, y + 16, 18, 'muted');
    rule(x, y + height, width);
  }

  function phoneAccount() {
    phoneTitle('Your account');
    ui(20, 233, 'alex@example.com', 22, 500);
    ui(20, 263, 'Alex · Administrator', 14, 400, C.muted);
    rule(20, 286, 353);
    t(20, 324, 'Family', 24, 600, C.ink, 'letter-spacing="-.4"');
    ui(373, 320, 'Active', 15, 600, C.accent, 'text-anchor="end"');
    ui(20, 351, 'Payer: Anna · anna@example.com', 14, 400, C.muted);
    action(20, 367, 167, 'Refresh access');
    action(207, 367, 166, 'View allowance');
    rule(20, 427, 353);
    accountRow(20, 447, 353, 'Export cookbook');
    accountRow(20, 510, 353, 'Leave household', 'Transfer administration first.', { disabled: true });
    accountRow(20, 586, 353, 'Delete account', 'Review your data and billing before confirming.', { color: C.warning });
    action(20, 678, 353, 'Sign out');
  }

  function phoneJoin() {
    phoneTitle('Join a household');
    ui(20, 238, 'Use a link shared by your household.', 17, 400, C.ink);
    ui(20, 294, 'Verified email', 14, 500, C.muted);
    ui(20, 326, 'jordan@example.com', 21, 500);
    ui(20, 357, 'Join as a member', 14, 400, C.muted);
    ui(20, 406, 'Invitation link or code', 15, 500, C.ink);
    rect(20, 424, 353, 56, 'white', 12, C.line);
    target(20, 424, 353, 56, 'Invitation link or code');
    ui(36, 459, 'Private invitation code', 17, 400, C.ink);
    ui(20, 516, 'Your email must match the invitation.', 14, 400, C.muted);
    lines(20, 578, ['We check the invitation and available', 'space when you join.'], 16, 26, C.ink);
    ui(20, 658, 'You can belong to one household.', 14, 400, C.muted);
    button(20, 714, 353, 'Join household', { tone: 'primary', glass: true, height: 48 });
  }

  function padSidebar(selected = 'Household') {
    t(32, 157, 'Settings', 28, 600, C.ink, 'letter-spacing="-.5"');
    ui(32, 185, 'Synthetic household demo', 12, 400, C.muted);
    [['Household', 'book.closed'], ['Your account', 'person.crop.circle']].forEach(([label, symbol], index) => {
      const y = 217 + index * 65;
      target(20, y, 240, 52, label);
      if (selected === label) rect(20, y, 240, 52, C.pale, 14);
      sf(symbol, 34, y + 12, 28, selected === label ? 'accent' : 'muted');
      ui(77, y + 33, label, 17, selected === label ? 600 : 400, selected === label ? C.accent : C.ink);
    });
    add(`<path d="M284 128v652" stroke="${C.line}" stroke-width="1"/>`);
    ui(32, 684, 'alex@example.com', 15, 500);
    ui(32, 711, 'Alex · Administrator', 13, 400, C.muted);
    button(32, 738, 228, 'Back to Cookbook', { glass: true, height: 44 });
  }

  function padChrome() {
    padStatus();
    ui(32, 70, 'Family Cookbook', 17, 600);
    circleButton('xmark', 1118, 42);
    home(1194, 834);
  }

  function padTitle(title, subtitle) {
    t(326, 164, title, 43, 700, C.ink, 'letter-spacing="-1.1"');
    if (subtitle) ui(326, 204, subtitle, 17, 400, C.muted);
  }

  function padHousehold() {
    padSidebar();
    padTitle('Household', 'One shared cookbook. Up to five people.');
    t(326, 276, 'Members', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(798, 273, '3 of 5', 16, 500, C.muted, 'text-anchor="end"');
    members.forEach((member, index) => {
      const y = 297 + index * 88;
      ui(326, y + 28, member.email, 19, 500);
      ui(326, y + 58, member.detail, 15, 400, C.muted);
      if (index) {
        target(754, y + 16, 44, 44, `Manage ${member.email}`);
        sf('ellipsis', 764, y + 26, 24, 'muted');
      }
      rule(326, y + 80, 472);
    });
    t(850, 276, 'Pending invitation', 23, 600, C.ink, 'letter-spacing="-.4"');
    ui(850, 321, 'jordan@example.com', 18, 500);
    ui(850, 351, 'Member · Expires in 7 days', 14, 400, C.muted);
    action(850, 373, 292, 'Revoke invitation', C.warning);
    lines(850, 458, ['Invitations do not reserve', 'a place in your household.'], 15, 25);
    button(326, 617, 268, 'Invite a member', { tone: 'primary', glass: true, height: 48 });
    action(326, 703, 330, 'Transfer administration', C.accent, 17);
    lines(850, 623, ['The administrator manages', 'membership. The payer', 'manages their own purchase.'], 15, 25);
  }

  function padInvite() {
    padSidebar();
    padTitle('Invite a member', 'Share the cookbook with someone in your household.');
    sf('checkmark', 326, 263, 30, 'accent');
    t(369, 289, 'Invitation ready', 27, 600, C.ink, 'letter-spacing="-.4"');
    ui(326, 344, 'Invited email', 15, 500, C.muted);
    ui(326, 379, 'jordan@example.com', 23, 500);
    rule(326, 405, 496);
    ui(326, 448, 'Private invitation link', 19, 500);
    ui(326, 483, 'No email sent. Copy and share the link.', 17, 400, C.ink);
    button(326, 517, 286, 'Copy invitation link', { tone: 'primary', glass: true, height: 48 });
    lines(326, 607, ['Copy the link before leaving.', 'You cannot retrieve it later.'], 16, 25);
    action(326, 699, 280, 'Revoke invitation', C.warning, 17);
    lines(866, 345, ['Expires in 7 days.', 'Only the verified email', 'shown here can join.'], 16, 27);
    rule(866, 446, 276);
    lines(866, 487, ['An invitation does not', 'reserve a place. Availability', 'is checked again at joining.'], 16, 27);
  }

  function padAccount() {
    padSidebar('Your account');
    padTitle('Your account', 'Your identity, data and household access.');
    ui(326, 277, 'alex@example.com', 26, 500);
    ui(326, 310, 'Alex · Administrator', 16, 400, C.muted);
    rule(326, 338, 490);
    accountRow(326, 370, 490, 'Export cookbook');
    accountRow(326, 439, 490, 'Leave household', 'Transfer administration first.', { disabled: true });
    accountRow(326, 521, 490, 'Delete account', 'Review your data and billing before confirming.', { color: C.warning });
    action(326, 626, 490, 'Sign out', C.accent, 17);
    t(866, 277, 'Family', 29, 600, C.ink, 'letter-spacing="-.4"');
    ui(1142, 274, 'Active', 16, 600, C.accent, 'text-anchor="end"');
    ui(866, 318, 'Payer: Anna', 17, 500);
    ui(866, 344, 'anna@example.com', 15, 400, C.muted);
    lines(866, 390, ['Access is shared by', 'your household.'], 16, 26);
    button(866, 464, 276, 'Refresh access', { glass: true, height: 48 });
    action(866, 535, 276, 'View allowance', C.accent, 17);
  }

  function padJoin() {
    t(52, 165, 'Join a household', 44, 700, C.ink, 'letter-spacing="-1.2"');
    ui(52, 204, 'Synthetic household demo', 13, 400, C.muted);
    add(`<path d="M724 257v470" stroke="${C.line}" stroke-width="1"/>`);
    ui(52, 280, 'Use a link shared by your household.', 19, 400, C.ink);
    ui(52, 335, 'Verified email', 15, 500, C.muted);
    ui(52, 371, 'jordan@example.com', 25, 500);
    ui(52, 403, 'Join as a member', 16, 400, C.muted);
    ui(52, 457, 'Invitation link or code', 17, 500, C.ink);
    rect(52, 476, 620, 56, 'white', 12, C.line);
    target(52, 476, 620, 56, 'Invitation link or code');
    ui(70, 511, 'Private invitation code', 18, 400, C.ink);
    ui(52, 567, 'Your email must match the invitation.', 16, 400, C.muted);
    lines(52, 618, ['We check the invitation and available space', 'when you join.'], 17, 28, C.ink);
    button(52, 688, 330, 'Join household', { tone: 'primary', glass: true, height: 52 });
    t(770, 280, 'One shared cookbook', 28, 600, C.ink, 'letter-spacing="-.4"');
    lines(770, 327, ['After joining, you can browse', 'the household’s recipes and', 'contribute as a member.'], 18, 30, C.ink);
    rule(770, 443, 372);
    t(770, 488, 'Your membership', 23, 600, C.ink, 'letter-spacing="-.3"');
    lines(770, 531, ['You can belong to one', 'household at a time.', 'Joining does not make you', 'the administrator or payer.'], 16, 28);
  }

  function padHandover() {
    padSidebar();
    padTitle('Transfer administration', 'A request is pending. Your role has not changed.');
    ui(326, 282, 'Waiting for acceptance', 18, 600, C.accent);
    t(326, 332, 'Sam', 32, 600, C.ink, 'letter-spacing="-.5"');
    ui(326, 366, 'sam@example.com · Existing member', 17, 400, C.muted);
    rule(326, 399, 488);
    lines(326, 441, ['Sam has 7 days to accept.', 'You remain the administrator until then.', 'After acceptance, you become a member.'], 18, 31, C.ink);
    ui(326, 565, 'Identity confirmed before creating this request.', 15, 400, C.muted);
    ui(326, 595, 'Sam can review the request in the app.', 15, 400, C.muted);
    button(326, 641, 280, 'Cancel transfer request', { glass: true, height: 48 });
    t(866, 282, 'What stays the same', 23, 600, C.ink, 'letter-spacing="-.4"');
    ui(866, 329, 'Payer: Anna', 18, 500);
    ui(866, 358, 'anna@example.com', 15, 400, C.muted);
    lines(866, 411, ['This transfers administration.', 'It does not move a purchase', 'or change recipe authorship.'], 15, 26);
    rule(866, 509, 276);
    lines(866, 551, ['Your invitations remain valid', 'while this request is pending.', 'They are revoked if Sam accepts.'], 15, 26);
    lines(866, 665, ['Only one transfer can', 'be pending at a time.'], 15, 26);
  }

  return [
    { name: 'iphone-household', width: 393, height: 852, platform: 'apple', content: phoneHousehold, chrome: phoneChrome },
    { name: 'iphone-invite', width: 393, height: 852, platform: 'apple', content: phoneInvite, chrome: phoneChrome },
    { name: 'iphone-account', width: 393, height: 852, platform: 'apple', content: phoneAccount, chrome: () => phoneChrome({ account: true }) },
    { name: 'iphone-join', width: 393, height: 852, platform: 'apple', content: phoneJoin, chrome: () => phoneChrome({ join: true }) },
    { name: 'ipad-household', width: 1194, height: 834, platform: 'apple', content: padHousehold, chrome: padChrome },
    { name: 'ipad-invite', width: 1194, height: 834, platform: 'apple', content: padInvite, chrome: padChrome },
    { name: 'ipad-account', width: 1194, height: 834, platform: 'apple', content: padAccount, chrome: padChrome },
    { name: 'ipad-join', width: 1194, height: 834, platform: 'apple', content: padJoin, chrome: padChrome },
    { name: 'ipad-handover', width: 1194, height: 834, platform: 'apple', content: padHandover, chrome: padChrome },
  ];
};
