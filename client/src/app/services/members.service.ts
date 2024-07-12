import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { getPaginationHeaders, paginatedResponse } from './PaginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  userParams = signal<UserParams>(new UserParams(this.accountService.currentUser()));
  memberCache = new Map();
  constructor() {}

  resetUserParams(){
    this.userParams.set(new UserParams(this.accountService.currentUser()));
  }
  getMembers() {
    var userParams = this.userParams();
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return paginatedResponse(response,this.paginatedResult);
    }
    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params.minAge = userParams.minAge;
    params.maxAge = userParams.maxAge;
    params.gender = userParams.gender;
    params.orderBy = userParams.orderBy;
    return this.http
      .get<Member[]>(this.baseUrl + 'users', {
        params: params,
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          paginatedResponse(response,this.paginatedResult);
          this.memberCache.set(Object.values(userParams).join('-'), response);
        },
      });
  }
  getMember(username: string) {
    const member : Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((member: Member) => member.username === username);
    console.log(member);
    if (member) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put<Member>(this.baseUrl + 'users', member).pipe(
      tap(() => {
        // const index = this.members.indexOf(member);
        // this.members[index] = member;
      })
    );
  }

  setMainPhoto(id: number) {
    return this.http.put<Member>(
      this.baseUrl + 'users/set-main-photo/' + id,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
