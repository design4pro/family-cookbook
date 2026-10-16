// Static Android onboarding artwork. No authentication or household operation is implemented.
module.exports = function androidOnboarding(h) {
  const { C, rect, rule, text, ui, lines, target, button, androidStatus, androidGesture, androidIconButton } = h;

  function chrome({ back = false, signedIn = false } = {}) {
    androidStatus();
    if (back) {
      androidIconButton('arrow_back', 8, 32, 'Back to email');
      ui(72, 65, 'Sign in', 22, 500);
    } else {
      ui(20, 65, 'Family Cookbook', 20, 600);
    }
    if (signedIn) {
      ui(392, 64, 'Sign out', 14, 500, C.accent, 'text-anchor="end"');
      target(304, 32, 88, 48, 'Sign out');
    }
    ui(20, 864, 'Synthetic onboarding demo', 12, 400, C.muted);
    androidGesture();
  }

  function field(y, label, value, { placeholder = false, disabled = false } = {}) {
    ui(20, y, label, 14, 500, C.muted);
    rect(20, y + 17, 372, 58, 'white', 4, C.muted);
    ui(36, y + 53, value, 17, 400, placeholder ? C.muted : C.ink);
    target(20, y + 17, 372, 58, label, disabled);
  }

  function email() {
    text(20, 160, 'Your family', 36, 700, C.ink, 'letter-spacing="-.8"');
    text(20, 202, 'cookbook.', 36, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 245, 'Sign in or start with your email.', 17, 400, C.muted);
    field(318, 'Email address', 'alex@example.com');
    button(20, 421, 372, 'Send sign-in code', { tone: 'primary', height: 48 });
    lines(20, 511, ['Use a six-digit code.', 'No password to create or remember.'], 16, 25);
    rule(20, 587, 372);
    text(20, 632, 'New here?', 22, 600);
    lines(20, 669, ['Your account is created only after', 'you verify your email.'], 16, 25);
  }

  function code() {
    text(20, 160, 'Check your email', 32, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 201, 'Enter the six-digit code for', 17, 400, C.muted);
    text(20, 233, 'alex@example.com', 22, 600);
    field(316, 'Sign-in code', '6-digit code', { placeholder: true });
    button(20, 419, 372, 'Verify and continue', { tone: 'disabled', height: 48 });
    lines(20, 511, ['Codes expire after 5 minutes.', 'Use the latest code.'], 16, 25);
    button(20, 583, 372, 'Send a new code', { tone: 'text', height: 48 });
    button(20, 648, 372, 'Change email', { height: 48 });
    lines(20, 751, ['No code yet? Check your spam folder', 'and the email address above.'], 15, 24);
  }

  function create() {
    text(20, 156, 'Create a household', 31, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 196, 'Signed in and verified', 14, 500, C.muted);
    ui(20, 224, 'alex@example.com', 18, 500);
    rule(20, 255, 372);
    text(20, 304, 'One private cookbook', 23, 600);
    lines(20, 341, ['Up to five people, each with', 'their own account.'], 16, 25);
    text(20, 423, 'Administrator and payer: You', 21, 600, C.ink, 'letter-spacing="-.3"');
    lines(20, 459, ['You’ll manage members and invitations.', 'No subscription is started by creating', 'a household.'], 15, 24);
    text(20, 568, 'Start with the free sample', 23, 600, C.ink, 'letter-spacing="-.4"');
    lines(20, 606, ['No card or automatic renewal.', 'Usage limits apply, including 10 recipes.'], 15, 24);
    ui(20, 686, 'View sample limits', 14, 500, C.accent);
    target(20, 655, 180, 48, 'View all sample limits');
    button(20, 738, 372, 'Create household', { tone: 'primary', height: 48 });
    button(20, 799, 372, 'Use an invitation', { tone: 'text', height: 48 });
  }

  function ready() {
    text(20, 160, 'Your cookbook', 36, 700, C.ink, 'letter-spacing="-.8"');
    text(20, 202, 'is ready.', 36, 700, C.ink, 'letter-spacing="-.8"');
    ui(20, 246, 'Household created · 1 of 5 members', 16, 400, C.muted);
    rule(20, 280, 372);
    ui(20, 324, 'alex@example.com', 20, 500);
    ui(20, 354, 'Alex · Administrator · Payer', 15, 400, C.muted);
    text(20, 416, 'Free sample', 23, 600);
    lines(20, 453, ['No subscription started.', '0 of 10 recipe places used.'], 16, 25);
    text(20, 559, 'Begin with one recipe', 25, 600, C.ink, 'letter-spacing="-.4"');
    lines(20, 598, ['Add a photo, a recording or text.', 'Review it before saving to the cookbook.'], 15, 25);
    button(20, 672, 372, 'Add first recipe', { tone: 'primary', height: 48 });
    button(20, 738, 372, 'Invite someone', { height: 48 });
    button(20, 800, 372, 'Open cookbook', { tone: 'text', height: 48 });
  }

  function requestError() {
    text(20, 151, 'Request not', 32, 700, C.ink, 'letter-spacing="-.7"');
    text(20, 189, 'confirmed', 32, 700, C.ink, 'letter-spacing="-.7"');
    lines(20, 235, ['We couldn’t confirm the code request.', 'Your email address is still here.'], 16, 25, C.muted);
    field(338, 'Email address', 'alex@example.com');
    lines(20, 459, ['Check your connection and try again.', 'This does not tell us whether a code', 'has reached your inbox.'], 16, 25, C.warning);
    button(20, 579, 372, 'Try again', { tone: 'primary', height: 48 });
    button(20, 649, 372, 'Enter a code', { height: 48 });
    lines(20, 752, ['If a code arrives, use the latest one.', 'A new request creates a new code.'], 15, 24);
  }

  function existingHousehold() {
    text(20, 158, 'You already have', 32, 700, C.ink, 'letter-spacing="-.7"');
    text(20, 197, 'a household', 32, 700, C.ink, 'letter-spacing="-.7"');
    ui(20, 250, 'alex@example.com · Verified', 16, 400, C.muted);
    rule(20, 287, 372);
    text(20, 344, 'Continue to your cookbook', 24, 600, C.ink, 'letter-spacing="-.5"');
    lines(20, 388, ['This account already belongs to', 'a household. No second household', 'was created.'], 17, 27, C.ink);
    lines(20, 538, ['You can belong to one active', 'household at a time.'], 16, 25);
    button(20, 658, 372, 'Open cookbook', { tone: 'primary', height: 48 });
    ui(20, 759, 'Not the right account? Sign out above.', 14, 400, C.muted);
  }

  return [
    { name: 'android-email', width: 412, height: 915, platform: 'android', content: email, chrome: () => chrome() },
    { name: 'android-code', width: 412, height: 915, platform: 'android', content: code, chrome: () => chrome({ back: true }) },
    { name: 'android-create', width: 412, height: 915, platform: 'android', content: create, chrome: () => chrome({ signedIn: true }) },
    { name: 'android-ready', width: 412, height: 915, platform: 'android', content: ready, chrome: () => chrome({ signedIn: true }) },
    { name: 'android-request-error', width: 412, height: 915, platform: 'android', content: requestError, chrome: () => chrome({ back: true }) },
    { name: 'android-existing-household', width: 412, height: 915, platform: 'android', content: existingHousehold, chrome: () => chrome({ signedIn: true }) },
  ];
};
