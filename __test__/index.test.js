// Import the js file to test
import { TestScheduler } from "jest";


const app = require('../src/server/index');
const supertest = require('supertest');
const request = supertest(app);

describe('testing parts of server/index.js', () => {
    test('async test', async done => {
        const response = await request.get('/testing');
        expect(response.body.text).toBe("correct");
        done();
    });
});