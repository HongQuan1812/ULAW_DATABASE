namespace api.Dtos.Major
{
    public class MajorDto
    {
        public string Name { get; set; }
        public int Code { get; set; }
        public string CodeName { get; set; }
        public List<SubjectGroupDto> SubjectGroup { get; set; }
    }
}