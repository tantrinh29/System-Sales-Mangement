export function isURL(input: string) {
  // Biểu thức chính quy để kiểm tra URL
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;

  // Sử dụng test() để kiểm tra chuỗi
  return urlRegex.test(input);
}
