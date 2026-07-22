import { resolveClassicToolbarCommands } from './toolbar-command.config';

describe('classic toolbar command config', () => {
  it('maps existing layout toolbar flags to typed command visibility', () => {
    const commands = resolveClassicToolbarCommands({
      filterButton: true,
      daterangepickerButton: false,
      primaryButton: true,
      primaryButtonModal: 'create-app',
    });

    expect(commands.map((command) => command.id)).toEqual([
      'filter',
      'date-range',
      'secondary-filter',
      'primary-create',
    ]);
    expect(commands.find((command) => command.id === 'filter')?.visible).toBeTrue();
    expect(commands.find((command) => command.id === 'date-range')?.visible).toBeFalse();
    expect(commands.find((command) => command.id === 'primary-create')).toEqual(
      jasmine.objectContaining({
        labelKey: 'common.actions.create',
        modalTarget: '#velora_modal_create_app',
        visible: true,
      }),
    );
  });

  it('keeps existing always-rendered fallback commands visible', () => {
    const commands = resolveClassicToolbarCommands({});

    expect(
      commands.find((command) => command.id === 'secondary-filter')?.visible,
    ).toBeTrue();
    expect(
      commands.find((command) => command.id === 'primary-create')?.visible,
    ).toBeTrue();
  });
});
