const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

// TEST THAT THE /POST fee ENDPOINT RETURNS A SUCCESSFUL RESPONSE
describe('/POST Fee configuration setup', () => {
    it('it should post the fee conguration spec payload', (done) => {
        const feeConfigurationSpec = {
            "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
        }
        chai.request(server)
        .post('/fee')
        .send(feeConfigurationSpec)
        .end((err, res) => {
            expect(res).to.have.status(200);
        done();
        });
    });
});

// TEST THAT THE /POST compute-transaction-fee RETURNS A SUCCESSFUL RESPONSE
describe('/POST Compute transaction fee', () => {
    it('it should compute transaction fee', (done) => {
        const transactionPayload = {
            "ID": 91203,
            "Amount": 5000,
            "Currency": "NGN",
            "CurrencyCountry": "NG",
            "Customer": {
                "ID": 2211232,
                "EmailAddress": "anonimized29900@anon.io",
                "FullName": "Abel Eden",
                "BearsFee": true
            },
            "PaymentEntity": {
                "ID": 2203454,
                "Issuer": "GTBANK",
                "Brand": "MASTERCARD",
                "Number": "530191******2903",
                "SixID": 530191,
                "Type": "CREDIT-CARD",
                "Country": "NG"
            }
        }
        chai.request(server)
        .post('/compute-transaction-fee')
        .send(transactionPayload)
        .end((err, res) => {
            expect(res).to.have.status(200);
        done();
        });
    });
});

