# VESTR

Create a vesting contract, track your contracts, withdraw when available.

## Screenshots

![About us](screenshots/Screenshot%202023-06-02%20at%2000.28.06.png)
![Creator](screenshots/Screenshot%202023-06-02%20at%2000.28.17.png)

## Collect a Vestr Contract Manually

This is for users who have issues collecting on the Vestr App for any unique reasons.  This is a guide on how to collect the contract, explaining the steps thoroughly.

### State Variables

To begin, Vestr contracts consist of these state variables:

| State Variable | Description                                                |
|:----------------|:------------------------------------------------------------|
| 0              | Collector’s address                                        |
| 1              | Locking up amount                                          |
| 2              | Start contract block height                                |
| 3              | End contract block height                                  |
| 4              | Minimum time user must wait between collections (Blocks)   |
| 5              | Current time (unix)                                        |
| 6              | Starting block (unix)                                      |
| 7              | Grace period (unix) (This is state variable 4 but in unix) |
| 8              | End block (unix)                                           |
| 199            | Unique Identifier for Contract                             |

### Collecting Manually Step by Step

If you need more explanation on how the contract works, check the 2 sections below this one.
```
// create a new txn
txncreate id:customVestr
txninput id:customVestr coinid:collectingCoinid scriptmmr:true
txnoutput id:customVestr address:withrawalAddress amount:canCollectAmount tokenid:tokenId storestate:false

// if there is any amount left in the contract after add the change
txnoutput id:customVestr address:scriptAddress amount:change tokenid:tokenId storestate:true

// Add all the state variables, you can use the util fnc getStateVariable to help here
// if you are doing it by code, otherwise just add each state variable

txnstate id:customVestr port:0 value:${MDS.util.getStateVariable(
      coin,
      0
    )};
            txnstate id:customVestr port:1 value:${MDS.util.getStateVariable(
      coin,
      1
    )};
            txnstate id:customVestr port:2 value:${MDS.util.getStateVariable(
      coin,
      2
    )};
            txnstate id:customVestr port:3 value:${MDS.util.getStateVariable(
      coin,
      3
    )};
            txnstate id:customVestr port:4 value:${MDS.util.getStateVariable(
      coin,
      4
    )};                
            txnstate id:customVestr port:5 value:${MDS.util.getStateVariable(
      coin,
      5
    )};         
            txnstate id:customVestr port:6 value:${MDS.util.getStateVariable(
      coin,
      6
    )};         
            txnstate id:customVestr port:7 value:${MDS.util.getStateVariable(
      coin,
      7
    )};         
            txnstate id:customVestr port:8 value:${MDS.util.getStateVariable(
      coin,
      8
    )};         
            txnstate id:customVestr port:199 value:${MDS.util.getStateVariable(
      coin,
      199
    )};

txnpost id:${id};

txndelete id:${id}
```

### Smart Contract Preimage

```
  LET unlockaddress = PREVSTATE(0) // withdrawing address of contract
  LET totallockedamount = PREVSTATE(1) // the original total amount locked
  LET startblock = PREVSTATE(2) // the starting block of the contract
  LET finalblock = PREVSTATE(3) // the final block of the contract
  LET minblockwait = PREVSTATE(4) // the minimum block time we must wait between each collection

  ASSERT SAMESTATE(0 8) // Ensure that all state variables are the same transaction to transaction

  ASSERT PREVSTATE(199) EQ STATE(199) // Make sure that state variables 199 -> 199 are the same

  // If current block time greater than the final then allow collection for all
  IF @BLOCK GTE finalblock THEN
    IF VERIFYOUT (@INPUT unlockaddress @AMOUNT @TOKENID false) THEN RETURN TRUE ENDIF
  ENDIF

  // If current block less than the starting block then reject execution
  IF @BLOCK LT startblock THEN RETURN FALSE ENDIF

  // If the coin's age is less than the minimum block time wait then reject execution
  IF @COINAGE LT minblockwait THEN RETURN FALSE ENDIF

	// calculate the total duration of the contract  
  LET totalduration = finalblock - startblock

  // If the total duration is less than zero then that means the contract has finished
  // now allow them to collect the full amount
  IF totalduration LTE 0 THEN 
    LET blockamount = @AMOUNT 
  ELSE
  // otherwise make it so they can collect a partial according to the duration
    LET blockamount = SIGDIG(2 (totallockedamount / totalduration))
  ENDIF

  // We use SIGDIG(2 (amount)) which returns us the amount to 2 significant digits
  // this will evade mis-calculations and ignores the less significant digits
  // in the total amount they can collect
  // this is done because sometimes as they are constructing the contract
  // the block time recorded in this contract vs real time changes
  // and so this will error the contract

  // Let's calculate how much they can collect on this block
  LET owedamounttime = @BLOCK - startblock
  LET owedamountminima = owedamounttime * blockamount
  LET alreadycollected = totallockedamount - @AMOUNT
  LET cancollect = SIGDIG(2 (owedamountminima - alreadycollected))

  // If the cancollect amount is less than 0 then reject
  IF cancollect LTE 0 THEN RETURN FALSE ENDIF

  // If the cancollect is greater than the coin amount then let them collect all
  IF cancollect GT @AMOUNT THEN LET cancollect = @AMOUNT ENDIF

  // Let's verify all the outputs are valid
  LET payout = GETOUTAMT(@INPUT)

  IF GETOUTADDR(@INPUT) NEQ unlockaddress THEN RETURN FALSE ENDIF
  IF GETOUTTOK(@INPUT) NEQ @TOKENID THEN RETURN FALSE ENDIF
  IF payout GT cancollect THEN RETURN FALSE ENDIF
  IF GETOUTKEEPSTATE(@INPUT) NEQ FALSE THEN RETURN FALSE ENDIF

  LET change = @AMOUNT - payout

  // If there is no change then ignore check
  IF change LTE 0 THEN RETURN TRUE ENDIF

  // Now verify that the opposing output is true
  RETURN VERIFYOUT(@INPUT+1 @ADDRESS change @TOKENID TRUE)

```

### Calculations

The Smart Contract’s Maths calculation is as follows:

```
// This is a smart contract script written just to use the
// checkMaths Minima command to do the calculation for us using KISSVM Math
// This will ensure precision

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
```

We then use the `runscript` method to calculate this for us, this **only** runs the calculation

```
// you add the script we mentioned above, the previous state variables as if it was the actual coin, and we add the globals that the contract requires, e.g @BLOCK
// This contract requires globals: @AMOUNT, @BLOCK, @COINAGE 
runscript script:"theAboveScript" prevstate:addAllPreviousState globals:addAllGlobals
```
