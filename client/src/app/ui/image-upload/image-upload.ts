import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  
  private uploadFile :File|null = null;
  
  protected imageSrc = signal<string | ArrayBuffer | null>(null);
  protected isDragging = false;
  
  outputFile = output<File>();
  loading = input(false);
  
  onDragOver(e:DragEvent){
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
  }
  onDragLeave(e:DragEvent){
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
  }
  onDrop(e:DragEvent){
    this.isDragging = false;
    console.log(e.dataTransfer?.files)
    if (e.dataTransfer?.files?.length) {
      const file = e.dataTransfer.files[0];
      this.previewImage(file);
      this.uploadFile = file;
    }
  }
  
  cancelFileUpload(){
    this.uploadFile = null;
    this.imageSrc.set(null)
  }
  
  handleFileUpload(){
    if (this.uploadFile) {
      this.outputFile.emit(this.uploadFile);
    }
  }
  
  private previewImage(file:File){
    const reader = new FileReader();
    reader.onload = e => this.imageSrc.set(e?.target?.result ?? null);
    reader.readAsDataURL(file);
  }
  
}


