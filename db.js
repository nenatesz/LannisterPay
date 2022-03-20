const sqlite3 = require('sqlite3').verbose();


// OPEN THE DATABASE
let db = new sqlite3.Database('./db/feeConfig.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the feeConfigurationSpec database.');
  });

  db.run("CREATE TABLE FeeConfigurationSpec(FeeID text NOT NULL UNIQUE, FeeCurrency text NOT NULL, FeeLocale text NOT NULL, FeeEntity text NOT NULL, EntityProperty text NOT NULL, FeeType text NOT NULL, WildcardLen real NOT NULL, PercentValue real, FlatValue real)",
  function(err, result){
       if (err) {
        return console.log(err.message);
  }
  }
  )

module.exports = db;