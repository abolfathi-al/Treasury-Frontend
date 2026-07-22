import {
  getContextMenuClickOutsideHandler,
  setContextMenuClickOutsideHandler,
} from './tree.directive';

describe('Tree directive adapter helpers', () => {
  it('stores and reads context-menu outside-click handlers on the element', () => {
    const element = document.createElement('div');
    const handler = () => undefined;

    setContextMenuClickOutsideHandler(element, handler);

    expect(getContextMenuClickOutsideHandler(element)).toBe(handler);
  });
});
