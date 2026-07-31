import { mapPromoCallout } from './promo-callout.adapter';

describe('mapPromoCallout', () => {
  it('should map valid promo CMS content to a PromoCallout', () => {
    const entry = {
      sys: {
        id: 'promo-123',
      },
      fields: {
        title: 'Earn more with your card',
        body: 'Get 3% cash back.',
        iconName: '🎁',
        tone: 'promo' as const,
        ctaLabel: 'See offer details',
        ctaUrl: '/promotions/123',
        dismissible: true,
      },
    };

    const result = mapPromoCallout(entry);

    expect(result).toEqual({
      id: 'promo-123',
      title: 'Earn more with your card',
      body: 'Get 3% cash back.',
      iconName: '🎁',
      tone: 'promo',
      ctaLabel: 'See offer details',
      ctaUrl: '/promotions/123',
      dismissible: true,
    });
  });

  it('should map valid info CMS content to a PromoCallout', () => {
    const entry = {
      sys: {
        id: 'info-security-alert-2026',
      },
      fields: {
        title: 'Keep your account secure',
        body: 'Review your security settings and make sure your contact information is up to date.',
        iconName: '🔒',
        tone: 'info' as const,
        dismissible: true,
      },
    };

    const result = mapPromoCallout(entry);

    expect(result).toEqual({
      id: 'info-security-alert-2026',
      title: 'Keep your account secure',
      body: 'Review your security settings and make sure your contact information is up to date.',
      iconName: '🔒',
      tone: 'info',
      ctaLabel: undefined,
      ctaUrl: undefined,
      dismissible: true,
    });
  });

  it('should return null and warn when title is missing', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const entry = {
      sys: {
        id: 'promo-missing-title',
      },
      fields: {
        body: 'This entry is missing a title.',
        tone: 'info' as const,
      },
    };

    const result = mapPromoCallout(entry);

    expect(result).toBeNull();

    expect(warnSpy).toHaveBeenCalledWith(
      'PromoCallout entry "promo-missing-title" is missing required content.'
    );

    warnSpy.mockRestore();
  });

  it('should default dismissible to false when it is missing', () => {
    const entry = {
      sys: {
        id: 'promo-123',
      },
      fields: {
        title: 'A valid title',
        tone: 'info' as const,
      },
    };

    const result = mapPromoCallout(entry);

    expect(result?.dismissible).toBe(false);
  });

  it('should return null and warn when tone is invalid', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const entry = {
      sys: {
        id: 'promo-invalid-tone',
      },
      fields: {
        title: 'A valid title',
        tone: 'banana' as any,
      },
    };

    const result = mapPromoCallout(entry);

    expect(result).toBeNull();

    expect(warnSpy).toHaveBeenCalledWith(
      'PromoCallout entry "promo-invalid-tone" is missing required content.'
    );

    warnSpy.mockRestore();
  });
});
