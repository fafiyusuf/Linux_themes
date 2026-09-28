# UI Design Rules — Anti-AI UI

## Purpose

Build a UI that feels **designed by a real product designer and developer**, not generated from an AI template.

The interface should feel intentional, distinctive, practical, and polished. Avoid generic patterns that immediately make the project look like an AI-generated website.

The goal is **not to make the UI complicated**. The goal is to make it feel **human-designed, product-specific, and visually intentional**.

---

# 1. Core Principle

Before creating any UI, ask:

> **"Would this interface look like it could belong to 500 other AI-generated projects?"**

If yes, redesign it.

Every major screen should have its own visual identity based on the actual purpose of the product.

Do not blindly follow common SaaS/dashboard templates.

---

# 2. Avoid Generic AI UI Patterns

Do NOT automatically use:

- Huge centered hero sections
- Purple/blue gradient backgrounds
- Excessive glassmorphism
- Floating gradient blobs
- Glowing borders
- Excessive rounded cards
- Everything inside a card
- Giant headings with generic marketing copy
- "AI-powered" badges everywhere
- Generic dashboard cards
- Three-column feature sections
- Random decorative icons
- Excessive shadows
- Excessive animations
- Gradient text
- Pills for everything
- Floating action buttons without a real purpose
- Generic empty-state illustrations
- Stock-looking illustrations
- Random Lucide icons used as decoration
- Excessive use of `rounded-xl` / `rounded-2xl`
- Every section having the same spacing and structure
- Excessive whitespace that makes the application feel empty
- Copy such as:
  - "Unlock the power of..."
  - "Supercharge your workflow"
  - "The future of..."
  - "Seamless experience"
  - "AI-powered solution"
  - "Revolutionize your..."
  - "Take your productivity to the next level"

These patterns are strongly associated with AI-generated interfaces.

---

# 3. Do Not Use the Same Layout Everywhere

Different pages should have different layouts when their purposes are different.

For example:

- Dashboard → information-dense
- Settings → structured and functional
- Analytics → data-focused
- Profile → personal and compact
- Management pages → tables and controls
- Landing page → visual storytelling
- Detail page → content hierarchy
- Creation page → focused workspace

Do not force every page into:

```text
Header
↓
Hero
↓
Cards
↓
Cards
↓
Cards
```

---

# 4. Design Around the Product

The UI must reflect what the product actually does.

Before designing a page, understand:

1. Who uses this page?
2. What are they trying to accomplish?
3. What information matters most?
4. What action should be easiest?
5. What information should be secondary?
6. What should the user see first?

Design the interface around these answers.

Do not add components simply because they "look good."

---

# 5. Use Visual Hierarchy

Not everything should compete for attention.

Establish clear hierarchy through:

- Typography
- Size
- Weight
- Spacing
- Position
- Contrast
- Grouping
- Color
- Borders

A page should have an obvious:

**Primary → Secondary → Supporting**

hierarchy.

Avoid making every heading bold, every card colorful, and every button prominent.

---

# 6. Typography

Use typography intentionally.

Do not randomly use multiple font sizes.

Recommended hierarchy:

```text
Page title
    ↓
Section title
    ↓
Subheading
    ↓
Body
    ↓
Supporting text
```

Avoid excessive:

- `font-black`
- giant text
- uppercase text
- letter spacing
- gradient text

Headings should feel natural rather than promotional.

---

# 7. Colors

Use a restrained color system.

Prefer:

- 1 primary brand color
- 1 secondary/accent color
- Neutral background
- Neutral surfaces
- Clear semantic colors

Do not create a rainbow UI.

Color should communicate meaning.

For example:

```text
Primary → main actions
Success → completed / healthy
Warning → attention required
Danger → destructive / critical
Muted → secondary information
```

Do not use bright colors just for decoration.

---

# 8. Cards

Cards should have a reason to exist.

Do NOT put every piece of content inside a card.

Bad:

```text
┌─────────────────────┐
│ Card                │
│                     │
│ Another Card        │
│                     │
│ Another Card        │
└─────────────────────┘
```

Prefer using:

- Sections
- Dividers
- Tables
- Lists
- Inline information
- Panels
- Grouped content

Use cards when they help separate meaningful pieces of information.

---

# 9. Border Radius

Do not make everything extremely rounded.

Avoid:

```css
border-radius: 9999px;
```

for normal containers.

Use different levels of rounding intentionally:

```text
Buttons        → small/medium
Inputs         → small/medium
Cards          → medium
Large panels   → subtle/medium
Pills          → only when semantically appropriate
```

Not every component needs to look like a floating bubble.

---

# 10. Shadows

Use shadows sparingly.

Avoid:

```text
shadow-xl
shadow-2xl
glow effects
multiple layered shadows
```

on everything.

Prefer:

- borders
- subtle elevation
- spacing
- contrast

A professional interface does not need every component to float.

---

# 11. Icons

Icons must have a purpose.

Do not add icons simply to fill empty space.

Avoid:

```text
Random icon
+
Heading
+
Description
```

for every section.

Use icons for:

- Actions
- Navigation
- Status
- Recognition
- Important visual shortcuts

Keep icon sizing consistent.

---

# 12. Buttons

Buttons should communicate clear actions.

Avoid excessive button styles.

Recommended hierarchy:

```text
Primary action
Secondary action
Tertiary action
Destructive action
```

Do not make every button primary.

Avoid unnecessarily long button text.

Prefer:

```text
Save
Create
Edit
Delete
Export
Continue
```

instead of:

```text
✨ Start Your Amazing Journey
```

---

# 13. Forms
