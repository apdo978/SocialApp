import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Posts as PostsServ } from '../../../Services/Posts/posts';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-post-creation-page',
  templateUrl: './post-creation-page.html',
  styleUrls: ['./post-creation-page.css'],
  standalone: true,
  imports: [
    MatButtonToggleModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ]
})
export class PostCreationPage implements OnInit {
   hideSingleSelectionIndicator = signal(false);
  postForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  privacyOptions = ['public', 'private', 'friends'];
  
  // Media related properties
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
  uploadError: string | null = null;

  constructor(private fb: FormBuilder,
    private _PostsService:PostsServ,
    private snackBar: MatSnackBar,
     private cdr: ChangeDetectorRef,
  ) {
    this.postForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.maxLength(1000),
        Validators.minLength(1)
      ]],
      privacy: ['public', [
        Validators.required,
        Validators.pattern('^(public|private|friends)$')
      ]],
      tags: this.fb.array([]),
      media: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Initialize form with default values if needed
   
  }

  // Validate file before upload
  private validateFile(file: File): boolean {
    this.uploadError = null;

    if (!this.allowedFileTypes.includes(file.type)) {
      this.uploadError = 'Invalid file type. Please upload an image or video.';
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.uploadError = 'File is too large. Maximum size is 5MB.';
      return false;
    }

    return true;
  }

  // Enhanced onFileSelected method
  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!this.validateFile(file)) {
      console.error(this.uploadError);
      return;
    }
    
    this.selectedImage = file;
    
    // Create preview based on file type
    if (file.type.startsWith('image/')) {
      this.createImagePreview(file);
    } else if (file.type.startsWith('video/')) {
      this.createVideoPreview(file);
    }

    // Add to form media array
    const mediaArray = this.postForm.get('media') as FormArray;
    mediaArray.clear(); // Clear previous media
    mediaArray.push(this.fb.control(file));
  }

  // Create image preview
  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
          this.cdr.detectChanges(); 

    };
    reader.readAsDataURL(file);
  }

  // Create video preview
  private createVideoPreview(file: File): void {
    const videoURL = URL.createObjectURL(file);
    this.imagePreview = videoURL; // We'll handle this differently in the template
          this.cdr.detectChanges(); 

  }

  // Enhanced remove media method
  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    this.uploadError = null;
    
    // Clear media from form
    const mediaArray = this.postForm.get('media') as FormArray;
    mediaArray.clear();
  }

  // Enhanced onSubmit method
  onSubmit(): void {
    if (this.postForm.valid) {
      const formData = new FormData();
      
      // Append text data
      const lastprivcy =  this.postForm.get('privacy')?.value;
      formData.append('content', this.postForm.get('content')?.value);
      formData.append('privacy',lastprivcy); 
      
      // Append tags
      const tags = this.postForm.get('tags')?.value;
      if (tags && tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }
      
      // Append media if exists
      if (this.selectedImage) {
        formData.append('media', this.selectedImage, this.selectedImage.name);
        
      }
      
      this._PostsService.createPost(this.postForm.value).subscribe({
        
        next: (response: any) => {
          this.snackBar.open('Post created successfully!', 'Close', {
            duration: 3000,
          });
          // Reset form after successful submission
          this.postForm.reset();
          this.postForm.setControl('privacy', this.fb.control(lastprivcy)); // Reset privacy to default
          this.removeImage(); // Clear image preview and selected file
          this.cdr.detectChanges(); 
          this._PostsService.getPosts().subscribe();
        },
        error: (error: any) => {
          console.error('Error creating post:', error);
          this.snackBar.open('Failed to create post. Please try again.', 'Close', {
            duration: 3000,
          });
          this.uploadError = 'Failed to create post. Please try again.';
             this.postForm.reset();
          this.removeImage(); // Clear image preview and selected file
          this.cdr.detectChanges();
        }

      });
    }
  }

  // Add validation error messages
  getErrorMessage(controlName: string): string {
    const control = this.postForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Please add content to your post';
    }
    if (control?.hasError('maxlength')) {
      return 'Post content cannot be more than 1000 characters';
    }
    if (control?.hasError('minlength')) {
      return 'Post content cannot be empty';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid privacy setting';
    }
    return '';
  }

  // Helper method to add tags
  addTag(tag: string): void {
    const tags = this.postForm.get('tags') as FormArray;
    if (tag.trim() && tags.length < 10) { // Limiting to 10 tags
      tags.push(this.fb.control(tag.trim()));
    }
  }

  // Helper method to remove tags
  removeTag(index: number): void {
    const tags = this.postForm.get('tags') as FormArray;
    tags.removeAt(index);
  }

    toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }
}
