const supertest = require('supertest');
const request = supertest('http://localhost:3000');
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImEiLCJSb2xlIjoiU2VjdXJpdHkgTWFuYWdlciIsImlhdCI6MTY1NTYwOTExMywiZXhwIjoxNjg3MTY2NzEzfQ.4QNKC5jM1zUqAFlSSQl1gpbMUSPn8U0TcAqM88F_iRQ"

describe('Express Route Test', function () {


	it('Staff login failed (Security Manager)', async () => {
	return request
		.post('/login')
		.send({UserName: 'Taylor', Password: "12345", Venue: "Gate A"})
		.expect('Content-Type', /text/)
		.expect(400)
		.then(res => {expect(res.text).toBe("Invalid username or password")});	
	});


	it('Staff register (Security Manager)', async () => {
		return request
			.post('/register')
			.send({UserName: 'Taylor', Password: "123456", Position: "Security Manager"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {expect(res.text).toBe("Register successfully")});});

	it('Staff register failed', async () => {
		return request
			.post('/register')
			.send({UserName: 'Taylor', Password: "123456", Position: "Security Manager" })
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {expect(res.text).toBe("Username is already exist!!!");});});


	it('Staff login successfully (Security Manager)', async () => {
		return request
			.post('/login')
			.send({UserName:'Taylor', Password: "123456", Venue: "Gate A"})
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body.message).toBe("Success to login");});});
				

	it('New Visitor Record is added', async () => {
		return request
			.post('/visitor_register')
			.set('authorization', 'Bearer ' + token)
			.send({
				Name: "Yim" , 
				Gender: "Male", 
				Identification_Number: "994624-08-4579", 
				Phone_Number: "012-23456789", 
				Visiting_Venue: "Gate C",
				Vehicle_NO: "ABC123", 
				Vaccine_Status: "Vaccined",  
				Parking_lot_No: "A-12",
				Tenant: "Unit 3-19"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {expect(res.text).toBe('Visitor Record has been added');

		});});	


	it('Visitor is not added (Blacklist)', async () => { //Jack is exist in blacklist
		return request
			.post('/visitor_register')
			.set('authorization', 'Bearer ' + token)
			.send({
				Name: "Jack" , 
				Gender: "Male", 
				Identification_Number: "865732-03-6627", 
				Phone_Number: "012-23456789", 
				Visiting_Venue: "Gate C",
				Vehicle_NO: "ABC123", 
				Vaccine_Status: "Vaccined",  
				Parking_lot_No: "A-12",
				Tenant: "Unit 3-19"})
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {expect(res.text).toBe('Record is in the blacklist, fail to add!!!');

		});});	


	it('Test for authorization of Security Manager to blacklist ', async () => {
		return request
			.post('/blacklist')
			.set('authorization', 'Bearer ' + token)
			.send({Blacklisk_Username: "Jack", NRIC:"865732-03-6627", Tenant: "Unit 3-19", Blacklisted_Reason:"Unauthorized Intruder"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {expect(res.text).toBe('The visitor has been added into blacklist!');

		});});		



	it('Delete Visitor Record Successfully', async () => {
		return request
			.delete('/deletevisitorrecord')
			.set('authorization', 'Bearer ' + token)
			.send({Visitor_Name: "Yim"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(res => {expect(res.text).toBe('Delete Successfully');

		});});	

	it('Fail to Delete Visitor Record', async () => {
		return request
			.delete('/deletevisitorrecord')
			.set('authorization', 'Bearer ' + token)
			.send({Visitor_Name: "Yim Wen Long"})
			.expect('Content-Type', /text/)
			.expect(400)
			.then(res => {expect(res.text).toBe('Delete failed, the record is not exist');

		});});		

	it('Visitor record', async () => {
		return request
		.get('/visitor_record')
		.expect('Content-Type', /json/)
		.expect(200).then(response=> {
			expect(response.body[0].Name).toBe("Yim");
			expect(response.body[0].Gender).toBe("Male");
			expect(response.body[0].Identification_Number).toBe("994624-08-4579");
			expect(response.body[0].Parking_lot_No).toBe("A-12");
			expect(response.body[0].Phone_Number).toBe("012-23456789");
			;});});
					
})