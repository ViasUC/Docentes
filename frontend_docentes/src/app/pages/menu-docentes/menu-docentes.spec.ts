import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDocentes } from './menu-docentes';

describe('MenuDocentes', () => {
  let component: MenuDocentes;
  let fixture: ComponentFixture<MenuDocentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDocentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDocentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
