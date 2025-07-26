import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreationPage } from './post-creation-page';

describe('PostCreationPage', () => {
  let component: PostCreationPage;
  let fixture: ComponentFixture<PostCreationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
