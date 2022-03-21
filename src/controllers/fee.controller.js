const db = require("../../db");

const feeConfigurationSpec = async (req, res) => {
    try{
      // GET REQUEST PAYLOAD 
      const feeConfigData = req.body.FeeConfigurationSpec;
      const objectsArray = [];

      // SPLIT THE PAYLOAD BY THE NEWLINE AND ADD INDIVIDUAL VALUES TO AN OBJECT
      const splitStr = feeConfigData.split("\n");    
          splitStr.map((str) => {
          const objj = {};
          const st = str.split(" ");
          const entityArr = st[3].split("(");
          objj.FeeID = st[0]; 
          objj.FeeCurrency = st[1];
          objj.FeeLocale = st[2];
          objj.FeeEntity = entityArr[0];
          objj.EntityProperty = entityArr[1].substring(0, entityArr[1].length-1);
          objj.FeeType = st[6];
          if(st[6] === "FLAT_PERC"){
            objj.FlatValue = parseFloat(st[7].split(":")[0]);
            objj.PercentValue = parseFloat(st[7].split(":")[1]);
          }
          else if (st[6] === "FLAT"){
            objj.FlatValue =  parseFloat(st[7]);
            objj.PercentValue =  0;
          }else{
            objj.PercentValue = parseFloat(st[7]);
            objj.FlatValue = 0;
          }

        // COUNT THE NUMBER OF ASTERISKS IN EACH FEE CONFIGURATION SPEC
        let objArr = Object.entries(objj)
        const filteredUser = objArr.filter(([key, value]) => {
            return value === "*"
        });
        const newObj = Object.fromEntries(filteredUser);
        const len = Object.keys(newObj).length
        objj.WildcardLen = len;

        //  PUSH CREATED OBJECTS INTO AN ARRAY FOR FURTHER PROCESSING
          objectsArray.push(objj)
          return objj
        });

        // GET THE INDIVIDUAL OBJECTS IN THE ObjectsArray TO BE ADDED TO THE SQLITE DATABASE
        let placeholders = objectsArray.map(item => `(${"'"}${item.FeeID}${"'"}, ${"'"}${item.FeeCurrency}${"'"}, ${"'"}${item.FeeLocale}${"'"}, ${"'"}${item.FeeEntity}${"'"}, ${"'"}${item.EntityProperty}${"'"}, ${"'"}${item.FeeType}${"'"}, ${item.WildcardLen}, ${item.PercentValue}, ${item.FlatValue})`)
        
        // WRITE THE SQL INSERT STATEMENT  
        let sql = "INSERT INTO FeeConfigurationSpec (FeeID, FeeCurrency, FeeLocale, FeeEntity, EntityProperty, FeeType, WildcardLen, PercentValue, FlatValue) VALUES " + placeholders

        // INSERT THE DATA INTO THE SQLITE DATABASE AND RETURN A CALLBACK FUNCTION
          db.run(sql, function(err) {
            if (err) {
              // RETURN ERROR CODE
              return res.status(400).json({
                    errors: [
                      {
                        msg: "FeeID Already Exists",
                      },
                    ],
                  });
            }

            console.log(`Rows inserted ${this.lastID}`);

            // RETURN SUCCESS CODE
            return res.status(200).json({status: "ok"});
          });      
    }catch(err){
      return res.status(400).json({
        errors: [
          {
            msg: "Error Saving Fee Configuration Specs",
          },
        ],
      });
    }
};


module.exports = {feeConfigurationSpec};
