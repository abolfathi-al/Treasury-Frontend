export function formatD3ChartValue(value: number, displayValue?: string, suffix = ''): string {
  if (displayValue && displayValue.trim().length > 0) {
    return displayValue;
  }

  return `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}`;
}

export function compactD3ChartLabel(label: string, maxLength = 18): string {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, Math.max(1, maxLength - 1))}...`;
}
