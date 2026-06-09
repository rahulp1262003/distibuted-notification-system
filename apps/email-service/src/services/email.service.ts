/**
 * Simulates email delivery.
 *
 * Returns:
 * true  => email sent
 * false => email failed
 */
export async function sendEmail(): Promise<boolean> {
  return Math.random() > 0.5;
}