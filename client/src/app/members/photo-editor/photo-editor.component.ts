import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../environments/environment.development';
import { Member } from '../../models/member';
import { Photo } from '../../models/photo';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, NgStyle, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent implements OnInit {
  ngOnInit(): void {
    this.initializeUploader();
  }
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  member = input.required<Member>();
  memberChange = output<Member>();
  uploader?: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user?: User | null;

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user) {
          this.user.photoUrl = photo.url;
          this.accountService.currentUser.set(this.user);
          this.member().photoUrl = photo.url;
          this.member().photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
          const updatedMember = { ...this.member() };
          this.memberChange.emit(updatedMember);
        }
      },
    });
  }

  deletePhoto(id: number) {
    this.memberService.deletePhoto(id).subscribe({
      next:()=>{
        this.member().photos = this.member().photos.filter((x) => x.id !== id);
      }
    });
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader() {
    this.user = this.accountService.currentUser();
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        const updatedMember = { ...this.member() };
        updatedMember.photos.push(photo);
        this.memberChange.emit(updatedMember);
      }
    };
  }
}
