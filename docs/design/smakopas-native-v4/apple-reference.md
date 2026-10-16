# Apple design reference

Reference snapshot: 2026-10-16. This is a short synthesis of Apple's current Human Interface Guidelines and its application to the static native v4 study. It is not a claim of platform compliance or runtime verification. All summaries below are paraphrases.

## Materials

Liquid Glass belongs to navigation and controls above the content layer. Content should retain its own readable surfaces. Apple distinguishes regular and clear variants and expects materials to adapt to context and accessibility preferences. [Apple: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

Study decision: keep recipe text, originals and forms opaque. Restrict the drawn glass treatment to navigation and controls. Backdrop blur, a light edge and tint illustrate the intended hierarchy; a future application must use system materials for their actual appearance and adaptations.

## Tab bars

Tabs represent destinations, not actions. Keep them available through ordinary navigation; modal flows can cover them. Apple's guidance, updated June 8, 2026, places iPad tabs at the top and favors a tab bar over a sidebar when a small set of destinations is sufficient. [Apple: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

Study decision: Cookbook, Assistant and Shopping form three bottom tabs on iPhone and three top tabs on iPad. Add recipe remains an action. Add photos and Review are focused modal flows that cover the destination tabs.

## Sidebars

Apple's June 8, 2026 update describes adaptable tab/sidebar navigation and the relationship between navigation and content extending beneath it. A sidebar is an option for navigation needs, rather than a requirement for every iPad layout. [Apple: Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)

Study decision: do not introduce a permanent sidebar for three sections. Use the available tablet width for a larger source preview, source-to-draft comparison and readable recipe columns.

## Accessibility

Apple recommends a 17pt default text size on iOS/iPadOS, with 11pt as the minimum, and support for substantial text enlargement through Dynamic Type. Layouts should accommodate enlargement of at least 200%, instead of preserving a fixed composition by shrinking text. [Apple: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

Study decision: use readable content sizes and avoid compressing the complete phone review into one frame. A second scroll-state image exposes the remaining fields. These static sizes and images do not demonstrate Dynamic Type support.

## Checks reserved for implementation

Validate actual system materials in Dark Mode, with Reduce Transparency and Reduce Motion, and against varied backgrounds. Verify contrast, Dynamic Type and long translations, VoiceOver, keyboard navigation, source/form switching and actual touch targets on devices. The locally rendered SF Pro Text and AppKit-exported SF Symbols establish asset choices only. They are not native controls or simulator evidence. T03 physical-device requirements and T09 capture evaluation remain unchanged.
