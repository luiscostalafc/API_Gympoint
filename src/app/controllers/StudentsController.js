import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const studentsExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentsExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }
    const { id, name, email, age, height, weight } = await Students.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .min(1),
      height: Yup.number().min(2),
      weight: Yup.number().min(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, name, age, height, weight } = req.body;
    const { id } = req.params;

    const students = await Students.findByPk(id);
    if (!students) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    if (email === students.email)
      return res.json({
        id,
        name,
        email,
        age,
        height,
        weight,
      });

    return res.status(400).json({ error: 'Student and email does not match' });
  }
}

export default new StudentsController();
