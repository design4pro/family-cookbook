# Android Material reference

Checked: 2026-10-16. Scope: static Android phone studies for Cookbook -> Add photos -> Review -> Recipe. This reference supports a design proposal, not application implementation or design approval. [PRODUCT.md](../../../PRODUCT.md), the [MVP specification](../../family-cookbook-mvp/spec.md) and the [native v4 brief](../smakopas-native-v4/design-brief.md) retain their authority.

## Verified guidance and application

Each source summary below contains fewer than 100 words. The application statements are design decisions for this study, not claims that Google prescribes this product's exact flow.

### Three primary destinations

[Android Developers: Navigation bar](https://developer.android.com/develop/ui/compose/components/navigation-bar)

Navigation bars suit compact windows with three to five equally important destinations. Each item represents one destination and can show its label, icon and selected state. Apply this to Cookbook, Assistant and Shopping, with visible labels and a clear selected Cookbook indicator. Add recipe remains an action inside Cookbook. The study keeps destination navigation on browsing and saved-recipe screens; focused capture and review cover it. That flow boundary is a product design decision.

### Top app bar

[Android Developers: App bars](https://developer.android.com/develop/ui/compose/components/app-bars)

Top app bars combine a screen title, leading navigation and trailing actions. Small, center-aligned, medium and large variants are available, with configurable scroll behavior. Use a compact, opaque Material top app bar for capture, review and the saved recipe. Keep navigation on the leading edge and an explicit Save action on Review. Large Archivo reading titles belong in content, separate from control labels. Static artwork depicts one scroll position and does not establish collapse or Back behavior.

### Add recipe action

[Android Developers: Floating action button](https://developer.android.com/develop/ui/compose/components/fab)

A FAB promotes one prominent, focused action, commonly near the lower right. An extended FAB can combine an icon and text. Use one extended Add recipe FAB in Cookbook, positioned above destination navigation with enough content clearance. Its label explains creation without turning it into a fourth destination. Capture and review use their own explicit upload/save actions; they do not repeat the Cookbook creation FAB.

### Source and Draft tabs

[Android Developers: Tabs](https://developer.android.com/develop/ui/compose/components/tabs)

Tabs group related content. Primary tabs sit below a top app bar and suit a single tab level; secondary tabs express another level within content. Use two primary tabs, Source and Draft, directly below the Review app bar. Show the selected indicator and text state. This is a comparison of one draft with its unchanged source, not a stepper. Switching views must preserve edits and scroll position in a future implementation; the static study cannot verify this behavior.

### Review text fields

[Android Developers: Configure text fields](https://developer.android.com/develop/ui/compose/text/user-input)

Material TextField provides filled styling; OutlinedTextField provides outlined styling. Both offer labels and text customization; BasicTextField omits Material decoration. Depict recognizable outlined fields for editable review values, with labels that remain understandable when populated. Keep missing amounts and servings explicitly labeled as Not specified, with supporting explanation rather than color alone. Do not make recipe reading text resemble editable fields. Missing source information is not automatically a blocking form error.

### Touch and accessibility

[Android Developers: Accessibility API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)

Interactive elements need a minimum 48 dp touch target. Smaller drawing bounds can acquire expanded targets, which can overlap unless layout provides enough room. Actionable icons need meaningful localized descriptions; appropriate standard controls provide useful semantics that still require verification. Reserve at least 48 x 48 logical units for icon buttons, including reorder and remove actions. Use visible text for uncertainty. Artwork proves neither actual touch bounds nor TalkBack semantics.

### System insets

[Android Developers: About window insets](https://developer.android.com/develop/ui/compose/system/insets)

Insets describe areas occupied by system UI. Android 15 and later draw apps edge-to-edge when they target SDK 35, so important content and controls must avoid obscuring system UI. System navigation can change at runtime. Treat the status area and gesture area in these exports as a single illustrative device configuration. A future app must use real window, cutout and keyboard insets rather than copy the mockup's fixed dimensions.

### Edge-to-edge composition

[Android Developers: Edge-to-edge design](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge)

Backgrounds and scrolling content may extend behind system bars, while important text and interactions remain inset. Avoid touch and drag targets inside system gesture areas. Keep gesture navigation transparent; use appropriate protection for system icons when content scrolls underneath. Extend the study's opaque background into the system areas, keep FAB and bottom actions clear of gestures, and provide content clearance below fixed controls. Do not substitute Apple glass effects for Android system-bar treatment.

### Typography and surface roles

[Android Developers: Material Design 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)

Material 3 exposes color, typography and shape roles. Its type scale uses display, headline, title, body and label roles; font families and related properties can be customized. Retain Archivo for Smakopas-derived titles and reading content, with bundled Roboto Variable for Android chrome. Use restrained opaque or tonal surfaces and clear action emphasis. The current documentation also describes M3 Expressive; this study does not require adopting every expressive shape or animation. Static palette choices do not verify dynamic color or Dark Mode.

### Android icon assets

[Google Fonts: Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols)

Material Symbols provide styles and variable axes for fill, weight, grade and optical size, and downloadable SVG/PNG assets suitable for mockups. Use a consistent Material icon family with appropriate selected states. Preserve the asset license when distributing assets. SF Symbols and Apple-specific glass rendering are excluded from the Android packet. A drawn icon does not provide an accessible action name by itself.

## Product continuity

- Cookbook starts with the existing demonstration recipes. Family pancakes appears only after explicit review and saving.
- Capture reuses the two complete synthetic source pages from native/web v4, without cropping or rewriting them. They remain visibly identified as synthetic.
- Family pancakes retains `2½ cups flour`, `2 eggs`, `250 ml milk`, `salt`, `Mix the ingredients.` and `Cook in a pan.`
- Anna remains the fictional recipe author. Alex remains the fictional source uploader and application editor; these roles stay separately labeled.
- Salt quantity and servings remain `Not specified`. The family note stays empty. Do not add preparation time, cooking time, temperature, serving counts, family stories or a dish photograph for this recipe.
- Review distinguishes the AI draft from the approved household recipe and asks the user to verify all fields. Save is explicit human approval, including when source values remain unknown.
- Upload and processing remain distinct: keep the screen open until upload completes; processing may continue after leaving once upload has completed.
- Shopping additions enter a review and confirmation flow. Reading a saved recipe or opening ingredient selection does not silently update the shared shopping list.

## Verification boundary

The linked Android Developers pages were readable through the research tool. Direct Material 3 guideline pages returned a JavaScript requirement, so no inaccessible page content is cited as inspected evidence. Component and design claims above use Google's readable primary documentation.

The packet is not a native view hierarchy and cannot prove component behavior, font scaling, keyboard avoidance, predictive Back, TalkBack, gesture navigation or accessibility compliance. Validate these with native controls and actual Android devices when implementation is authorized. Polish labels, long text, display scaling, larger fonts and alternative navigation modes require later layout and interaction checks. T03 physical-device durability and T09 capture-fidelity/evaluation gaps remain open; neither readiness gate changes.
