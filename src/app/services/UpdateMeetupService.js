import { parseISO, isBefore } from 'date-fns';

import RequestError from '../utils/RequestError';
import Meetup from '../models/Meetup';

class UpdateMeetupService {
  async run({ meetup_id, user_id, date, data }) {
    const meetup = await Meetup.findByPk(meetup_id);
    if (!meetup) {
      throw new RequestError(400, 'Meetup does not exists.');
    }

    if (meetup.user_id !== user_id) {
      throw new RequestError(
        401,
        "You don't have permission to change this meetup."
      );
    }

    if (meetup.past) {
      throw new RequestError(400, 'Meetup have already happened.');
    }

    const parsedDate = parseISO(date);
    if (isBefore(parsedDate, new Date())) {
      throw new RequestError(400, 'Meetup date is on the past.');
    }

    await meetup.update(data);
    return meetup;
  }
}

export default new UpdateMeetupService();
