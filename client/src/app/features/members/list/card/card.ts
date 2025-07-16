import { Component, computed, inject, input } from '@angular/core';
import { Member } from "../../../../models";
import { RouterLink } from "@angular/router";
import { AgePipe } from "../../../../core/pipes/age-pipe";
import { MemberLikesService } from "../../../../core/services/member-likes.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart} from "@fortawesome/free-regular-svg-icons";
import { PresenceService } from "../../../../core/services/presence.service";

@Component({
  selector: 'app-member-card',
  imports: [
    RouterLink,
    AgePipe,
    FaIconComponent
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class MemberCard {
  
    private memberLikeService = inject(MemberLikesService);
    private presenceService = inject(PresenceService);
    
    member = input.required<Member>();
    protected hasLiked = computed(()=> this.memberLikeService.likeIds().includes(this.member().id));
    protected isOnline= computed(()=> this.presenceService.onlineUsers().includes(this.member().id));
    
    toggleLike(event:Event) {
        event.preventDefault();
        event.stopPropagation();
        this.memberLikeService.toggleLike(this.member().id).subscribe({});
    }
    
    protected readonly faHeart = faHeart;
    protected readonly farHeart = farHeart;
}
