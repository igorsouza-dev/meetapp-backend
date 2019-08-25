import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async index(req, res) {}

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

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
    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }

  async delete(req, res) {}
}

export default new SubscriptionController();
