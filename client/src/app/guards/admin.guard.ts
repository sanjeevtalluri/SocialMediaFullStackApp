import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if(accountService.roles().includes('Admin') || accountService.roles().includes('Moderator')){
    return true;
  }
  else{
    toastr.error('Only admins can access this area');
    return false;
  }
};
