import { Mail } from "@/entities";

export interface IMailRepository {
  getMailFormat(id: number): Promise<Mail>;
}
