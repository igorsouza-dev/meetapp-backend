import * as Yup from 'yup';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const queryDate = parseISO(req.query.date);
      where.date = {
        [Op.between]: [startOfDay(queryDate), endOfDay(queryDate)],
      };
    }
    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });
    return res.json(meetups);
  }

  async find(req, res) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists.' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to view this meetup." });
    }
    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists.' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to change this meetup." });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup have already happened.' });
    }

    const schema = Yup.object().shape({
      title: Yup.string().min(5),
      description: Yup.string().min(5),
      localization: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    const parsedDate = parseISO(req.body.date);
    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Meetup date is on the past.' });
    }

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({
        error: err.message,
      });
    });
    await meetup.update(req.body);

    return res.json(meetup);
  }

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

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission do cancel this meetup",
      });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: "You can only cancel meetups that haven't already happened.",
      });
    }
    await meetup.destroy();
    return res.send();
  }
}

export default new MeetupController();
