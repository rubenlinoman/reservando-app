import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { DashboardService } from '../../services/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent { }
