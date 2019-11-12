import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ReplyOrderMail {
  get key() {
    // each job needs an unique key = usually the class name
    return 'ReplyOrderMail';
  }

  async handle({ data }) {
    const { students, helpOrder } = data;

    console.log('Queue executed');
    console.log(
      students.name,
      students.email,
      helpOrder.question,
      helpOrder.answer,
      helpOrder.createdAt
    );

    await Mail.sendMail({
      to: `${students.name} <${students.email}`,
      subject: 'Retorno GYMPOINT',
      template: 'replyorder',
      context: {
        name: students.name,
        question: helpOrder.question,
        created_at: format(
          parseISO(helpOrder.createdAt),
          "'Dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        answer: helpOrder.answer,
      },
    });
  }
}
export default new ReplyOrderMail();
