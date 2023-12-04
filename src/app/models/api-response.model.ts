export type ApiResponse<T> = {
  data: T;
  path: string,
  duration: string,
  method: string
}