import { Component, inject } from '@angular/core';
import { MemberService } from "../../../core/services/member.service";
import { Observable } from "rxjs";
import { Photo } from "../../../models";
import { ActivatedRoute } from "@angular/router";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-member-photos',
  imports: [
    AsyncPipe
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.css'
})
export class MemberPhotos {
  private memberService = inject(MemberService);
  protected photos$?:Observable<Photo[]>;
  private route = inject(ActivatedRoute);

  constructor () {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId) {
      this.photos$ = this.memberService.getPhotos(memberId);
    }
  }


}
