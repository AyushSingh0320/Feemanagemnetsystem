const { app } = require('@azure/functions');
const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();

app.http('updatetable', {
  methods: ['POST'],
  authLevel: 'anonymous', // We'll handle auth via Azure AD, not here
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { studentID, newPaidAmount } = body;

      if (!studentID || newPaidAmount == null) {
        return { status: 400, jsonBody: { error: "Missing required fields." } };
      }

      // Connect to SQL
      const pool = await sql.connect(process.env.SQL_CONNECTION_STRING,
        context.log("Database connected")
      );
     context.log("hwloo");
      // Update record
      const result = await pool.request()
        .input('id', sql.Int, studentID)
        .input('paid', sql.Int, newPaidAmount)
        .query(`UPDATE STUDENT_TABLE SET PaidAmount = @paid WHERE StudentID = @id`);

      context.log("result:", result);
      if (result.rowsAffected[0] === 0) {
        return { status: 404, jsonBody: { message: "Student not found." } };
      }
      context.log("Update successful" , result.rowsAffected);
      return {
        status: 200,
        jsonBody: { message: "Payment record updated successfully!" }
      };

    } catch (error) {
      context.log.error("Error updating record:", error);
      return { status: 500, jsonBody: { error: "Internal Server Error" } };
    }
  }
});
