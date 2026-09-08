const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "testuser",
        email: "test@test.com",
        password: "123456",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("username", "testuser");
    });

    it("should return 400 if user exists", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "testuser",
        email: "test@test.com",
        password: "123456",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@test.com",
        password: "123456",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });
});
