import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const plans = await Plans.findAll();
    // return res.json({ message: 'PlanController here' });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const plansExists = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (plansExists) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const { title, duration, price } = await Plans.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    const { title } = req.body;
    const { id } = req.params;

    const plans = await Plans.findByPk(id);

    if (!plans) {
      res.status(400).json({ error: 'Plan does not exist' });
    }

    if (title === plans.title) {
      const { duration, price } = await plans.update(req.body);
      return res.json({
        title,
        duration,
        price,
      });
    }

    return res.status(400).json({ error: 'Plan name and ID does not match' });
  }

  async delete(req, res) {
    const { id } = req.params;
    await Plans.destroy({
      where: { id },
    });
    return res.json({ message: 'Plan deleted' });
  }
}

export default new PlansController();
