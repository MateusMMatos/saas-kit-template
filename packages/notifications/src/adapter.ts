export interface Notifier {
  send(to: string, template: string, vars?: Record<string,string>): Promise<void>;
}
