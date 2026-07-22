import {
  ResponsiveBreakpointValue,
  ResponsiveUtil,
} from './responsive.util';

describe('ResponsiveUtil breakpoint values', () => {
  it('resolves typed responsive breakpoint maps', () => {
    spyOn(ResponsiveUtil, 'getViewPort').and.returnValue({
      width: 1200,
      height: 800,
    });
    const value: ResponsiveBreakpointValue<string> = {
      default: 'append',
      1000: 'prepend',
    };

    expect(ResponsiveUtil.getBreakpointValue(value)).toBe('prepend');
  });

  it('resolves JSON attribute breakpoint maps to unknown values', () => {
    spyOn(ResponsiveUtil, 'getViewPort').and.returnValue({
      width: 1200,
      height: 800,
    });

    expect(
      ResponsiveUtil.getAttributeValueByBreakpoint(
        JSON.stringify({ default: 'append', 1000: { mode: 'prepend' } })
      )
    ).toEqual({ mode: 'prepend' });
  });
});
