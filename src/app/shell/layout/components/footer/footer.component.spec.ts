import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it('renders a neutral Velora footer', () => {
    const host = fixture.nativeElement as HTMLElement;
    const footer = host.querySelector('footer[role="contentinfo"]');

    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain('Velora Enterprise');
    expect(footer?.textContent).toContain(String(new Date().getFullYear()));
  });

  it('renders only shell navigation links', () => {
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a.menu-link')
    ).map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(['/dashboard']);
  });
});
