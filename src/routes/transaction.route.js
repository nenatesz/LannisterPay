   // let getAllPaymentEntity = await FeeConfigurationSpec.find({$and: [{FeeCurrency: transactionData.Currency}, 
    //     {FeeEntity: transactionData.PaymentEntity.Type}, {EntityProperty: transactionData.PaymentEntity.Brand},
    //     {FeeLocale: localeType}
    // ]})


    // if (getAllPaymentEntity.length === 0){
    //      const getSomePaymentEntity = await FeeConfigurationSpec.find({$or: [{FeeCurrency: transactionData.Currency}, 
    //         {FeeEntity: transactionData.PaymentEntity.Type}, {EntityProperty: transactionData.PaymentEntity.Brand},
    //         {FeeLocale: localeType}
    //     ]})

    //     console.log("some")
    //     console.log("ang", getSomePaymentEntity)
        
    //     if (getSomePaymentEntity.length !== 0){

    //         //getAllPaymentEntity = getSomePaymentEntity.find(obj => {
    //         const min = getAllPaymentEntity = getSomePaymentEntity.reduce((prev, curr) => {
    //                console.log("min")
    //                 return prev.WildcardLen < curr.WildcardLen ? prev : curr;
    //                 }, 0)
    //             // obj.FeeID === min
    //         //})
    //         console.log("someLength", getAllPaymentEntity)

    //         // getAllPaymentEntity = getAllPaymentEntity.reduce((prev, curr) => {
    //         //     return prev.WildcardLen < curr.WildcardLen ? prev : curr;
    //         // })
    //     }

    //     // const getsomePaymentEntity = await FeeConfigurationSpec.findOne({FeeID: minId})
    //     // console.log(getsomePaymentEntity)
    // }
    //  console.log("TYPE", getAllPaymentEntity.FeeType)
    //  console.log("value", getAllPaymentEntity.FeeType)