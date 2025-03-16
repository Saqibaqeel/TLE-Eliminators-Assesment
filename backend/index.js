const express=require('express');
require('dotenv').config();
const cors=require('cors');
const connectDb = require('./utility/connectDb');
const contestRoutes=require('./routes/contestRoutes');

const app=express();


const port=process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ strict: false }));
app.use('/api/contests',contestRoutes);



app.listen(port,()=>{
    connectDb();
    console.log(`Server is running on port ${port}`);
    
})


