import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import CreateMeetupService from '../services/CreateMeetupService';
import UpdateMeetupService from '../services/UpdateMeetupService';
import DestroyMeetupService from '../services/DestroyMeetupService';

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
    const meetup = await UpdateMeetupService.run({
      meetup_id: req.params.id,
      user_id: req.userId,
      date: req.body.date,
      data: req.body,
    });

    return res.json(meetup);
  }

  async store(req, res) {
    const meetup = await CreateMeetupService.run({
      date: req.body.date,
      body_inputs: req.body,
      user_id: req.userId,
    });
    return res.json(meetup);
  }

  async delete(req, res) {
    await DestroyMeetupService.run({
      meetup_id: req.params.id,
      user_id: req.userId,
    });
    return res.send();
  }
}

export default new MeetupController();
