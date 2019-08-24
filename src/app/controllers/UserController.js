import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Some information could not be validated!' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'E-mail is already in use.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email('Not a valid e-email'),
      oldPassword: Yup.string()
        .min(6)
        .when('password', (password, oldPassword) =>
          password
            ? oldPassword.required('The old password is required')
            : oldPassword
        ),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().when(
        'password',
        (password, confirmPassword) =>
          password
            ? confirmPassword
                .required('Confirmation password is required.')
                .oneOf([Yup.ref('password')])
            : confirmPassword
      ),
    });
    await schema.validate(req.body).catch(err => {
      return res.status(400).json({
        error: err.message,
      });
    });

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail is already in use.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Old password does not match!' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
