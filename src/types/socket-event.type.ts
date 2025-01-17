export enum SocketEvent {
  /**
   * Socket is connected
   */
  connection = 'connection',

  /**
   * Socket is disconnected
   */
  disconnect = 'disconnect',

  /**
   * New mail received by server
   */
  mail_received = 'mail_received',

  /**
   * Retrieve pre-existing mail upon connection
   */
  mail_init = 'mail_init',
}
