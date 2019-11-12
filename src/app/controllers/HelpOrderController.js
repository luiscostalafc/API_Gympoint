import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Students from '../models/Students';
import Enrollment from '../models/Enrollment';

import ReplyOrderMail from '../jobs/ReplyOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
      include: [
        {
          model: Students,
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    const students_id = req.params.id;
    const students = await Students.findByPk(students_id);

    if (!students) {
      res.status(400).json({ error: 'Invalid student' });
    }

    const enrollmentExists = await Enrollment.findOne({
      where: { students_id },
    });

    if (!enrollmentExists) {
      return res.status(400).json({ error: 'Student is not enrolled' });
    }
    const { question } = req.body;
    const helpOrder = await HelpOrder.create({ question, students_id });

    await Queue.add(ReplyOrderMail.key, {
      students,
      helpOrder,
    });

    return res.json(helpOrder);
  }

  async show(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { students_id: req.params.id },
      attributes: ['question', 'answer', 'answer_at', 'created_at'],
      include: [
        {
          model: Students,
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ message: 'There is no such help order' });
    }

    if (helpOrder.answer) {
      return res.status(400).json({ error: 'Question already answered' });
    }

    const students = await Students.findByPk(helpOrder.students_id, {
      attributes: ['name', 'email'],
    });

    req.body.answer_at = new Date();

    await helpOrder.update(req.body);

    await Queue.add(ReplyOrderMail.key, {
      students,
      helpOrder,
    });

    return res.json({ ...req.body });
  }

  async delete(req, res) {
    const { id } = req.params;
    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order not found' });
    }

    await HelpOrder.destroy({
      where: { id },
    });
    return res.json({ message: 'Help Order deleted' });
  }
}
export default new HelpOrderController();
