import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

import RequestError from '../utils/RequestError';

class CreateSubscriptionService {
  async run({ meetup_id, user_id }) {
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!meetup) {
      throw new RequestError(400, "Meetup doesn't exists.");
    }

    if (meetup.past) {
      throw new RequestError(400, 'Meetup has already happened.');
    }

    if (meetup.user_id === user_id) {
      throw new RequestError(400, "You can't subscribe to your own meetup.");
    }

    const subscriptions = await Subscription.findAll({
      where: { user_id, meetup_id: meetup.id },
    });

    if (subscriptions.length > 0) {
      throw new RequestError(400, 'You are already subscribed to this meetup.');
    }
    const sameTimeSubscriptions = await Subscription.findAll({
      where: {
        user_id,
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
      throw new RequestError(
        400,
        'You are already subscribed to another meetup on the same date.'
      );
    }

    const subscription = await Subscription.create({
      user_id,
      meetup_id: meetup.id,
    });
    const organizer = meetup.User;
    const user = await User.findByPk(user_id);

    await Queue.add(SubscriptionMail.key, {
      organizer,
      user,
      meetup,
    });
    return subscription;
  }
}

export default new CreateSubscriptionService();
