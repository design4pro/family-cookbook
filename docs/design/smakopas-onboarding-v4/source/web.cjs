// Static web design artboards. These drawing instructions are not application UI.
module.exports = function webArtboards(h) {
  const { C, add, rect, rule, text, lines, target, icon, button } = h;

  function header(isMobile = false, ready = false, signOut = false) {
    const x = isMobile ? 16 : 112;
    text(x, 40, 'Family Cookbook', 20, 800, C.ink, 'letter-spacing="-.45"');
    target(x, 10, 206, 44, 'Open Family Cookbook');
    if (ready) {
      const accountX = isMobile ? 352 : 1308;
      add(`<circle cx="${accountX}" cy="32" r="20" fill="${C.surface}"/>`);
      text(accountX, 38, 'A', 15, 600, C.ink, 'text-anchor="middle"');
      target(accountX - 22, 10, 44, 44, 'Open account');
    }
    if (signOut) textAction(isMobile ? 294 : 1244, 10, 84, 'Sign out');
  }

  function footer(y, isMobile = false) {
    const x = isMobile ? 16 : 112, width = isMobile ? 358 : 1216;
    rule(x, y, width);
    if (isMobile) {
      lines(x, y + 24, ['Synthetic onboarding demo · Static design', 'Family Cookbook is a working name.'], 11, 18, C.muted);
    } else {
      text(x, y + 27, 'Synthetic onboarding demo · Static design · Family Cookbook is a working name.', 12, 400, C.muted);
    }
  }

  function textAction(x, y, width, label, arrow = false) {
    text(x, y + 28, label, 14, 600, C.accent);
    if (arrow) icon('arrow', x + width - 20, y + 13, 18, C.accent);
    target(x, y, width, 44, label);
  }

  function input(x, y, width, label, value, { placeholder = false, error = false, code = false } = {}) {
    text(x, y, label, 15, 500);
    rect(x, y + 20, width, 60, 'white', 8, error ? C.warning : C.muted);
    text(x + 18, y + 58, value, code ? 24 : 20, 400, placeholder ? C.muted : C.ink);
    target(x, y + 20, width, 60, label);
  }

  function desktopEmail() {
    text(112, 181, 'Welcome', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 225, 'Sign in or get started with your email.', 18, 400, C.muted);
    input(112, 313, 560, 'Email address', 'alex@example.com');
    button(112, 433, 560, 'Send sign-in code', { tone: 'primary', height: 48 });
    text(112, 526, 'We’ll use a one-time code to sign you in.', 15, 400, C.muted);

    text(912, 181, 'Your recipes,', 42, 600, C.ink, 'letter-spacing="-1.05"');
    text(912, 231, 'together.', 42, 600, C.ink, 'letter-spacing="-1.05"');
    lines(912, 285, ['A private cookbook for the people', 'you cook with.'], 18, 28, C.muted);
    text(912, 467, 'What happens next', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(912, 510, ['Enter the code from your email.', 'Then open your household or set up', 'your first one.'], 16, 26, C.muted);
    footer(948);
  }

  function mobileEmail() {
    text(16, 147, 'Welcome', 36, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 190, 'Sign in or get started with your email.', 16, 400, C.muted);
    input(16, 279, 358, 'Email address', 'alex@example.com');
    button(16, 399, 358, 'Send sign-in code', { tone: 'primary', height: 48 });
    lines(16, 490, ['We’ll use a one-time code', 'to sign you in.'], 15, 25, C.muted);
    text(16, 650, 'Your recipes, together.', 28, 600, C.ink, 'letter-spacing="-.6"');
    lines(16, 695, ['A private cookbook for the people', 'you cook with.'], 16, 26, C.muted);
    footer(844, true);
  }

  function desktopCode() {
    text(112, 181, 'Check your email', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 225, 'Enter the sign-in code for alex@example.com.', 18, 400, C.muted);
    input(112, 313, 560, 'Sign-in code', '6-digit code', { placeholder: true, code: true });
    text(112, 434, 'Use the latest code.', 17, 500);
    text(112, 465, 'Expires after 5 minutes.', 15, 400, C.muted);
    button(112, 508, 560, 'Verify and continue', { tone: 'disabled', height: 48 });
    textAction(112, 585, 140, 'Change email');
    textAction(490, 585, 182, 'Send a new code');

    text(912, 181, 'Keep this page open', 26, 600, C.ink, 'letter-spacing="-.5"');
    lines(912, 227, ['Find the most recent sign-in code', 'in your email, then enter it here.'], 17, 28, C.muted);
    footer(948);
  }

  function mobileCode({ error = false, invited = false } = {}) {
    const email = invited ? 'jordan@example.com' : 'alex@example.com';
    const offset = invited ? 48 : 0;
    text(16, 147, 'Check your email', 35, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 192, 'Enter the sign-in code for', 17, 400, C.muted);
    text(16, 226, email, 22, 500, C.ink, 'letter-spacing="-.3"');
    if (invited) text(16, 274, 'After sign-in, review your invitation.', 15, 500);
    input(16, 306 + offset, 358, 'Sign-in code', error ? '104928' : '6-digit code', { placeholder: !error, error, code: true });
    if (error) {
      lines(16, 429, ['That code is invalid or has expired.', 'Try the latest code or request a new one.'], 15, 24, C.warning);
      text(16, 506, 'Sign-in codes expire after 5 minutes.', 14, 400, C.muted);
      button(16, 548, 358, 'Verify and continue', { tone: 'primary', height: 48 });
      textAction(16, 627, 138, 'Change email');
      textAction(204, 627, 170, 'Send a new code');
      footer(944, true);
      return;
    }
    text(16, 429 + offset, 'Use the latest code.', 17, 500);
    text(16, 460 + offset, 'Expires after 5 minutes.', 14, 400, C.muted);
    button(16, 503 + offset, 358, 'Verify and continue', { tone: 'disabled', height: 48 });
    textAction(16, 582 + offset, 138, 'Change email');
    textAction(204, 582 + offset, 170, 'Send a new code');
    if (invited) {
      lines(16, 768, ['Your private invitation stays with this sign-in.', 'Signing in does not join a household.'], 14, 24, C.muted);
      footer(1044, true);
    } else {
      footer(944, true);
    }
  }

  function createRole(x, y, width, title, detail) {
    text(x, y, title, 18, 500);
    text(x + width, y, 'You', 17, 500, C.ink, 'text-anchor="end"');
    text(x, y + 29, detail, 14, 400, C.muted);
    rule(x, y + 57, width);
  }

  function desktopCreate() {
    text(112, 181, 'Start your household', 44, 700, C.ink, 'letter-spacing="-1.1"');
    text(112, 225, 'Signed in as alex@example.com', 16, 400, C.muted);
    text(112, 318, 'One private cookbook', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(112, 359, 'For up to 5 people, including you.', 18, 400, C.muted);
    rule(112, 394, 560);
    text(112, 445, 'Your roles after creating', 23, 600, C.ink, 'letter-spacing="-.4"');
    createRole(112, 490, 560, 'Administrator', 'Manage members and invitations.');
    createRole(112, 575, 560, 'Designated payer', 'Creating a household starts no subscription.');
    text(112, 679, 'Free sample access', 22, 600, C.ink, 'letter-spacing="-.3"');
    text(112, 710, 'No card required. No automatic renewal.', 15, 400, C.muted);
    text(112, 736, 'Usage limits apply, including 10 recipes.', 15, 400, C.muted);
    textAction(112, 750, 180, 'View sample limits');
    button(112, 814, 560, 'Create household', { tone: 'primary', height: 48 });
    textAction(112, 882, 560, 'Use an invitation', true);

    text(912, 181, 'Already invited?', 30, 600, C.ink, 'letter-spacing="-.6"');
    lines(912, 230, ['Use your invitation instead of', 'creating a new household.'], 17, 28, C.muted);
    lines(912, 354, ['You can belong to one household', 'at a time.'], 16, 26, C.muted);
    lines(912, 438, ['Your verified email must match', 'the invitation.'], 16, 26, C.muted);
    footer(948);
  }

  function mobileCreate() {
    text(16, 147, 'Start your household', 34, 700, C.ink, 'letter-spacing="-1.02"');
    text(16, 191, 'Signed in as alex@example.com', 14, 400, C.muted);
    text(16, 274, 'One private cookbook', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 313, 'For up to 5 people, including you.', 16, 400, C.muted);
    rule(16, 350, 358);
    text(16, 399, 'Your roles after creating', 22, 600, C.ink, 'letter-spacing="-.4"');
    createRole(16, 446, 358, 'Administrator', 'Manage members and invitations.');
    createRole(16, 532, 358, 'Designated payer', 'Creating a household starts no subscription.');
    text(16, 645, 'Free sample access', 22, 600, C.ink, 'letter-spacing="-.3"');
    text(16, 684, 'No card required. No automatic renewal.', 15, 400, C.muted);
    text(16, 712, 'Usage limits apply, including 10 recipes.', 15, 400, C.muted);
    textAction(16, 730, 180, 'View sample limits');
    button(16, 806, 358, 'Create household', { tone: 'primary', height: 48 });
    textAction(16, 876, 358, 'Use an invitation', true);
    text(16, 1001, 'Already invited?', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(16, 1043, ['Use the invitation instead.', 'One active household at a time.'], 15, 25, C.muted);
    footer(1144, true);
  }

  function desktopReady() {
    text(112, 181, 'Your household is ready', 43, 700, C.ink, 'letter-spacing="-1.08"');
    text(112, 225, 'Start with a recipe you want to keep.', 18, 400, C.muted);
    text(112, 323, 'Your cookbook', 28, 600, C.ink, 'letter-spacing="-.5"');
    text(672, 322, '0 recipes', 15, 400, C.muted, 'text-anchor="end"');
    rule(112, 351, 560);
    text(112, 425, 'Add your first recipe', 30, 600, C.ink, 'letter-spacing="-.6"');
    lines(112, 469, ['Save a recipe to start', 'your shared cookbook.'], 18, 28, C.muted);
    button(112, 550, 244, 'Add first recipe', { tone: 'primary', height: 48 });
    textAction(384, 552, 180, 'Open cookbook', true);

    text(912, 181, 'Your household', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(912, 220, '1 of 5 places in use', 16, 400, C.muted);
    text(912, 287, 'Alex · You', 23, 600, C.ink, 'letter-spacing="-.3"');
    text(912, 320, 'alex@example.com', 15, 400, C.muted);
    text(912, 377, 'Administrator', 18, 500);
    text(912, 417, 'Designated payer', 18, 500);
    text(912, 449, 'No subscription started.', 15, 400, C.muted);
    rule(912, 490, 416);
    text(912, 541, 'Free sample access', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(912, 581, ['No card required.', 'No automatic renewal.', 'Usage limits apply, including 10 recipes.'], 15, 25, C.muted);
    button(912, 686, 416, 'Invite someone', { tone: 'secondary', height: 48 });
    footer(948);
  }

  function mobileReady() {
    text(16, 147, 'Your household', 36, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 190, 'is ready', 36, 700, C.ink, 'letter-spacing="-1.05"');
    text(16, 235, 'Start with a recipe you want to keep.', 16, 400, C.muted);
    text(16, 313, 'Your cookbook', 25, 600, C.ink, 'letter-spacing="-.4"');
    text(374, 312, '0 recipes', 14, 400, C.muted, 'text-anchor="end"');
    rule(16, 343, 358);
    text(16, 403, 'Add your first recipe', 28, 600, C.ink, 'letter-spacing="-.6"');
    lines(16, 444, ['Save a recipe to start', 'your shared cookbook.'], 16, 25, C.muted);
    button(16, 512, 358, 'Add first recipe', { tone: 'primary', height: 48 });
    textAction(16, 576, 358, 'Open cookbook', true);
    rule(16, 644, 358);
    text(16, 687, 'Your household', 24, 600, C.ink, 'letter-spacing="-.4"');
    text(16, 722, '1 of 5 places in use', 15, 400, C.muted);
    text(16, 774, 'Alex · You', 22, 600, C.ink, 'letter-spacing="-.3"');
    text(16, 803, 'alex@example.com', 14, 400, C.muted);
    text(16, 846, 'Administrator', 17, 500);
    text(16, 879, 'Designated payer', 17, 500);
    text(16, 909, 'No subscription started.', 14, 400, C.muted);
    text(16, 963, 'Free sample access', 22, 600, C.ink, 'letter-spacing="-.3"');
    text(16, 996, 'No card. No automatic renewal.', 14, 400, C.muted);
    text(16, 1023, 'Usage limits apply, including 10 recipes.', 14, 400, C.muted);
    button(16, 1055, 358, 'Invite someone', { tone: 'secondary', height: 48 });
    footer(1144, true);
  }

  return [
    { name: 'web-desktop-email', width: 1440, height: 1000, platform: 'web', content: desktopEmail, chrome() { header(); } },
    { name: 'web-mobile-email', width: 390, height: 900, platform: 'web', content: mobileEmail, chrome() { header(true); } },
    { name: 'web-desktop-code', width: 1440, height: 1000, platform: 'web', content: desktopCode, chrome() { header(); } },
    { name: 'web-mobile-code', width: 390, height: 1000, platform: 'web', content() { mobileCode(); }, chrome() { header(true); } },
    { name: 'web-desktop-create', width: 1440, height: 1000, platform: 'web', content: desktopCreate, chrome() { header(false, false, true); } },
    { name: 'web-mobile-create', width: 390, height: 1200, platform: 'web', content: mobileCreate, chrome() { header(true, false, true); } },
    { name: 'web-desktop-ready', width: 1440, height: 1000, platform: 'web', content: desktopReady, chrome() { header(false, true); } },
    { name: 'web-mobile-ready', width: 390, height: 1200, platform: 'web', content: mobileReady, chrome() { header(true, true); } },
    { name: 'web-mobile-code-error', width: 390, height: 1000, platform: 'web', content() { mobileCode({ error: true }); }, chrome() { header(true); } },
    { name: 'web-mobile-invited', width: 390, height: 1100, platform: 'web', content() { mobileCode({ invited: true }); }, chrome() { header(true); } },
  ];
};
