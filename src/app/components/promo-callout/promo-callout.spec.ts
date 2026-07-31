import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoCalloutComponent } from './promo-callout';

describe('PromoCalloutComponent', () => {
  let component: PromoCalloutComponent;
  let fixture: ComponentFixture<PromoCalloutComponent>;

  const promoContent = {
    id: 'promo-123',
    title: 'Earn more with your card',
    body: 'Get 3% cash back.',
    iconName: '🎁',
    tone: 'promo' as const,
    ctaLabel: 'See offer details',
    ctaUrl: '/promotions/123',
    dismissible: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCalloutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoCalloutComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('content', promoContent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render valid content', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.promo-callout__title')?.textContent)
      .toContain('Earn more with your card');

    expect(compiled.querySelector('.promo-callout__body')?.textContent)
      .toContain('Get 3% cash back.');
  });

  it('should render the promo tone', () => {
    const callout = fixture.nativeElement.querySelector(
      '.promo-callout'
    ) as HTMLElement;

    expect(callout.classList.contains('promo-callout--promo')).toBe(true);
    expect(callout.classList.contains('promo-callout--info')).toBe(false);
  });

  it('should render the info tone', () => {
    fixture.componentRef.setInput('content', {
      ...promoContent,
      tone: 'info',
    });

    fixture.detectChanges();

    const callout = fixture.nativeElement.querySelector(
      '.promo-callout'
    ) as HTMLElement;

    expect(callout.classList.contains('promo-callout--info')).toBe(true);
    expect(callout.classList.contains('promo-callout--promo')).toBe(false);
  });

  it('should render the CTA when both label and URL are provided', () => {
    const cta = fixture.nativeElement.querySelector(
      '.promo-callout__cta'
    ) as HTMLAnchorElement;

    expect(cta).toBeTruthy();
    expect(cta.textContent).toContain('See offer details');
    expect(cta.getAttribute('href')).toBe('/promotions/123');
  });

  it('should not render the CTA when the label is missing', () => {
    fixture.componentRef.setInput('content', {
      ...promoContent,
      ctaLabel: undefined,
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.promo-callout__cta')
    ).toBeNull();
  });

  it('should not render the CTA when the URL is missing', () => {
    fixture.componentRef.setInput('content', {
      ...promoContent,
      ctaUrl: undefined,
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.promo-callout__cta')
    ).toBeNull();
  });

  it('should render the loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const loading = fixture.nativeElement.querySelector(
      '.promo-callout--loading'
    );

    expect(loading).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.promo-callout__title')
    ).toBeNull();
  });

  it('should not render the callout when the feature is disabled', () => {
    fixture.componentRef.setInput('featureEnabled', false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.promo-callout')
    ).toBeNull();
  });

  it('should emit the entry id when dismissed', () => {
    const dismissedSpy = vi.fn();

    component.dismissed.subscribe(dismissedSpy);

    component.onDismiss();

    expect(dismissedSpy).toHaveBeenCalledWith('promo-123');
  });

  it('should render a dismiss button when the entry is dismissible', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '.promo-callout__dismiss'
    );

    expect(dismissButton).toBeTruthy();
  });

  it('should not render a dismiss button when the entry is not dismissible', () => {
    fixture.componentRef.setInput('content', {
      ...promoContent,
      dismissible: false,
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.promo-callout__dismiss')
    ).toBeNull();
  });

  it('should use an aside for the callout', () => {
    const callout = fixture.nativeElement.querySelector(
      '.promo-callout'
    );

    expect(callout?.tagName.toLowerCase()).toBe('aside');
  });

  it('should give the dismiss button an accessible name', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '.promo-callout__dismiss'
    ) as HTMLButtonElement;

    expect(dismissButton).toBeTruthy();
    expect(dismissButton.getAttribute('aria-label')).toBe(
      'Dismiss promotional message'
    );
  });

  it('should hide the decorative icon from assistive technology', () => {
    const icon = fixture.nativeElement.querySelector(
      '.promo-callout__icon'
    );

    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });
});
