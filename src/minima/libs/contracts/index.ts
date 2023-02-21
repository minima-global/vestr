/**
 * All smart contracts leveraged by this app
 */

// Vesting Contract v1

export const vestingContract = {
  version: 1.0,
  cleanScript: `LET unlockaddress=PREVSTATE(0) LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) LET root=PREVSTATE(5) ASSERT SAMESTATE(0 5) IF root NEQ 0x21 AND SIGNEDBY(root) THEN RETURN TRUE ENDIF IF @BLOCK GTE finalblock THEN RETURN VERIFYOUT(@INPUT unlockaddress @AMOUNT @TOKENID FALSE) ENDIF IF @BLOCK LT startblock THEN RETURN FALSE ENDIF IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=totallockedamount/totalduration ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect LTE 0 THEN RETURN FALSE ENDIF IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF IF GETOUTAMT(@INPUT) GT cancollect THEN RETURN FALSE ENDIF IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF LET change=@AMOUNT-cancollect IF change LTE 0 THEN RETURN TRUE ENDIF LET changeoutput=@INPUT+1 IF GETOUTADDR(changeoutput) NEQ @ADDRESS THEN RETURN FALSE ENDIF IF GETOUTTOK(changeoutput) NEQ @TOKENID THEN RETURN FALSE ENDIF IF GETOUTAMT(changeoutput) LTE change THEN RETURN FALSE ENDIF IF GETOUTKEEPSTATE(changeoutput) NEQ TRUE THEN RETURN FALSE ENDIF RETURN TRUE`,
  checkMaths: `LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET cliffed=@BLOCK LT startblock LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=totallockedamount/totalduration ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET change=@AMOUNT-cancollect"`,
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
  
  IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF
  IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF
  IF GETOUTAMT(@INPUT) GT cancollect THEN RETURN FALSE ENDIF
  IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF

  LET change = @AMOUNT - cancollect
  IF change LTE 0 THEN RETURN TRUE ENDIF
  
  LET changeoutput = @INPUT+1
  IF GETOUTADDR(changeoutput) NEQ @ADDRESS THEN RETURN FALSE ENDIF
  IF GETOUTTOK(changeoutput) NEQ @TOKENID THEN RETURN FALSE ENDIF
  IF GETOUTAMT(changeoutput) LTE change THEN RETURN FALSE ENDIF
  IF GETOUTKEEPSTATE(changeoutput) NEQ TRUE THEN RETURN FALSE ENDIF

  RETURN TRUE
  `,
  scriptaddress:
    "0x5521B0750E1838DA532A6D6AD336A728F6CDC9DBE0A42190E23FE54F1B0CD24C",
};
