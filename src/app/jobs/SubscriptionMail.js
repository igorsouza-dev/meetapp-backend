import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { organizer, user, meetup } = data;
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
  }
}

export default new SubscriptionMail();
