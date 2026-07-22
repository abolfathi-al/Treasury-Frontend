export type TranslationTree = Record<string, unknown>;

export function mergeTranslationTree(target: TranslationTree, source: TranslationTree): void {
  for (const [key, value] of Object.entries(source)) {
    const targetValue = target[key];

    if (isTranslationTree(targetValue) && isTranslationTree(value)) {
      mergeTranslationTree(targetValue, value);
      continue;
    }

    target[key] = value;
  }
}

function isTranslationTree(value: unknown): value is TranslationTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
