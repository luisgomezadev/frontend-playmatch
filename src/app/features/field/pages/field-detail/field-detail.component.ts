import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Field, Status } from '@field/interfaces/field';
import { ButtonComponent } from '@shared/components/button/button.component';
import { User } from '@user/interfaces/user';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { FieldInfoComponent } from '@features/field/components/field-info/field-info.component';

@Component({
  selector: 'app-field-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FieldInfoComponent, ButtonComponent, LayoutComponent],
  templateUrl: './field-detail.component.html',
  styleUrl: './field-detail.component.scss'
})
export class FieldDetailComponent implements OnInit {
  private readonly authService = inject(AuthService);

  user!: User;
  field: Field | null = null;
  fieldId!: number;
  loading = false;
  Status = Status;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

  }

}
