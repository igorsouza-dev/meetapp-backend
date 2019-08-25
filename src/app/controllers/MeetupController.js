import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {}

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required('The title is required'),
      description: Yup.string().required('The description is required'),
      localization: Yup.string().required('The localization is required'),
      date: Yup.date().required('The date is required'),
    });
    await schema.validate(req.body).catch(err => {
      return res.status(400).json({
        error: err.message,
      });
    });

    const parsedDate = parseISO(req.body.date);
    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Meetup date is on the past.' });
    }

    const inputs = { ...req.body, user_id: req.userId };
    const meetup = await Meetup.create(inputs);
    return res.json(meetup);
  }

  async delete(req, res) {}
}

export default new MeetupController();
