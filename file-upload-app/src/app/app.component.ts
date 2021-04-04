import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'File Upload';
  fileUploadForm: FormGroup;
  userImage: String;
  selectedImage: File;
  progress: Number = 0; // initially progress is zero
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {
    // Form validation
    this.fileUploadForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      image: [null, [Validators.required]], // get Image which user had uploaded
      profileImage: [null] // get binary data of image uploaded by user
    });
  }

  get image() { return this.fileUploadForm.get('image'); }
  get name() { return this.fileUploadForm.get('name'); }
  get profileImage() { return this.fileUploadForm.get('profileImage'); }

  onSubmit() {
    // on form submit mark all fields as touched
    this.fileUploadForm.markAllAsTouched();
    if (this.fileUploadForm.valid) { // check if all fields are valid
      const formData: any = new FormData(); // File/images can not be sent to backend directly,
      // need to convert to them as binary, so using form data
      formData.append('name', this.fileUploadForm.get('name').value);
      // in case of multiple image use this.selectedImage as array and use loop on it
      formData.append('profileImage', this.selectedImage, this.selectedImage['name']); // selectedImage contain binary image data and image name
      this.appService.addUser(formData).subscribe((event: HttpEvent<any>) => { // client call
        switch(event.type) { //checks events
          case HttpEventType.UploadProgress: // If upload is in progress
          this.progress = Math.round(event.loaded / event.total * 100); // get upload percentage
          break;
          case HttpEventType.Response: // give final response
          console.log('User successfully added!', event.body);
        }
      })
    }
  }

  // Image Preview
  onFileChange(event) {
    this.userImage;
    if (event.target.files && event.target.files[0]) { // check is any file is there
      const reader = new FileReader(); 
      const file = event.target.files[0] // Get first file as we are not allowing multiple image
      // in case of multiple image use loop on event.target.files and use below code in loop
      reader.onload = (events: any) => { // process to render image at UI for preview
        this.userImage = events.target.result; // get Image to show at UI
        this.selectedImage = file; // get binary image
        this.fileUploadForm.patchValue({
          profileImage: this.userImage
        });
        this.fileUploadForm.get('profileImage').updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }
}
