import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    // each job needs an unique key - usually the class name
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { students, plans, end_date, price } = data;

    // console.log('Queue executed');

    await Mail.sendMail({
      to: `${students.name} <${students.email}>`,
      subject: 'Bem vindo a GYMPOINT',
      template: 'enrollment',
      context: {
        name: students.name,
        plans: plans.title,
        end_date: format(parseISO(end_date), "'Dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        total: price,
      },
    });
  }
}

export default new EnrollmentMail();
