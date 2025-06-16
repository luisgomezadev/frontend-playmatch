import { Location } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PlayerService } from '../../player/services/player.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../admin/services/admin.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  userForm!: FormGroup;
  loading: boolean = false;
  userId!: number;
  userType!: string;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private playerService: PlayerService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.userType = this.route.snapshot.paramMap.get('user')!;
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    if (this.userId) {
      if (this.userType == 'admin') this.loadInfoAdmin();
      else this.loadInfoPlayer();
    }
  }

  goBack(): void {
    this.location.back();
  }

  loadInfoPlayer() {
    this.loading = true;
    this.playerService.getPlayerById(this.userId).subscribe({
      next: (player) => {
        this.userForm.patchValue(player);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar la info', 'error');
        this.router.navigate(['/dashboard/profile']);
      },
    });
  }

  loadInfoAdmin() {
    this.loading = true;
    this.adminService.getAdminById(this.userId).subscribe({
      next: (admin) => {
        this.userForm.patchValue(admin);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar la info', 'error');
        this.router.navigate(['/dashboard/profile']);
      },
    });
  }
}
