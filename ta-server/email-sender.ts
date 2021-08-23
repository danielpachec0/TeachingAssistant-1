import { Aluno } from '../common/aluno';
import nodemailer = require("nodemailer")
import {SentMessageInfo} from "nodemailer";

export class EMailSender {
    private domains: string[] = ['@cin.ufpe.br', '@gmail.com', '@yahoo.com.br', '@ufpe.br']

    sendEMail(aluno: Aluno, subject: string, text: string): SentMessageInfo | null{

        if (!this.emailForaDoPadrao(aluno.email)) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "ta.ess.2020.2@gmail.com",
                    pass: "ess2020a"
                }
            });
            const mailOptions = {
                from: `ta.ess.2020.2@gmail.com`,
                to: aluno.email,
                subject: subject,
                text: text,
                //html: "<b></b>"(html subrescreve o text, mas da pra usar pra fazer msg formatadas)
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return null;
                } else {
                    return 1;
                }
            });
        } else {
            return null;
        }
    }

    private emailForaDoPadrao(email: string): boolean{
        for (let domain of this.domains){
            if (email.endsWith(domain)){
                return false;
            }
        }
        return true;
    }
}
