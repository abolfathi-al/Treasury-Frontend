import { CoreUtil } from './core.util';

describe('CoreUtil nested array helpers', () => {
  it('reads and writes nested properties without changing sibling values', () => {
    const target: Record<string, unknown> = {
      order: { id: 1 },
    };

    expect(CoreUtil.setNestedProperty(target, 'order.status.label', 'Open')).toBeTrue();
    expect(CoreUtil.getNestedProperty<string>(target, 'order.status.label')).toBe('Open');
    expect(CoreUtil.getNestedProperty<number>(target, 'order.id')).toBe(1);
  });

  it('updates nested properties from their previous value', () => {
    const target: Record<string, unknown> = {
      order: { count: 1 },
    };

    expect(
      CoreUtil.updateNestedProperty<number>(target, 'order.count', (previous) => (previous ?? 0) + 1)
    ).toBeTrue();

    expect(CoreUtil.getNestedProperty<number>(target, 'order.count')).toBe(2);
  });

  it('parses JSON strings and returns non-JSON strings unchanged', () => {
    expect(CoreUtil.toJSON('{"enabled":true}')).toEqual({ enabled: true });
    expect(CoreUtil.toJSON('enabled')).toBe('enabled');
  });

  it('ensures nested arrays through a typed object path helper', () => {
    const target: Record<string, unknown> = {};

    const items = CoreUtil.ensureNestedArray<string>(target, 'orders.items');
    items?.push('first');

    expect(target).toEqual({
      orders: {
        items: ['first'],
      },
    });
  });

  it('pushes values into nested arrays without replacing existing arrays', () => {
    const target: Record<string, unknown> = {
      orders: {
        items: ['first'],
      },
    };

    expect(CoreUtil.pushToNestedArray(target, 'orders.items', 'second')).toBeTrue();

    expect(target).toEqual({
      orders: {
        items: ['first', 'second'],
      },
    });
  });
});
