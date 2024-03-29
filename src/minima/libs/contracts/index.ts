/**
 * All smart contracts leveraged by this app
 */

// Vesting Contract v1

export const vestingContract = {
  version: 1.0,
  cleanScript: `LET unlockaddress=PREVSTATE(0) LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) ASSERT SAMESTATE(0 8) ASSERT PREVSTATE(199) EQ STATE(199) IF @BLOCK GTE finalblock THEN IF VERIFYOUT(@INPUT unlockaddress @AMOUNT @TOKENID FALSE) THEN RETURN TRUE ENDIF ENDIF IF @BLOCK LT startblock THEN RETURN FALSE ENDIF IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=SIGDIG(2(totallockedamount/totalduration)) ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=SIGDIG(2(owedamountminima-alreadycollected)) IF cancollect LTE 0 THEN RETURN FALSE ENDIF IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET payout=GETOUTAMT(@INPUT) IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF IF payout GT cancollect THEN RETURN FALSE ENDIF IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF LET change=@AMOUNT-payout IF change LTE 0 THEN RETURN TRUE ENDIF RETURN VERIFYOUT(@INPUT+1 @ADDRESS change @TOKENID TRUE)`,
  checkMaths: `
  LET totallockedamount=PREVSTATE(1) 
  LET startblock=PREVSTATE(2) 
  LET finalblock=PREVSTATE(3) 
  LET minblockwait=PREVSTATE(4) 
  LET mustwaitblocks="0"
  LET mustwait= (@BLOCK - @COINAGE) GT "0" AND minblockwait GT (@BLOCK - @COINAGE)
  LET contractexpired = @BLOCK GTE finalblock
  IF mustwait EQ TRUE THEN LET mustwaitblocks=minblockwait - (@BLOCK - @COINAGE) ENDIF
  
  LET coinsage=@COINAGE  
  LET cliffed=@BLOCK LT startblock 
  LET totalduration=finalblock-startblock 
  IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=SIGDIG(2 (totallockedamount/totalduration)) ENDIF 
  LET owedamounttime=@BLOCK-startblock 
  LET owedamountminima=owedamounttime*blockamount 
  LET alreadycollected=totallockedamount-@AMOUNT 
  LET cancollect=SIGDIG(2 (owedamountminima - alreadycollected)) 
  IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF 
  LET change=@AMOUNT-cancollect LET totalsum = change + cancollect LET totalinput = @AMOUNT
  
  IF contractexpired EQ TRUE THEN LET mustwait=FALSE ENDIF
  IF contractexpired EQ TRUE THEN LET cancollect=@AMOUNT ENDIF
  `,
  checkMathsRoot: `LET desiredamount=PREVSTATE(1) LET change=@AMOUNT-desiredamount`,
  script: `
  LET unlockaddress = PREVSTATE(0) 
  LET totallockedamount = PREVSTATE(1)
  LET startblock = PREVSTATE(2)
  LET finalblock = PREVSTATE(3)
  LET minblockwait = PREVSTATE(4)
  
  ASSERT SAMESTATE(0 8)

  ASSERT PREVSTATE(199) EQ STATE(199)
  
  IF @BLOCK GTE finalblock THEN
    IF VERIFYOUT (@INPUT unlockaddress @AMOUNT @TOKENID false) THEN RETURN TRUE ENDIF
  ENDIF
  
  IF @BLOCK LT startblock THEN RETURN FALSE ENDIF
  
  IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF
  
  LET totalduration = finalblock - startblock
  
  IF totalduration LTE 0 THEN 
    LET blockamount = @AMOUNT 
  ELSE
    LET blockamount = SIGDIG(2 (totallockedamount / totalduration))
  ENDIF
  
  LET owedamounttime = @BLOCK - startblock
  LET owedamountminima = owedamounttime * blockamount
  LET alreadycollected = totallockedamount - @AMOUNT
  LET cancollect = SIGDIG(2 (owedamountminima - alreadycollected))


  IF cancollect LTE 0 THEN RETURN FALSE ENDIF
  
  IF cancollect GT @AMOUNT THEN LET cancollect = @AMOUNT ENDIF

  LET payout = GETOUTAMT(@INPUT)    

  IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF
  IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF
  IF payout GT cancollect THEN RETURN FALSE ENDIF
  IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF

  LET change = @AMOUNT - payout  

  IF change LTE 0 THEN RETURN TRUE ENDIF


  RETURN VERIFYOUT(@INPUT+1 @ADDRESS change @TOKENID TRUE) 
  `,
  scriptaddress:
    "0x0A526BC4B5498147CDF9688C9FA3604642F823B8D8C95D9FDD83F4E3ECD3DF16",
};
