const MongoClient = require("mongodb").MongoClient;
const Staff = require("./staff")

describe("Staff Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:123abcdghhgg3455@sandbox.twx68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Staff.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})


	test("New staff registration (Security Guard)", async () => {
		const res = await Staff.register("Lee", "123456", "Security Guard");
		expect(res).toMatch("UserName is available");
	})

	test("New staff registration (Security Manager)", async () => {
		const res = await Staff.register("Jason", "123456", "Security Manager");
		expect(res).toMatch("UserName is available");
	})

	test("Duplicate username", async () => {
		const res = await Staff.register("Lee", "123456")
		expect(res).toMatch("UserName is already exist!!!");
	})

	test("Staff login invalid username", async () => {
		const res = await Staff.login("Le", "123456", "Gate A")
		expect(res).toMatch("Invalid username")
	})
	
	test("Staff login invalid password", async () => {
		const res = await Staff.login("Lee", "1234", "Gate A")
		expect(res).toBe("Invalid password")
	})

	test("Staff login successfully", async () => {
		const res = await Staff.login("Lee", "123456", "Gate A")
		expect(res[0].Position).toMatch("Security Guard")
		expect(res[0].UserName).toMatch("Lee")
	})


	test("Blaclist system for Security Manager", async () => {
		const res = await Staff.blacklist("Jack", "865732-03-6627", "Unit 3-19" , "Unauthorized Intruder")
		expect(res).toMatch("Blacklist Successfully")
	})

	test("Delete Visitor Record Successfully", async () => {
		const res = await Staff.delete_visitor_record("Yim")
		expect(res).toMatch("Delete Successfully")
	})

	test("Fail to delete Visitor Record Successfully", async () => {
		const res = await Staff.delete_visitor_record("Tan")
		expect(res).toMatch("Delete failed, the record is not exist")
	})
});