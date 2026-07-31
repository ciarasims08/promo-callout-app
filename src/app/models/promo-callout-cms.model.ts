export interface PromoCalloutCmsEntry {
  sys: {
    id: string;
  };
  fields: {
    title?: string;
    body?: string;
    iconName?: string;
    tone?: 'info' | 'promo';
    ctaLabel?: string;
    ctaUrl?: string;
    dismissible?: boolean;
  };
}