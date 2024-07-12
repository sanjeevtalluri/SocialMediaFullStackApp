import { HttpResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import { Member } from "../models/member";
import { PaginatedResult } from "../models/pagination";

export function paginatedResponse<T>(response: HttpResponse<T>,
    paginatedResultSignal:ReturnType<typeof signal<PaginatedResult<T> | null>>) {
    paginatedResultSignal.set({
      items: response.body as T,
      pagination: JSON.parse(response.headers.get('Pagination')!),
    });
  }

 export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params:any = {
      pageNumber: 1,
      pageSize: 10
    };
    
    if (pageNumber) {
      params.pageNumber = pageNumber;
    }
    if (pageSize) {
      params.pageSize = pageSize;
    }
    return params;
  }