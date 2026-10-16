// Static Apple onboarding artboards. These drawings do not implement authentication or membership.
module.exports = function appleOnboardingArtboards(h) {
  const { C, add, rect, rule, t, ui, lines, target, button, circleButton, phoneStatus, padStatus, home } = h;

  function action(x, y, width, label, size = 16) {
    target(x, y, width, 44, label);
    ui(x, y + 28, label, size, 500, C.accent);
  }

  function field(x, y, width, label, value, { placeholder = false, invalid = false } = {}) {
    ui(x, y - 18, label, 15, 500);
    rect(x, y, width, 56, 'white', 12, invalid ? C.warning : C.muted);
    target(x, y, width, 56, label);
    ui(x + 16, y + 35, value, 18, 400, placeholder ? C.muted : C.ink);
  }

  function phoneChrome({ back = false, signOut = false } = {}) {
    phoneStatus();
    if (back) circleButton('chevron.left', 20, 64);
    else t(20, 94, 'Family Cookbook', 20, 600, C.ink, 'letter-spacing="-.3"');
    if (signOut) action(289, 66, 84, 'Sign out');
    home();
  }

  function phoneHeading(first, second = '') {
    t(20, 165, first, 34, 700, C.ink, 'letter-spacing="-.8"');
    if (second) t(20, 208, second, 34, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, second ? 240 : 197, 'Synthetic onboarding demo', 12, 400, C.muted);
  }

  function phoneEmail() {
    t(20, 203, 'Your recipes,', 41, 700, C.ink, 'letter-spacing="-1.1"');
    t(20, 251, 'together.', 41, 700, C.ink, 'letter-spacing="-1.1"');
    ui(20, 286, 'Synthetic onboarding demo', 12, 400, C.muted);
    lines(20, 343, ['New here or returning?', 'Start with your email address.'], 18, 28, C.ink);
    field(20, 431, 353, 'Email address', 'alex@example.com');
    button(20, 519, 353, 'Send sign-in code', { tone: 'primary', glass: true, height: 48 });
    ui(20, 615, 'No password to remember.', 16, 500);
    lines(20, 663, ['Verify your address before creating', 'or joining a household.'], 15, 25);
  }

  function phoneCode() {
    phoneHeading('Check your email');
    ui(20, 253, 'alex@example.com', 22, 500);
    ui(20, 288, 'Enter the 6-digit sign-in code.', 16, 400, C.muted);
    field(20, 357, 353, 'Sign-in code', '6-digit code', { placeholder: true });
    button(20, 441, 353, 'Verify and continue', { tone: 'disabled', height: 48 });
    lines(20, 536, ['Codes expire after 5 minutes.', 'Use the latest code.'], 15, 26);
    action(20, 603, 353, 'Send a new code');
    action(20, 667, 353, 'Change email');
  }

  function phoneCodeExpired() {
    phoneHeading('Check your email');
    ui(20, 253, 'alex@example.com', 22, 500);
    ui(20, 288, 'Enter the 6-digit sign-in code.', 16, 400, C.muted);
    field(20, 357, 353, 'Sign-in code', '6-digit code', { placeholder: true, invalid: true });
    ui(20, 447, 'Invalid or expired code.', 17, 600, C.warning);
    lines(20, 484, ['Request a new code, then enter', 'the latest one.'], 16, 26, C.ink);
    button(20, 552, 353, 'Request a new code', { tone: 'primary', glass: true, height: 48 });
    action(20, 639, 353, 'Change email');
    ui(20, 728, 'Codes expire after 5 minutes.', 15, 400, C.muted);
  }

  function phoneCreate() {
    phoneHeading('Create your', 'household');
    ui(20, 294, 'Verified email', 14, 500, C.muted);
    ui(20, 325, 'alex@example.com', 22, 500);
    rule(20, 352, 353);
    t(20, 394, 'One private cookbook', 24, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 426, 'For up to five people, including you.', 16, 400, C.muted);
    lines(20, 473, ['You become the administrator and payer.', 'Creating a household starts no subscription.'], 14, 25, C.ink);
    t(20, 535, 'Start with a free sample', 23, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 563, 'No card. No countdown. No auto-renewal.', 14, 400, C.muted);
    ui(20, 587, 'Limits apply, including 10 recipes.', 14, 400, C.muted);
    action(20, 598, 353, 'View sample limits');
    button(20, 657, 353, 'Create household', { tone: 'primary', glass: true, height: 48 });
    action(20, 724, 353, 'Use an invitation');
    ui(20, 795, 'You can belong to one household.', 13, 400, C.muted);
  }

  function phoneReady() {
    phoneHeading('Your cookbook', 'is ready.');
    ui(20, 288, '1 of 5 people · 0 recipes', 16, 400, C.muted);
    ui(20, 342, 'alex@example.com', 22, 500);
    ui(20, 373, 'Alex · Administrator and payer', 15, 400, C.muted);
    ui(20, 405, 'No subscription started.', 15, 500, C.ink);
    rule(20, 439, 353);
    t(20, 484, 'Free sample', 25, 600, C.ink, 'letter-spacing="-.4"');
    ui(20, 520, 'Begin with a recipe you love.', 17, 400, C.muted);
    ui(20, 548, 'Limits apply, including 10 recipes.', 14, 400, C.muted);
    button(20, 571, 353, 'Add your first recipe', { tone: 'primary', glass: true, height: 48 });
    button(20, 647, 353, 'Invite someone', { glass: true, height: 48 });
    action(20, 735, 353, 'Open cookbook');
  }

  function padChrome({ back = false, signOut = false } = {}) {
    padStatus();
    if (back) {
      circleButton('chevron.left', 32, 42);
      t(94, 72, 'Family Cookbook', 20, 600, C.ink, 'letter-spacing="-.3"');
    } else t(52, 72, 'Family Cookbook', 20, 600, C.ink, 'letter-spacing="-.3"');
    if (signOut) action(1054, 44, 88, 'Sign out', 17);
    home(1194, 834);
  }

  function padSplit() {
    add(`<path d="M724 160v570" stroke="${C.line}" stroke-width="1"/>`);
    ui(52, 777, 'Synthetic onboarding demo', 12, 400, C.muted);
  }

  function padEmail() {
    padSplit();
    t(52, 246, 'Your recipes,', 58, 700, C.ink, 'letter-spacing="-1.6"');
    t(52, 313, 'together.', 58, 700, C.ink, 'letter-spacing="-1.6"');
    ui(52, 372, 'One cookbook for your household.', 22, 400, C.muted);
    rule(52, 478, 588);
    lines(52, 533, ['Save family recipes, cook from them,', 'and share a shopping list.'], 22, 35, C.ink);
    t(770, 246, 'Sign in with email', 32, 600, C.ink, 'letter-spacing="-.7"');
    ui(770, 288, 'New here or returning? Start here.', 17, 400, C.muted);
    field(770, 374, 372, 'Email address', 'alex@example.com');
    button(770, 463, 372, 'Send sign-in code', { tone: 'primary', glass: true, height: 48 });
    ui(770, 568, 'No password to remember.', 17, 500);
    lines(770, 616, ['Verify your address before creating', 'or joining a household.'], 16, 26);
  }

  function padCode() {
    padSplit();
    t(52, 246, 'Check your', 58, 700, C.ink, 'letter-spacing="-1.6"');
    t(52, 313, 'email.', 58, 700, C.ink, 'letter-spacing="-1.6"');
    lines(52, 376, ['Use the 6-digit sign-in code', 'for this email address.'], 22, 35, C.muted);
    rule(52, 478, 588);
    ui(52, 534, 'A new code replaces the previous one.', 21, 400, C.ink);
    ui(770, 236, 'Email address', 15, 500, C.muted);
    ui(770, 274, 'alex@example.com', 25, 500);
    field(770, 362, 372, 'Sign-in code', '6-digit code', { placeholder: true });
    button(770, 451, 372, 'Verify and continue', { tone: 'disabled', height: 48 });
    lines(770, 546, ['Codes expire after 5 minutes.', 'Use the latest code.'], 16, 27);
    action(770, 611, 372, 'Send a new code', 17);
    action(770, 675, 372, 'Change email', 17);
  }

  function padCreate() {
    padSplit();
    t(52, 196, 'Create your household', 44, 700, C.ink, 'letter-spacing="-1.2"');
    ui(52, 247, 'One private cookbook for up to five people.', 20, 400, C.muted);
    ui(52, 329, 'Verified email', 15, 500, C.muted);
    ui(52, 368, 'alex@example.com', 27, 500);
    rule(52, 411, 588);
    t(52, 464, 'Your role', 26, 600, C.ink, 'letter-spacing="-.4"');
    lines(52, 509, ['You become the administrator and payer.', 'Creating a household starts no subscription.'], 19, 31, C.ink);
    ui(52, 634, 'You can belong to one household at a time.', 17, 400, C.muted);
    t(770, 247, 'Start with a', 34, 600, C.ink, 'letter-spacing="-.7"');
    t(770, 288, 'free sample', 34, 600, C.ink, 'letter-spacing="-.7"');
    lines(770, 354, ['No card.', 'No countdown.', 'No auto-renewal.'], 19, 37, C.ink);
    ui(770, 476, 'Limits apply, including 10 recipes.', 16, 400, C.muted);
    action(770, 493, 372, 'View sample limits', 17);
    button(770, 570, 372, 'Create household', { tone: 'primary', glass: true, height: 52 });
    action(770, 665, 372, 'Use an invitation', 17);
  }

  function padReady() {
    padSplit();
    t(52, 224, 'Your cookbook', 52, 700, C.ink, 'letter-spacing="-1.4"');
    t(52, 285, 'is ready.', 52, 700, C.ink, 'letter-spacing="-1.4"');
    ui(52, 339, '1 of 5 people · 0 recipes', 19, 400, C.muted);
    rule(52, 390, 588);
    ui(52, 448, 'alex@example.com', 27, 500);
    ui(52, 486, 'Alex · Administrator and payer', 18, 400, C.muted);
    ui(52, 532, 'No subscription started.', 18, 500, C.ink);
    action(52, 615, 588, 'Open cookbook', 18);
    t(770, 264, 'Free sample', 34, 600, C.ink, 'letter-spacing="-.7"');
    lines(770, 313, ['Begin with a recipe you love.', 'Invite your household when ready.'], 18, 29, C.muted);
    ui(770, 381, 'Limits apply, including 10 recipes.', 16, 400, C.muted);
    button(770, 416, 372, 'Add your first recipe', { tone: 'primary', glass: true, height: 52 });
    button(770, 497, 372, 'Invite someone', { glass: true, height: 48 });
  }

  return [
    { name: 'iphone-email', width: 393, height: 852, platform: 'apple', content: phoneEmail, chrome: phoneChrome },
    { name: 'iphone-code', width: 393, height: 852, platform: 'apple', content: phoneCode, chrome: () => phoneChrome({ back: true }) },
    { name: 'iphone-create', width: 393, height: 852, platform: 'apple', content: phoneCreate, chrome: () => phoneChrome({ signOut: true }) },
    { name: 'iphone-ready', width: 393, height: 852, platform: 'apple', content: phoneReady, chrome: () => phoneChrome({ signOut: true }) },
    { name: 'iphone-code-expired', width: 393, height: 852, platform: 'apple', content: phoneCodeExpired, chrome: () => phoneChrome({ back: true }) },
    { name: 'ipad-email', width: 1194, height: 834, platform: 'apple', content: padEmail, chrome: padChrome },
    { name: 'ipad-code', width: 1194, height: 834, platform: 'apple', content: padCode, chrome: () => padChrome({ back: true }) },
    { name: 'ipad-create', width: 1194, height: 834, platform: 'apple', content: padCreate, chrome: () => padChrome({ signOut: true }) },
    { name: 'ipad-ready', width: 1194, height: 834, platform: 'apple', content: padReady, chrome: () => padChrome({ signOut: true }) },
  ];
};
