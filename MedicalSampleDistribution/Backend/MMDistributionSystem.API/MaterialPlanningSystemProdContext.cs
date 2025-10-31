using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MMDistributionSystem.API;

public partial class MaterialPlanningSystemProdContext : DbContext
{
    public MaterialPlanningSystemProdContext()
    {
    }

    public MaterialPlanningSystemProdContext(DbContextOptions<MaterialPlanningSystemProdContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Abmstock> Abmstocks { get; set; }

    public virtual DbSet<AuditMarcaMolecula> AuditMarcaMoleculas { get; set; }

    public virtual DbSet<AuditMarcaMolecula20250528> AuditMarcaMolecula20250528s { get; set; }

    public virtual DbSet<Distribution> Distributions { get; set; }

    public virtual DbSet<DistributionOld> DistributionOlds { get; set; }

    public virtual DbSet<Import> Imports { get; set; }

    public virtual DbSet<ImportedCustomersByCriterion> ImportedCustomersByCriteria { get; set; }

    public virtual DbSet<Material> Materials { get; set; }

    public virtual DbSet<MaterialMasterTableFromSap> MaterialMasterTableFromSaps { get; set; }

    public virtual DbSet<MaterialMasterTableFromSap20250703> MaterialMasterTableFromSap20250703s { get; set; }

    public virtual DbSet<MigrationAssignment> MigrationAssignments { get; set; }

    public virtual DbSet<MigrationAssignmentSapDescription> MigrationAssignmentSapDescriptions { get; set; }

    public virtual DbSet<MigrationConfiguration> MigrationConfigurations { get; set; }

    public virtual DbSet<MigrationDirect> MigrationDirects { get; set; }

    public virtual DbSet<MigrationExistencia20250812> MigrationExistencia20250812s { get; set; }

    public virtual DbSet<MigrationExistencium> MigrationExistencia { get; set; }

    public virtual DbSet<MigrationMaterial> MigrationMaterials { get; set; }

    public virtual DbSet<Mmaestro> Mmaestros { get; set; }

    public virtual DbSet<Relation> Relations { get; set; }

    public virtual DbSet<RelationOld> RelationOlds { get; set; }

    public virtual DbSet<StockDelivery> StockDeliveries { get; set; }

    public virtual DbSet<StockReal> StockReals { get; set; }

    public virtual DbSet<TmpAuditMarc> TmpAuditMarcs { get; set; }

    public virtual DbSet<ToSendMock> ToSendMocks { get; set; }

    public virtual DbSet<UserType> UserTypes { get; set; }

    public virtual DbSet<VCategory> VCategories { get; set; }

    public virtual DbSet<VCustomerType> VCustomerTypes { get; set; }

    public virtual DbSet<VHierarchyView> VHierarchyViews { get; set; }

    public virtual DbSet<VInstitutionType> VInstitutionTypes { get; set; }

    public virtual DbSet<VLine> VLines { get; set; }

    public virtual DbSet<VMaterialesStock> VMaterialesStocks { get; set; }

    public virtual DbSet<VMercadoDeAuditorium> VMercadoDeAuditoria { get; set; }

    public virtual DbSet<VMigrationConfiguration> VMigrationConfigurations { get; set; }

    public virtual DbSet<VMigrationDirect> VMigrationDirects { get; set; }

    public virtual DbSet<VMoleculaDeAuditorium> VMoleculaDeAuditoria { get; set; }

    public virtual DbSet<VProductoDeAuditorium> VProductoDeAuditoria { get; set; }

    public virtual DbSet<VRepresentative> VRepresentatives { get; set; }

    public virtual DbSet<VSpecialty> VSpecialties { get; set; }

    public virtual DbSet<VState> VStates { get; set; }

    public virtual DbSet<VSupervisor> VSupervisors { get; set; }

    public virtual DbSet<WebUser> WebUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Abmstock>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ABMstock__3214EC2716793C64");

            entity.ToTable("ABMstock");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CodigoSap)
                .HasMaxLength(255)
                .HasColumnName("CodigoSAP");
            entity.Property(e => e.DescriptionMaterial).HasMaxLength(255);
            entity.Property(e => e.MaxStockaDistribuir)
                .HasMaxLength(255)
                .HasColumnName("MaxStocka Distribuir");
            entity.Property(e => e.MinStockADistribuir)
                .HasMaxLength(255)
                .HasColumnName("MInStock a distribuir");
        });

        modelBuilder.Entity<AuditMarcaMolecula>(entity =>
        {
            entity.HasKey(e => new { e.Marca, e.Molecula });

            entity.ToTable("auditMarcaMolecula");

            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("marca");
            entity.Property(e => e.Molecula)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("molecula");
        });

        modelBuilder.Entity<AuditMarcaMolecula20250528>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("_auditMarcaMolecula_20250528");

            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("marca");
            entity.Property(e => e.Molecula)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("molecula");
        });

        modelBuilder.Entity<Distribution>(entity =>
        {
            entity.ToTable("Distribution");

            entity.Property(e => e.LegajoSap)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.MaterialId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany(p => p.Distributions)
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Distribution_Import");
        });

        modelBuilder.Entity<DistributionOld>(entity =>
        {
            entity.ToTable("Distribution_OLD");

            entity.Property(e => e.LegajoSap)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany(p => p.DistributionOlds)
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Distribution_Import_OLD");
        });

        modelBuilder.Entity<Import>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Import__3214EC074200FBC9");

            entity.ToTable("Import");

            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaModificacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FileBase).IsUnicode(false);
            entity.Property(e => e.FileNameAsignacion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FileNameExistencia)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ImportDate).HasColumnType("datetime");
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.UsuarioAlta).HasDefaultValue("test");
            entity.Property(e => e.UsuarioModificacion).HasDefaultValue("test");

            entity.HasOne(d => d.User).WithMany(p => p.Imports)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Import_WebUser");
        });

        modelBuilder.Entity<ImportedCustomersByCriterion>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("importedCustomersByCriteria");

            entity.Property(e => e.CustomerCode).HasColumnName("customerCode");
            entity.Property(e => e.FirstName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Material__3214EC079439C0CE");

            entity.ToTable("Material");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MaterialMasterTableFromSap>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("MaterialMasterTableFromSAP");

            entity.Property(e => e.Descripcion).HasColumnName("DESCRIPCION");
            entity.Property(e => e.Index).HasColumnName("INDEX");
            entity.Property(e => e.Labst).HasColumnName("LABST");
            entity.Property(e => e.Lgort).HasColumnName("LGORT");
            entity.Property(e => e.Matnr).HasColumnName("MATNR");
            entity.Property(e => e.Meins).HasColumnName("MEINS");
            entity.Property(e => e.Umrez).HasColumnName("UMREZ");
            entity.Property(e => e.Werks).HasColumnName("WERKS");
        });

        modelBuilder.Entity<MaterialMasterTableFromSap20250703>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("MaterialMasterTableFromSAP_20250703");

            entity.Property(e => e.Descripcion).HasColumnName("DESCRIPCION");
            entity.Property(e => e.Index).HasColumnName("INDEX");
            entity.Property(e => e.Labst).HasColumnName("LABST");
            entity.Property(e => e.Lgort).HasColumnName("LGORT");
            entity.Property(e => e.Matnr).HasColumnName("MATNR");
            entity.Property(e => e.Meins).HasColumnName("MEINS");
            entity.Property(e => e.Umrez).HasColumnName("UMREZ");
            entity.Property(e => e.Werks).HasColumnName("WERKS");
        });

        modelBuilder.Entity<MigrationAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Migratio__3214EC071C145641");

            entity.ToTable("MigrationAssignment");

            entity.HasIndex(e => new { e.ImportId, e.Direct, e.Value }, "IX_MigrationAssignment_importId_Direct_Value");

            entity.HasIndex(e => new { e.ImportId, e.Direct, e.RowId, e.Value }, "MigrationAssignment_ImportId_Direct_RowId_Value");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany(p => p.MigrationAssignments)
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MigrationAssignment_Import");
        });

        modelBuilder.Entity<MigrationAssignmentSapDescription>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("MigrationAssignmentSapDescription");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.DescriptionSap).HasMaxLength(255);
        });

        modelBuilder.Entity<MigrationConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Migratio__3214EC07AC7E68F6");

            entity.ToTable("MigrationConfiguration");

            entity.Property(e => e.AuditCategoria)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditMercado)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditMolecula)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditProducto)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Campania)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.Categoria)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CountPreview).HasColumnName("countPreview");
            entity.Property(e => e.Edad)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Especialidad)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EspecialidadCartera)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EspecialidadSec)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaModificacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Institucion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Linea)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LugarVisita)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ObjetosEntregados)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Planificacion)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Provincia)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Sexo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Tarea)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TipoCliente)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Tratamiento)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UsuarioAlta).HasDefaultValue("test");
            entity.Property(e => e.UsuarioModificacion).HasDefaultValue("test");

            entity.HasOne(d => d.Import).WithMany(p => p.MigrationConfigurations)
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MigrationConfiguration_Import");
        });

        modelBuilder.Entity<MigrationDirect>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Migratio__3214EC07E7B19225");

            entity.ToTable("MigrationDirect");

            entity.Property(e => e.Excluded)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaModificacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.LegajoRepresentante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LegajoSupervisor)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Representante).IsUnicode(false);
            entity.Property(e => e.Supervisor).IsUnicode(false);
            entity.Property(e => e.UsuarioAlta).HasDefaultValue("test");
            entity.Property(e => e.UsuarioModificacion).HasDefaultValue("test");

            entity.HasOne(d => d.Import).WithMany(p => p.MigrationDirects)
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MigrationDirect_Import");
        });

        modelBuilder.Entity<MigrationExistencia20250812>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("MigrationExistencia_20250812");

            entity.Property(e => e.CodigoSap).IsUnicode(false);
            entity.Property(e => e.CodigoSapLegacy).IsUnicode(false);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.MaterialDescription).IsUnicode(false);
        });

        modelBuilder.Entity<MigrationExistencium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Migratio__3214EC07C8D210FF");

            entity.HasIndex(e => e.ImportId, "IX_MigrationExistencia_ImportId");

            entity.HasIndex(e => new { e.ImportId, e.CodigoSap }, "IX_MigrationExistencia_ImportId_CodigoSap");

            entity.HasIndex(e => e.ImportId, "IX_MigrationExistencia_ImportId_CodigoSap_Stock");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CodigoSapLegacy).IsUnicode(false);
            entity.Property(e => e.MaterialDescription).IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany(p => p.MigrationExistencia)
                .HasForeignKey(d => d.ImportId)
                .HasConstraintName("FK_MigrationExistencia_Import");
        });

        modelBuilder.Entity<MigrationMaterial>(entity =>
        {
            entity.ToTable("MigrationMaterial");

            entity.HasIndex(e => new { e.ImportId, e.Pack, e.CodigoSap }, "IX_MigrationMaterial_ImportId_Pack_CodigoSap");

            entity.HasIndex(e => new { e.ImportId, e.Pack, e.CodigoSap }, "IX_V_MaterialesStock_ImportId_Pack_CodigoSap");

            entity.HasIndex(e => e.ImportId, "MigrationMaterial_ImporId");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).IsUnicode(false);
        });

        modelBuilder.Entity<Mmaestro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MMaestro__3214EC07388C80FD");

            entity.ToTable("MMaestro");

            entity.Property(e => e.CodigoSap).HasColumnName("CodigoSAP");
            entity.Property(e => e.DescriptionMaterial).HasMaxLength(255);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaModificacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IncluirColumna).HasMaxLength(3);
            entity.Property(e => e.MaxStockAdistribuir).HasColumnName("MaxStockADistribuir");
            entity.Property(e => e.MinStockAdistribuir).HasColumnName("MinStockADistribuir");
            entity.Property(e => e.UsuarioAlta).HasDefaultValue("usuario predeterminado");
            entity.Property(e => e.UsuarioModificacion).HasDefaultValue("usuario predeterminado");
        });

        modelBuilder.Entity<Relation>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Relation");

            entity.HasIndex(e => e.ImportId, "Relation_importId");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.MaterialId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany()
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Relation_Import");
        });

        modelBuilder.Entity<RelationOld>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Relation_OLD");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<StockDelivery>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("StockDelivery");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.MaterialId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany()
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StockDelivery_Import");
        });

        modelBuilder.Entity<StockReal>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("StockReal");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.MaterialId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Import).WithMany()
                .HasForeignKey(d => d.ImportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StockReal_Import");
        });

        modelBuilder.Entity<TmpAuditMarc>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tmpAuditMarc");

            entity.HasIndex(e => e.CustomerCode, "IXTMP");

            entity.Property(e => e.CustomerCode).HasColumnName("customerCode");
            entity.Property(e => e.ImportId).HasColumnName("importId");
            entity.Property(e => e.MercCategoria)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("merc_categoria");
            entity.Property(e => e.MercDescripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("merc_descripcion");
            entity.Property(e => e.Molecula)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("molecula");
            entity.Property(e => e.ProdDescripcion)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("prod_Descripcion");
        });

        modelBuilder.Entity<ToSendMock>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ToSendMo__3214EC27B4CFB87D");

            entity.ToTable("ToSendMock", tb => tb.HasTrigger("tr_UpdateStock"));

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CodigoSap).HasColumnName("CodigoSAP");
            entity.Property(e => e.DescriptionMaterial).HasMaxLength(255);

            entity.HasOne(d => d.Import).WithMany(p => p.ToSendMocks)
                .HasForeignKey(d => d.ImportId)
                .HasConstraintName("FK_ToSendMock_Import");
        });

        modelBuilder.Entity<UserType>(entity =>
        {
            entity.ToTable("UserType");

            entity.Property(e => e.Description)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VCategory>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_Category");

            entity.Property(e => e.Code)
                .ValueGeneratedOnAdd()
                .HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VCustomerType>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_CustomerType");

            entity.Property(e => e.Code)
                .ValueGeneratedOnAdd()
                .HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VHierarchyView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_hierarchyView");

            entity.Property(e => e.BusinessLineCode).HasColumnName("businessLineCode");
            entity.Property(e => e.BusinessLineDescription)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("businessLineDescription");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.CountryCode).HasColumnName("countryCode");
            entity.Property(e => e.Description)
                .HasMaxLength(102)
                .IsUnicode(false);
            entity.Property(e => e.DistrictCode).HasColumnName("districtCode");
            entity.Property(e => e.DistrictDescription)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("districtDescription");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lastName");
            entity.Property(e => e.LegacyCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("legacyCode");
            entity.Property(e => e.LineCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lineCode");
            entity.Property(e => e.ManagerCode).HasColumnName("managerCode");
            entity.Property(e => e.ManagerDescription)
                .HasMaxLength(102)
                .IsUnicode(false)
                .HasColumnName("managerDescription");
            entity.Property(e => e.MaxStamp)
                .IsRowVersion()
                .IsConcurrencyToken()
                .HasColumnName("maxStamp");
            entity.Property(e => e.RegionCode).HasColumnName("regionCode");
            entity.Property(e => e.RegionDescription)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("regionDescription");
            entity.Property(e => e.RegionManagerCode).HasColumnName("regionManagerCode");
            entity.Property(e => e.RegionsCode).IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.TimeZone)
                .HasColumnType("numeric(4, 2)")
                .HasColumnName("timeZone");
            entity.Property(e => e.TimelineCode).HasColumnName("timelineCode");
        });

        modelBuilder.Entity<VInstitutionType>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_InstitutionType");

            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VLine>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_Line");

            entity.Property(e => e.Code)
                .ValueGeneratedOnAdd()
                .HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VMaterialesStock>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_MaterialesStock");

            entity.Property(e => e.CodigoSap)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .IsUnicode(false)
                .HasColumnName("description");
        });

        modelBuilder.Entity<VMercadoDeAuditorium>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_MercadoDeAuditoria");

            entity.Property(e => e.Codigo)
                .ValueGeneratedOnAdd()
                .HasColumnName("codigo");
            entity.Property(e => e.CodigoCup).HasColumnName("codigoCup");
            entity.Property(e => e.DisplayMember)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VMigrationConfiguration>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_MigrationConfiguration");

            entity.Property(e => e.AuditCategoria)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditMercado)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditMolecula)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AuditProducto)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Campania)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.Categoria)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CountPreview).HasColumnName("countPreview");
            entity.Property(e => e.Edad)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Especialidad)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EspecialidadCartera)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EspecialidadSec)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Institucion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Linea)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LugarVisita)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ObjetosEntregados)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Planificacion)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Provincia)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Sexo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Tarea)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TipoCliente)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Tratamiento)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VMigrationDirect>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_MigrationDirect");

            entity.Property(e => e.Excluded)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.LegajoRepresentante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LegajoSupervisor)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Representante).IsUnicode(false);
            entity.Property(e => e.Supervisor).IsUnicode(false);
        });

        modelBuilder.Entity<VMoleculaDeAuditorium>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_MoleculaDeAuditoria");

            entity.Property(e => e.DisplayMember)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Marca)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("marca");
            entity.Property(e => e.Molecula)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("molecula");
        });

        modelBuilder.Entity<VProductoDeAuditorium>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_ProductoDeAuditoria");

            entity.Property(e => e.Codigo)
                .ValueGeneratedOnAdd()
                .HasColumnName("codigo");
            entity.Property(e => e.DisplayMember)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VRepresentative>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_Representative");

            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.DisplayMember)
                .HasMaxLength(102)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VSpecialty>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_Specialty");

            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VState>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_State");

            entity.Property(e => e.Code)
                .ValueGeneratedOnAdd()
                .HasColumnName("code");
            entity.Property(e => e.FullDesc)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS");
        });

        modelBuilder.Entity<VSupervisor>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("V_Supervisor");

            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.DisplayMember)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WebUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__WebUser__3214EC07E8E81EDC");

            entity.ToTable("WebUser");

            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(800)
                .HasDefaultValueSql("(pwdencrypt('12345'))");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("A")
                .IsFixedLength();
            entity.Property(e => e.UserName)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.UserType).WithMany(p => p.WebUsers)
                .HasForeignKey(d => d.UserTypeId)
                .HasConstraintName("FK_WebUser_UserType");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
