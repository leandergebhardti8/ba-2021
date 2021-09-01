/* eslint-disable no-undef */
const request = require("supertest")("https://ba-2021.herokuapp.com/api/");
const expect = require("chai").expect;


describe("API Tests", function() {
    describe("GET projects", function () {
        it("returns all projects", async function () {
            const response = await request.get("projects")

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
            done()
        });
    })

    describe("GET project", function () {
        it("returns project with id 1", async function () {
            const response = await request.get("project/1")

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
            done()
        })
    })

    describe("GET user", function () {
        it("returns user with username leander", async function () {
            const response = await request.get("user/leander")

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
            done()
        })
    })

    describe("POST project", function () {
        it("able to create a new project", async function () {
            const response = await request
                .post("project")
                .send({name: "Projekt for automated testing"})

            expect(response.status).to.eql(200)
            expect(response).to.not.be.empty;
            done()
        })
    })

    // describe("UPDATE project", function () {
    //     it("able to update a project", async function () {
    //         const savedProjects = await request.get("projects")
    //         let projectToUpdate = {}
    //         for(let i=0; i < savedProjects.length; i++) {
    //             if(savedProjects[i].name === "Project for automated testing")
    //             projectToUpdate = savedProjects[i]
    //         }
    //         const response = await request
    //             .put(`project/${projectToUpdate._id}`)
    //             .send({name: "Changed Projekt for automated testing"})

    //         expect(response.status).to.eql(200)
    //         done()
    //     })
    // })
})