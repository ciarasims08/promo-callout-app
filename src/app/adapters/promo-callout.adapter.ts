import { PromoCallout } from '../models/promo-callout.model';
import { PromoCalloutCmsEntry } from '../models/promo-callout-cms.model';

export function mapPromoCallout(
  entry: PromoCalloutCmsEntry
): PromoCallout | null {
  const { id } = entry.sys;
  const {
    title,
    body,
    iconName,
    tone,
    ctaLabel,
    ctaUrl,
    dismissible,
  } = entry.fields;

  const isValidTone = tone === 'info' || tone === 'promo';

  if (!title || !isValidTone) {
    console.warn(
      `PromoCallout entry "${id}" is missing required content.`
    );

    return null;
  }

  return {
    id,
    title,
    body,
    iconName,
    tone,
    ctaLabel,
    ctaUrl,
    dismissible: dismissible ?? false,
  };
}
