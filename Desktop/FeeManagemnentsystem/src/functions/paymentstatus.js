const { app } = require('@azure/functions');
const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();


app.http('paymentstatus', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
       const  studentid = request.query.get('studentid') || (await request.json())?.studentId; ;
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
let status = "";

if(studentdata.TotalFee <=  studentdata.PaidAmount){
    status = "PAID"
}
else if (studentdata.TotalFee > studentdata.PaidAmount){
   status =  "PARTIALLY PAID"
}
else if (new Date(s.DueDate) < new Date() && s.PaidAmount < s.TotalFee) {
      status = "Overdue";
    }

    context.res = {
      status: 200,
      body: {
        StudentID: studentId,
        Name: s.Name,
        Course: s.Course,
        TotalFee: s.TotalFee,
        PaidAmount: s.PaidAmount,
        DueDate: s.DueDate,
        PaymentStatus: status
      }
    };



        } catch (error) {
    context.log.error("Database error:", err);
    context.res = {
    status: 500,
    body: { error: "Internal server error" }
        }

    }}})