import { inject, Injectable, signal } from '@angular/core';
import { environment } from "../../../environments/environment";
import { ToastService } from "./toast.service";
import { User } from "../../models";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  
  private hubUrl = environment.hubUrl;
  private toastService = inject(ToastService);
  hubConnection? : HubConnection;
  onlineUsers = signal<string[]>([]);
  
  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${this.hubUrl}/presence`, {accessTokenFactory:()=> user.token})
        .withAutomaticReconnect()
        .build();
    
    this.hubConnection.start().catch(err => console.log(err));
    
    this.hubConnection.on("UserOnline", id => {
      this.onlineUsers.update(u => [...u, id]);
    })
    
    this.hubConnection.on("UserOffline", id => {
      this.onlineUsers.update(u => u.filter(x => x !== id));
    })
    
    this.hubConnection.on("GetOnlineUsers", userIds => {
      this.onlineUsers.set(userIds);
    })
    
    this.hubConnection.on("NewMessageReceived", message => {
      this.toastService.info(`${message.senderDisplayName} has sent you a message!`, 10000, message.senderImageUrl, `/members/${message.senderId}/messages`);
    })
  }
  
  stopHubConnection(){
    if (this.hubConnection?.state === HubConnectionState.Connected) this.hubConnection.stop().catch(err => console.log(err));
  }
}
