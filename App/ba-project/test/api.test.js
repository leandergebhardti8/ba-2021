/* eslint-disable no-undef */
const request = require("supertest")("https://ba-2021.herokuapp.com/api/");
const expect = require("chai").expect;


describe("API Tests", function() {
    describe("GET projects", function () {
        it("returns all projects", async function () {
            const response = await request.get("project")

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
        });
    })

    describe("GET user", function () {
        it("returns user with username leander", async function () {
            const response = await request.get("user/leander")

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
        })
    })

    describe("POST project", function () {
        it("able to create a new project", async function () {
            const response = await request
                .post("project")
                .send({name: "Projekt for automated testing"})

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
        })
    })
})