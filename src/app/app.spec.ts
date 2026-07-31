import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render both promo and info callouts', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const callouts = compiled.querySelectorAll(
      'app-promo-callout'
    );

    expect(callouts.length).toBe(2);
  });

  it('should dismiss the promo callout without dismissing the info callout', () => {
    component.onPromoDismissed('promo-cc-cashback-2026-q3');

    expect(component.isPromoDismissed).toBe(true);
    expect(component.isInfoDismissed).toBe(false);
  });

  it('should dismiss the info callout without dismissing the promo callout', () => {
    component.onInfoDismissed('info-security-alert-2026');

    expect(component.isInfoDismissed).toBe(true);
    expect(component.isPromoDismissed).toBe(false);
  });
});
