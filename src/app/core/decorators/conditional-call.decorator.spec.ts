import { ConditionalCall } from './conditional-call.decorator';

describe('ConditionalCall', () => {
  class ConditionalHost {
    enabled = false;
    calls = 0;

    @ConditionalCall<ConditionalHost>((instance) => instance.enabled)
    run(value: string): string {
      this.calls += 1;
      return `ran:${value}`;
    }
  }

  it('skips the method when the condition is false', () => {
    const host = new ConditionalHost();

    expect(host.run('save')).toBeUndefined();
    expect(host.calls).toBe(0);
  });

  it('calls the method when the condition is true', () => {
    const host = new ConditionalHost();
    host.enabled = true;

    expect(host.run('save')).toBe('ran:save');
    expect(host.calls).toBe(1);
  });
});
