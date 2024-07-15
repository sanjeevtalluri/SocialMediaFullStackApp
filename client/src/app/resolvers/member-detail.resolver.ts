import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Member } from '../models/member';
import { MembersService } from '../services/members.service';

export const memberDetailResolver: ResolveFn<Member | null> = (route, state) => {
  const memberSrvice = inject(MembersService);
  const username = route.paramMap.get('username');
  if(!username) return null;
  return memberSrvice.getMember(username);
};
