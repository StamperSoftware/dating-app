import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from "../../../core/services/member.service";
import { Observable } from "rxjs";
import { Member, Photo, User } from "../../../models";
import { ActivatedRoute } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ImageUpload } from "../../../ui/image-upload/image-upload";
import { AccountService } from "../../../core/services/account.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-member-photos',
  imports: [
    ImageUpload,
    FaIconComponent
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.css'
})
export class MemberPhotos implements OnInit {
  
  private route = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);
  memberId = this.route.parent?.snapshot.paramMap.get('id');
  
  ngOnInit(): void {
    if (this.memberId) {
      this.memberService.getPhotos(this.memberId).subscribe({
        next : (photos) => this.photos.set(photos),
      })
    }
  }
  
  handleUploadImage(file:File){
    if(!this.memberId) return;
    
    this.loading.set(true);
    this.memberService.uploadPhoto(this.memberId, file).subscribe({
      next:(photo)=>{
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
      },
      error:err => console.log(err),
    });
  }
  
  setMainPhoto(photo:Photo){
    if(!this.memberId) return;
    this.memberService.setMainPhoto(this.memberId, photo.id).subscribe({
      next : ()=>{
        const currentUser = this.accountService.currentUser();
        if (!currentUser) return;
        
        currentUser.imageUrl = photo.url;
        this.accountService.currentUser.set(currentUser);
        this.memberService.member.update(m => ({...m, imageUrl:photo.url} as Member))
      }
    })
  }

  deletePhoto(photo:Photo){
    if(!this.memberId) return;
    
    this.memberService.deletePhoto(this.memberId, photo.id).subscribe({
      next : ()=>{
        this.photos.update(photos => photos.filter(p => p.id !== photo.id));
      }
    })
  }

  protected readonly faStar = faStar;
  protected readonly faTrash = faTrash;
}
