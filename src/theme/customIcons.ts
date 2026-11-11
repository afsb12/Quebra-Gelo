/**
 * Category icons the app draws itself, for symbols MaterialCommunityIcons does not have (014).
 * Geometry is in a 24×24 box, stroke only (no fill), like the library's outline icons.
 * `paths` are drawn as-is; `mirrored.path` is drawn inside `mirrored.transform` and once more
 * flipped horizontally around the box center.
 */
export const CUSTOM_ICONS = {
  /** Happy Hour: two beer mugs toasting, with clink marks above. */
  'beer-toast': {
    paths: ['M12 1.5v2.5M8.8 2.6l1 1.6M15.2 2.6l-1 1.6'],
    mirrored: {
      path: 'M4 9h7v10a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 014 19zM4 11.5H2.5v4H4M4 9c0-1.5 1.2-2.4 2.3-1.8.6-1 2.2-1 2.8 0 1.1-.4 1.9.6 1.9 1.8M7.5 12v5',
      transform: 'rotate(14 7.5 14)',
    },
  },
} as const;

/** Stroke width in the 24-unit box: the outline weight of the library icons (014 Q1). */
export const CUSTOM_ICON_STROKE = 2;

export type CustomIconName = keyof typeof CUSTOM_ICONS;

export const isCustomIcon = (name: string): name is CustomIconName =>
  Object.prototype.hasOwnProperty.call(CUSTOM_ICONS, name);
