import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FieldCardComponent } from '@field/components/field-card/field-card.component';
import { Field } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { LoadingFieldListComponent } from '@shared/components/loading/loading-field-list/loading-field-list.component';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LoadingFieldListComponent,
    FieldCardComponent,
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent implements OnInit {
  private fieldService = inject(FieldService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  @Input() showHeader = true;
  fields: Field[] = [];
  user!: User;
  loading = false;
  showModal = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.loadFields();
  }

  isUserPlayer(user: User): boolean {
    return user.role == UserRole.PLAYER;
  }

  loadFields() {
    this.loading = true;
    this.fields = [];
    this.fieldService.getFieldsActive().subscribe({
      next: data => {
        this.loading = false;
        this.fields = data;
      },
      error: err => {
        this.loading = false;
        console.error('Error cargando canchas', err.error.message || 'Error desconocido');
      }
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
  }

}
