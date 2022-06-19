
let visitor
var result;
let blacklist;
class Visitor {	

	static async injectDB(conn) {
		visitor = await conn.db("Residential_VMS").collection("Visitor_Record")
		blacklist= await conn.db("Residential_VMS").collection("Visitor_Blacklist_Record")
	}

	static async register(name, gender, NRIC, phone_number, visiting_venue, vehicle_no, vaccine_status, parking_lot, tenant) 
	{

		var blacklist_visitor= await blacklist.find( { $and: [ {Name: name}, {NRIC:NRIC} ] }).count();
		if (blacklist_visitor == 0)
		{
			const date = new Date();
			var visiting_time = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
			visiting_time=visiting_time.split("T");
			await visitor.insertOne({
				Name: name , 
				Identification_Number: NRIC, 
				Gender: gender, 
				Phone_Number: phone_number, 
				Vehicle_NO: vehicle_no, 
				Vaccine_Status: vaccine_status, 
				Visiting_Venue: visiting_venue, 
				Parking_lot_No: parking_lot, 
				Date: visiting_time[0], 
				Visiting_Time: visiting_time[1],
				Tenant: tenant});
			result = await visitor.aggregate([ 
				{ $match : {  
					Name: name, 
					Visiting_Time: visiting_time[0], 
					Visiting_Time: visiting_time[1] } }, 
					{$project : {_id: 0} }]).toArray();
			if (result[0].Name == name && result[0].Visiting_Time == visiting_time[1])
			{
				return "Register Successful";	
			}		
		}else{
			return "You are blacklisted"
		}		
	};
	
	static async record() 
		{

			return result;
		};
	
	
	}
module.exports = Visitor;