import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string().required('The title is required'),
      description: Yup.string().required('The description is required'),
      localization: Yup.string().required('The localization is required'),
      date: Yup.date().required('The date is required'),
    });
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'Some information could not be validated!',
      messages: err.inner,
    });
  }
};
