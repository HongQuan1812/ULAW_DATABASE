namespace api.Dtos.Common
{
    public class ApiResponseDto
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public PaginationMetaDataDto? Pagination { get; set; }
    }
    public class ApiResponseDto<T> : ApiResponseDto
    {
        public T? Data { get; set; }
        public PaginationMetaDataDto? Pagination { get; set; }
    }
}