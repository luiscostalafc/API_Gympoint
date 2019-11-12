import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt;
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll();
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      students_id: Yup.number().required(),
      plans_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    const enrollmentExists = await Enrollment.findOne({
      where: { students_id: req.body.students_id },
    });

    if (enrollmentExists) {
      return res.status(400).json({ error: 'Student is actually enrolled' });
    }

    const { students_id, plans_id, start_date } = req.body;
    const plans = await Plans.findByPk(plans_id, {
      attributes: ['duration', 'price', 'title'],
    });

    if (!plans) {
      return res.status(400).json({ error: 'Choose a valid plan' });
    }

    const price = plans.duration * plans.price;

    const end_date = addMonths(parseISO(req.body.start_date), plans.duration);

    const students = await Students.findByPk(students_id, {
      attributes: ['name', 'email'],
    });

    if (!students) {
      return res.status(400).json({ error: 'Choose a valid student' });
    }

    const enrollment = await Enrollment.create({
      start_date,
      students_id,
      plans_id,
      end_date,
      price,
    });

    await Queue.add(EnrollmentMail.key, {
      students,
      enrollment,
      plans,
      end_date,
      price,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      students_id: Yup.number(),
      plans_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    const { plans_id, start_date } = req.body;
    const plans = await Plans.findByPk(plans_id);

    if (plans_id !== enrollment.plan_id && plans) {
      const price = plans.price * plans.duration;
      const end_date = addMonths(parseISO(start_date), plans.duration);

      await enrollment.update({
        plans_id,
        price,
        end_date,
        start_date,
      });
      return res.json({ message: 'Enrollment updated' });
    }

    return res.status(400).json({ error: 'Please choose a valid plan' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    await Enrollment.destroy({
      where: { id },
    });
    return res.json({ message: 'Enrollment deleted' });
  }
}

export default new EnrollmentController();
