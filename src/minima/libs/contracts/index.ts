/**
 * All smart contracts leveraged by this app
 */

// Vesting Contract v1

export const vestingContract = {
  version: 1.0,
  cleanScript: `LET unlockaddress=PREVSTATE(0) LET totallockedamount=PREVSTATE(1) LET startblock=PREVSTATE(3) LET finalblock=PREVSTATE(4) LET minblockwait=PREVSTATE(5) LET root=PREVSTATE(6) IF root NEQ 0x21 AND SIGNEDBY(root) THEN RETURN TRUE ENDIF IF @BLOCK GTE finalblock THEN RETURN VERIFYOUT(@INPUT unlockaddress @AMOUNT @TOKENID FALSE) ENDIF IF @BLOCK LT startblock THEN RETURN FALSE ENDIF IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF LET totalduration=finalblock-startblock IF totalduration LTE 0 THEN LET blockamount=@AMOUNT ELSE LET blockamount=totallockedamount/totalduration ENDIF LET owedamounttime=@BLOCK-startblock LET owedamountminima=owedamounttime*blockamount LET alreadycollected=totallockedamount-@AMOUNT LET cancollect=owedamountminima-alreadycollected IF cancollect LTE 0 THEN RETURN FALSE ENDIF IF cancollect GT @AMOUNT THEN LET cancollect=@AMOUNT ENDIF ASSERT VERIFYOUT(@INPUT cancollect unlockaddress @TOKENID FALSE) LET change=@AMOUNT-cancollect IF change EQ 0 THEN RETURN TRUE ENDIF RETURN VERIFYOUT(1 @ADDRESS change @TOKENID TRUE)`,
  script: `
    LET unlockaddress = PREVSTATE(0)
    LET totallockedamount = PREVSTATE(1)
    LET startblock = PREVSTATE(3)
    LET finalblock = PREVSTATE(4)
    LET minblockwait = PREVSTATE(5)
    LET root = PREVSTATE(6)
    
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
    
    ASSERT VERIFYOUT (@INPUT cancollect unlockaddress @TOKENID false) 
    
    LET change = @AMOUNT - cancollect
    IF change EQ 0 THEN RETURN TRUE ENDIF
    
    RETURN VERIFYOUT (1 @ADDRESS change @TOKENID true) 
  `,
  scriptaddress:
    "0xB1EDD0928405A93CC05F3D654C24EDA083BAAE7BF87ECD2ECBAAD90D6D851EA7",
};
