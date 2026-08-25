import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() loading = false;
}
