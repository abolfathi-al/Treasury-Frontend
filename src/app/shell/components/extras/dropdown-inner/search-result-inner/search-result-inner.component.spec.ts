import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultInnerComponent } from './search-result-inner.component';

const waitForSearchDelay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 120));

describe('SearchResultInnerComponent timeout handling', () => {
  let fixture: ComponentFixture<SearchResultInnerComponent>;
  let component: SearchResultInnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultInnerComponent],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(SearchResultInnerComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchResultInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('cancels a pending delayed search when the input is cleared', async () => {
    component.handleProcesss('karina');
    component.handleClear();

    await waitForSearchDelay();

    expect(component.activeMode()).toBe('velora-search-search-main');
    expect(component.results()).toEqual([]);
  });

  it('publishes delayed search results after the debounce window', async () => {
    component.handleProcesss('karina');

    await waitForSearchDelay();

    expect(component.activeMode()).toBe('velora-search-search-result');
    expect(component.results()).toEqual([
      jasmine.objectContaining({ title: 'Karina Clark' }),
    ]);
  });
});
