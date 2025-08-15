using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityUserContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }
        public DbSet<DaiHocEnrollment> DaiHocEnrollments { get; set; }
        public DbSet<LienThongEnrollment> LienThongEnrollments { get; set; }
        public DbSet<VanBang2Enrollment> VanBang2Enrollments { get; set; }
        public DbSet<SauDaiHocEnrollment> SauDaiHocEnrollments { get; set; }
        public DbSet<Summarization> Summarization { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.StudentInfor);
            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.HighSchoolInfor);
            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.ContactInfor);
            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.EnglishCertificate);
            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.FranceCertificate);
            builder.Entity<DaiHocEnrollment>().OwnsOne(d => d.JapanCertificate);
            builder.Entity<DaiHocEnrollment>().Property(d => d.AspirationSubject1Score).HasPrecision(4, 2);
            builder.Entity<DaiHocEnrollment>().Property(d => d.AspirationSubject2Score).HasPrecision(4, 2);
            builder.Entity<DaiHocEnrollment>().Property(d => d.AspirationSubject3Score).HasPrecision(4, 2);

            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.StudentInfor);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.HighSchoolInfor);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.ContactInfor);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.EnglishCertificate);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.FranceCertificate);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.JapanCertificate);
            builder.Entity<LienThongEnrollment>().OwnsOne(l => l.UniversityInfor)
                                                 .Property(u => u.UniversityGpa)
                                                 .HasPrecision(4, 2);

            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.StudentInfor);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.HighSchoolInfor);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.ContactInfor);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.EnglishCertificate);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.FranceCertificate);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.JapanCertificate);
            builder.Entity<VanBang2Enrollment>().OwnsOne(v => v.UniversityInfor)
                                                .Property(u => u.UniversityGpa)
                                                .HasPrecision(4, 2);

            builder.Entity<SauDaiHocEnrollment>().OwnsOne(e => e.StudentInfor);
            builder.Entity<SauDaiHocEnrollment>().OwnsOne(e => e.ContactInfor);
            builder.Entity<SauDaiHocEnrollment>().OwnsOne(e => e.HighStudyInfor);
            builder.Entity<SauDaiHocEnrollment>().OwnsOne(e => e.EnglishCertificate);
            builder.Entity<SauDaiHocEnrollment>().OwnsOne(e => e.UniversityInfor)
                                                 .Property(u => u.UniversityGpa)
                                                 .HasPrecision(4, 2);

            builder.Entity<DaiHocEnrollment>(entity =>
            {
                entity.OwnsOne(d => d.StudentInfor);
                entity.OwnsOne(d => d.HighSchoolInfor);
                entity.OwnsOne(d => d.ContactInfor);
                entity.OwnsOne(d => d.EnglishCertificate);
                entity.OwnsOne(d => d.FranceCertificate);
                entity.OwnsOne(d => d.JapanCertificate);
                entity.HasIndex(d => d.EnrollmentCode).IsUnique();
            });

            builder.Entity<LienThongEnrollment>(entity =>
            {
                entity.OwnsOne(l => l.StudentInfor);
                entity.OwnsOne(l => l.HighSchoolInfor);
                entity.OwnsOne(l => l.UniversityInfor);
                entity.OwnsOne(l => l.ContactInfor);
                entity.OwnsOne(l => l.EnglishCertificate);
                entity.OwnsOne(l => l.FranceCertificate);
                entity.OwnsOne(l => l.JapanCertificate);
                entity.HasIndex(l => l.EnrollmentCode).IsUnique();
            });

            builder.Entity<VanBang2Enrollment>(entity =>
            {
                entity.OwnsOne(v => v.StudentInfor);
                entity.OwnsOne(v => v.HighSchoolInfor);
                entity.OwnsOne(v => v.ContactInfor);
                entity.OwnsOne(v => v.UniversityInfor);
                entity.OwnsOne(v => v.EnglishCertificate);
                entity.OwnsOne(v => v.FranceCertificate);
                entity.OwnsOne(v => v.JapanCertificate);
                entity.HasIndex(v => v.EnrollmentCode).IsUnique();
            });

            builder.Entity<SauDaiHocEnrollment>(entity =>
            {
                entity.OwnsOne(e => e.StudentInfor);
                entity.OwnsOne(e => e.ContactInfor);
                entity.OwnsOne(e => e.UniversityInfor);
                entity.OwnsOne(e => e.EnglishCertificate);
                entity.OwnsOne(e => e.HighStudyInfor);
                entity.HasIndex(e => e.EnrollmentCode).IsUnique();
            });

            builder.Entity<Summarization>(entity =>
            {
                entity.HasKey(s => s.EnrollmentCode);
                entity.OwnsOne(s => s.StudentInfor);
                entity.OwnsOne(s => s.HighSchoolInfor);
                entity.OwnsOne(s => s.UniversityInfor);
                entity.OwnsOne(s => s.HighStudyInfor);
                entity.OwnsOne(s => s.ContactInfor);
                entity.OwnsOne(s => s.EnglishCertificate);
                entity.OwnsOne(s => s.FranceCertificate);
                entity.OwnsOne(s => s.JapanCertificate);
                entity.HasIndex(s => s.EnrollmentCode).IsUnique();
            });

            builder.Entity<AppUser>()
                .HasMany(u => u.Summarization)
                .WithOne(s => s.AppUser)
                .HasForeignKey(s => s.AppUserId)
                .IsRequired();
        }
    }
}