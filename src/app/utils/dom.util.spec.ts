import { DomUtil } from './dom.util';

describe('DomUtil event bridge', () => {
  it('forwards custom event detail payloads through EventUtil', () => {
    const element = document.createElement('div');
    const payload = ['toolbar', 'filter'];
    let receivedDetail: unknown;

    element.addEventListener('toolbar-action', (event) => {
      receivedDetail = (event as CustomEvent<unknown>).detail;
    });

    const dispatched = DomUtil.trigger(element, 'toolbar-action', payload);

    expect(dispatched).toBeTrue();
    expect(receivedDetail).toBe(payload);
  });
});
