import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from "../../core/services/message.service";
import { Message, PaginatedResults } from "../../models";
import { Paginator } from "../../ui/paginator/paginator";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ConfirmDialogService } from "../../core/services/confirm-dialog.service";

@Component({
  selector: 'app-messages',
  imports: [
    Paginator,
    RouterLink,
    DatePipe,
    FaIconComponent
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {

  private messageService = inject(MessageService)
  private confirmDialogService = inject(ConfirmDialogService);
  
  protected container = 'inbox';
  protected updatedContainer = this.container;
  protected pageIndex = 0;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResults<Message> | null>(null);
  
  tabs = [
    {label:'Inbox', value:'inbox'},
    {label:'Outbox', value:'outbox'},
  ]
  
  ngOnInit(): void {
    this.getMessages();
  }

  async confirmDelete(e:Event, id:string){
    e.stopPropagation();
    const ok = await this.confirmDialogService.confirm("Are you sure you want to delete this message?")
    if (ok) this.deleteMessage(id);
  }
  
  deleteMessage(messageId:string){
    
    this.messageService.deleteMessage(messageId).subscribe({
      
      next:()=> {
        const current = this.paginatedMessages();
        if(current?.items){
          this.paginatedMessages.update(prev => {
            if (!prev) return null;
            return {
              items : prev.items.filter(x => x.id !== messageId) || [],
              metadata : prev.metadata,
            }
          })
        }
      },
    })
  }
  
  getMessages(){
    this.messageService.getMessages(this.container, this.pageIndex, this.pageSize).subscribe({
      next: results => {
          this.updatedContainer = this.container;
          this.paginatedMessages.set(results);
        }
    })
  }
  
  get isInbox(){
    return this.updatedContainer === 'inbox';
  }
  
  setContainer(container:string){
    this.container = container;
    this.pageIndex = 0;
    this.getMessages();
  }
  
  handlePageChange(event:{pageIndex:number, pageSize:number}){
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getMessages();
  }


  protected readonly faTrash = faTrash;
}
