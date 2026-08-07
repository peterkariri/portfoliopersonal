# Accessibility (A11y) Guidelines for Portfolio UI

To ensure the portfolio is accessible to all users, the UI/UX agent MUST implement the following semantic HTML structures and ARIA attributes for custom components.

## 1. Custom Modals (Dialogs)
When building custom modals or lightboxes, use the following attributes to ensure screen readers can properly interact with them.

- **Semantic HTML**: Use the native `<dialog>` element where possible. If a custom `<div>` must be used:
  - Add `role="dialog"` or `role="alertdialog"`.
  - Add `aria-modal="true"` to indicate that windows underneath the current dialog are not available for interaction.
  - Add `aria-labelledby="[id-of-modal-title]"` to link the modal to its heading.
  - Add `aria-describedby="[id-of-modal-description]"` if there is supporting text.

**Example:**
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Project Details</h2>
  <button aria-label="Close modal">X</button>
  <!-- Modal Content -->
</div>
```

## 2. Interactive Elements (Buttons & Links)
Ensure all interactive elements are clearly identifiable and usable via keyboard.

- **Buttons vs Links**: Use `<button>` for actions (e.g., opening a modal, submitting a form) and `<a>` with an `href` for navigation.
- If a `<div>` or `<span>` MUST be used as a button (strongly discouraged):
  - Add `role="button"`.
  - Add `tabindex="0"` to make it keyboard focusable.
  - Ensure both `Enter` and `Space` keys trigger the action in JavaScript.
- **Icon-only Buttons**: Always provide an `aria-label` (e.g., `aria-label="Menu"` or `aria-label="Close"`).

## 3. Navigation
- Use `<nav>` for the primary navigation block.
- Add `aria-label="Main Navigation"` or similar if there are multiple `<nav>` elements on the page.
- Use `aria-current="page"` on the link that points to the currently active page or section.

## 4. Focus Management
- Ensure a visible focus indicator (e.g., `outline`) is present for all focusable elements (do not use `outline: none;` without providing a custom visual focus state).
- When a modal opens, move focus to the first interactive element inside the modal.
- When a modal closes, return focus to the button that opened it.

## 5. Skip Links
- Provide a "Skip to main content" link at the very top of the document for keyboard users to bypass navigation.
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

## 6. Semantic Structure
- Use `<main>` to wrap the core content of the portfolio.
- Use properly nested headings (`<h1>` to `<h6>`) without skipping levels.
- Use `<section>` with `aria-labelledby` for distinct parts of the page (e.g., About, Projects, Contact).
