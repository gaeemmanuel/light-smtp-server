import { simpleParser } from 'mailparser';
import { SMTPServer } from 'smtp-server';
import { Server } from 'socket.io';
import { MailData, SocketEvent } from '../types';

class MailServer {
  private readonly server: SMTPServer;

  private readonly mails: MailData[] = [];

  constructor(private readonly socketIo: Server) {
    this.server = this.initServer();
  }

  /**
   * Start listening for mails
   * @param params listening parameters
   */
  listen({
    port,
    hostname,
  }: {
    port: number;
    hostname: string;
  }): Promise<void> {
    return new Promise((resolve, rejects) => {
      try {
        this.server.listen(port, hostname, () => {
          console.log(`Start listening ${hostname} with port ${port}`);
          resolve();
        });
      } catch (error: any) {
        console.error('Error while listening', error);
        rejects(new Error('Could not listen'));
      }
    });
  }

  /**
   * Stop listening
   */
  close(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('Stopped mail server!!');
        resolve();
      });
    });
  }

  /**
   * List all registered mails
   * @returns instances of the mails
   */
  getMails(): MailData[] {
    return [...this.mails];
  }

  private initServer(): SMTPServer {
    const self = this;
    return new SMTPServer({
      onData(stream, session, callback) {
        console.debug('stream AT', session);
        simpleParser(stream, {}, (err, parsed) => {
          if (err) {
            // 1. When an error occurs, we do nothing
            console.error('Error:', err);
            return;
          } else {
            // 2. We have to parse the received message
            const { messageId, subject, date, to, html, text } = parsed;
            const mail = {
              messageId:
                messageId ??
                `Generated-${Math.random()}-${new Date().getTime()}`,
              subject,
              html: html !== false ? html : text,
              date: date ?? new Date().toISOString(),
              to: (to as any).text ?? to,
            } as any;

            // 3. We add the new message on top of the list, and we also emit it via the socket
            self.mails.unshift(mail);
            self.socketIo.emit(SocketEvent.mail_received, mail);
          }

          stream.on('end', callback);
        });
      },
      disabledCommands: ['AUTH'],
    });
  }
}

/**
 * Get an instance of mail server
 * @param socket socket instance for sending new mails to clients
 * @returns created instance
 */
export function createMailServer(socketIo: Server) {
  return new MailServer(socketIo);
}
