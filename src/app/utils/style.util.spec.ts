import { StyleUtil } from './style.util';

describe('StyleUtil typed style values', () => {
  it('coerces primitive values when setting CSS custom properties', () => {
    const element = document.createElement('div');

    StyleUtil.set(element, '--item-count', 3);
    StyleUtil.set(element, '--is-active', false);

    expect(StyleUtil.get(element, '--item-count')).toBe('3');
    expect(StyleUtil.get(element, '--is-active')).toBe('false');
  });
});
