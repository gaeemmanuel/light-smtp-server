import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: DomSanitizer, useValue: {} },
        { provide: Socket, useValue: { on: () => {} } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'light-smtp-server' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('light-smtp-server');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'LIGHT-SMTP-SERVER'
    );
  });
});
