import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await contactService.create(user, request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(req.user);
    console.log(req.body);
    next(error);
  }
};

export default { create };
