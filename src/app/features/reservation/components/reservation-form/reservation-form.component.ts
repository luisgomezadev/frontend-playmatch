import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmedReservation } from '../../interfaces/reservation';
import { UserPlayer } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import Swal from 'sweetalert2';
import { Team } from '../../../team/interfaces/team';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    ButtonActionComponent,
    RouterModule,
    ReactiveFormsModule,
    TimeFormatPipe,
    LoadingComponent,
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss',
})
export class ReservationFormComponent {
  user!: UserPlayer;
  fieldId!: number;
  team!: Team;
  formReservation!: FormGroup;
  confirmedReservation!: ConfirmedReservation | null;
  verifiedReservation = false;
  today: string = '';
  loading: boolean = false;
  loadingReservation: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private authService: AuthService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    today.setDate(today.getDate());

    this.today = today.toISOString().split('T')[0];

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (this.isUserPlayer(user) && user.team) {
          this.team = user.team;
        }
      }
    });

    this.formReservation = this.fb.group({
      reservationDate: [this.today, Validators.required],
      startTime: ['', Validators.required],
      hours: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
  }

  private isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }

  goBack(): void {
    this.location.back();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  verifyReservation() {
    if (this.formReservation.valid) {
      this.loading = true;

      const reservationData = {
        ...this.formReservation.value,
        teamId: this.team.id,
        fieldId: this.fieldId,
      };

      this.reservationService
        .getReservationAvailability(reservationData)
        .subscribe({
          next: (data: ConfirmedReservation) => {
            this.loading = false;
            this.confirmedReservation = data;
          },
          error: (err) => {
            this.loading = false;
            Swal.fire('Error', err.error.message, 'error');
          },
        });

      this.verifiedReservation = true;
    } else {
      this.formReservation.markAllAsTouched();
    }
  }

  cancelReservation() {
    this.verifiedReservation = false;
    this.confirmedReservation = null;
  }

  confirmReservation() {
    Swal.fire({
      title: '¿Estás seguro de crear la reserva?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && this.confirmedReservation) {
        this.loadingReservation = true;
        const reservationRequest = {
          teamId: this.confirmedReservation.team?.id,
          fieldId: this.confirmedReservation.field?.id,
          reservationDate: this.confirmedReservation.reservationDate,
          startTime: this.confirmedReservation.startTime,
          endTime: this.confirmedReservation.endTime,
          hours: this.confirmedReservation.hours,
        };
        this.reservationService
          .createReservation(reservationRequest)
          .subscribe({
            next: () => {
              this.loadingReservation = false;
              Swal.fire({
                title: 'Reserva creada',
                text: `Has creado una reserva para el día ${reservationRequest.reservationDate}.`,
                icon: 'success',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
              this.router.navigate(['/dashboard/reservation/list/team']);
            },
            error: (err) => {
              this.loadingReservation = false;
              Swal.fire('Error', err.error.message, 'error');
            },
          });
      }
    });
  }
}
