const bcrypt= require("bcryptjs")
let staff;
let login;   
let blacklist;
let visitor;
const saltRound= 5
var hash_password;
class Staff {	
	static async injectDB(conn) {
		staff = await conn.db("Residential_VMS").collection("Staff_Record")
		login = await conn.db("Residential_VMS").collection("Login_Record")
		blacklist= await conn.db("Residential_VMS").collection("Visitor_Blacklist_Record")
		visitor = await conn.db("Residential_VMS").collection("Visitor_Record")

	}

	static async register(username, password, position) {
	{	
		bcrypt.genSalt(saltRound, function (saltError, salt){
			if (saltError){
				throw saltError
			}else{
			bcrypt.hash(password, salt, function(hashError, hash){
				if (hashError){
					throw hashError
				}else{
					hash_password=hash;
				}
			})}});
	
			var result = await staff.find({UserName: username}).count();	
			if (result == 0) {
				await staff.insertOne({UserName: username , Password: hash_password, Position: position})
				return "UserName is available";
			} else {
				return "UserName is already exist!!!";
			}
		}};


	static async login(username, password, venue) {
		var result = await staff.find({UserName: username}).count();
		if (result == 0) {
			return "Invalid username";
		}else
		{	
			var result = await staff.find({UserName: username}).toArray();
			let bool = bcrypt.compareSync(password, result[0].Password)
			if (bool == true){
				const date = new Date();
				var isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
				await login.insertOne({UserName: username , Gate_Name: venue, Login_Time: isoDate})				
				return await staff.aggregate(
					[ { $match : {UserName: username	}},{$project : {_id: 0} }, {$project : {Password: 0} }]).toArray();
			}else {
				return "Invalid password"}}}
	

	static async blacklist(Blacklist_Username, NRIC, Tenant, Blacklist_Reason) {
		{
			await blacklist.insertOne({Name: Blacklist_Username, NRIC: NRIC, Tenant: Tenant, Blacklisted_Reason:Blacklist_Reason})
			return "Blacklist Successfully"
		}}


	static async delete_visitor_record(name) {
		{
			const date = new Date();
			var today_date = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
			today_date=today_date.split("T");
			var result = await visitor.count( {Name: name} );
			if (result > 0) 
			{
				await visitor.deleteMany( { $and: [ {Name: name}, {Date:today_date[0]} ] } )
				return "Delete Successfully"
			}else
			{
				return "Delete failed, the record is not exist"
			}
						
		}}


	static async display_all_visitor_record() {
	{
		return await visitor.aggregate( [ {$project: {_id: 0}} ] ).toArray()
	}}

	

}
module.exports = Staff;