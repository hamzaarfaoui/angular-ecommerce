import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {

  /**
   * Injecte les erreurs renvoyées par Django REST Framework directement dans les contrôles d'un FormGroup.
   * Renseigne également un tableau d'erreurs globales (pour les clés comme 'non_field_errors' ou 'detail').
   */
  handleDjangoErrors(form: FormGroup, errorResponse: HttpErrorResponse): string[] {
    const globalErrors: string[] = [];

    if (!errorResponse || !errorResponse.error) {
      globalErrors.push('Une erreur réseau ou serveur est survenue.');
      return globalErrors;
    }

    const errors = errorResponse.error;

    // Si la réponse est une simple chaîne
    if (typeof errors === 'string') {
      globalErrors.push(errors);
      return globalErrors;
    }

    // Parcours des clés d'erreurs renvoyées par Django (ex: email, first_name, non_field_errors)
    Object.keys(errors).forEach(field => {
      const fieldErrors = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
      const control = form.get(field);

      if (control) {
        // Associe l'erreur au champ Angular spécifique
        control.setErrors({
          serverError: fieldErrors.join(' ')
        });
        control.markAsTouched();
      } else {
        // Erreurs non associées à un champ du formulaire (ex: non_field_errors ou detail)
        globalErrors.push(...fieldErrors);
      }
    });

    return globalErrors;
  }
}