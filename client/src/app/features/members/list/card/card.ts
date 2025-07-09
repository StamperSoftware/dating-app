import { Component, input } from '@angular/core';
import { Member } from "../../../../models";
import { NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AgePipe } from "../../../../core/pipes/age-pipe";

@Component({
  selector: 'app-member-card',
  imports: [
    RouterLink,
    AgePipe
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class MemberCard {
    member = input.required<Member>();
    
}
