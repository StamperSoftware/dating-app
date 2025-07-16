import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { filter} from "rxjs";
import { AgePipe } from "../../../core/pipes/age-pipe";
import { AccountService } from "../../../core/services/account.service";
import { MemberService } from "../../../core/services/member.service";
import { PresenceService } from "../../../core/services/presence.service";
import { MemberLikesService } from "../../../core/services/member-likes.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-member-detail',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe, FaIconComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class MemberDetail implements OnInit {
  
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    protected memberLikesService = inject(MemberLikesService);
    private routeId = signal<string|null>(null);
    
    protected isLoading = signal(false);
    protected presenceService = inject(PresenceService);
    
    protected title = signal<string|undefined>('Profile');
    protected hasLiked = computed(()=> this.memberLikesService.likeIds().includes(this.routeId()!));
    protected isCurrentUser = computed(()=> this.accountService.currentUser()?.id === this.routeId());
    
    memberService = inject(MemberService);
  
    constructor () {
        this.route.paramMap.subscribe(params => {
            this.routeId.set(params.get('id'));
        })
    }
    
    ngOnInit(): void {
        
        this.title.set(this.route.firstChild?.snapshot?.title);
        
        this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe({
            next:()=> {
                this.title.set(this.route.firstChild?.snapshot?.title);
            },
        });
    }

    handleToggleLike(memberId:string){
        this.isLoading.set(true);
        this.memberLikesService.toggleLike(memberId).subscribe({
            complete : () => this.isLoading.set(false),
        })
    }
    

    protected readonly faHeart = faHeart;
    protected readonly farHeart = farHeart;
    protected readonly faSpinner = faSpinner;
}
