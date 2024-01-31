import { Injectable, inject} from '@angular/core';
import { ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';


import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class ValidatorsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;


  // Método para validar si un campo de un formulario tiene errores
  public isValidField( form: FormGroup, field: string ): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  // Método para validar que un campo es igual al otro. Debe ser llamado en el segundo objeto de un formGroup, dentro de validators: []
  public isFieldOneEqualFieldTwo( field1: string, field2: string) {
    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if( fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true })
        return { noEqual: true }
      }

      formGroup.get(field2)?.setErrors(null);
      return null;

    }
  }

}
