import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contacto } from '../interfaces/contacto';
import { StateContacto } from '../interfaces/state-contacto';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactosService {
    private http = inject(HttpClient);
    url: string = environment.apiUrl + "/";
    #state = signal<StateContacto>({
        loading: true,
        contactos: []
    });

    contactos = computed(() => this.#state().contactos);
    loading = computed(() => this.#state().loading);

    constructor() {
        this.refresh();
    }

    refresh(): void {
        this.#state.set({ loading: true, contactos: [] });
        this.http.get<Contacto[]>(`${this.url}contactos`).subscribe({
            next: (res) => {
                this.#state.set({
                    loading: false,
                    contactos: res,
                });
            },
            error: (error) => {
                console.error('Error al cargar contactos:', error);
                this.#state.update(state => ({ ...state, loading: false }));
            }
        });
    }

    create(contacto: Partial<Contacto>) {
        return this.http.post<Contacto>(`${this.url}contactos`, contacto);
    }

    update(id: number, contacto: Partial<Contacto>) {
        return this.http.put<Contacto>(`${this.url}contactos/${id}`, contacto);
    }

    delete(contacto: Contacto) {
        return this.http.delete<Contacto>(`${this.url}contactos/${contacto.id}`);
    }

    deleteMany(ids: number[]) {
        const requests = ids.map(id => this.http.delete(`${this.url}contactos/${id}`));
        return forkJoin(requests);
    }
}
