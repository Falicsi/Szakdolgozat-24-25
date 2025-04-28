import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceEditDialogComponent } from './resource-edit-dialog.component';

describe('ResourceEditDialogComponent', () => {
  let component: ResourceEditDialogComponent;
  let fixture: ComponentFixture<ResourceEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
