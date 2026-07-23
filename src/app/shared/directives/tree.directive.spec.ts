import {
  Component,
  provideZonelessChangeDetection,
  signal,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  getContextMenuClickOutsideHandler,
  setContextMenuClickOutsideHandler,
  TreeDirective,
  TreeNode,
} from './tree.directive';

@Component({
  imports: [TreeDirective],
  standalone: true,
  template: `
    <div
      vlVeloraTree
      [treeData]="nodes()"
      [treeAnimation]="animation()"
      [treeStriped]="striped()"
    ></div>
  `,
})
class TreeDirectiveHostComponent {
  readonly nodes = signal<TreeNode[]>([{ id: 'root', text: 'Root' }]);
  readonly animation = signal<boolean | number>(100);
  readonly striped = signal(true);
  readonly directive = viewChild.required(TreeDirective);
}

describe('Tree directive adapter helpers', () => {
  it('stores and reads context-menu outside-click handlers on the element', () => {
    const element = document.createElement('div');
    const handler = () => undefined;

    setContextMenuClickOutsideHandler(element, handler);

    expect(getContextMenuClickOutsideHandler(element)).toBe(handler);
  });
});

describe('TreeDirective lifecycle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('keeps one document drag listener across recreation and removes it on destroy', () => {
    const fixture = TestBed.createComponent(TreeDirectiveHostComponent);
    fixture.detectChanges();

    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as {
      handleDragMove(event: MouseEvent): void;
    };
    const dragMoveSpy = spyOn(internals, 'handleDragMove').and.callThrough();

    document.dispatchEvent(new MouseEvent('mousemove'));
    expect(dragMoveSpy).toHaveBeenCalledTimes(1);

    directive.recreateTree();
    document.dispatchEvent(new MouseEvent('mousemove'));
    expect(dragMoveSpy).toHaveBeenCalledTimes(2);

    fixture.destroy();
    document.dispatchEvent(new MouseEvent('mousemove'));
    expect(dragMoveSpy).toHaveBeenCalledTimes(2);
  });

  it('applies initial options and refreshes batched input changes once', () => {
    const fixture = TestBed.createComponent(TreeDirectiveHostComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const directive = component.directive();
    const internals = directive as unknown as { loadTreeData(): void };

    expect(directive.getOptions().core?.animation).toBe(100);
    expect(directive.getOptions().core?.themes?.striped).toBeTrue();
    const loadTreeData = spyOn(internals, 'loadTreeData').and.callThrough();

    component.nodes.set([{ id: 'next', text: 'Next' }]);
    component.animation.set(200);
    component.striped.set(false);
    fixture.detectChanges();

    expect(loadTreeData).toHaveBeenCalledTimes(1);
    expect(directive.getOptions().core?.animation).toBe(200);
    expect(directive.getOptions().core?.themes?.striped).toBeFalse();
    fixture.destroy();
  });

  it('cancels delayed context-menu listeners when destroyed', async () => {
    const fixture = TestBed.createComponent(TreeDirectiveHostComponent);
    fixture.detectChanges();
    const addListenerSpy = spyOn(document, 'addEventListener').and.callThrough();
    const anchor = fixture.nativeElement.querySelector(
      '[data-node-id] .jstree-anchor'
    ) as HTMLElement;

    anchor.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 10,
        clientY: 20,
      })
    );
    fixture.destroy();
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));

    const delayedClickListeners = addListenerSpy.calls
      .allArgs()
      .filter(([eventName]) => eventName === 'click');
    expect(delayedClickListeners).toEqual([]);
    expect(document.querySelector('.jstree-context-menu')).toBeNull();
  });
});
