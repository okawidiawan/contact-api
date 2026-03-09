import supertest from "supertest";
import { web } from "../src/application/web.js";
import { removeAlltestAddresses, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser, createTestAddress, getTestAddress } from "./test-util.js";

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

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAlltestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can get contact address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).get(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`).set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("Jalan Test");
    expect(result.body.data.city).toBe("Kota Test");
    expect(result.body.data.province).toBe("Provinsi Test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("12345");
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAlltestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`).set("Authorization", "test").send({
      street: "Ganti Jalan",
      city: "Ganti Kota",
      province: "Ganti Provinsi",
      country: "Ganti Negara",
      postal_code: "54321",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.street).toBe("Ganti Jalan");
    expect(result.body.data.city).toBe("Ganti Kota");
    expect(result.body.data.province).toBe("Ganti Provinsi");
    expect(result.body.data.country).toBe("Ganti Negara");
    expect(result.body.data.postal_code).toBe("54321");
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`).set("Authorization", "test").send({
      street: "Ganti Jalan",
      city: "Ganti Kota",
      province: "Ganti Provinsi",
      country: "",
      postal_code: "",
    });

    expect(result.status).toBe(400);
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
      .set("Authorization", "test")
      .send({
        street: "Ganti Jalan",
        city: "Ganti Kota",
        province: "Ganti Provinsi",
        country: "Ganti Negara",
        postal_code: "54321",
      });

    expect(result.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
      .set("Authorization", "test")
      .send({
        street: "Ganti Jalan",
        city: "Ganti Kota",
        province: "Ganti Provinsi",
        country: "Ganti Negara",
        postal_code: "54321",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAlltestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });
  it("should can remove address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web).delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`).set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAlltestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });
  it("should can show list of address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).get(`/api/contacts/${testContact.id}/addresses`).set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("should can reject if contact id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id + 1}/addresses`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
  });
});
