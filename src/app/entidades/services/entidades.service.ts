import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';
import { delay, forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)
  url: string = environment.apiUrl + "/"
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);
  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.set({ loading: true, entidades: [] }) // Actualiza el estado a "cargando" y vacia las entidades
    this.http.get<Entidad[]>(`${this.url}entidades`).subscribe({
      next: (res) => {
        this.#state.set({
          loading: false,
          entidades: res,
        });
      },
      error: (error) => {
        console.error('Error al cargar entidades:', error);
      }
    });

  }


  create(entidad: Partial<Entidad>) {
    return this.http.post<Entidad>(`${this.url}entidades`, entidad).subscribe({
      next: () => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al crear entidad:', error);
      }
    });
  }

  update(id: number, entidad: Partial<Entidad>) {
    return this.http.put<Entidad>(`${this.url}entidades/${id}`, entidad).subscribe({
      next: () => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al actualizar entidad:', error);
      }
    });
  }

  deleteMany(ids: number[]) {
    const requests = ids.map(id => this.http.delete(`${this.url}entidades/${id}`));
    forkJoin(requests).subscribe({
      next: () => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar entidades:', error);
      }
    });
  }

  delete(entidad: Entidad): void {
    this.http.delete<Entidad>(`${this.url}entidades/${entidad.id}`).subscribe({
      next: (res) => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar la entidad:', error);
      }
    });
  }
}
