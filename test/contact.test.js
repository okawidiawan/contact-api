import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createTestUser, removeAllTestContact, removeTestUser } from "./test-util.js";

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
