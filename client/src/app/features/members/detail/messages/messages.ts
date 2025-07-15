import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from "../../../../core/services/message.service";
import { MemberService } from "../../../../core/services/member.service";
import { Message } from '../../../../models';
import { DatePipe } from "@angular/common";
import { DateAgoPipe } from "../../../../core/pipes/date-ago-pipe";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-member-messages',
  imports: [
    DatePipe,
    DateAgoPipe,
    FormsModule
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class MemberMessages implements OnInit {
  
  @ViewChild('messageEndRef') messageEndRef!:ElementRef;
  private messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected messages = signal<Message[]>([]);
  protected messageContent = "";
  
  constructor () {
    effect(()=>{
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom()
      }
    });
  }
  
  ngOnInit(): void {
    this.getMessageThread();
  }
  
  getMessageThread(){
    const memberId = this.memberService.member()?.id;
    
    if (!memberId) return;
    
    this.messageService.getMessageThread(memberId).subscribe({
      next: messages => this.messages.set(messages.map(m=> ({...m, currentUserSender:m.senderId!==memberId}))),
      
    });
  }
  
  
  sendMessage(){
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    
    this.messageService.sendMessage(recipientId, this.messageContent).subscribe({
      next:(message)=> {
        this.messages.update(m => {
          message.currentUserSender = true;
          return [...m, message]
        });
        this.messageContent = "";
      },
    })
    
  }
  
  scrollToBottom(){
    if (!this.messageEndRef) return;
    setTimeout(() => {
      this.messageEndRef.nativeElement.scrollIntoView({behavior:"smooth"});
    });
  }
  
  
}
