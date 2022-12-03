import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieTheaterComponent } from './movie-theater.component';

describe('MovieTheaterComponent', () => {
  let component: MovieTheaterComponent;
  let fixture: ComponentFixture<MovieTheaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieTheaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
