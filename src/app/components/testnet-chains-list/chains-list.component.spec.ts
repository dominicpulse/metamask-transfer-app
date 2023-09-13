import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainsListComponent } from './chains-list.component';

describe('ChainsListComponent', () => {
  let component: ChainsListComponent;
  let fixture: ComponentFixture<ChainsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChainsListComponent],
    });
    fixture = TestBed.createComponent(ChainsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
