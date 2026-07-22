import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ContentComponent } from './content.component';

class RouterStub {
  readonly events = new Subject<unknown>();
}

describe('ContentComponent performance', () => {
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useClass: RouterStub },
      ],
    })
      .overrideComponent(ContentComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    fixture.detectChanges();
  });

  it('exposes a stable content container class map', () => {
    const component = fixture.componentInstance as unknown as {
      contentContainerClasses?: () => Record<string, boolean>;
    };

    fixture.componentRef.setInput('appContentContiner', 'fixed');
    fixture.detectChanges();

    const fixedClasses = component.contentContainerClasses?.();
    const fixedClassesAgain = component.contentContainerClasses?.();

    expect(fixedClasses).toEqual({
      'container-xxl': true,
      'container-fluid': false,
    });
    expect(fixedClassesAgain).toBe(fixedClasses);

    fixture.componentRef.setInput('appContentContiner', 'fluid');
    fixture.detectChanges();

    expect(component.contentContainerClasses?.()).toEqual({
      'container-xxl': false,
      'container-fluid': true,
    });
  });
});
