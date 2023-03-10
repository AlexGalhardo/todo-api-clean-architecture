import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, it, expect, afterAll } from "vitest";

import app from "../../../src/app";
import { HttpStatusCode } from "../../../src/utils/HttpStatusCode";

describe("testing get all user todos", () => {
    it("it should return http status code 200 with correct json response object", async () => {
        const name = faker.internet.userName();
        const email = faker.internet.email();

        const userRegistredResponse = await request(app)
            .post("/api/user/register")
            .send({
                name,
                email,
                password: "test123",
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        expect(userRegistredResponse.statusCode).toBe(HttpStatusCode.CREATED);
        expect(userRegistredResponse.body.jwtToken).toBeDefined();

        const responseGetAllToDos = await request(app)
            .get("/api/todo/all")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${userRegistredResponse.body.jwtToken}`);

        expect(responseGetAllToDos.statusCode).toBe(HttpStatusCode.OK);

        afterAll(async () => {
            const response = await request(app)
                .delete(`/api/user/delete/${userRegistredResponse.body.id}`)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${userRegistredResponse.body.jwtToken}`);

            expect(response.statusCode).toBe(HttpStatusCode.OK);
            expect(response.body.success).toBeTruthy();
        });
    });
});
