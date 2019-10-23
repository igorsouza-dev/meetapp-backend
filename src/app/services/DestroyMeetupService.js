import User from '../models/User';
import Meetup from '../models/Meetup';

import RequestError from '../utils/RequestError';

class DestroyMeetupService {
  async run({ meetup_id, user_id }) {
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    });

    if (!meetup) {
      throw new RequestError(400, 'Meetup does not exists.');
    }
    if (meetup.user_id !== user_id) {
      throw new RequestError(
        401,
        "You don't have permission do cancel this meetup."
      );
    }

    if (meetup.past) {
      throw new RequestError(
        400,
        "You can only cancel meetups that haven't already happened."
      );
    }
    await meetup.destroy();
  }
}

export default new DestroyMeetupService();
