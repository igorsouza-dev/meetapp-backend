import Meetup from '../models/Meetup';
import Cache from '../../lib/Cache';

class OrganizerController {
  async index(req, res) {
    const cacheKey = `user:${req.userId}:meetups`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
    });

    await Cache.set(cacheKey, meetups);

    return res.json(meetups);
  }
}

export default new OrganizerController();
