import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string()
        .min(5)
        .max(255),
      description: Yup.string()
        .min(25)
        .max(255),
      localization: Yup.string().min(5),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    return res.status(400).json({
      error: `Some information could not be validated: ${err.inner
        .map(error => error.message)
        .join(', ')}`,
    });
  }
};
