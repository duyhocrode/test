#check bear market
## profit = (amountPerBet * totalBear) - (totalRound * totalBear)

###case 1: total 29, win 18
select  Count(*) as totalRound from Round where rsi < 35;
select SUM(bearpayout) as  totalBear, Count(*) as totalWin from Round where rsi < 35 and  winner = "bear";

###case 2:
#check bull market: total 30, win 18
select  Count(*) as totalRound from Round where rsi > 60;
select SUM(bearpayout) as  totalbear, Count(*) as totalWin from Round where rsi > 60 and  winner = "bear";




