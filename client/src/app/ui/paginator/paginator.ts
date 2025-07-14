import { Component, computed, input, model, output } from '@angular/core';
import { PaginationParams } from "../../models";

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  
    pageIndex = model(0);
    pageSize = model(5);
    totalCount = input(0);
    pageSizeOptions = input([3, 5,10,25,50]);
    
    lastItemIndex = computed(()=>{
      return Math.min((this.pageIndex()+1)*this.pageSize(), this.totalCount());
    });
    
    pageChange = output<PaginationParams>({});
  
    onPageChange(newPage?:number, pageSize?:EventTarget|null){
      
      if (newPage != undefined) {
        this.pageIndex.set(newPage);
      }
      
      if (pageSize) {
        const size = Number((pageSize as HTMLSelectElement).value);
        this.pageSize.set(size);
      }
      
      this.pageChange.emit({
        pageIndex:this.pageIndex(),
        pageSize:this.pageSize()
      });
    }
  
}
