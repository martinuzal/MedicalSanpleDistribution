# 📚 Referencia de Catálogos y Vistas - MM Distribution System

## 🔍 Vistas de Solo Lectura

Esta es la referencia de las vistas (tablas de catálogo) disponibles en la base de datos **MaterialPlanningSystem**.

---

## 📋 **Catálogos de Clientes/Médicos**

### **V_Category**
**Descripción**: Categoría de médicos/clientes
- Categorización de los profesionales de la salud
- Usado en: MigrationConfiguration.Categoria

### **V_CustomerType**
**Descripción**: Tipo de clientes
- Clasificación de tipos de cliente (médicos, instituciones, etc.)
- Usado en: MigrationConfiguration.TipoCliente

### **V_Specialty**
**Descripción**: Especialidades Médicas
- Lista de especialidades médicas (cardiología, pediatría, etc.)
- Usado en: MigrationConfiguration.Especialidad, EspecialidadSec, EspecialidadCartera

---

## 🏥 **Catálogos Institucionales**

### **V_InstitutionType**
**Descripción**: Tipo de institución
- Clasificación de instituciones (hospital, clínica, consultorio, etc.)
- Usado en: MigrationConfiguration.Institucion

### **V_State**
**Descripción**: Provincias
- Lista de provincias/estados
- Usado en: MigrationConfiguration.Provincia

---

## 💼 **Catálogos de Negocio**

### **V_Line**
**Descripción**: Línea de Negocios
- Líneas de productos/negocios de la empresa
- Usado en: MigrationConfiguration.Linea

### **V_Representative**
**Descripción**: Representantes/Visitadores Médicos
- Lista de representantes de ventas
- Usado en: Distribution, Relation, StockReal, StockDelivery

### **V_Supervisor**
**Descripción**: Supervisores
- Lista de supervisores de los representantes
- Usado en: Distribution, Relation, StockReal, StockDelivery

---

## 📦 **Catálogos de Productos**

### **V_MaterialesStock**
**Descripción**: Stock Actual de productos
- Vista consolidada del stock disponible por material
- Información en tiempo real del inventario
- Crítico para: MigrationExistencia, MigrationMaterial

---

## 📊 **Catálogos de Auditoría de Prescripciones**

Estos catálogos se usan para segmentar la distribución basándose en datos de auditoría de prescripciones médicas.

### **V_MercadoDeAuditoria**
**Descripción**: Mercados de auditoría de prescripciones
- Segmentación por mercado farmacéutico
- Usado en: MigrationConfiguration.AuditMercado

### **V_MoleculaDeAuditoria**
**Descripción**: Moléculas/Drogas de la auditoría de prescripciones
- Principios activos/moléculas farmacéuticas
- Usado en: MigrationConfiguration.AuditMolecula

### **V_ProductoDeAuditoria**
**Descripción**: Productos de la auditoría de prescripciones
- Productos comerciales específicos
- Usado en: MigrationConfiguration.AuditProducto

---

## 🔗 **Relaciones con Entidades Principales**

### **MigrationConfiguration - Criterios de Segmentación**

Los criterios de distribución se definen usando combinaciones de estos catálogos:

```
MigrationConfiguration {
    // Catálogos de Clientes
    TipoCliente      → V_CustomerType
    Categoria        → V_Category
    Especialidad     → V_Specialty
    EspecialidadSec  → V_Specialty
    EspecialidadCartera → V_Specialty

    // Catálogos Institucionales
    Institucion      → V_InstitutionType
    Provincia        → V_State

    // Catálogos de Negocio
    Linea            → V_Line

    // Catálogos de Auditoría
    AuditCategoria   → V_Category
    AuditMercado     → V_MercadoDeAuditoria
    AuditProducto    → V_ProductoDeAuditoria
    AuditMolecula    → V_MoleculaDeAuditoria

    // Otros campos de segmentación
    Campania         → String
    LugarVisita      → String
    Edad             → String
    Sexo             → String
    Tarea            → String
    Frecuencia       → Int
    Planificacion    → String
    Tratamiento      → String
    ObjetosEntregados → String
    PorcenDeAplic    → Int (%)
}
```

---

## 📝 **Notas de Implementación**

### **Para Módulos Futuros:**

1. **Módulo 4: Configuración de Criterios**
   - Necesitará dropdowns/selectores para todos estos catálogos
   - Permitir selección múltiple en algunos casos
   - Validar combinaciones válidas

2. **Módulo 5: Asignaciones Directas**
   - Usar V_Representative para seleccionar representantes
   - Usar V_Supervisor para supervisores

3. **Módulo 3: Gestión de Stock**
   - Usar V_MaterialesStock para mostrar stock disponible
   - Comparar con MigrationExistencia

4. **Módulo 9: Dashboard de Cobertura**
   - Usar estos catálogos para filtros y agrupaciones
   - Análisis por línea, provincia, especialidad, etc.

### **Convenciones:**

- Todas son **vistas de solo lectura** (no se pueden modificar)
- Usar estas vistas para poblar dropdowns en formularios
- Cachear en frontend para mejorar performance
- Actualizar periódicamente (pueden cambiar en la BD)

---

## 🎯 **Próximos Controladores a Crear**

Para soportar los módulos futuros, necesitaremos crear estos controladores:

### **CatalogsController** (Alta Prioridad)
```
GET /api/catalogs/categories        → V_Category
GET /api/catalogs/customer-types    → V_CustomerType
GET /api/catalogs/specialties       → V_Specialty
GET /api/catalogs/institution-types → V_InstitutionType
GET /api/catalogs/states            → V_State
GET /api/catalogs/lines             → V_Line
GET /api/catalogs/representatives   → V_Representative
GET /api/catalogs/supervisors       → V_Supervisor
GET /api/catalogs/audit-markets     → V_MercadoDeAuditoria
GET /api/catalogs/audit-molecules   → V_MoleculaDeAuditoria
GET /api/catalogs/audit-products    → V_ProductoDeAuditoria
```

### **MaterialsController** (Módulo 2)
```
GET /api/materials                  → Material + V_MaterialesStock
GET /api/materials/{codigoSap}     → Material detalle
GET /api/materials/stock           → V_MaterialesStock
```

### **StockController** (Módulo 3)
```
GET /api/stock/{importId}          → MigrationExistencia
PUT /api/stock/{importId}          → Actualizar stock manual
POST /api/stock/{importId}/import  → Importar desde archivo
```

---

## ✅ **Beneficios de Esta Arquitectura**

1. **Separación de Concerns**: Catálogos centralizados
2. **Performance**: Vistas optimizadas por el DBA
3. **Consistencia**: Mismos datos en toda la aplicación
4. **Mantenibilidad**: Un solo lugar para actualizar catálogos
5. **Seguridad**: Solo lectura, no se pueden corromper datos

---

**Última actualización**: 2025-10-29
**Versión BD**: MaterialPlanningSystem @ Solsrv20.solutica,1683
