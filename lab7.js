const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:123abcdghhgg3455@sandbox.twx68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async err => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to MongoDB')


	app.get('/read', async (req , res) => {
		const result= await client.db('sample_training').collection('zips').find({zip: '35020'}).toArray();
		res.status(200).json(result)});


	app.post('/create', async (req, res) => {
		console.log(req.body);	
		client.db('Lab_7').collection('HTTP').insertOne(req.body);
		const result= await client.db('Lab_7').collection('HTTP').count({Name: req.body.Name});
		if (result > 0){	
			res.status(200).json({
			message: 'Post request successful'});}})
	 
	app.patch('/update', async (req, res) => {
		await client.db('Lab_7').collection('HTTP').updateOne({Name: "Yim"}, {$set: {Name: req.body.Name}});
		const result= await client.db('Lab_7').collection('HTTP').count({Name: req.body.Name});
		if (result > 0){	
			res.status(200).json({
			message: 'Patch request successful'});}})
		})

	app.delete('/delete', async (req, res) => {
		client.db('Lab_7').collection('HTTP').deleteOne({Age : req.body.Age});
		const result= await client.db('Lab_7').collection('HTTP').count({Age: req.body.Age});
		if (result == 0){	
			res.status(200).json({
			message: 'Delete request successful'});}})
	
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)});

