import { inject, Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Message, PaginatedResults } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  
  private url = `${environment.apiUrl}/messages`;
  private http = inject(HttpClient);
  
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
    return this.http.post<Message>(`${this.url}`, {recipientId,content});
  }
  
  deleteMessage(messageId:string){
    return this.http.delete(`${this.url}/${messageId}`)
  }
}
