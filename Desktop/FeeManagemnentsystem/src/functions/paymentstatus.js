const { app } = require('@azure/functions');
const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();


app.http('paymentstatus', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
       const  studentid = request.query.studentid || request.body.studentid ;
         if (!studentid) {
        return context.res = { 
        status: 404, 
        body: { message: "Student ID required" } };
        }
        try {
              const pool = await sql.connect(process.env.SQL_CONNECTION_STRING , 
                console.log("Database connected")
              );
      const result = await pool.request()
      .input('id', sql.Int, studentid)
      .query(`SELECT Name, Course, TotalFee, PaidAmount, DueDate FROM Students WHERE StudentID = @id`);

      if(!result){
         return context.res = { 
        status: 404, 
        body: { message: "Student not found" } };
    }

     const studentdata = result.recordsets[0]

     if(!studentdata){
        return context.res = {
            status: 400,
            body: {
                message: "studentdata not found"
            }
        }
     }
console.log(studentdata);

if(studentdata.TotalFee == studentdata.PaidAmount){
    return "PAID"
}
else if (studentdata.TotalFee == studentdata.PaidAmount){

}




        } catch (error) {
            
        }

    }})