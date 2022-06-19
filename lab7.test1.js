const supertest = require('supertest');
const request = supertest('http://localhost:3000');


    
describe('Express Route Test', function () {
	it('Http Get', async () => {
		return request
		.get('/read')
		.expect('Content-Type', /json/)
		.expect(200).then(response => {
			expect(response.body).toEqual(
				expect.objectContaining(
				[{
					"_id":"5c8eccc1caa187d17ca6ed17",
					"city":"BESSEMER",
					"zip":"35020",
					"loc":{"y":33.409002,"x":86.947547},
					"pop":40549,"state":"AL"}]));});});

	it('Http Post ', async () => {
		return request
			.post('/create')
			.send(({Name: "Yim",Age: 23 }))
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						"message" : 'Post request successful'
					}));});});

	it('Http Patch ', async () => {
		return request
			.patch('/update')
			.send(({Name: "Yim Wen Long"}))
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						"message" : 'Patch request successful'
					}));});})

	it('Http delete ', async () => {
		return request
			.delete('/delete')
			.send(({Age: "23"}))
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						"message" : 'Delete request successful'
					}));});})})