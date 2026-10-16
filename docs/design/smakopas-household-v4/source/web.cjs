// Static web design artboards. These drawing instructions are not application UI.
module.exports = function webArtboards(h) {
  const { C, add, rect, rule, text, lines, target, icon, button } = h;

  function header(isMobile = false, visitor = false) {
    const x = isMobile ? 16 : 112;
    text(x, 40, 'Family Cookbook', 20, 800, C.ink, 'letter-spacing="-.45"');
    target(x, 10, 206, 44, 'Open Cookbook');
    if (isMobile) {
      const accountX = visitor ? 352 : 300;
      add(`<circle cx="${accountX}" cy="32" r="18" fill="${C.pale}"/>`);
      text(accountX, 38, visitor ? 'J' : 'A', 15, 600, C.accent, 'text-anchor="middle"');
      target(accountX - 22, 10, 44, 44, 'Open account');
      if (!visitor) {
        icon('menu', 346, 20, 24);
        target(336, 10, 44, 44, 'Open navigation');
      }
      return;
    }
    if (!visitor) {
      text(916, 39, 'Cookbook', 15, 500, C.muted);
      text(1027, 39, 'Assistant', 15, 500, C.muted);
      text(1130, 39, 'Shopping', 15, 500, C.muted);
      target(906, 10, 91, 44, 'Open Cookbook');
      target(1017, 10, 86, 44, 'Open Assistant');
      target(1120, 10, 91, 44, 'Open Shopping');
    }
    add(`<circle cx="1308" cy="32" r="20" fill="${C.pale}"/>`);
    text(1308, 38, visitor ? 'J' : 'A', 15, 600, C.accent, 'text-anchor="middle"');
    target(1286, 10, 44, 44, 'Open account');
  }

  function footer(y, isMobile = false) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 1216;
    rule(x, y, width);
    if (isMobile) {
      lines(x, y + 24, ['Synthetic household demo · Static design', 'Family Cookbook is a working name.'], 11, 18, C.muted);
    } else {
      text(x, y + 27, 'Synthetic household demo · Static design · Family Cookbook is a working name.', 12, 400, C.muted);
    }
  }

  function textAction(x, y, width, label, arrow = false) {
    text(x, y + 28, label, 14, 600, C.accent);
    if (arrow) icon('arrow', x + width - 20, y + 13, 18, C.accent);
    target(x, y, width, 44, label);
  }

  function subnav(account = false, isMobile = false) {
    const x = isMobile ? 16 : 112, y = 212;
    text(x, y + 28, 'Household', 15, account ? 500 : 600, account ? C.muted : C.ink);
    text(x + 138, y + 28, 'Account', 15, account ? 600 : 500, account ? C.ink : C.muted);
    target(x, y, 104, 44, 'Open household settings');
    target(x + 128, y, 94, 44, 'Open account settings');
    rule(x, y + 44, isMobile ? 358 : 1216);
    rule(x + (account ? 138 : 0), y + 44, account ? 60 : 78, C.accent);
  }

  function settingsTitle(account = false, isMobile = false) {
    const x = isMobile ? 16 : 112;
    text(x, isMobile ? 123 : 137, account ? 'My account' : 'My household', isMobile ? 35 : 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(x, isMobile ? 161 : 174, account ? 'Your sign-in and membership.' : 'One cookbook, shared with your household.', isMobile ? 15 : 18, 400, C.muted);
    subnav(account, isMobile);
  }

  function backToHousehold(isMobile = false) {
    const x = isMobile ? 16 : 112;
    icon('back', x, 85, 18, C.muted);
    text(x + 27, 100, 'Household', 14, 500, C.muted);
    target(x - 6, 72, 148, 44, 'Return to household');
  }

  function member(y, name, email, { isMobile = false, admin = false, payer = false, removable = false } = {}) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 768;
    const height = isMobile ? (payer ? 134 : 112) : 104;
    text(x, y + 31, admin ? `${name} · You` : name, isMobile ? 21 : 23, 600, C.ink, 'letter-spacing="-.3"');
    text(x, y + 59, admin ? 'Administrator' : 'Member', 15, 500);
    text(x, y + 83, email, 14, 400, C.muted);
    if (payer) {
      text(isMobile ? x : x + width, y + (isMobile ? 108 : 59), 'Pays for Family', 14, 500, C.muted, isMobile ? '' : 'text-anchor="end"');
    }
    if (removable) textAction(x + width - 78, y + 11, 78, 'Remove');
    rule(x, y + height, width);
    return height;
  }

  function familyDetails(x, y, isMobile = false) {
    text(x, y, 'Family · Active', isMobile ? 22 : 25, 600, C.ink, 'letter-spacing="-.4"');
    text(x, y + 34, 'Paid by Anna', 16, 500);
    lines(x, y + 74, ['Administration and payment are separate.', 'Anna manages her own purchase.'], 15, 25, C.muted);
    textAction(x, y + 118, isMobile ? 358 : 352, 'Plan and allowance details', true);
  }

  function desktopHousehold() {
    settingsTitle();
    text(112, 316, 'Members', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(232, 316, '3 of 5 places in use', 15, 400, C.muted);
    button(704, 285, 176, 'Invite someone', { tone: 'primary', height: 48 });
    rule(112, 344, 768);
    member(344, 'Alex', 'alex@example.com', { admin: true });
    member(448, 'Anna', 'anna@example.com', { payer: true, removable: true });
    member(552, 'Sam', 'sam@example.com', { removable: true });
    textAction(112, 677, 260, 'Transfer administration', true);

    text(112, 778, 'Pending invitation', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(112, 824, 'jordan@example.com', 20, 500);
    text(112, 854, 'Expires in 7 days · Does not reserve a place', 14, 400, C.muted);
    textAction(802, 799, 78, 'Revoke');
    rule(112, 883, 768);

    text(976, 316, 'Sharing a cookbook', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(976, 360, ['Everyone here shares the household’s', 'recipes and shopping list.'], 16, 26, C.muted);
    lines(976, 444, ['As administrator, you manage invitations', 'and membership. You can pass this role', 'to another member.'], 15, 25, C.muted);
    familyDetails(976, 605);
    footer(948);
  }

  function mobileHousehold() {
    settingsTitle(false, true);
    text(16, 317, 'Members', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(374, 317, '3 of 5 places in use', 14, 400, C.muted, 'text-anchor="end"');
    button(16, 347, 358, 'Invite someone', { tone: 'primary', height: 48 });
    rule(16, 418, 358);
    member(418, 'Alex', 'alex@example.com', { isMobile: true, admin: true });
    member(530, 'Anna', 'anna@example.com', { isMobile: true, payer: true, removable: true });
    member(664, 'Sam', 'sam@example.com', { isMobile: true, removable: true });
    textAction(16, 795, 358, 'Transfer administration', true);

    text(16, 898, 'Pending invitation', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 945, 'jordan@example.com', 18, 500);
    textAction(296, 919, 78, 'Revoke');
    text(16, 977, 'Expires in 7 days', 14, 400, C.muted);
    lines(16, 1007, ['Pending invitations do not reserve a place.', 'Availability is checked when someone joins.'], 14, 23, C.muted);
    rule(16, 1060, 358);
    familyDetails(16, 1121, true);
    footer(1344, true);
  }

  function invitedEmail(x, y, width, isMobile = false) {
    text(x, y, 'Invited email · Read-only', 14, 500, C.muted);
    rect(x, y + 19, width, 58, C.surface, 8);
    text(x + 18, y + 55, 'jordan@example.com', isMobile ? 19 : 21, 500);
  }

  function privateLink(x, y, width, isMobile = false) {
    rule(x, y, width);
    text(x, y + 35, 'Private invitation link', isMobile ? 21 : 24, 600, C.ink, 'letter-spacing="-.4"');
    text(x, y + 65, 'Only jordan@example.com can accept.', isMobile ? 14 : 15, 400, C.muted);
    rule(x, y + 91, width);
  }

  function desktopInvite() {
    backToHousehold();
    text(112, 181, 'Invitation ready', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 221, 'Share this private link with Jordan.', 18, 400, C.muted);
    invitedEmail(112, 296, 768);
    privateLink(112, 425, 768);
    text(112, 562, 'No email sent. Copy and share the link.', 17, 500);
    button(112, 600, 254, 'Copy invitation link', { tone: 'primary', height: 48 });
    textAction(402, 602, 150, 'Revoke invitation');
    lines(112, 711, ['Keep this page open until you have copied the link.', 'You will not be able to retrieve it from pending invitations.'], 15, 25, C.muted);

    text(976, 316, 'Valid for 7 days', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(976, 360, ['The recipient signs in and verifies the', 'invited email before accepting.'], 15, 25, C.muted);
    text(976, 467, '3 of 5 places in use', 22, 600, C.ink, 'letter-spacing="-.3"');
    lines(976, 509, ['This invitation does not reserve a place.', 'Availability is checked again when', 'Jordan chooses to join.'], 15, 25, C.muted);
    footer(948);
  }

  function mobileInvite() {
    backToHousehold(true);
    text(16, 161, 'Invitation ready', 35, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 202, 'Share this private link with Jordan.', 16, 400, C.muted);
    invitedEmail(16, 266, 358, true);
    privateLink(16, 390, 358, true);
    lines(16, 525, ['No email sent.', 'Copy and share the link.'], 16, 25, C.ink);
    button(16, 587, 358, 'Copy invitation link', { tone: 'primary', height: 48 });
    textAction(16, 653, 180, 'Revoke invitation');
    lines(16, 737, ['Keep this page open until you copy the link.', 'It cannot be retrieved later.'], 14, 23, C.muted);
    text(16, 831, 'Valid for 7 days', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 869, ['3 of 5 places in use.', 'This invitation does not reserve a place.', 'Availability is checked when Jordan joins.'], 14, 24, C.muted);
    footer(1044, true);
  }

  function accountRow(y, label, detail, isMobile = false, height = 86) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 768;
    text(x, y + 31, label, isMobile ? 19 : 21, 500);
    text(x, y + 58, detail, isMobile ? 13 : 15, 400, C.muted);
    icon('arrow', x + width - 24, y + 16, 22, C.accent);
    target(x, y + 1, width, height - 2, label);
    rule(x, y + height, width);
  }

  function desktopAccount() {
    settingsTitle(true);
    text(112, 319, 'Alex', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(112, 356, 'Email · Read-only', 14, 500, C.muted);
    rect(112, 375, 768, 58, C.surface, 8);
    text(130, 412, 'alex@example.com', 21, 500);
    text(112, 495, 'Household administrator', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(112, 531, 'You manage members and invitations.', 16, 400, C.muted);
    textAction(688, 476, 192, 'Open household', true);
    text(112, 611, 'Your data and membership', 24, 600, C.ink, 'letter-spacing="-.4"');
    rule(112, 637, 768);
    accountRow(637, 'Export cookbook', 'Originals, JSON and offline HTML.');
    accountRow(723, 'Leave household', 'Transfer administration before leaving.');
    accountRow(809, 'Delete account', 'Review what will be removed before confirming.');
    familyDetails(976, 319);
    textAction(976, 572, 352, 'Sign out', true);
    footer(948);
  }

  function mobileAccount() {
    settingsTitle(true, true);
    text(16, 317, 'Alex', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(16, 356, 'Email · Read-only', 14, 500, C.muted);
    rect(16, 375, 358, 58, C.surface, 8);
    text(34, 412, 'alex@example.com', 20, 500);
    text(16, 496, 'Household administrator', 23, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 533, 'You manage members and invitations.', 15, 400, C.muted);
    textAction(16, 551, 358, 'Open household', true);
    rule(16, 628, 358);
    familyDetails(16, 690, true);
    text(16, 923, 'Your data and membership', 23, 600, C.ink, 'letter-spacing="-.4"');
    rule(16, 950, 358);
    accountRow(950, 'Export cookbook', 'Originals, JSON and offline HTML.', true);
    accountRow(1036, 'Leave household', 'Transfer administration before leaving.', true);
    accountRow(1122, 'Delete account', 'Review what will be removed first.', true);
    textAction(16, 1240, 358, 'Sign out', true);
    footer(1344, true);
  }

  function desktopJoin() {
    text(112, 137, 'Join a household', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 177, 'Use a link shared by your household.', 18, 400, C.muted);
    text(112, 280, 'Your verified email', 15, 500, C.muted);
    text(112, 320, 'jordan@example.com', 28, 600, C.ink, 'letter-spacing="-.4"');
    text(112, 394, 'Invitation link or code', 15, 500);
    rect(112, 413, 768, 58, 'white', 8, C.line);
    text(130, 450, 'Private invitation code', 20, 400);
    target(112, 413, 768, 58, 'Enter invitation link or code');
    rule(112, 512, 768);
    text(112, 556, 'You’ll join as a Member.', 21, 500);
    text(112, 596, 'You can belong to one household at a time.', 17, 400);
    text(112, 640, 'Your email must match the invitation.', 15, 400, C.muted);
    text(112, 675, 'We check the invitation and available space when you join.', 15, 400, C.muted);
    button(112, 726, 216, 'Join household', { tone: 'primary', height: 48 });
    textAction(364, 728, 100, 'Not now');

    text(976, 298, 'Member access', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(976, 343, ['Share recipes and a shopping list', 'with one household.'], 16, 26, C.muted);
    lines(976, 430, ['Managing invitations and membership', 'stays with the household administrator.'], 15, 25, C.muted);
    footer(948);
  }

  function mobileJoin() {
    text(16, 125, 'Join a household', 34, 700, C.ink, 'letter-spacing="-1.05"');
    lines(16, 165, ['Use a link shared', 'by your household.'], 17, 26, C.muted);
    text(16, 271, 'Your verified email', 14, 500, C.muted);
    text(16, 309, 'jordan@example.com', 24, 600, C.ink, 'letter-spacing="-.3"');
    text(16, 379, 'Invitation link or code', 15, 500);
    rect(16, 400, 358, 58, 'white', 8, C.line);
    text(34, 436, 'Private invitation code', 19, 400);
    target(16, 400, 358, 58, 'Enter invitation link or code');
    text(16, 493, 'Your email must match the invitation.', 15, 400, C.muted);
    rule(16, 530, 358);
    text(16, 579, 'Join as a Member', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 621, ['Share recipes and a shopping list', 'with one household.'], 16, 25, C.muted);
    lines(16, 691, ['You can belong to one household', 'at a time.'], 16, 25, C.ink);
    lines(16, 765, ['We check the invitation and available', 'space when you join.'], 15, 24, C.muted);
    button(16, 831, 358, 'Join household', { tone: 'primary', height: 48 });
    textAction(16, 899, 100, 'Not now');
    footer(1044, true);
  }

  function mobileCreate() {
    backToHousehold(true);
    text(16, 161, 'Invite someone', 35, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 202, 'Invite one person to your household.', 16, 400, C.muted);
    text(16, 276, 'Email address', 15, 500);
    rect(16, 296, 358, 58, 'white', 8, C.line);
    text(34, 333, 'jordan@example.com', 19, 400);
    target(16, 296, 358, 58, 'Enter invited email address');
    text(16, 386, 'Only this verified email can accept.', 14, 400, C.muted);
    button(16, 431, 358, 'Create invitation', { tone: 'primary', height: 48 });
    lines(16, 529, ['Create a private link, then copy', 'and share it yourself.'], 17, 26, C.ink);
    lines(16, 605, ['Creating an invitation does not', 'send an email.'], 15, 24, C.muted);
    text(16, 726, 'Valid for 7 days', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 769, ['The link is tied to the email above.', 'It does not reserve a place.'], 15, 25, C.muted);
    text(16, 871, '3 of 5 places in use', 20, 600, C.ink, 'letter-spacing="-.3"');
    text(16, 907, 'Availability is checked when someone joins.', 14, 400, C.muted);
    footer(1044, true);
  }

  function mobileExpired() {
    text(16, 161, 'Invitation', 35, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 203, 'unavailable', 35, 700, C.ink, 'letter-spacing="-1.05"');
    lines(16, 254, ['We could not accept this invitation.', 'No membership was added.'], 16, 25, C.muted);
    text(16, 362, 'Check your sign-in email', 23, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 402, 'jordan@example.com', 18, 500);
    lines(16, 440, ['Use the email that was invited.', 'You can belong to one household at a time.'], 14, 24, C.muted);
    text(16, 539, 'Check the link with its sender', 22, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 580, ['They can check available places or', 'create a new link if this one expired', 'or was revoked.'], 15, 24, C.muted);
    button(16, 700, 358, 'Review link and try again', { tone: 'primary', height: 48 });
    textAction(16, 770, 358, 'Back to account', true);
    footer(944, true);
  }

  return [
    { name: 'web-desktop-household', width: 1440, height: 1000, platform: 'web', content: desktopHousehold, chrome() { header(); } },
    { name: 'web-mobile-household', width: 390, height: 1400, platform: 'web', content: mobileHousehold, chrome() { header(true); } },
    { name: 'web-desktop-invite', width: 1440, height: 1000, platform: 'web', content: desktopInvite, chrome() { header(); } },
    { name: 'web-mobile-invite', width: 390, height: 1100, platform: 'web', content: mobileInvite, chrome() { header(true); } },
    { name: 'web-desktop-account', width: 1440, height: 1000, platform: 'web', content: desktopAccount, chrome() { header(); } },
    { name: 'web-mobile-account', width: 390, height: 1400, platform: 'web', content: mobileAccount, chrome() { header(true); } },
    { name: 'web-desktop-join', width: 1440, height: 1000, platform: 'web', content: desktopJoin, chrome() { header(false, true); } },
    { name: 'web-mobile-join', width: 390, height: 1100, platform: 'web', content: mobileJoin, chrome() { header(true, true); } },
    { name: 'web-mobile-create', width: 390, height: 1100, platform: 'web', content: mobileCreate, chrome() { header(true); } },
    { name: 'web-mobile-expired', width: 390, height: 1000, platform: 'web', content: mobileExpired, chrome() { header(true, true); } },
  ];
};
