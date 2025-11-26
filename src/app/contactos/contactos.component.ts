import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ContactosService } from './services/contactos.service';
import { Contacto } from './interfaces/contacto';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EntidadesService } from '../entidades/services/entidades.service';

@Component({
    selector: 'app-contactos',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule
    ],
    templateUrl: './contactos.component.html',
    styleUrl: './contactos.component.css',
    providers: [MessageService]
})
export default class ContactosComponent implements OnInit {
    public contactosService = inject(ContactosService);
    public entidadesService = inject(EntidadesService);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    total = computed(() => this.contactosService.contactos().length);
    selectedContactos: Contacto[] = [];

    contactoDialog: boolean = false;
    form: FormGroup;
    submitted: boolean = false;
    isEdit: boolean = false;
    currentContactoId: number | null = null;

    constructor() {
        this.form = this.fb.group({
            identificacion: ['', [Validators.required, Validators.minLength(5)]],
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            apellido: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            entidad_id: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.entidadesService.entidades().length === 0) {
            this.entidadesService.refresh();
        }
    }

    openNew() {
        this.contactoDialog = true;
        this.submitted = false;
        this.isEdit = false;
        this.currentContactoId = null;
        this.form.reset();
    }

    edit(contacto: Contacto) {
        this.contactoDialog = true;
        this.submitted = false;
        this.isEdit = true;
        this.currentContactoId = contacto.id;
        this.form.patchValue(contacto);
    }

    hideDialog() {
        this.contactoDialog = false;
        this.submitted = false;
    }

    saveContacto() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const contactoData = this.form.value;

        const request = (this.isEdit && this.currentContactoId)
            ? this.contactosService.update(this.currentContactoId, contactoData)
            : this.contactosService.create(contactoData);

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: this.isEdit ? 'Contacto Actualizado' : 'Contacto Creado', life: 3000 });
                this.contactosService.refresh();
                this.contactoDialog = false;
                this.form.reset();
            },
            error: (error) => {
                console.error('Error:', error);
                let errorMessage = 'Ocurrió un error al guardar el contacto';

                if (error.status === 422 && error.error && error.error.errors) {

                    const validationErrors = Object.values(error.error.errors).flat().join(', ');
                    errorMessage = `Error de validación: ${validationErrors}`;
                }

                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
            }
        });
    }

    delete(contacto: Contacto) {
        this.contactosService.delete(contacto).subscribe({
            next: () => {
                this.contactosService.refresh();
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Contacto Eliminado', life: 3000 });
            },
            error: (error) => {
                console.error('Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar contacto', life: 3000 });
            }
        });
    }

    deleteSelectedContactos() {
        if (this.selectedContactos.length > 0) {
            const ids = this.selectedContactos.map(c => c.id);
            this.contactosService.deleteMany(ids).subscribe({
                next: () => {
                    this.contactosService.refresh();
                    this.selectedContactos = [];
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Contactos Eliminados', life: 3000 });
                },
                error: (error) => {
                    console.error('Error:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar contactos', life: 3000 });
                }
            });
        }
    }
}
