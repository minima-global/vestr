/**
 * All smart contracts leveraged by this app
 */

// Vesting Contract v1

export const vestingContract = {
  version: 1.0,
  cleanScript: `LET unlockaddress=PREVSTATE(0) LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) LET root=PREVSTATE(5) ASSERT SAMESTATE(0 5) IF root NEQ 0x21 AND SIGNEDBY(root) THEN RETURN TRUE ENDIF IF @BLOCK GTE finalblock THEN RETURN VERIFYOUT(@INPUT unlockaddress @AMOUNT @TOKENID FALSE) ENDIF IF @BLOCK LT startblock THEN RETURN FALSE ENDIF IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=totallockedamount/totalduration ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect LTE 0 THEN RETURN FALSE ENDIF IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET payout=GETOUTAMT(@INPUT) IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF IF payout GT cancollect THEN RETURN FALSE ENDIF IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF LET change=@AMOUNT-payout IF change LTE 0 THEN RETURN TRUE ENDIF RETURN VERIFYOUT(@INPUT+1 @ADDRESS change @TOKENID TRUE)`,
  checkMaths: `LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) LET mustwait=@COINAGE LT minblockwait  LET cliffed=@BLOCK LT startblock LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=totallockedamount/totalduration ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET change=@AMOUNT-cancollect"`,
  checkMathsRoot: `LET desiredamount=PREVSTATE(1) LET change=@AMOUNT-desiredamount"`,
  script: `
  LET unlockaddress = PREVSTATE(0) 
  LET totallockedamount = PREVSTATE(1)
  LET startblock = PREVSTATE(2)
  LET finalblock = PREVSTATE(3)
  LET minblockwait = PREVSTATE(4)
  LET root = PREVSTATE(5)
  
  ASSERT SAMESTATE(0 5)
  
  IF root NEQ 0x21 AND SIGNEDBY ( root ) THEN RETURN TRUE ENDIF
  
  IF @BLOCK GTE finalblock THEN
    RETURN VERIFYOUT (@INPUT unlockaddress @AMOUNT @TOKENID false)
  ENDIF
  
  IF @BLOCK LT startblock THEN RETURN FALSE ENDIF
  
  IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF
  
  LET totalduration = finalblock - startblock
  
  IF totalduration LTE 0 THEN 
    LET blockamount = @AMOUNT 
  ELSE
    LET blockamount = totallockedamount / totalduration
  ENDIF
  
  LET owedamounttime = @BLOCK - startblock
  LET owedamountminima = owedamounttime * blockamount
  LET alreadycollected = totallockedamount - @AMOUNT
  LET cancollect = owedamountminima - alreadycollected
  
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
    "0x2543362CE73B6B148C0D86F6C6B1C4EB5F9803B6306A329FAF1ACC4ED864D2B1",
};
