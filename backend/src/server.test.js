const request = require("supertest");
const { app, pool } = require("./server");

describe("API Endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  it("GET /health - devrait retourner le statut healthy", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "healthy");
  });

  it("GET /metrics - devrait retourner les métriques", async () => {
    const res = await request(app).get("/metrics");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("api_requests_total");
  });
});
