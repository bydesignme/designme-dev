/** Joins class names, skipping empty ones */
export const cx = (...names: Array<string | false | null | undefined | 0>) => names.filter(Boolean).join(' ');
