import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
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
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      messages: err.inner,
    });
  }
};
