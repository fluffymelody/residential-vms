const MongoClient = require("mongodb").MongoClient;
const Staff = require("./staff");
const Visitor = require("./visitor")
const jwt= require('jsonwebtoken')

function generateAccessToken(payload)
{
	return jwt.sign(payload, 'secretKey', {expiresIn: '1y'});
}

function verifyToken(req, res, next)
{
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token == null) return res.sendStatus(401)

	jwt.verify(token, 'secretKey', (err, user) => {
		if(err) return res.sendStatus(403)
		req.user=user
		next()
	})

}

MongoClient.connect(
	"mongodb+srv://m001-student:123abcdghhgg3455@sandbox.twx68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	Staff.injectDB(client);
	Visitor.injectDB(client)
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RVMS API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                jwt: {
                    type: 'http',
                    scheme: 'bearer',
                    in: 'header',
                    bearerFormat: 'JWT'
                }
            },
            security:[{"jwt":[]}]
        },
    },
    apis: ['./main.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/**
 * @swagger
 * /register:
 *   post:
 *     summary: For new staff to register
 *     description: Staff to register to VMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserName:
 *                 type: string
 *               Password:
 *                 type: string
 *               Position:
 *                 type: string
 *         
 *     responses:
 *       200:
 *         description: Register successfully
 *       400:
 *         description: Username is already exist!!!
 */

app.post('/register', async (req, res) => {

	const staff = await Staff.register(req.body.UserName, req.body.Password, req.body.Position); //register new staff (with position)
	if (staff == "UserName is available"){
		res.status(200).send("Register successfully");

	}else{
		res.status(400).send("Username is already exist!!!");
	}
})

/**
 * @swagger
 * /login:
 *   post:
 *     summary: For staff to log in
 *     description: Staff login to VMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserName:
 *                 type: string
 *               Password:
 *                 type: string
 *               Venue:
 *                 type: string
 *         
 *     responses:
 *       200:
 *         description: Success to login
 *       400:
 *         description: Invalid username or password
 */

 app.post('/login', async (req, res) => {
	// console.log(req.body);
	const staff = await Staff.login(req.body.UserName, req.body.Password, req.body.Venue);  //staff login
	if (staff == "Invalid username" || staff == "Invalid password"){
		res.status(400).send("Invalid username or password");
	}
	else
	{
		res.status(200).send({
			message: "Success to login",
			token: generateAccessToken({UserName: staff[0].UserName, Role: staff[0].Position })
		})
	}
})

/**
 * @swagger
 * /visitor_record:
 *   get:
 *     summary: To let visitor view their access record
 *     description: view  visitor record
 *     responses:
 *       200:
 *         description: View Visitor record successfully
 */

app.get('/visitor_record', async (req , res) => {    //for visitor to view the record
	var visitor= await Visitor.record();
	res.status(200).json(visitor)});

	



app.use(verifyToken);

/**
 * @swagger
 * /visitor_register:
 *   post:
 *     summary: To register new visitor
 *     security:
 *       - jwt: []
 *     description: Register visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Gender:
 *                 type: string
 *               Identification_Number:
 *                 type: string
 *               Phone_Number:
 *                 type: string
 *               Visiting_Venue:
 *                 type: string
 *               Vehicle_NO:
 *                 type: string
 *               Vaccine_Status:
 *                 type: string
 *               Parking_lot_No:
 *                 type: string
 *               Tenant:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor Record has been added
 *       400:
 *         description: Record is in the blacklist, fail to add!!!
 */
	
 app.post('/visitor_register',  async (req, res) => {      //register visitor, name in the blacklist cannot be register
	if (req.user.Role == "Security Manager" || req.user.Role == "Security Guard")
	{
		const visitor = await Visitor.register(
			req.body.Name, 
			req.body.Gender, 
			req.body.Identification_Number, 
			req.body.Phone_Number, 
			req.body.Visiting_Venue, 
			req.body.Vehicle_NO, 
			req.body.Vaccine_Status, 
			req.body.Parking_lot_No,
			req.body.Tenant);
		if (visitor == "Register Successful"){
			res.status(200).send("Visitor Record has been added")
		}else{
			res.status(400).send("Record is in the blacklist, fail to add!!!");}
	}
})

/**
 * @swagger
 * /allvisitorrecord:
 *   get:
 *     summary: To viw all existing visitor record
 *     security:
 *       - jwt: []
 *     description: view all visitor record
 *     responses:
 *       200:
 *         description: View all visitor record successfully
 */

 app.get('/allvisitorrecord',  async (req , res) => {    //for security guard to view the all the visitor record
	if (req.user.Role == "Security Manager" || req.user.Role == "Security Guard")
	{
		var visitor= await Staff.display_all_visitor_record();
		res.status(200).json(visitor)
	}});

/**
 * @swagger
 * /deletevisitorrecord:
 *   delete:
 *     summary: ONLY For Securiy Manager to delete
 *     security:
 *       - jwt: []
 *     description: Delete visitor record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Visitor_Name:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Delete Successfully
 *       400:
 *         description: Delete failed, the record is not exist
 *       403:
 *         description: You have no permission to delete the record
 */

 app.delete("/deletevisitorrecord",  async (req, res) => {   //delete the visitor record for today only , the same visitor record who had accessed yesterday cannot be deleted 
	if (req.user.Role == "Security Manager" )
	{
		var visitor= await Staff.delete_visitor_record(req.body.Visitor_Name);
		if (visitor == "Delete Successfully"){
			res.status(200).send("Delete Successfully")
		}else{
			res.status(400).send("Delete failed, the record is not exist");
		}
	}else{
			res.status(403).send("You have no permission to delete the record");
		}	
})	

/**
 * @swagger
 * /blacklist:
 *   post:
 *     summary: ONLY For Securiy Manager to blackist
 *     security:
 *       - jwt: []
 *     description: Blacklist visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Blacklist_Username:
 *                 type: string
 *               NRIC:
 *                 type: string
 *               Tenant:
 *                 type: string
 *               Blacklisted_Reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: "The visitor has been added into blacklist!"
 *       400:
 *         description: "You have no permission to blacklist!"
 */

app.post('/blacklist',   async (req, res) => { //only staff with position Security Manager can blacklist, security guard cannot blacklist visitor
	if (req.user.Role == "Security Manager" )
	{
		const staff = await Staff.blacklist(
			req.body.Blacklist_Username, 
			req.body.NRIC, 
			req.body.Tenant,
			req.body.Blacklisted_Reason
			); 
		if (staff == "Blacklist Successfully"){
			res.status(200).send("The visitor has been added into blacklist!");}
	}
	else{
		res.status(400).send("You have no permission to blacklist!");
	}})






app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

