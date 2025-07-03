import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MemberService } from "./core/services/member";
import { Member } from "./models";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  memberService = inject(MemberService);
  protected members = signal<Member[]>([]);
  
  
  ngOnInit(): void {
    this.memberService.getMember("9b1d3431-83e9-4ca5-b7cc-8d8113b07ba4").subscribe();
    this.memberService.getMembers().subscribe({
      next: response => this.members.set(response) 
    });
  }
  
}
