//Filename : check.js
//Function : 检查输入栏位之正确性, 错误回传 false
/*包括 
◎基本资料
chkCode(fieldName,msg)       检查是否符合代号之规定,代号只能输入英文字母,数字  . - _  不符则回传 false
chkCodeND(fieldName,msg)     检查是否符合代号之规定,代号只能输入英文字母,数字  不符则回传 false
chkCodeNQ(fieldName,msg)     检查是否符合代号之规定,代号不能输入双引号  不符则回传 false
chkString(fieldName,msg)	   检查是否符合代号之规定,代号只能输入英文字母,数字 _ 不符则回传 false 
chkCombo(fieldName,msg)		   检查是否选择 combo box 	
chkEmail(fieldName,msg)      检查 E-Mail 信箱
chkIdNo(fieldName,msg)       检查身分证字号
chkInvoNo(fieldName,msg)     检查发票号码
chkUniformNo(fieldName,msg)    检查统一编号
chkKBoard(str)               检查是否为英文,数字及符号 (ASCII 33~127)等键盘上可视元件, 不是则回传 false
chkNull(fieldName,msg)       检查栏位是否为空值
chkPhone(fieldName,msg)      检查电话 : 设定电话号码格式如 0212345678, 不得有非数字之字元
chkURL(fieldName,msg)        检查 URL 是否合法
◎栏位长度
chkMinMaxLen(fieldName,minLen,maxLen,msg)  检查栏位长度之范围
chkMinLen(fieldName,msg)     检查栏位之最小长度
chkMaxLen(fieldName,msg)     检查栏位之最大长度
chkMaxLen_ChAware(fieldName,maxLen,msg) 检查栏位之最大长度(BIg5)
chkMaxLen_UTF_8_ChAware(fieldName,maxLen,msg) 检查栏位之最大长度(UTF-8)
trim(val) 去掉前后空白
◎数值
chkNum(fieldName,msg)        检查是否为数值
chkInt(fieldName,msg)        检查是否为整数值
chkPlusInt(fieldName,msg)    检查是否为'正整数'值, 不包括 0
chkMinMax(fieldName,minL,maxL,msg)         检查数值之范围
chkMinMaxE(fieldName,minL,maxL,msg)        检查数值之范围,包含等于
function chkNumSt(fieldName1,msg1,fieldName2,msg2) //检查两栏位数值
◎日期
chkDate(fieldName,msg,showMsg)       检查日期格式是否正确  ex.1971-04-27
oneBeforeTwo(fieldName1,msg1,fieldName2,msg2,showMsg) 检查日期1是否日期2在今天之前
isEqualsToday(fieldName,msg,showMsg) 检查日期是否为今天日期
isBeforeToday(fieldName,msg,showMsg) 检查日期是否在今天之前
isBeforeTodayByDays(fieldName)       计算日期是否在今天之前 n 天
isAfterToday(fieldName,msg,showMsg)  检查日期是否在今天之后 
compareDate(fileName1,msg1,fileName2,msg2,showMsg)  比较两日期之前后,其日期格式为yyyymm 
compareDate2(fileName1,msg1,fileName2,msg2,showMsg)  比较两日期之前后,其日期格式为yyyymm 

*/

var check_days = new Array(31,29,31,30,31,30,31,31,30,31,30,31);

//===== 基本资料 ===============================================================
//DEPRECATED   检查是否符合代号之规定,代号只能输入英文字母,数字  . - _  不符则回传 false 
//检查栏位是否为空值
function chkNull(fieldName,msg){
	if(document.all(fieldName).value == ""){
		alert("【"+msg+"】不可以空白!");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
		return false;
	}
	return true;
}

function chkCombo(fieldName,msg){
	var len=document.all(fieldName).length;
	var count=0;
	for(var i=0;i<len;i++){
		if(document.all(fieldName)[i].checked == false){ count++; 
	   }else{ return true;
		}
	}
	if(count == len){ alert("请选择【"+msg+"】!"); document.all(fieldName)[0].focus(); return false;
	}else{ return true;
	}
}

/*  deprecated 2001-12-27
function chkCode(str){
	var len=str.length;
	var flag=0;
	for(var i=0;i<len;i++){
		var no=str.charCodeAt(i);
		
		if((no>122)||(no<45)){    
		   return false;
		}else if((no>57)&&(no<65)){
		   return false;
		}else if(no==91){
		   return false;
		}else if((no>92)&&(no<97)){
		   return false;
		}else{
		   flag++;
		}
	}
	if(flag==len){ return true; 
	}else{ return false; }
}
*/

//检查是否符合代号之规定,代号只能输入英文字母,数字  . - _  不符则回传 false 
function chkCode(fieldName,msg){
  var str=document.all(fieldName).value;
  var len=str.length;
  var flag=0;
	for(var i=0;i<len;i++){
   	var no=str.charCodeAt(i);
    if((no>122)||(no<45)){    
      alert("【"+msg+"】只能输入英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if(no==47){
			// 47 means [/]
		  alert("【"+msg+"】只能输入英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if((no>57)&&(no<65)){
      alert("【"+msg+"】只能输入英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if((no>90)&&(no<95)){
      alert("【"+msg+"】只能输入英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if(no == 96){
			alert("【"+msg+"】只能输入英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else{
		   flag++;
		}
   }
   if(flag==len){ return true; 
   }else{ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }
}

//检查是否符合代号之规定,代号只能输入英文字母,数字 _ 不符则回传 false
function chkString(fieldName,msg){
	  var str=document.all(fieldName).value;
	  var len=str.length;
	  var flag=0;
		for(var i=0;i<len;i++){
	   	var no=str.charCodeAt(i);
	    if((no>122)||(no<48)){    
	      alert("【"+msg+"】只能输入英文字母,数字及 _");  document.all(fieldName).focus(); return false;
			}else if((no>57)&&(no<65)){
	      alert("【"+msg+"】只能输入英文字母,数字及 _");  document.all(fieldName).focus(); return false;
			}else if((no>90)&&(no<95)){
	      alert("【"+msg+"】只能输入英文字母,数字及 _");  document.all(fieldName).focus(); return false;
			}else if(no == 96){
				alert("【"+msg+"】只能输入英文字母,数字及 _");  document.all(fieldName).focus(); return false;
			}else{
			   flag++;
			}
	   }
	   if(flag==len){ return true; 
	   }else{ 
	      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
	   }
	}

//检查是否符合代号之规定,代号不能输入双引号   不符则回传 false 
function chkCodeNQ(fieldName,msg){
  var str=document.all(fieldName).value;
  var len=str.length;
  var flag=0;
	for(var i=0;i<len;i++){
   	var no=str.charCodeAt(i);
    if((no==34)){    
      alert("【"+msg+"】不能输入双引号");  document.all(fieldName).focus(); return false;
		}else{
		   flag++;
		}
   }
   if(flag==len){ return true; 
   }else{ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }
}

//检查 E-Mail 信箱
function chkEmail(fieldName,msg){
   var email=document.all(fieldName).value;
   var len=email.length;
   for(var i=0;i<len;i++)
   {  var c=email.charAt(i);
      if(!((c>="A"&&c<="Z")||(c>="a"&&c<="z")||(c>="0"&&c<="9")||(c=="-")||(c=="_")||(c==".")||(c=="@"))){
         alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
         //电子邮件地址只能是数字,英文字母及'-','_','.','@'等符号,其他的符号都不能使用 
      }   
   }
   if((len<8)||(len>50)){         //输入之电子邮件地址小于八码或大于50码
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if((email.indexOf("@")==-1)||(email.indexOf("@")==0)||(email.indexOf("@")==(len-1))){       //没有或第一个或最后一个字为@ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if((email.indexOf("@")!=-1)&&(email.substring(email.indexOf("@")+1,len).indexOf("@")!=-1)){ //有两个@ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if((email.indexOf(".")==-1)||(email.indexOf(".")==0)||(email.lastIndexOf(".")==(len-1))){   //没有或第一个或最后一个字为.
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if((email.indexOf("@.")!=-1)||(email.indexOf(".@")!=-1)||(email.indexOf("..")!=-1)){        //. 与 @ 或 .连在一起  
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }   
   return true;
} 

//检查 URL 是否合法
function chkURL(fieldName,msg){          
   var strUrl=document.all(fieldName).value; 
   var len=strUrl.length;
	if(len<10){                                                   //输入字数少于10    
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
	}else if((strUrl.indexOf('.',0)==-1)||(strUrl.indexOf(':',0)==-1)){ //未包括 . 与 ;
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;  
   }else if(strUrl.indexOf(' ',0)!=-1){                             //含有空白
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;   
	}else if((strUrl.indexOf('http://',0)!=0)&&(strUrl.indexOf('https://',0)!=0)&&(strUrl.indexOf('ftp://',0)!=0)&&(strUrl.indexOf('mailto:',0)!=0)&&(strUrl.indexOf('telnet://',0)!=0)&&(strUrl.indexOf('bbs:',0)!=0)&&(strUrl.indexOf('gopher://',0)!=0)&&(strUrl.indexOF('news://',0)!=0)&&(strUrl.indexOf('file://',0)!=0)){
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
	}
}
		
//检查身分证字号
function chkIdNo(fieldName,msg){
   var myid = document.all(fieldName).value;
   myid = myid.toUpperCase();            //先将 ID 转成大写
   if(myid.length!=10){           //身分证字号超过10个字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(myid.charAt(0)<"A" || myid.charAt(0)> "Z"){    //身分证字号第一码必须是英文字母
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(myid.charAt(1)!="1" && myid.charAt(1)!="2"){   //身分证字号第二码非 1 或 2
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(isNaN(myid.substring(1,10))){                  //身分证字号第二到十码非数字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }   
   var alph = new Array("A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","X","Y","W","Z","I","O");
   var num  = new Array("10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35");
   var n=0;
   for(i=0;i<alph.length;i++){
     if(myid.charAt(0)==alph[i])
        n=i;
   }     
   var tot1 = parseFloat(num[n].charAt(0)) + (parseFloat(num[n].charAt(1)) * 9);
   var tot2 = 0;
   for(i=1;i<myid.length-1;i++){
	    tot2 = tot2 + parseFloat(myid.charAt(i))*(9-i);
	}    
   var tot3 = parseFloat(myid.charAt(9));
   var tot4 = tot1 + tot2 + tot3;
   if((tot4 % 10)!=0){            //身分证字号有问题 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }    
   return true;
}

//检查发票号码
function chkInvoNo(fieldName,msg){
   var myInvo = document.all(fieldName).value;
   myInvo = myInvo.toUpperCase();            //先将 ID 转成大写
   
   if(myInvo.length!=10){           //身分证字号超过10个字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(myInvo.charAt(0)<"A" || myInvo.charAt(0)> "Z"){    //发票号码第一码必须是英文字母
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(myInvo.charAt(1)<"A" || myInvo.charAt(1)> "Z"){   //发票号码第二码必须是英文字母
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(isNaN(myInvo.substring(2,10))){                  //发票号码第三到十码非数字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }       
   return true;
}

//检查统一编号
function chkUniformNo(fieldName,msg){
   var myComNo = document.all(fieldName).value;
     
   if(myComNo.length!=8){           //统一编号超过8个字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(isNaN(myComNo)){                  //统一编号非数字 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }       
   return true;
}
	
//检查是否为英文,数字及符号 (ASCII 33~127)等键盘上可视元件, 不是则回传 false 
function chkKBoard(str){
   var len=str.length;
   var flag=0;
   for(var i=0;i<len;i++){
      var no=str.charCodeAt(i);
      if((no>127)||(no<33)){
         return false;
      }else{
         flag++;
      } 
   }
   if(flag==len){ return true;
   }else{ return false; }
}

//检查电话 : 设定电话号码格式如 0212345678, 不得有非数字之字元
function chkPhone(fieldName,msg){
   var phone=document.all(fieldName).value;
   var len=phone.length;
   if((isNaN(phone))||(len<9)||(len>10)){    //电话号码含有非数字, 固不接受 - ( ), 且只接受九码或十码
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }else if(phone.substring(0,1)!="0"){      //第一个字必须为 0
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }      
}

//===== 栏位长度 ===============================================================
//检查栏位长度之范围
function chkMinMaxLen(fieldName,minLen,maxLen,msg){
   if(!chkMinLen(fieldName,minLen,msg)){ return false;
   }else if(!chkMaxLen(fieldName,maxLen,msg)){ return false;
   }
   return true; 
}

//检查栏位之最小长度
function chkMinLen(fieldName,minLen,msg){
   if(document.all(fieldName).value.length<minLen){
      alert("【"+msg+"】至少输入 "+minLen+" 个字");
      document.all(fieldName).value="";
      document.all(fieldName).focus();
      return false;
   } 
   return true;  
}

//检查栏位之最大长度
function chkMaxLen(fieldName,maxLen,msg){
   if(document.all(fieldName).value.length>maxLen){
      alert("【"+msg+"】最多输入 "+maxLen+" 个字");
      document.all(fieldName).value = "";
      document.all(fieldName).focus();
      return false;
   }   
   return true;
}



//===== 数值 ===============================================================
//检查是否为数值
function chkNum(fieldName,msg){
	if(isNaN(document.all(fieldName).value)){
		alert("【"+msg+"】必须输入数值!");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
		return false;
	}
	return true;
}

//检查是否为整数值
function chkInt(fieldName,msg){
   if(chkNum(fieldName,msg)==false){
      return false;
   }else if(document.all(fieldName).value.indexOf('.')!=-1){
      alert("【"+msg+"】必须输入整数!");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
      return false;
   }    
   return true;  
}

//检查是否为'正整数'值, 不包括 0
function chkPlusInt(fieldName,msg){
   if(chkInt(fieldName,msg)==false){
      return false;
   }else if(document.all(fieldName).value<=0){
      alert("【"+msg+"】必须输入正整数!");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
      return false;
   }
}

//检查数值之范围
function chkMinMax(fieldName,minL,maxL,msg){
	if(document.all(fieldName).value > maxL || document.all(fieldName).value < minL){
		alert("【"+msg+"】请输入 "+minL+" 到 "+maxL+" 的数字");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
		return false;
	}
	return true;
}

function chkMinMaxE(fieldName,minL,maxL,msg){
	if(document.all(fieldName).value >= maxL || document.all(fieldName).value <= minL){
		alert("【"+msg+"】请输入 "+minL+" 到 "+maxL+" 之间的数字");
		document.all(fieldName).value = "";
		document.all(fieldName).focus();
		return false;
	}
	return true;
}




//检查两栏位数值
function chkNumSt(fieldName1,msg1,fieldName2,msg2){
  if(!(document.all(fieldName1).value < document.all(fieldName2).value)){
   alert("【"+msg2+"】需输入大于【"+msg1+"】的数字");
	document.all(fieldName2).value ="";
	document.all(fieldName2).focus();
	return false;
  }
  return true;
}




//===== 日期 ===============================================================
//检查日期格式是否正确  ex.1971-04-27
//检查日期是否符合规定
function isCorrectDate(Y,M,D){
   //var Y=year;            //var Y=parseInt(year);
   //var M=month;           //var M=parseInt(month);
   //var D=dat;             //var D=parseInt(dat);
   if((Y<1900)||(M<1)||(D<1)||(Y>2100)||(M>12)||(D>31)){return false;
   }else if((M==4)||(M==6)||(M==9)||(M==11)){return (D>30)?false:true;   //4, 6, 9, 11月有30天
   }else if((M==2)&&(((Y%4==0)&&(Y%100!=0))||(Y%400==0))){return (D>29)?false:true; //是否闰年                 //闰年2月29天, 其余28天
   }else if(M==2){return (D>28)?false:true;
   }else{return true;}
}
//检查日期格式是否正确  ex.1971-04-27
function chkDate(fieldName,msg, showMsg){
   var str=document.all(fieldName).value;
   var dateSpliter = str.substring(4,5);
   var theYear=str.substring(0,4);
   var theMonth=str.substring(5,7);
   var theDate=str.substring(8,10);
   //if((str.length!=10)||(str.charAt(4)!='-')||(str.charAt(7)!='-')){
	if((str.length!=10)||(str.charAt(4)!=dateSpliter)||(str.charAt(7)!=dateSpliter)){
      //alert("【"+msg+"】请输入 YYYY-MM-DD!");  document.all(fieldName).focus(); return false; 
	  if (showMsg) { alert("【"+msg+"】请输入 YYYY"+dateSpliter+"MM"+dateSpliter+"DD!"); }  
	  document.all(fieldName).focus(); 
	  return false; 
   }else if(isNaN(theYear)||isNaN(theMonth)||isNaN(theDate)){
      //alert("【"+msg+"】请输入 YYYY-MM-DD!");  document.all(fieldName).focus(); return false; 
	  if (showMsg) { alert("【"+msg+"】请输入 YYYY"+dateSpliter+"MM"+dateSpliter+"DD!"); }  
	  document.all(fieldName).focus(); 
	  return false; 
   }
   return true;
}

//检查日期格式是否正确  ex.1971/04/27 (added by mark 2005/09/15)
function chkSimpleDate(fieldName,msg,seperator){
	if(seperator==null) seperator = "-";
	var reg = new RegExp("(\\d{4})"+seperator+"(\\d{2})"+seperator+"(\\d{2})");

   	var str=document.all(fieldName).value;
	var res = str.match(reg);
	var bSuccess = false;
	var sError = "";
	if(res){
		try{
			bSuccess = isCorrectDate(parseInt(RegExp.$1,10),parseInt(RegExp.$2,10),parseInt(RegExp.$3,10));
		}catch(e){
			sError = e.toString();
		}
	}

	if(!bSuccess){
      	alert(sError+"【"+msg+"】请输入 YYYY"+seperator+"MM"+seperator+"DD!");
		document.all(fieldName).focus();
		return false; 
	}

	return true;
}


//检查日期格式(台湾的格式)是否正确  ex.94/09/01
function chkTwDate(fieldName,msg){
	var str=document.all(fieldName).value;
	var reg = /\d{2,3}\/(\d{2})\/(\d{2})/;
	var res = str.match(reg);
	//alert(res+", $1="+RegExp.$1+", $2="+RegExp.$2);
	if((!res) || (parseInt(RegExp.$1,10)<1) || (parseInt(RegExp.$1,10)>12) || (parseInt(RegExp.$2,10)<1) || (parseInt(RegExp.$2,10)>31)){
		alert("【"+msg+"】请输入 (Y)YY/MM/DD");
		document.all(fieldName).focus();
		return false; 
	}else{
		return true;
	}
}



//比较两日期之前后
function compareDate(Y1,M1,D1,msg1,Y2,M2,D2,msg2,showMsg){
   if(Y1>Y2){ 
      if(showMsg){ alert("【"+msg1+"】要在【"+msg2+"】之前 !");} 
      return false;
   }else if(Y1==Y2){
      if(M1>M2){
         if (showMsg) {alert("【"+msg1+"】要在【"+msg2+"】之前 !");}
         return false;
      }else if(M1==M2){
         if(D1>D2){
            if (showMsg) {alert("【"+msg1+"】要在【"+msg2+"】之前 !");} 
            return false;
         }
      }  
   } 
   return true;  
}

//比较两日期之前后,其日期格式为yyyymm 
function compareDate2(fileName1,msg1,fileName2,msg2,showMsg){
   var str1=document.all(fileName1).value;
   var theYear1 = str1.substring(0,4);
   var theMonth1 = str1.substring(5,7)
   var str2=document.all(fileName2).value;
   var theYear2 = str2.substring(0,4);
   var theMonth2 = str2.substring(5,7)
   
   if(theYear1>theYear2){ 
      if (showMsg) { alert("【"+msg1+"】要在【"+msg2+"】之前 !"); } 
      return false;
   }else if(theYear1==theYear2){
      if(theMonth1>theMonth2){
         if (showMsg) { alert("【"+msg1+"】要在【"+msg2+"】之前 !"); } 
         return false;
      }
    }  
   return true;  
}


//检查日期是否为今天日期
function isEqualsToday(fieldName,msg,showMsg){
   if(!chkDate(fieldName,msg,showMsg)){ return false; }
   var str=document.all(fieldName).value;
   var Y1=parseInt(str.substring(0,4),10);
   var M1=parseInt(str.substring(5,7),10);
   var D1=parseInt(str.substring(8,10),10);
   if(!isCorrectDate(Y1,M1,D1)){
      if (showMsg) {alert("【"+msg+"】输入错误!"); } 
      document.all(fieldName).focus(); 
      return false;
   }
   var Y2=new Date().getFullYear();
   var M2=new Date().getMonth()+1;
   var D2=new Date().getDate();
   var msg2="今天日期";
   if(Y1!=Y2 || M1!=M2 || D1!=D2 ){
   	if (showMsg) { alert("【"+msg+"】要与【"+msg2+"】相同 !"); } 
   	return false; 
   }
   return true;   
}

//检查日期是否在今天之前
function isBeforeToday(fieldName,msg,showMsg){
   if(!chkDate(fieldName,msg,showMsg)){ return false; }
   var str=document.all(fieldName).value;
   var Y1=parseInt(str.substring(0,4),10);
   var M1=parseInt(str.substring(5,7),10);
   var D1=parseInt(str.substring(8,10),10);
   if(!isCorrectDate(Y1,M1,D1)){
      if (showMsg) {alert("【"+msg+"】输入错误!"); } 
      document.all(fieldName).focus(); 
      return false;
   }
   var Y2=new Date().getFullYear();
   var M2=new Date().getMonth()+1;
   var D2=new Date().getDate();
   var msg2="今天日期";
   if(!compareDate(Y1,M1,D1,msg,Y2,M2,D2,msg2,showMsg)){ return false; }
   return true;   
}

//计算日期是否在今天之前 n 天
function isBeforeTodayByDays(fieldName) {
   if(!chkDate(fieldName,"日期资料",true)){ return false; }
   var str=document.all(fieldName).value;
   var Y1=parseInt(str.substring(0,4),10);
   var M1=parseInt(str.substring(5,7),10);
   var D1=parseInt(str.substring(8,10),10);
   if(!isCorrectDate(Y1,M1,D1)){
      alert("【日期资料】输入错误!"); 
      document.all(fieldName).focus(); 
      return false;
   }
   var Y2=new Date().getFullYear();
   var M2=new Date().getMonth()+1;
   var D2=new Date().getDate();
  
   var ds=((Y2*365)+(M2*30)+D2)-((Y1*365)+(M1*30)+D1)
   return ds;   
}


//检查日期是否在今天之后
function isAfterToday(fieldName,msg,showMsg){
   if(!chkDate(fieldName,msg,showMsg)){ return false; }
   var str=document.all(fieldName).value;   
   var Y2=parseInt(str.substring(0,4),10);
   var M2=parseInt(str.substring(5,7),10);
   var D2=parseInt(str.substring(8,10),10);
   if(!isCorrectDate(Y2,M2,D2)){
      if (showMsg) {alert("【"+msg+"】输入错误!");} 
      document.all(fieldName).focus(); 
      return false;
   }
   var Y1=new Date().getFullYear();
   var M1=new Date().getMonth()+1;
   var D1=new Date().getDate();
   var msg1="今天日期";
   if(!compareDate(Y1,M1,D1,msg1,Y2,M2,D2,msg,showMsg)){ return false; }
   return true;   
}

//检查日期1是否日期2在今天之前	
function oneBeforeTwo(fieldName1,msg1,fieldName2,msg2,showMsg){
   if(!chkDate(fieldName1,msg1,showMsg)){ return false; 
   }else if(!chkDate(fieldName2,msg2,showMsg)){ return false;
   }
   var str1=document.all(fieldName1).value;
   var Y1=parseInt(str1.substring(0,4),10);
   var M1=parseInt(str1.substring(5,7),10);
   var D1=parseInt(str1.substring(8,10),10);
   if(!isCorrectDate(Y1,M1,D1)){
      if (showMsg) { alert("【"+msg1+"】输入错误!"); } 
      document.all(fieldName1).focus();
      return false;
   }
   var str2=document.all(fieldName2).value;
   var Y2=parseInt(str2.substring(0,4),10);
   var M2=parseInt(str2.substring(5,7),10);
   var D2=parseInt(str2.substring(8,10),10);
   if(!isCorrectDate(Y2,M2,D2)){
      if (showMsg) { alert("【"+msg2+"】输入错误!"); } 
      document.all(fieldName2).focus();
      return false;
   }
   if(!compareDate(Y1,M1,D1,msg1,Y2,M2,D2,msg2,showMsg)){ return false; }
   return true;   
} 



//检查是否符合代号之规定,代号只能输入英文字母,数字   不符则回传 false 
function chkCodeND(fieldName,msg){
  var str=document.all(fieldName).value;
  var len=str.length;
  var flag=0;
	for(var i=0;i<len;i++){
   	var no=str.charCodeAt(i);
    if((no>122)||(no<48)){    
      alert("【"+msg+"】只能输入英文字母及数字");  document.all(fieldName).focus(); return false;
		}else if((no>57)&&(no<65)){
      alert("【"+msg+"】只能输入英文字母及数字");  document.all(fieldName).focus(); return false;
		}else if((no>90)&&(no<96)){
      alert("【"+msg+"】只能输入英文字母及数字");  document.all(fieldName).focus(); return false;
		}else{
		   flag++;
		}
   }
   if(flag==len){ return true; 
   }else{ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }
}

//检查是否符合代号之规定,代号不能输入双引号   不符则回传 false 
function chkCodeNQ(fieldName,msg){
  var str=document.all(fieldName).value;
  var len=str.length;
  var flag=0;
	for(var i=0;i<len;i++){
   	var no=str.charCodeAt(i);
    if((no==34)){    
      alert("【"+msg+"】不能输入双引号");  document.all(fieldName).focus(); return false;
		}else{
		   flag++;
		}
   }
   if(flag==len){ return true; 
   }else{ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }
}
//Added by Be.
function checkCode(fieldName,msg){
  var str=document.all(fieldName).value;
  var len=str.length;
  var flag=0;
	for(var i=0;i<len;i++){
   	var no=str.charCodeAt(i);
    if((no<45)){   //符号
      alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if(no==47){
			// 47 means [/]
		  alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if((no>57)&&(no<65)){
      alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if((no>90)&&(no<95)){
      alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if(no == 96){
			alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else if((no>122)&&(no<128)){
      alert("【"+msg+"】只能输入中英文字母,数字及 . - _");  document.all(fieldName).focus(); return false;
		}else{
		   flag++;
		}
   }
   if(flag==len){ return true; 
   }else{ 
      alert("【"+msg+"】输入错误!");  document.all(fieldName).focus(); return false;            
   }
}


// 去掉空白
function trim(val)
{
	// 去掉前面空白
	val=""+val
	var idx=val.indexOf(" ")
	while (idx==0)
	{
		val=val.substring(idx+1)
		idx=val.indexOf(" ")
	}
	// 去掉后面空白
	idx=val.length
	if (idx>0)
	{
		var ck=val.substring(idx-1)
		while (ck==" ")
		{
			val=val.substring(0,idx-1)
			idx=val.length
			ck=val.substring(idx-1)
		}
	}
	return val
}

// 将日期资料转换为天
function getDateToDays(str){
	var d = new Date(str);
    return parseInt(d.getTime() / (24 * 60 * 60 * 1000));
}

//将日期资料转为分钟
function getDateToTime(str)
{
	var Y1=parseInt(str.substring(0,4),10);
	var year=365
	if( ((Y1%4 == 0) && (Y1%100 != 0)) || (Y1%400 == 0) ){
		year=366
		check_days[1] = 29;
	} else{
		check_days[1] = 28;
	}	
	var s=str.substring(5,7);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var M1=parseInt(s,10);
	s=str.substring(8,10);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var D1=parseInt(s,10);
	//var days=(Y1*year)+D1
	var days=365*Y1+ ( parseInt(Y1/4) - parseInt(Y1/100) + parseInt(Y1/400) )+D1 ;
	
	for (var k=0;k<(M1-1);k++) {
		days +=check_days[k];
	}
		
	return days*24*60
	
}

//将时分资料转为分钟
function getHourToTime(str)
{
	var s=str.substring(0,2);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var t1=parseInt(s,10);
	s=str.substring(2,4);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var t2=parseInt(s,10);	
	return (t1*60)+t2;

}

// 如果是 button 的物件,则 Disabled 或 取消Disabled
function disabledButton(flag)
{
	for(i = 0; i < document.all.length; i++){
	   if (document.all(i).type=="button"){
	   	document.all(i).disabled=flag
		}
	}	
}

// 取得
function getObjectValue(fieldName){
	var obj = document.all(fieldName);
	if(obj==null){ return ""; }
	var objValue="";
	if(obj.length){
		for (i=0;i<obj.length;i++) {
			if (obj[i].checked) {
				objValue=obj[i].value;
				break;
			}
		}
	}else{
		if (obj.checked) objValue=obj.value;
	}
	
	return objValue;
}

//检查输入资料是否符合时间
function chkTime(fieldName)
{
	// 检查长度
	if (!chkMinMaxLen(fieldName,4,4,"时间资料")) {return false;}
	// 检查是否为数值资料
	if (!chkNum(fieldName,"时间资料")) {return false;}
	// 检查是否为时间范围资料
	var str=document.all(fieldName).value;
	var s=str.substring(0,2);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var t1=parseInt(s,10);
	s=str.substring(2,4);
	if (s.substring(0,1)=="0") s=s.substring(1,2);
	var t2=parseInt(s,10);	
	if ((t1>=0 && t1<24) && (t2>=0 && t2<60)) { return true;
	} else { 
		alert("【时间资料】输入错误!"); 
		return false;
	}	
}

//检查输入资料是否符合时间 HHmm
function chkSimpleTime(fieldName, msg){
	var reg = /(\d{2})(\d{2})/;
	var str=document.all(fieldName).value;
	var res = str.match(reg);
	if((!res) || (parseInt(RegExp.$1,10)>23) || (parseInt(RegExp.$2,10)>59)){
		alert("【"+msg+"】请输入正确格式 HHmm, ex: 1530");
		document.all(fieldName).focus();
		return false;
	}else{
		return true;
	}
}

//检查栏位之最大长度(Big5)
function chkMaxLen_ChAware(fieldName,maxLen,msg){
	var realLen = 0;
	var str = document.getElementById(fieldName).value;
	for(var i=0; i<str.length; i++){
      var no = str.charCodeAt(i);
      //if((no>127)||(no<33)){	// 非键盘上的字元就当成是双位元字
	  if(no>126){
		  realLen+=2;
	  }else{
		  realLen++;
	  }
	}

	if(realLen>maxLen){
      alert("【"+msg+"】最多输入 "+(maxLen/2)+" 个中文字或 "+maxLen+" 个英文字");
      document.all(fieldName).focus();
      return false;
	}else{
		return true;
	}
}
//检查栏位之最大长度(UTF_8)
	function chkMaxLen_UTF_8_ChAware(fieldName,maxLen,msg){
		var realLen = 0;
		var str = document.getElementById(fieldName).value;
		for(var i=0; i<str.length; i++){
	      var no = str.charCodeAt(i);
		  if(no>126){
			  realLen+=3;
		  }else{
			  realLen++;
		  }
		}
		if(realLen>maxLen){
	      alert("【"+msg+"】最多输入 "+(maxLen/3)+" 个中文字或 "+(maxLen+1)+" 个英文字");
	     // document.all(fieldName).focus();
	      return false;
		}else{
			return true;
		}
	}