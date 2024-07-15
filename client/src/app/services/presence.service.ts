import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
      //   this.onlineUsersSource.next([...usernames, username])
      // })
      this.toastr.info(username + ' has connected');
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
      //   this.onlineUsersSource.next([...usernames.filter(x => x !== username)])
      // })
      this.toastr.warning(username + ' has disconnected');
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsers.set(usernames);
    })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection.stop().catch((error) => console.log(error));
  }

  constructor() {}
}
