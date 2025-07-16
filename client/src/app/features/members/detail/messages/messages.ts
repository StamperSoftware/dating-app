import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from "../../../../core/services/message.service";
import { MemberService } from "../../../../core/services/member.service";
import { Message } from '../../../../models';
import { DatePipe } from "@angular/common";
import { DateAgoPipe } from "../../../../core/pipes/date-ago-pipe";
import { FormsModule } from "@angular/forms";
import { PresenceService } from "../../../../core/services/presence.service";
import { ActivatedRoute } from "@angular/router";

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
export class MemberMessages implements OnInit, OnDestroy {
  
  @ViewChild('messageEndRef') messageEndRef!:ElementRef;
  protected messageService = inject(MessageService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  
  protected presenceService = inject(PresenceService);
  protected messageContent = "";
  
  constructor () {
    effect(()=>{
      const currentMessages = this.messageService.messageThread();
      if (currentMessages.length > 0) {
        this.scrollToBottom()
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();  
  }
  
  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error("Can not connect");
        
        this.messageService.createHubConnection(otherUserId);
      }
    })
  }
  
  sendMessage(){
    const recipientId = this.memberService.member()?.id;
    if (!recipientId || !this.messageContent) return;
    
    this.messageService.sendMessage(recipientId, this.messageContent)?.then(()=> this.messageContent = "");
  }
  
  scrollToBottom(){
    if (!this.messageEndRef) return;
    setTimeout(() => {
      this.messageEndRef.nativeElement.scrollIntoView({behavior:"smooth"});
    });
  }
  
  
}
