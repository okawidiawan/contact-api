import { validate } from "../validation/validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation } from "../validation/address-validation.js";

const create = async (user, contactId, request) => {
  contactId = validate(getContactValidation, contactId);

  const isContactAvailable = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (isContactAvailable !== 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  const address = validate(createAddressValidation, request);
  address.contact_id = contactId;

  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default { create };
