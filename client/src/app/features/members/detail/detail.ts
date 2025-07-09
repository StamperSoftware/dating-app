import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { filter} from "rxjs";
import { Member } from "../../../models";
import { AgePipe } from "../../../core/pipes/age-pipe";

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class MemberDetail implements OnInit {
  
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    protected title = signal<string|undefined>('Profile');
    protected member = signal<Member|undefined>(undefined);
    
  
    ngOnInit(): void {
        
        this.title.set(this.route.firstChild?.snapshot?.title);
        this.route.data.subscribe({
            next: data => this.member.set(data['member'])
        })
        
        this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe({
            next:()=> {
                this.title.set(this.route.firstChild?.snapshot?.title);
            },
        });
    }
    
}
