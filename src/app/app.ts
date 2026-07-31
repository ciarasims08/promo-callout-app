import { ChangeDetectionStrategy, Component } from '@angular/core';

import { mapPromoCallout } from './adapters/promo-callout.adapter';
import { PromoCalloutComponent } from './components/promo-callout/promo-callout';

const promoCmsEntry = {
  sys: {
    id: 'promo-cc-cashback-2026-q3',
  },
  fields: {
    title: 'Earn more with your M1st Cash Back card',
    body: 'Members earn 3% back on gas and groceries through September.',
    iconName: '🎁',
    tone: 'promo' as const,
    ctaLabel: 'See offer details',
    ctaUrl: '/promotions/cashback-q3',
    dismissible: true,
  },
};

const infoCmsEntry = {
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

@Component({
  selector: 'app-root',
  imports: [PromoCalloutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  promo = mapPromoCallout(promoCmsEntry);
  info = mapPromoCallout(infoCmsEntry);

  isPromoDismissed = false;
  isInfoDismissed = false;

  onPromoDismissed(id: string): void {
    console.log(`Promo callout dismissed: ${id}`);
    this.isPromoDismissed = true;
  }

  onInfoDismissed(id: string): void {
    console.log(`Info callout dismissed: ${id}`);
    this.isInfoDismissed = true;
  }
}
