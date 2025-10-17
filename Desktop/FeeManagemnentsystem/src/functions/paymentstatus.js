const { app } = require('@azure/functions');
const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();


app.http('paymentstatus', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Payment status function invoked');
       const  StudentID = request.query.get('studentID') || (await request.json())?.studentID;
         if (!StudentID) {
        return context.res = { 
        status: 404, 
        body: { message: "Student ID required" } };
        }
        try {
              const pool = await sql.connect(process.env.SQL_CONNECTION_STRING , 
                context.log("Database connected")
              );
              context.log("hwloo");

      const result = await pool.request()
      .input('id', sql.Int, StudentID)
      .query(`SELECT Name, Course, TotalFee, PaidAmount, DueDate FROM STUDENT_TABLE WHERE StudentID = @id`);
   context.log(result);
      if(!result){
         return context.res = { 
        status: 404, 
        body: { message: "Student not found" } };
    }

     const studentdata = result.recordsets[0]
    context.log("studentdata:", studentdata);
     if(!studentdata){
        return context.res = {
            status: 400,
            body: {
                message: "studentdata not found"
            }
        }
     }
context.log("helloo after studentdata");
let status = "";

if(studentdata[0].TotalFee <=  studentdata[0].PaidAmount){
    status = "PAID"
}
//  context.log("helo from first if")


else if (studentdata[0].TotalFee > studentdata[0].PaidAmount){
   status =  "PARTIALLY PAID"
}
else if (new Date(studentdata[0].DueDate) < new Date() && studentdata[0].PaidAmount < studentdata[0].TotalFee) {
      status = "Overdue";
    }
context.log("last log")
    return {
          jsonBody: { 
            statuscode: 200, 
            Name: studentdata[0].Name,
            Course: studentdata[0].Course,
            TotalFee: studentdata[0].TotalFee,
            PaidAmount: studentdata[0].PaidAmount,
            DueDate: studentdata[0].DueDate,
            PaymentStatus: status
    }};
    } catch (error) {
    context.log.error("Database error:", error);
   return {
    jsonBody: { 
        statuscode: 500, 
        message: "Internal Server Error" 
    }
   }
}}})

// module.exports = paymentstatus;