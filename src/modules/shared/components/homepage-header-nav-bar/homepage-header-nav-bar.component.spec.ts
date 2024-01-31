import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageHeaderNavBarComponent } from './homepage-header-nav-bar.component';

describe('HomepageHeaderNavBarComponent', () => {
  let component: HomepageHeaderNavBarComponent;
  let fixture: ComponentFixture<HomepageHeaderNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageHeaderNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomepageHeaderNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
