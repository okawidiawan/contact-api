import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web).post("/api/contacts").set("Authorization", "test").send({
      first_name: "test_contact",
      last_name: "tester",
      email: "tester@gmail.com",
      phone: "08123456789",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test_contact");
    expect(result.body.data.last_name).toBe("tester");
    expect(result.body.data.email).toBe("tester@gmail.com");
    expect(result.body.data.phone).toBe("08123456789");
  });

  it("should reject if request is not valid", async () => {
    const result = await supertest(web).post("/api/contacts").set("Authorization", "test").send({
      first_name: "",
      last_name: "test",
      email: "test@",
      phone: "08120000000081200000000812000000008120000000",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can get contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web).get(`/api/contacts/${testContact.id}`).set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("should return 404 if contact id is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id + 1}`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can update contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}`).set("Authorization", "test").send({
      first_name: "Oju",
      last_name: "Bezarius",
      email: "oju@gmail.com",
      phone: "085712345678",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("Oju");
    expect(result.body.data.last_name).toBe("Bezarius");
    expect(result.body.data.email).toBe("oju@gmail.com");
    expect(result.body.data.phone).toBe("085712345678");
  });

  it("should reject if data is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id + 1}`)
      .set("Authorization", "test")
      .send({
        first_name: "Oju",
        last_name: "Bezarius",
        email: "oju@gmail.com",
        phone: "085712345678",
      });
    expect(result.status).toBe(404);
  });

  it("should reject update if first_name is empty", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}`).set("Authorization", "test").send({
      first_name: "", // invalid
      last_name: "Updated",
      email: "updated@gmail.com",
      phone: "08123456789",
    });

    expect(result.status).toBe(400);
  });

  it("should reject update if first_name is too long", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id}`)
      .set("Authorization", "test")
      .send({
        first_name: "a".repeat(101), // > 100
        last_name: "Updated",
        email: "updated@gmail.com",
        phone: "08123456789",
      });

    expect(result.status).toBe(400);
  });

  it("should reject update if last_name is missing", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}`).set("Authorization", "test").send({
      first_name: "Updated",
      // last_name missing
      email: "updated@gmail.com",
      phone: "08123456789",
    });

    expect(result.status).toBe(400);
  });

  it("should reject update if email format is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put(`/api/contacts/${testContact.id}`).set("Authorization", "test").send({
      first_name: "Updated",
      last_name: "User",
      email: "bukan-email", // invalid format
      phone: "08123456789",
    });

    expect(result.status).toBe(400);
  });

  it("should reject update if phone is too long", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id}`)
      .set("Authorization", "test")
      .send({
        first_name: "Updated",
        last_name: "User",
        email: "updated@gmail.com",
        phone: "1".repeat(25), // > 20
      });

    expect(result.status).toBe(400);
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can remove contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web).delete(`/api/contacts/${testContact.id}`).set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it("should can reject if contact id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id + 1}`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(web).get("/api/contacts").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(20);
  });

  it("should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "test 1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(11);
  });
  it("should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(11);
  });

  it("should can search using phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "0812000001",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(11);
  });
});
