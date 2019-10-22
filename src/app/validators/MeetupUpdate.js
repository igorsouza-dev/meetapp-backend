import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string().min(5),
      description: Yup.string().min(5),
      localization: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
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
