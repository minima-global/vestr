/**
 * All smart contracts leveraged by this app
 */

// Vesting Contract v1

export const vestingContract = {
  version: 1.0,
  cleanScript: `LET unlockaddress=PREVSTATE(0) LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) LET root=PREVSTATE(5) ASSERT SAMESTATE(0 8) ASSERT PREVSTATE(199) EQ STATE(199) IF root NEQ 0x21 AND SIGNEDBY(root) THEN RETURN TRUE ENDIF IF @BLOCK GTE finalblock THEN IF VERIFYOUT(@INPUT unlockaddress @AMOUNT @TOKENID FALSE) THEN RETURN TRUE ENDIF ENDIF IF @BLOCK LT startblock THEN RETURN FALSE ENDIF IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=SIGDIG(2(totallockedamount/totalduration)) ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect LTE 0 THEN RETURN FALSE ENDIF IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET payout=GETOUTAMT(@INPUT) IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF IF payout GT cancollect THEN RETURN FALSE ENDIF IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF LET change=@AMOUNT-payout IF change LTE 0 THEN RETURN TRUE ENDIF RETURN VERIFYOUT(@INPUT+1 @ADDRESS change @TOKENID TRUE)`,
  checkMaths: `LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(2) LET finalblock=PREVSTATE(3) LET minblockwait=PREVSTATE(4) LET rootkey=PREVSTATE(5) LET mustwaitblocks="0" LET isrooted=TRUE IF rootkey EQ 0x21 THEN LET isrooted=FALSE ENDIF LET mustwait=(@BLOCK - @COINAGE) LT minblockwait IF mustwait EQ TRUE THEN LET mustwaitblocks=minblockwait - (@BLOCK - @COINAGE) ENDIF  LET coinsage=@COINAGE  LET cliffed=@BLOCK LT startblock LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=SIGDIG(2 (totallockedamount/totalduration)) ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF LET change=@AMOUNT-cancollect LET totalsum = change + cancollect LET totalinput = @AMOUNT"`,
  checkMathsRoot: `LET desiredamount=PREVSTATE(1) LET change=@AMOUNT-desiredamount"`,
  script: `
  LET unlockaddress = PREVSTATE(0) 
  LET totallockedamount = PREVSTATE(1)
  LET startblock = PREVSTATE(2)
  LET finalblock = PREVSTATE(3)
  LET minblockwait = PREVSTATE(4)
  LET root = PREVSTATE(5)
  
  ASSERT SAMESTATE(0 8)

  ASSERT PREVSTATE(199) EQ STATE(199)
  
  IF root NEQ 0x21 AND SIGNEDBY ( root ) THEN RETURN TRUE ENDIF
  
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
    "0x0AE9DB120D6B6684BF1AA244050EADE5F5250B0C87AC572B9CBB7E012E17C7BC",
};
