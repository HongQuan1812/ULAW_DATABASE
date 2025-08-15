namespace api.Dtos.Province
{
    public class ProvinceDto
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Codename { get; set; }
        public string Division_type { get; set; }
        public int? Phone_code { get; set; }
        public List<WardDto> Wards { get; set; }
    }
}