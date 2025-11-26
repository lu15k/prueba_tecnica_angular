export interface Contacto {
    id: number;
    identificacion: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    entidad_id: number;
    entidad?: any;
    updated_at?: Date;
    created_at?: Date;
}
