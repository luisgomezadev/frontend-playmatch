import { Component, Input } from '@angular/core';
import { Field } from '../../interfaces/field';
import { FieldService } from '../../services/field.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserPlayer } from '../../../../core/interfaces/user';
import { WithoutTeamComponent } from '../../../team/components/without-team/without-team.component';
import { MoneyFormatPipe } from '../../../../pipes/money-format.pipe';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { CommonModule, Location } from '@angular/common';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    WithoutTeamComponent,
    MoneyFormatPipe,
    TimeFormatPipe,
    CommonModule,
    ButtonActionComponent
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss',
})
export class FieldsListComponent {
  fields: Field[] = [];
  user!: UserPlayer;
  loading = false;

  @Input() showHeader: boolean = true;

  constructor(
    private fieldService: FieldService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.loadFields();
  }

  loadFields() {
    this.loading = true;
    this.fields = [];
    this.fieldService.getFields().subscribe({
      next: (data) => {
        this.loading = false;
        this.fields = data;
      },
      error: (err) => {
        this.loading = false;
        console.error(
          'Error cargando canchas',
          err.error.errorMessage || 'Error desconocido'
        );
      },
    });
  }

  isFieldOpen(opening: string, closing: string): boolean {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = opening.split(':').map(Number);
    const [closeHour, closeMin] = closing.split(':').map(Number);

    const openingMinutes = openHour * 60 + openMin;
    const closingMinutes = closeHour * 60 + closeMin;

    return nowMinutes >= openingMinutes && nowMinutes <= closingMinutes;
  }

  goBack(): void {
    this.location.back();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}
