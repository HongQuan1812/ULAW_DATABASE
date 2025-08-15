using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using api.Dtos.Province;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System;
using api.Dtos.User;

namespace api.Service
{
    public class ProvinceService
    {
        private List<ProvinceDto> _provinces;
        private readonly IHostEnvironment _env;

        public ProvinceService(IHostEnvironment env)
        {
            _env = env;
            LoadProvincesData();
        }
        private void LoadProvincesData()
        {
            var jsonFilePath = Path.Combine(_env.ContentRootPath, "wwwroot", "cities_and_wards.json");
            if (File.Exists(jsonFilePath))
            {
                var jsonString = File.ReadAllText(jsonFilePath);
                _provinces = JsonSerializer.Deserialize<List<ProvinceDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            else
            {
                _provinces = new List<ProvinceDto>();
                Console.WriteLine($"Error: province.json not found at {jsonFilePath}");
            }
        }
        public List<ProvinceDto> GetAllProvinces()
        {
            return _provinces;
        }
        public ProvinceDto GetProvinceByCode(string provinceCode)
        {
            return _provinces.FirstOrDefault(p => p.Code == provinceCode);
        }
        public WardDto GetWardByCode(string provinceCode, string wardCode)
        {
            var province = GetProvinceByCode(provinceCode);
            return province?.Wards.FirstOrDefault(w => w.Code == wardCode);
        }
        public UserProvinceDto? GetProvinceNameByProvinceCode(string provinceCode)
        {
            var province = _provinces.FirstOrDefault(p => p.Code == provinceCode);
            if (province == null) return null;

            return new UserProvinceDto { ProvinceName = province.Name };
        }
        public UserProvinceDto? GetWardNameByWardCode(string provinceCode, string wardCode)
        {
            var province = _provinces.FirstOrDefault(p => p.Code == provinceCode);
            if (province == null) return null;

            var ward = province.Wards.FirstOrDefault(w => w.Code == wardCode);
            if (ward == null) return null;

            return new UserProvinceDto
            {
                ProvinceName = province.Name,
                WardName = ward.Name
            };
        }
    }
}