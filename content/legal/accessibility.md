**Version {{PRIVACY_VERSION}}.** This statement applies to {{BASE_URL}}.

This website is run by {{ORG_LEGAL_NAME}}. We want as many people as possible to be able to use it. That means you should be able to:

- change colours, contrast levels and fonts using browser or operating system settings;
- zoom in up to 400% without text spilling off the screen;
- navigate the whole site using a keyboard alone;
- navigate the whole site using speech recognition software;
- listen to the site using a screen reader, including the most recent versions of JAWS, NVDA, VoiceOver and TalkBack.

We have also tried to make the writing as simple as possible to understand, and to avoid jargon except where the jargon is the point — in which case it is in the [glossary]({{BASE_URL}}/glossary).

AbilityNet has advice on making your device easier to use if you have a disability.

## How accessible this website is

We aim to meet **WCAG 2.2 level AA** in full. We believe the site currently meets it, with the caveats below.

What we have deliberately done:

- **No reliance on JavaScript.** Every page, every form, every download and every tool works with JavaScript disabled. JavaScript only adds convenience — instant vote counts, an inline signup prompt instead of a page change. This is the single most effective accessibility decision available to a site like this.
- **One column, generous line length, real HTML.** Headings are headings, lists are lists, tables have proper header cells and captions.
- **Visible focus on everything focusable**, with a 3:1 contrast focus indicator that does not rely on colour alone.
- **Skip link** to the main content as the first focusable element.
- **Error summaries** at the top of the form, linked to the field in question, with the error also repeated next to the field — the GOV.UK Design System pattern.
- **Text contrast of at least 4.5:1** for body text and 3:1 for large text and interface components, in both light and dark colour schemes.
- **Target sizes of at least 24 by 24 pixels** with adequate spacing (WCAG 2.2 success criterion 2.5.8).
- **No motion by default.** The small amount of animation present is disabled automatically when `prefers-reduced-motion` is set.
- **No time limits** anywhere, other than security token expiry, which is generous and always re-requestable.
- **Consistent help.** The same contact route appears in the same place on every page (WCAG 2.2 success criterion 3.2.6).
- **Accessible authentication.** You can paste into every field including the password field, and we never require you to solve a puzzle, do arithmetic, or transcribe an image to sign in (WCAG 2.2 success criterion 3.3.8).

## Known limitations

We are honest about the gaps rather than claiming perfection:

1. **Wide data tables.** Some templates preview a table with up to fourteen columns. On a narrow screen these scroll horizontally. The scroll region is keyboard focusable and labelled, but scrolling a wide table with a screen magnifier is still awkward. The downloadable CSV is a better experience and we say so on the page.
2. **The retro board and estimation tools** were built keyboard-first and are fully operable without a pointer, but they are dense. If you find any part of them hard to use, tell us — these are the pages we most want feedback on.
3. **Markdown downloads** are plain text and inherit the accessibility of whatever you open them in. We do not produce PDFs precisely because untagged PDFs are so often inaccessible.

## Feedback and contact

If you need information on this website in a different format — accessible PDF, large print, easy read, audio recording, braille — email {{SUPPORT_EMAIL}} and tell us what you need. We will reply within 5 working days.

If you find any accessibility problem not listed here, or you think we are not meeting the accessibility requirements, email {{SUPPORT_EMAIL}}. Include the page address and what happened. We treat accessibility bugs as higher priority than feature work.

## Enforcement procedure

The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018. If you are not happy with how we respond to your complaint, contact the Equality Advisory and Support Service (EASS).

{{ORG_LEGAL_NAME}} is not a public sector body, so those regulations do not apply to us directly. We hold ourselves to the same standard anyway, because it is the right standard and because our users work in organisations that have to meet it.

## Technical information about this website's accessibility

{{ORG_LEGAL_NAME}} is committed to making this website accessible, in accordance with WCAG 2.2 level AA.

### Compliance status

This website is believed to be **fully compliant** with the Web Content Accessibility Guidelines version 2.2 AA standard, subject to the known limitations described above, which we consider to be usability rather than conformance failures.

## How we tested this website

- Automated checks on every page using an accessibility linter in the build.
- Manual keyboard-only walkthrough of every journey, including signup, download, the retro board and the assessment.
- Screen reader testing with NVDA on Windows and VoiceOver on macOS and iOS.
- Zoom to 400% and reflow testing at a 320 pixel viewport width.
- Colour contrast checked programmatically for every foreground and background pair in the design tokens.
- Full journey testing with JavaScript disabled.

## What we are doing to improve accessibility

- Replacing the wide table previews with a responsive definition-list view on narrow screens.
- Commissioning an external audit including testing with disabled users, rather than relying only on our own testing. We will publish the findings, including the ones that are embarrassing.
- Adding a plain-text summary at the top of every long template page.

## Preparation of this statement

This statement was prepared on {{PRIVACY_VERSION}}. It was last reviewed on {{PRIVACY_VERSION}}.

The website was last tested on {{PRIVACY_VERSION}}. The test was carried out internally by {{ORG_LEGAL_NAME}}. We tested every page template, because the site is small enough to test exhaustively.
