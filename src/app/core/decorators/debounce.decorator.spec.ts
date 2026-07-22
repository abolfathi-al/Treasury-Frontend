import { Debounce } from './debounce.decorator';

type DebouncedMethod = ((value: string) => void) & {
  cancelDebounce?: () => void;
};

describe('Debounce', () => {
  class DebounceHost {
    readonly values: string[] = [];

    @Debounce(100)
    push(value: string): void {
      this.values.push(value);
    }
  }

  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('coalesces repeated calls with the same arguments', () => {
    const host = new DebounceHost();

    host.push('alpha');
    host.push('alpha');
    jasmine.clock().tick(99);

    expect(host.values).toEqual([]);

    jasmine.clock().tick(1);

    expect(host.values).toEqual(['alpha']);
  });

  it('cancels pending debounced calls through the attached cancel method', () => {
    const host = new DebounceHost();

    host.push('alpha');
    (host.push as DebouncedMethod).cancelDebounce?.();
    jasmine.clock().tick(100);

    expect(host.values).toEqual([]);
  });
});
