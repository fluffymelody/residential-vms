const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")

describe("Visitor Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:123abcdghhgg3455@sandbox.twx68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})


	test("Visitor record has been added", async () => {
		const res = await Visitor.register("Yim", "Male", "993462-08-6278", "012-3456789", "Gate A", "BAC345", "Booster", "G-15", "Unit 3-19");
		expect(res).toMatch("Register Successful");
	})

	test("Visitor record has been added", async () => {
		const res = await Visitor.register("Yim", "Male", "993462-08-6278", "012-3456789", "Gate A", "BAC345", "Booster", "G-15", "Unit 3-19");
		expect(res).toMatch("Register Successful");
	})

	test("Visitor is in the blacklist", async () => {   //Jack already exist in blacklist
		const res = await Visitor.register("Jack", "Male", "865732-03-6627", "012-3456789", "Gate A", "BAC345", "Booster", "G-15", "Unit 3-19"); 
		expect(res).toMatch("You are blacklisted");
	})

	test("Visitor record", async () => {
		const res = await Visitor.record();
		expect(res[0].Name).toBe("Yim");
        expect(res[0].Identification_Number).toBe("993462-08-6278");
        expect(res[0].Gender).toBe("Male");
        expect(res[0].Phone_Number).toBe("012-3456789");
        expect(res[0].Vehicle_NO).toBe("BAC345");
        expect(res[0].Vaccine_Status).toBe("Booster");
		expect(res[0].Visiting_Venue).toBe("Gate A");
		expect(res[0].Parking_lot_No).toBe("G-15");
		expect(res[0].Tenant).toBe("Unit 3-19")
	})



	
});