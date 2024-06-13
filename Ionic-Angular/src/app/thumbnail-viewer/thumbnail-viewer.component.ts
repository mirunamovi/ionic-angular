import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ThumbnailService } from './thumbnail.service';

@Component({
  selector: 'app-thumbnail-viewer',
  templateUrl: './thumbnail-viewer.component.html',
  styleUrls: ['./thumbnail-viewer.component.css']
})
export class ThumbnailViewerComponent implements OnChanges {
  @Input() thumbnail?: string; // Input property to receive the thumbnail filename
  thumbnailUrl?: string;

  constructor(private thumbnailService: ThumbnailService) {}

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['thumbnail'] && this.thumbnail) {
      this.loadThumbnail(this.thumbnail);
    }
  }

  loadThumbnail(filename: string): void {
    this.thumbnailUrl = this.thumbnailService.getImageUrl(filename);
  }
}
