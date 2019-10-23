import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import CreateSubscriptionService from '../services/CreateSubscriptionService';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
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
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      order: [[Meetup, 'date']],
    });
    return res.json(subscriptions);
  }

  async store(req, res) {
    const subscription = await CreateSubscriptionService.run({
      meetup_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(400).json({ error: "Subscription does'nt exists." });
    }
    if (subscription.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this subscription.",
      });
    }

    await subscription.destroy();

    return res.send();
  }
}

export default new SubscriptionController();
