import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioContable } from './formulario-contable';

describe('FormularioContable', () => {
  let component: FormularioContable;
  let fixture: ComponentFixture<FormularioContable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioContable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioContable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
