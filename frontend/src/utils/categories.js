// =============================================================
// CATEGORIES — names and their design-token colors
// =============================================================
// One place for the category list, so the form, filters and
// charts always agree. Each category maps to a color "key" in
// src/styles/tokens.css (--cat-<key>, --cat-<key>-tint, --cat-<key>-ink).
// The same category always gets the same color everywhere.
// =============================================================

export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Other',
];

const COLOR_KEYS = {
  Food: 'food',
  Transport: 'transport',
  Entertainment: 'entertainment',
  Shopping: 'shopping',
  Bills: 'housing',
  Health: 'health',
  Education: 'education',
  Other: 'other',
};

// Returns CSS variable references, e.g. { solid: 'var(--cat-food)', ... }
// Unknown categories fall back to the "other" colors.
export function getCategoryColors(category) {
  const key = COLOR_KEYS[category] || 'other';
  return {
    solid: `var(--cat-${key})`,
    tint: `var(--cat-${key}-tint)`,
    ink: `var(--cat-${key}-ink)`,
  };
}
