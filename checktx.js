/* 	checktx.js by jimmyscratchlab@gmail.com
		checktx.js is licensed under the MIT License, see LICENSE.
*/

	var risk=0;
	
	function checkrules(tx,address)   
	{
		address = address.trim();
		checknodust(tx);
		checksmallmoney(tx,address);
		checkFee(tx);
		checksize(tx);
		checkNoTimelock(tx);
		reportRisk();
		showMiningNodesAndRelayedCount(tx); 
	}

	function filterYourTX(tx,address)
	{
		
		if(address == '')return true;
    var outs = tx.x.out;
    for (var i=0;i<outs.length;i++)
    {
      if(outs[i].addr == address)	return true;
    }
		return false;
	}

	function checknodust(tx)
  {
    var outs = tx.x.out;
    for (var i=0;i<outs.length;i++)
    {
      if(outs[i].value <= 5430)      
      {
        //writeToScreen('<span style="color: red;">RESPONSE: It has a dust output </span>');
				risk+=1;
				writeToChklist('<input type="checkbox"><a style="color: red;">no dust output </a>');				
				return;
      }
    }
			//writeToScreen('<span style="color: green;">RESPONSE: it has no dust output</span>');  
			writeToChklist('<input type="checkbox" checked><a style="color: green;"> no dust output </a>');	 
  }

	
	function checksmallmoney(tx,address)
	{
		var smallmoney = 100000;//satoshi
		if(address == '')return;
    var outs = tx.x.out;
    for (var i=0;i<outs.length;i++)
    {
      if(outs[i].addr == address)	
			{
				if(outs[i].value > smallmoney)
				{
					risk+=1;
					writeToChklist('<input type="checkbox" ><a style="color: red;">&lt;'+smallmoney/100000000+'BTC </a>');
				}else
				{
					writeToChklist('<input type="checkbox" checked><a style="color: green;">&lt;'+smallmoney/100000000+'BTC </a>');
				}
			}
    }

	}

	function checksize(tx)
	{
		var size = tx.x.size;
		if(size > 1000)
		{
			risk+=1;
			writeToChklist('<input type="checkbox"><a style="color: red;">size&lt;=1k </a>');
		}else
		{
			writeToChklist('<input type="checkbox" checked><a style="color: green;">size&lt;=1k </a>');	
		}

	}	

	function checkFee(tx)
	{
		var input_value=0,out_value=0;
    var inputs = tx.x.inputs,outs = tx.x.out;
    for (var i=0;i<inputs.length;i++)
    {
      input_value += inputs[i].prev_out.value;     
    }
    for (var i=0;i<outs.length;i++)
    {
      out_value += outs[i].value;     
    }
		if((input_value-out_value) < 10000){
			//TxFee=(input_value-out_value)/100000000;
			risk+=1;
			writeToChklist('<input type="checkbox"><a style="color: red;">txFee&gt;=0.0001BTC </a>');
		}else
		{
			writeToChklist('<input type="checkbox" checked><a style="color: green;">txFee&gt;=0.0001BTC  </a>');
		}
	}

	function checkNoTimelock(tx)
	{
		var timelock = tx.x.lock_time;
		if(timelock != 'Unavailable')
		{
			risk+=1;
			writeToChklist('<input type="checkbox"><a style="color: red;">no Timelock </a>');
		}else
		{
			writeToChklist('<input type="checkbox" checked><a style="color: green;">no Timelock </a>');	
		}
	}

	function showMiningNodesAndRelayedCount(tx)
	{
		//if(address == '')return true;
		var txhash = tx.x.hash;
		writeToChklist('<p>Please check tx status <iframe id="hiddenframe'+txhash+'"  src="http://blockchain.info/inv/'+txhash+'?format=json"  height="80" width="300"></iframe>. If relayed_count < 500 and mining_nodes < 6 then wait 1+ confirmations.....');//hidden
		
		$("#hiddenframe"+txhash).hover(
				function (){$(this).height(300);$(this).attr("src", $(this).attr("src"));},function (){$(this).height(100)}
			);
		//$("#hiddenframe"+txhash).load(function(){
		//alert($(this).contents());
			//$(this)//$(this).attr("src", $(this).attr("src"));
		//});


	}

	function reportRisk()
	{
		if(risk>0)writeToChklist('<a style="color: red;"> Please wait 1+ confirmations.....  </a>');
		risk=0;

	}
