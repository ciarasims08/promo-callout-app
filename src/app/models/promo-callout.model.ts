// define data shape
export interface PromoCallout {
  id: string;               // id to know which promo dismissed
  title: string;            // missing title makes content invalid
  body?: string;
  iconName?: string;
  tone: 'info' | 'promo';
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;     // determine whether to show dismiss button
}