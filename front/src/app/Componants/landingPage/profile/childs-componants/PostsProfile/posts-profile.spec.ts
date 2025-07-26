import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsProfile } from './posts-profile';

describe('PostsProfile', () => {
  let component: PostsProfile;
  let fixture: ComponentFixture<PostsProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
