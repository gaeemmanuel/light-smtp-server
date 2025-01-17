export type MailData = {
  /**
   * Unique mail ID
   */
  messageId: string;
  /**
   * Mail subject
   */
  subject: string;
  /**
   * Message content
   */
  html: string;
  /**
   * Sent date
   */
  date: string;
  /**
   * Recipient
   */
  to: string;
};
