CREATE TABLE Round
(
    roundid        INT PRIMARY KEY,
    start          DATETIME,
    close          DATETIME,
    lockprice      DECIMAL(10, 2),
    closeprice     DECIMAL(10, 2),
    bullamount     DECIMAL(10, 2),
    bearamount     DECIMAL(10, 2),
    winner         VARCHAR(255),
    bullpayout     DECIMAL(10, 2),
    bearpayout     DECIMAL(10, 2),
    rsi            DECIMAL(10, 2),
    realprice      DECIMAL(10, 2),
    rsiclose       DECIMAL(10, 2),
    realpriceclose DECIMAL(10, 2)
);
