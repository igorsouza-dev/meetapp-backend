import { parseISO, isBefore } from 'date-fns';
import RequestError from '../utils/RequestError';

import Meetup from '../models/Meetup';

class CreateMeetupService {
  async run({ date, body_inputs, user_id }) {
    const parsedDate = parseISO(date);

    if (isBefore(parsedDate, new Date())) {
      throw new RequestError(400, 'Meetup date is on the past.');
    }

    const inputs = { ...body_inputs, user_id };
    const meetup = await Meetup.create(inputs);
    return meetup;
  }
}

export default new CreateMeetupService();
