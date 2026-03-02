import supertest from "supertest";
import { createTestUser, getMyUserAccount, getTestUser, removeTestUser } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if password is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if username is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "salah");
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should can get my account", async () => {
    const myAccount = await getMyUserAccount();

    const result = await supertest(web).get("/api/users/current").set("Authorization", `${myAccount.token}`);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("okaw");
    expect(result.body.data.name).toBe("Oka W");
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update user", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      name: "Ozu",
      password: "ozurahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Ozu");

    const user = await getTestUser();
    expect(await bcrypt.compare("ozurahasia", user.password)).toBe(true);
  });

  it("should can update user name only", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      name: "Oju",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Oju");
  });

  it("should can update user password only", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      password: "ojurahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");

    const user = await getTestUser();
    expect(await bcrypt.compare("ojurahasia", user.password)).toBe(true);
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "APA?").send({});

    expect(result.status).toBe(401);
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });
  it("should can logout user", async () => {
    const result = await supertest(web).delete("/api/users/logout").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).delete("/api/users/logout").set("Authorization", "salah");

    expect(result.status).toBe(401);
  });
});
