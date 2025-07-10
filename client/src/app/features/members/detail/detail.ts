import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { filter} from "rxjs";
import { Member } from "../../../models";
import { AgePipe } from "../../../core/pipes/age-pipe";
import { AccountService } from "../../../core/services/account.service";
import { MemberService } from "../../../core/services/member.service";

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class MemberDetail implements OnInit {
  
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    
    memberService = inject(MemberService);
    protected title = signal<string|undefined>('Profile');
    protected isCurrentUser = computed(()=>{
        return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get("id");
    });
  
    ngOnInit(): void {
        
        this.title.set(this.route.firstChild?.snapshot?.title);
        
        this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe({
            next:()=> {
                this.title.set(this.route.firstChild?.snapshot?.title);
            },
        });
    }
    
}
