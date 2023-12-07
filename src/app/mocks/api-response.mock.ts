import { HttpEventType, HttpHeaders, HttpResponse } from "@angular/common/http";

export const apiResponseMock = (body:any) => {
  const mockApiResponse = {
    body,
    type: HttpEventType.Response,
    clone: function () {
      throw new Error();
    },
    headers: new HttpHeaders,
    status: 200,
    statusText: '',
    url: null,
    ok: false
  };
  return mockApiResponse;
}