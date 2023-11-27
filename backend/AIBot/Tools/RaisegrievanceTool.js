// Summary,Dept
// username user location room id

import { DynamicTool } from "langchain/tools";
import mongoose from "mongoose";
import Grievance from "../../db_schemas/grievanceModel.js";

const mongoDBConnectionURL = process.env.mongodb_connection_url;

mongoose.connect(mongoDBConnectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getRaiseGrievanceTool = () => {
  return new DynamicTool({
    name: "RaiseGrievance",
    description: `Call this function to raise a grievance. call it with atleast two parameters: {summaryOfGrievance} and {departmentOrTeamToApproach} and {locationOfHuman} and {emailOfDepartment} and {roomId} and {grievanceName} `,
    func: async (summaryOfGrievance) => {
      try {
        var keyValuePairs = summaryOfGrievance.replace(/[{}]/g, "").split(",");
        var dataObject = {};
        keyValuePairs.forEach(function (pair) {
          var [key, value] = pair.split(":");
          if(value&&key){
            dataObject[key.trim()] = value.trim();
          }
        });
        console.log(dataObject);
        const grievance = new Grievance({
          summary: dataObject.summaryOfGrievance,
          team: dataObject.departmentOrTeamToApproach,
          email:dataObject.emailOfDepartment,
          roomId:dataObject.roomId,
          grievanceName:dataObject.grievanceName
        });
        await grievance.save();

        console.log("Grievance raised successfully");
        return "Grievance raised successfully";
      } catch (err) {
        console.error("Error raising grievance:", err.message);
        return "Error raising grievance";
      }
    },
  });
};

const raiseGrievanceTool = getRaiseGrievanceTool();

export { raiseGrievanceTool };
