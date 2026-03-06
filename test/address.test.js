import supertest from "supertest";
import { web } from "../src/application/web.js";
import { removeAlltestAddresses, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAlltestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).post(`/api/contacts/${testContact.id}/addresses`).set("Authorization", "test").send({
      street: "Jalan Test",
      city: "Kota Test",
      province: "Provinsi Test",
      country: "Indonesia",
      postal_code: "12345",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("Jalan Test");
    expect(result.body.data.city).toBe("Kota Test");
    expect(result.body.data.province).toBe("Provinsi Test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("12345");
  });

  it("should reject if address are invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).post(`/api/contacts/${testContact.id}/addresses`).set("Authorization", "test").send({
      street: "Jalan Test",
      city: "Kota Test",
      province: "Provinsi Test",
      country: "",
      postal_code: "",
    });

    expect(result.status).toBe(400);
  });

  it("should reject if contact id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id + 1}/addresses`)
      .set("Authorization", "test")
      .send({
        street: "Jalan Test",
        city: "Kota Test",
        province: "Provinsi Test",
        country: "Indonesia",
        postal_code: "12345",
      });

    expect(result.status).toBe(404);
  });
});
