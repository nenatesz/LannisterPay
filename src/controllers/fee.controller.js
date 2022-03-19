const FeeConfigurationSpec = require("../models/fee.model");

const feeConfigurationSpec = async (req, res) => {
    try{
            // GET FORM DATA   
    const feeConfigData = req.body.FeeConfigurationSpec;
    console.log(feeConfigData);
    let arrAll = [];
    let arrId = [];
    // DECLARE A VARIABE TO FORMAT FEE-ID
    // let formatId;

    // WHILE LOOP CHECKS IF CREATED RANDOM KEY EXISTS IN THE DATABASE. IF IT DOES A NEW KEY IS CREATED
    // do { 
    //     const rand = Math.floor(Math.random() * (1250 - 1221) + 1221);       
    //     formatId = "LNPY" + rand
    //     foundKey = await FeeConfigurationSpec.findOne({FeeID: formatId });
    //   } while (foundKey);

    // const str = "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
    const splitStr = feeConfigData.split("\n");
    console.log(splitStr)
    
       const feeConfigArr = splitStr.map((str) => {
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
            objj.FeeValue = [{isPercent: false, value: parseFloat(st[7].split(":")[0])},
                                {isPercent: true, value: parseFloat(st[7].split(":")[1])}
                            ]
        }
        else if (st[6] === "FLAT"){
            objj.FeeValue = [{isPercent: false, value: parseFloat(st[7])}]
        }else{
            objj.FeeValue = [{isPercent: true, value: parseFloat(st[7])}]
        }
        // 
        let objArr = Object.entries(objj)
       const filteredUser = objArr.filter(([key, value]) => {
           return value === "*"
       });
       const newObj = Object.fromEntries(filteredUser);
       const len = Object.keys(newObj).length
       objj.WildcardLen = len;
       console.log('newObj', newObj);
       console.log('LEN', len);

        arrAll.push(objj)
        arrId.push(objj.FeeID)
        return objj
      });
      console.log('ALL', arrAll)
      console.log('ID', arrId)

      const foundfeeconfig = await FeeConfigurationSpec.findOne({FeeID: {$in: arrId}});

      console.log("FOUND", foundfeeconfig)

      if(foundfeeconfig || foundfeeconfig !== null){
      return res.status(400).json({
          errors: [
            {
              msg: "Key exists",
            },
          ],
        });
      }

      const feeConfigurationSpec = await FeeConfigurationSpec.insertMany(arrAll)
      console.log('FCS', feeConfigurationSpec);
      if(feeConfigurationSpec.length !== 0){
        return res.status(400).json({
            errors: [
              {
                msg: "Error occured while creating fee configuration spec.",
              },
            ],
          });
      }
   

    // CREATE A NEW FEE CONFIGURATION SPEC
   

    // CHECK CREATION OF FEE CONFIGURATION SPEC WAS UNSUCCESSFUL
    

    // {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}    

    return res.status(200).json({status: "ok"});
    }catch(err){
        res.send(err)
    }
};


module.exports = {feeConfigurationSpec};

// {
//"FeeConfigurationSpec": 
//"LNPY1221 NGN * *(*) : APPLY PERC 1.4\n
//LNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\n
//LNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\n
//LNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100
//\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
// }

// {
    // Feeid: Llpy1223
    // Currency: Ngn
    // Locale: Locale
    // Payment type: credit card
    // Processor: *
    // Fees: [
    // {Percent: false,
    // Amount: 50},
    // {Percent: True,
    // Amount: 1.4}
    // ]
    // }

// Fees: [{Percent: False, Flat: 3.8}]