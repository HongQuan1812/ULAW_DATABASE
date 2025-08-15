using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace api.Dtos.User
{
    public class GetUserByRoleDto
    {
        public string? Role { get; set; }

        [DefaultValue(1)]
        [Range(1, int.MaxValue, ErrorMessage = "PageNumber phải lớn hơn hoặc bằng 1.")]
        public int PageNumber { get; set; } = 1;

        [DefaultValue(10)]
        [Range(1, 100, ErrorMessage = "PageSize phải lớn hơn hoặc bằng 1 và không quá 100.")]
        public int PageSize { get; set; } = 10;

        [DefaultValue("ascending")]
        public string? SortOrder { get; set; } = "ascending";

        public string? SearchQuery { get; set; }
    }
}