const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json())

const dbPath = path.join(__dirname, "registrations.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5002, () => {
      console.log("Server Running at http://localhost:5002/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/registration/", async (request, response) => {
    const getRegistrationQuery = `
      SELECT
        *
      FROM
        registration
      ORDER BY 
        user_id;`;
    const usersArray = await db.all(getRegistrationQuery);
    response.send(usersArray);
  });

  app.get("/registration/:userId/", async (request, response) => {
    const { userId } = request.params;
    const getUserQuery = `
      SELECT
        *
      FROM
        registration
      WHERE
        user_id = ${userId};`;
    const user = await db.get(getUserQuery);
    response.send(user);
  });

  app.post("/registration/", async (request, response) => {
    const userDetails = request.body;
    const {
      user_id,
      Name,
      Email,
      Mobile,
      DOB,
      JobType,
    } = userDetails;
    const addUserQuery = `
      INSERT INTO
        registration (user_id, Name, Email, Mobile, Dob, JobType)
      VALUES
        (
          ${user_id},
          '${Name}',
          '${Email}',
           ${Mobile},
          '${DOB}',
          '${JobType}'
        );`;
  
    await db.run(addUserQuery);
    response.send("User Details Add SuccessFully");
  });

  app.put("/registration/:userId/", async (request, response) => {
    const { userId } = request.params;
    const userDetails = request.body;
    const {
      user_id,
      Name,
      Email,
      Mobile,
      DOB,
      JobType,
    } = userDetails;
    const updateUserQuery = `
      UPDATE
        registration
      SET
        user_id = ${user_id},
        Name = '${Name}',
        Email = '${Email}',
        Mobile = ${Mobile},
        Dob = '${DOB}',
        JobType = '${JobType}'
      WHERE
        user_id = ${userId};`;
    await db.run(updateBookQuery);
    response.send("User Details Updated Successfully");
  });

  app.delete("/registration/:userId/", async (request, response) => {
    const { userId } = request.params;
    const deleteUserQuery = `
      DELETE FROM
        registration
      WHERE
        user_id = ${userId};`;
    await db.run(deleteUserQuery);
    response.send("User Deleted Successfully");
  });

  module.exports = app;
