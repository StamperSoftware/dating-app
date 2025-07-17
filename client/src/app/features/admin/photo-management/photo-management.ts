import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { AdminService } from "../../../core/services/admin.service";
import { Photo } from "../../../models";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-photo-management',
  imports: [
    FaIconComponent
  ],
  templateUrl: './photo-management.html',
  styleUrl: './photo-management.css'
})
export class PhotoManagement implements OnInit {
  
    private adminService = inject(AdminService);
    protected photos = signal<Photo[]>([]);
    
    ngOnInit(): void {
      this.getPhotos();
    }

    getPhotos(){
      this.adminService.getUnapprovedPhotos().subscribe({
        next: photos => this.photos.set(photos),
      });
    }
    
    approvePhoto(photoId:number){
      this.adminService.approvePhoto(photoId).subscribe({
        next : () => this.getPhotos(),
      });
    }
    rejectPhoto(photoId:number){
      this.adminService.rejectPhoto(photoId).subscribe({
        next : () => this.getPhotos(),
      });
      
    }
    
  protected readonly faThumbsUp = faThumbsUp;
  protected readonly faThumbsDown = faThumbsDown;
}
