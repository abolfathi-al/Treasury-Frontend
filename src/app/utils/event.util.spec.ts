import { EventUtil } from './event.util';

describe('EventUtil typed event payloads', () => {
  it('dispatches custom events with unknown detail payloads', () => {
    const element = document.createElement('button');
    const payload = { id: 42, source: 'spec' };
    let receivedDetail: unknown;

    element.addEventListener('custom-action', (event) => {
      receivedDetail = (event as CustomEvent<unknown>).detail;
    });

    const dispatched = EventUtil.trigger(element, 'custom-action', payload);

    expect(dispatched).toBeTrue();
    expect(receivedDetail).toBe(payload);
  });
});
