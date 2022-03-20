
SELECT * 
FROM FeeConfigurationSpec WHERE (FeeCurrency = 'NGN' OR FeeCurrency = '*') AND (FeeLocale = 'LOCL' OR FeeLocale = '*') AND (FeeEntity = 'CREDIT-CARD' OR FeeEntity = '*') AND (EntityProperty = 'VISA' OR EntityProperty = '*') 
ORDER BY WildcardLen 
LIMIT 1