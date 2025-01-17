import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MailData, SocketEvent } from '../types';
import { Socket } from 'ngx-socket-io';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [UpperCasePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'light-smtp-server';

  mails: MailData[] = [];

  selectedMail: MailData | null = null;

  private readonly socket: Socket = inject(Socket);

  private readonly sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.socket.on(SocketEvent.mail_init, (mails: MailData[]) => {
      console.debug('Initializing mails', mails);
      this.mails = mails;
    });

    this.socket.on(SocketEvent.mail_received, (mail: MailData) => {
      console.debug('Received new mail', mail);
      this.mails.unshift(mail);
    });
  }

  showDetails(mail: MailData): void {
    this.selectedMail = {
      ...mail,
      html: this.sanitizer.bypassSecurityTrustHtml(mail.html) as any,
    };
  }

  keyUpDetails(event: KeyboardEvent, mail: MailData): void {
    if (event.key !== 'Enter') {
      return;
    }
    this.showDetails(mail);
  }

  closeDetails(): void {
    this.selectedMail = null;
  }
}
