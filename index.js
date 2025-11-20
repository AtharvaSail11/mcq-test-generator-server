	import express from 'express';
	import cors from 'cors';
	import questionGenerator from './api/questionGeneratorApi/questionGenerator.js'

	const app=express();
	const port=3000;
	app.use(cors());

	app.use('/api/generateQuestions',questionGenerator);

	app.get('/',(req,res)=>{
	res.send("Hello from server!");
	});

	app.listen(port,()=>{
	console.log("server started on port:",port);
	});
