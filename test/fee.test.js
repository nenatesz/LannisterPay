const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const FeeConfigurationSpec = require("../src/models/fee.model");
const expect = chai.expect;


chai.use(chaiHttp);
describe('Fee configuration setup', () => {
    it('it should post only when no empty fields with correct datatype', (done) => {
        do { 
            const rand = Math.floor(Math.random() * (1250 - 1221) + 1221);       
            formatId = "LNPY" + rand
            foundKey = await FeeConfigurationSpec.findOne({FeeID: formatId });
          } while (foundKey);
        const feeConfigurationSpec = {
            FeeID: "LNPY1221",
            FeeCurrency: "NGN",
            FeeLocale: "LOCL",
            FeeEntity: "CREDIT-CARD",
            EntityProperty: "MASTERCARD",
            FeeType: "FLAT",
            FeeValue: "50"
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