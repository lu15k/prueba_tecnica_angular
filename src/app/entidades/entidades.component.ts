import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-entidades',
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
    InputTextModule
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService]
})
export default class EntidadesComponent {
  public entidadesService = inject(EntidadesService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[] = [];

  entidadDialog: boolean = false;
  form: FormGroup;
  submitted: boolean = false;
  isEdit: boolean = false;
  currentEntidadId: number | null = null;

  constructor() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      nit: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openNew() {
    this.entidadDialog = true;
    this.submitted = false;
    this.isEdit = false;
    this.currentEntidadId = null;
    this.form.reset();
  }

  edit(entidad: Entidad) {
    this.entidadDialog = true;
    this.submitted = false;
    this.isEdit = true;
    this.currentEntidadId = entidad.id;
    this.form.patchValue(entidad);
  }

  hideDialog() {
    this.entidadDialog = false;
    this.submitted = false;
  }

  saveEntidad() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const entidadData = this.form.value;

    if (this.isEdit && this.currentEntidadId) {
      this.entidadesService.update(this.currentEntidadId, entidadData);
      this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Entidad Actualizada', life: 3000 });
    } else {
      this.entidadesService.create(entidadData);
      this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Entidad Creada', life: 3000 });
    }

    this.entidadDialog = false;
    this.form.reset();
  }

  deleteSelectedEntidades() {
    if (this.selectedEntidades.length > 0) {
      const ids = this.selectedEntidades.map(e => e.id);
      this.entidadesService.deleteMany(ids);
      this.selectedEntidades = [];
      this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Entidades Eliminadas', life: 3000 });
    }
  }
}
