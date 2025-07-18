import { inject, Injectable, signal } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Message, PaginatedResults } from "../../models";
import { AccountService } from "./account.service";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  
  private url = `${environment.apiUrl}/messages`;
  private http = inject(HttpClient);
  private hubUrl = environment.hubUrl;
  private accountService = inject(AccountService);
  private hubConnection?:HubConnection;
  messageThread = signal<Message[]>([]);
  
  createHubConnection(otherUserId:string){
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return;
    console.log('test')
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${this.hubUrl}/messages?userId=${otherUserId}`, {accessTokenFactory :()=> currentUser.token})
        .withAutomaticReconnect()
        .build();
    
    this.hubConnection.start().catch(err => console.log(err));
    
    this.hubConnection.on("ReceiveMessageThread", (messages:Message[]) => {
      this.messageThread.set(messages.map(m=> ({...m, currentUserSender:m.senderId!==otherUserId})));
    });
    this.hubConnection.on("NewMessage", (message:Message) => {
      message.currentUserSender = message.senderId == currentUser.id;
      
      this.messageThread.update(m=>[...m,message]);
    });
    
  }
  
  stopHubConnection(){
    if (this.hubConnection?.state !== HubConnectionState.Connected){
      this.hubConnection?.stop().catch(err => console.log(err));
    }
  }
    
  
  getMessages(container:string, pageIndex:number, pageSize:number){
    const params = new HttpParams().appendAll({
      pageIndex,
      pageSize,
      container
    })
    
    return this.http.get<PaginatedResults<Message>>(this.url, {params});
  }
  
  getMessageThread(memberId:string){
    return this.http.get<Message[]>(`${this.url}/thread/${memberId}`)
  }
  
  sendMessage(recipientId:string, content:string){
    return this.hubConnection?.invoke("SendMessage", {recipientId,content});
  }
  
  deleteMessage(messageId:string){
    return this.http.delete(`${this.url}/${messageId}`)
  }
}
