'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const Users = require("../models/users");
const Letters = require("../models/letters");

const should = chai.should();
chai.use(chaiHTTP);

let token;
describe('users', function () {
    Users.collection.drop();

    beforeEach(function (done) {
        let user = new Users({
            email: "test@gmail.com",
            password: "1234",
        });

        user.save(function (err) {
            chai.request(server)
                .post('/api/users/login')
                .send({ 'email': 'test@gmail.com', 'password': '1234' })
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    token = res.body.token;
                });
            done();
        })
    });

    afterEach(function (done) {
        Users.collection.drop();
        done();
    });

    it('one user should add with POST method', function (done) {
        chai.request(server)
            .post('/api/users/register')
            .send({ email: 'test@gmail.com', password: '1234', retypepassword: '1234' })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });

    it('one user should log in with the POST method ', function (done) {
        chai.request(server)
            .post('/api/users/login')
            .send({ 'email': 'test@gmail.com', 'password': '1234' })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.data.should.have.property('email');
                res.body.should.have.property('token');
                res.body.data.email.should.equal('test@gmail.com');
                done();
            });
    });

    it('should check token with the POST method', function (done) {
        chai.request(server)
            .post('/api/users/check')
            .set({ token: token })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('valid');
                res.body.should.have.property('data');
                done();
            });
    });


})

describe('letters', function () {
    Letters.collection.drop();

    beforeEach(function (done) {
        let letter = new Letters({
            letter: "A",
            frequency: '1.1',
        });

        letter.save(function (err) {
            done();
        })
    });

    afterEach(function (done) {
        // Letters.collection.drop();
        done();
    });

    it('one data should add with the POST method', function (done) {
        chai.request(server)
            .post('/api/data')
            .send({ 'letter': 'A', 'frequency': 1.1 })
            .set({ token: `${token}` })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('message');
                res.body.data.should.have.property('letter');
                res.body.data.should.have.property('frequency');
                res.body.data.should.have.property('_id');
                res.body.data.letter.should.equal('A');
                res.body.data.frequency.should.equal(1.1);
                done();
            });
    });

    it('should display all data with the GET method', function (done) {
        chai.request(server)
            .get('/api/data')
            .set({ token: `${token}` })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.data[0].should.have.property('letter');
                res.body.data[0].should.have.property('frequency');
                res.body.data[0].should.have.property('_id');
                done();
            })
    })

    it('should edit data with the PUT method', function (done) {
        chai.request(server)
            .get('/api/data')
            .set({ token: `${token}` })
            .end(function (err, res) {
                chai.request(server)
                    .put(`/api/data/${res.body.data[0]._id}`)
                    .send({ 'letter': res.body.data[0].letter, 'frequency': res.body.data[0].frequency })
                    .set({ token: `${token}` })
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.should.be.json;
                        done();
                    })
            })
    })

    it('should delete one data with the DELETE method', function (done) {
        chai.request(server)
            .get('/api/data')
            .set({ token: `${token}` })
            .end(function (err, res) {
                chai.request(server)
                    .delete(`/api/data/${res.body.data[0]._id}`)
                    .set({ token: `${token}` })
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data')
                        done();
                    })
            })
    })

    it('should displays all data with the GET method', function (done) {
        chai.request(server)
            .get('/api/data')
            .set({ token: `${token}` })
            .end(function (err, res) {
                chai.request(server)
                    .get(`/api/data/${res.body.data[0]._id}`)
                    .set({ token: `${token}` })
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.data.should.have.property('letter');
                        response.body.data.should.have.property('frequency');
                        response.body.data.should.have.property('_id');
                        done();
                    })
            })
    })

    it('should look for data with the POST method', function (done) {
        chai.request(server)
            .post('/api/data/search')
            .send({ 'letter': 'A', 'frequency': 1.1 })
            .set({ token: `${token}` })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data[0].should.have.property('letter');
                res.body.data[0].should.have.property('frequency');
                res.body.data[0].should.have.property('_id');
                done();
            });
    });


})