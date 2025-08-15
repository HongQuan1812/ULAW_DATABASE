using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text.Json;
using api.Dtos.Major;
using api.Dtos.User;
using Microsoft.Extensions.Hosting;

namespace api.Service
{
    public class MajorService
    {
        private List<MajorDto> _majors;
        private readonly IHostEnvironment _env;

        public MajorService(IHostEnvironment env)
        {
            _env = env;
            LoadMajorData();
        }

        private void LoadMajorData()
        {
            var jsonFilePath = Path.Combine(_env.ContentRootPath, "wwwroot", "dataMajor.json");
            if (File.Exists(jsonFilePath))
            {
                var jsonString = File.ReadAllText(jsonFilePath);
                _majors = JsonSerializer.Deserialize<List<MajorDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            else
            {
                _majors = new List<MajorDto>();
                Console.WriteLine($"Error: dataMajor.json not found at {jsonFilePath}");
            }
        }

        public List<MajorDto> GetAllMajors()
        {
            return _majors;
        }
        public MajorDto GetMajorByCode(int majorCode)
        {
            return _majors.FirstOrDefault(m => m.Code == majorCode);
        }
        public SubjectGroupDto GetSubjectGroupByCode(int majorCode, string subjectGroupCode)
        {
            var major = GetMajorByCode(majorCode);
            return major?.SubjectGroup.FirstOrDefault(s => s.Code == subjectGroupCode);
        }
        public UserMajorDto? GetMajorNameByCode(int majorCode)
        {
            var major = _majors.FirstOrDefault(m => m.Code == majorCode);
            if (major == null) return null;

            return new UserMajorDto { MajorName = major.Name };
        }
        public UserMajorDto? GetSubjectGroupNameByCode(int majorCode, string subjectGroupCode)
        {
            var major = _majors.FirstOrDefault(m => m.Code == majorCode);
            if (major == null) return null;

            var subjectGroup = major.SubjectGroup.FirstOrDefault(s => s.Code == subjectGroupCode);
            if (subjectGroup == null) return null;

            return new UserMajorDto
            {
                MajorName = major.Name,
                SubjectGroupName = subjectGroup.Name
            };
        }
    }
}