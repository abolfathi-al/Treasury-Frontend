import {
  Component,
  TemplateRef,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDirective } from './search.directive';

@Component({
  imports: [SearchDirective],
  standalone: true,
  template: `
    <div vlVeloraSearch>
      <input type="search" />
      <ng-template #emptyTemplate>Empty state</ng-template>
      <ng-template #loadingTemplate>Loading state</ng-template>
      <ng-template #noResultsTemplate>No results state</ng-template>
      <ng-template #resultsTemplate>Results state</ng-template>
    </div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(SearchDirective);
}

function renderTemplate(template: TemplateRef<unknown>): string {
  const view = template.createEmbeddedView({});
  view.detectChanges();
  const text = (view.rootNodes as Node[])
    .map((node) => node.textContent ?? '')
    .join('')
    .trim();
  view.destroy();
  return text;
}

describe('SearchDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  function setup(): {
    fixture: ComponentFixture<HostComponent>;
    directive: SearchDirective;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, directive: fixture.componentInstance.directive() };
  }

  it('exposes projected search state templates', () => {
    const { directive } = setup();

    expect(renderTemplate(directive.emptyTemplate()!)).toBe('Empty state');
    expect(renderTemplate(directive.loadingTemplate()!)).toBe('Loading state');
    expect(renderTemplate(directive.noResultsTemplate()!)).toBe(
      'No results state'
    );
    expect(renderTemplate(directive.resultsTemplate()!)).toBe('Results state');
  });
});
