export interface Import {
  id: number;
  userId: number;
  userName?: string;
  importDate: string;
  state?: string;
  fileNameExistencia?: string;
  fileNameAsignacion?: string;
  fileBase?: string;
  fechaAlta: string;
  usuarioAlta: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

export interface CreateImportDto {
  userId: number;
  importDate: string;
  state?: string;
  fileNameExistencia?: string;
  fileNameAsignacion?: string;
  fileBase?: string;
  usuarioAlta: string;
}

export interface UpdateImportDto {
  state?: string;
  fileNameExistencia?: string;
  fileNameAsignacion?: string;
  fileBase?: string;
  usuarioModificacion: string;
}

export interface ImportListResponse {
  imports: Import[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
