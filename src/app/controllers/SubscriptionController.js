import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

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
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(400).json({ error: "Meetup doesn't exists." });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup has already happened.' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe to your own meetup." });
    }

    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId, meetup_id: meetup.id },
    });

    if (subscriptions.length > 0) {
      return res
        .status(400)
        .json({ error: 'You are already subscribed to this meetup.' });
    }
    const sameTimeSubscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (sameTimeSubscriptions.length > 0) {
      return res.status(400).json({
        error: 'You are already subscribed to another meetup on the same date.',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });
    const organizer = meetup.User;
    const user = await User.findByPk(req.userId);
    await Mail.sendMail({
      to: `${organizer.name} <${organizer.email}>`,
      subject: 'New Subscription',
      template: 'subscription',
      context: {
        organizer: organizer.name,
        user: user.name,
        email: user.email,
        meetup: meetup.title,
      },
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
