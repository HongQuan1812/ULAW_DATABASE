export const getStepInfo = (step?: number): { label: string; color: string; current: number } => {
  switch (step) {
    case 1:
      return { label: 'Tiếp nhận', color: 'blue', current: 1 };
    case 2:
      return { label: 'Yêu cầu cập nhật', color: 'orange', current: 1 };
    case 3:
      return { label: 'Từ chối', color: 'red', current: 2 };
    case 4:
      return { label: 'Chấp nhận', color: 'green', current: 2 };
    case 5:
      return { label: 'Phê duyệt', color: 'success', current: 2 };
    default:
      return { label: 'Chưa tiếp nhận', color: 'default', current: 0 };
  }
};
