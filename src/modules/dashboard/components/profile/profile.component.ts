import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ValidatorsService } from 'src/modules/shared/services/validators.service';
import { DashboardService } from '../../services/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'dashboard-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  public apiUrl = environment.apiUrl;

  public user = computed(() => this.authService.currentUser());
  public subirFoto = true;
  public imagenPerfil: string | undefined;
  public selectedFile: File | null = null;

  public profileForm: FormGroup;

  constructor() {
    this.imagenPerfil = this.user()?.imagen;
    this.profileForm = this.fb.group({
      nombre: [this.user()?.nombre],
      apellidos: [this.user()?.apellidos],
      email: [{ value: this.user()?.email, disabled: true }],
      imagen: [this.user()?.imagen],
      imagenSubida:[],
    });
  }

  /**
   * Método para comprobar si el campo es valido
   * @param field - Campo del formulario
   * @returns Devuelve el estado del campo
   */
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.profileForm, field);
  }

  // Método para actualizar el perfil del usuario
  //Función para acualizar los datos del perfil
  updateProfileInfo($event: any) {
    let valor = null;
    let campo = null;

    // Se trata de un input, un textarea o una fecha
    if ($event.constructor.name === 'FocusEvent') {
      valor = $event.target.value;
      campo = $event.target.attributes.formcontrolname.nodeValue;
    }

    const actualizar = { [campo]: valor };

    this.dashboardService.updateProfileInfo(actualizar, this.user().idUsuario).subscribe((resp) => {
      if (resp != 1) {
        Swal.fire('Error', 'No se ha podido actualizar el dato', 'error');
      }
    });
  }

  // FUNCIONES PARA LA FOTO DE PERFIL
  /**
   * Método para borrar la imagen de perfil
   */
  deleteImage() {
    if (this.profileForm.controls['imagen'].value != '') {
      this.profileForm.controls['imagen'].setValue('');
      this.imagenPerfil = '';
      this.updateBaseImage('');
    }
  }

  /**
   * Método para cargar la imagen
   * @param event - Evento
   */
  chargeImage($event: any) {
    this.selectedFile = <File>$event;
    this.dashboardService.chargeImage(this.selectedFile).subscribe((resp) => {
      this.updateBaseImage(resp.filename);
    });
  }

  /**
   * Método para actualizar la imagen en la base de datos
   * @param imageName - Nombre de la imagen
   */
  //Función para actualizar la imagen en la base de datos
  updateBaseImage(imageName: string) {

    const actualizar = { imagen: [imageName] };

    this.dashboardService.updateProfileInfo(actualizar, this.user().idUsuario).subscribe((resp) => {

      if (resp != 1) {
        Swal.fire('Error', 'No se ha podido actualizar el dato', 'error');
      }
      if (resp == 1) {
        this.profileForm.controls['imagen'].setValue(imageName);
        this.user()!.imagen = this.imagenPerfil = imageName;
        this.subirFoto = true;
      }
    });
  }
  // FIN FUNCIONES PARA LA FOTO DE PERFIL
}
