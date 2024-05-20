import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapRecorderService } from '../map-recorder/map-recorder.service';
import { catchError, tap } from 'rxjs';
@Component({
  selector: 'app-upload-tracks',
  templateUrl: './upload-tracks.component.html',
  styleUrls: ['./upload-tracks.component.css'],
})
export class UploadTracksComponent implements OnInit {

  // url = "http://192.168.0.105:4000/uploads/";

  error: string = '';
  isLoading: boolean = false;
  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  uploadFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private mapRecorderService: MapRecorderService) {
    this.uploadFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      file: ['', Validators.required],
      fileSource: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
      
     
  onFileChange(event: { target: any }) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadFormGroup.patchValue({
        fileSource: file,
        file: file.name  // Stores the file name

      });
    }
  }
     
  submit(){
    console.log("Form submitted");

    // Log form values and status for debugging
    console.log("Form Values: ", this.uploadFormGroup.value);
    console.log("Form Valid: ", this.uploadFormGroup.valid);

    if (this.uploadFormGroup.invalid) {
      console.log("Form is invalid");
      return;
    }

    const formData = new FormData();
    formData.append('title', this.uploadFormGroup.get('title')?.value);
    const fileControl = this.uploadFormGroup.get('fileSource');

    if (fileControl?.value) {
      formData.append('file', fileControl.value);
    }

   
    this.http.post('http://192.168.0.105:4000/tracks/upload', formData)
      .subscribe(res => {
        console.log(res);
        this.toastMessage =
          'Uploaded Successfully.'; 
      })
  }


}

