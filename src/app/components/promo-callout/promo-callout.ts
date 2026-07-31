import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { PromoCallout } from '../../models/promo-callout.model';

@Component({
  selector: 'app-promo-callout',
  templateUrl: './promo-callout.html',
  styleUrl: './promo-callout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'promo-callout-host',
  },
})
export class PromoCalloutComponent {
  content = input<PromoCallout | null>(null);

  loading = input(false);

  featureEnabled = input(true);

  dismissed = output<string>();

  onDismiss(): void {
    const id = this.content()?.id;

    if (id) {
      this.dismissed.emit(id);
    }
  }
}
