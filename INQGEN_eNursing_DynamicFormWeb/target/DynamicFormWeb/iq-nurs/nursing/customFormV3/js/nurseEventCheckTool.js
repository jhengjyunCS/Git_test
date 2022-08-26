/*
所有 Nurse Event 在网页中使用的 function
function getDate_old(value,selType,nowDate,nowTime)	呼叫万年历
function getDate(value,selType,nowDate,nowTime,url)     呼叫万年历(for万芳用)
function addSelectData(dataType,title,val)    	将输入的项目加入 Select 物件中
function updateSelectData(dataType,title,val)	将输入的项目更新至 Select 物件指定的项目中
function getSelectDataValue(dataType)         	将编辑资料组成 Select 使用的字串项目(整批输入时使用)
function onDateChange(DateValue,nowDate,nowTime)        检查输入日期(如果系统时间<10:00则可以输入前一日资料)(for万芳用)
function checkTime_old(fieldName,DateValue,nowDate,nowTime)	检查输入时间是否异常
function checkTime(fieldName,DateValue,nowDate,nowTime)     检查输入时间是否异常(for万芳用)
function showReasonItem(selType,selTab,fm)        是否显示无法测量原因项目(类型,栏位名,FormName)
function showData(selType)	呼叫显示确认页面(Vital Sign , Coma Scale 输入完成的确认画面处理)
function checkLen(fieldName,msg)	      检查 输入的身高体重腹围资料是否错误
function chkDataOnly(dataType,type,datetime,funType)	      检查 日期时间记录是否已存在	
*/

// 是否需要检查日期 0:要检查 1:不检查 2:仅可<系统日一天,但不限系统时间是否<9点
var nurseTools_isCheckDate=0
var checktime = '2400'
var globalDataPath = 'frame/calendar1.htm';
// 开启引流管种类,部位视窗
function openDrainage(url, filename, vType)
{
    var wh="center:yes;dialogLeft:30;dialogTop:450;dialogWidth:25;dialogHeight:18"
    var getNumV = window.showModalDialog(url + '?type='+vType,'',wh)
    if (getNumV  && getNumV != null)	{
        var s="document.all('"+filename+"').value='"+getNumV+"'"
        eval(s)
    } else {
        var s="document.all('"+filename+"').value=''"
        eval(s)
    }
}

//== usage outside: I/O, OTHERS =======start==========
// 检视字串长度
function countLen(title){
    var realLen=0;
    for (var i = 0; i < title.length; i++) {
        var no = title.charCodeAt(i);
        //if((no>127)||(no<33)){	// 非键盘上的字元就当成是双位元字
        if (no > 126) {
            realLen += 2;
        } else {
            realLen++;
        }
    }
    return realLen;
}

// 将输入的项目加入 Select 物件中
function addSelectData(dataType, title, val) {
    var selectObj = document.all(dataType);
    for (var i = selectObj.length; i > 0; i--)
    {  //将所有资料往后移一个位置
        var oldvalue = selectObj.options[i - 1].value;
        var oldtext = selectObj.options[i - 1].text;
        selectObj.options[i] = new Option(oldtext);
        selectObj.options[i].value = oldvalue;
    }
    if(countLen(title)>50 ){
        title= title.substring(0,50)+"‧‧‧";
    }
    // 将新增资料加入第一个位置
    selectObj.options[0] = new Option(title);
    selectObj.options[0].value = val;
}

// 将输入的项目更新至 Select 物件指定的项目中
function updateSelectData(dataType, title, val) {
    var isUpdated = false;
    var selectObj = document.all(dataType);
    var selectedIdx = selectObj.selectedIndex;
    if (selectedIdx == -1) {
        alert("未指定更新的项目，不得更新 !!");
    } else {
        if (selectObj.options[selectedIdx].value.substring(0, 5) != "=====") {
            // 更新内容
            selectObj.options[selectedIdx] = new Option(title);
            selectObj.options[selectedIdx].value = val;
            isUpdated = true;
        }
    }
    return isUpdated;
}

// 移出选择项目
function deleteSelectData(dataType) {
    var selectObj = document.all(dataType);
    var selectedIdx = selectObj.selectedIndex;
    if (selectedIdx >= 0) {
        var selectedValue = selectObj.options[selectedIdx].value;
        if (selectedValue.substring(0, 5) != "=====") selectObj.options.remove(selectedIdx);
    }
}
//== usage outside: I/O, OTHERS======end==========
/** 呼叫万年历 by Emily
/* value:目前日期栏位的值
/* dateField:日期栏位的名称
/* timeField:时间栏位的名称
/* nowDate:目前日期
/* nowTime:目前时间
**/
function getPlanDate(value, dateField, timeField, nowDate, nowTime) {
	var width=350;
	var hegiht=300;
	var bw=(screen.width-width)/2;
	
    var chkok = true;
    var getdate;    
    if(timeField=='null')
    {
    	timeField = "time";
    }
    while (chkok) {
        //getdate = window.showModalDialog(globalDataPath, "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
        getdate = window.showModalDialog(globalDataPath, "", "center:yes;dialogLeft:"+bw+"px;dialogTop:35px;dialogWidth:"+width+"px;dialogHeight:"+hegiht+"px");

        if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        }
       
        document.all(dateField).value = getdate;
        if (dateField.indexOf("goalDesireDate") > -1 ) {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("预定完成日期不得小于健康问题开始日期时间!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更换日期,则将时间设为0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("预定完成日期不得小于目标开始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = false;
		            // 如果有更换日期,则将时间设为0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("goalSetupDate") > -1) {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("目标开始日期时间不得小于健康问题开始日期时间!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更换日期,则将时间设为0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("目标开始日期时间不得小于目标开始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更换日期,则将时间设为0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField == "setupDate" ) {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("措施设立日期不得小于健康问题开始日期!!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更换日期,则将时间设为0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalDate").value);
	            if (ds < 0) {
	                alert("预定完成日期不得小于目标开始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更换日期,则将时间设为0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("intdate") ==0 ) {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("setupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及宣教开始日期不得小于健康问题开始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更换日期,则将时间设为0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField.indexOf("Alldate") ==0  ) {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("AllsetupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及宣教开始日期不得小于健康问题开始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更换日期,则将时间设为0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField == "achieveUserDate" || dateField == "userSolveDate") {
            //计算日期相差天数
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                if (dateField == "achieveUserDate") {
                    alert("达成日期不得小于健康问题开始日期!!");
                } else if (dateField == "userSolveDate") {
                    alert("健康问题解决日期时间不得小于健康问题开日期时间");
                }
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
                // 如果有更换日期,则将时间设为0000
                if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                    document.all(timeField).value = '0000';
                }
            }
        } else {    	
            chkok = onDateChange(dateField, timeField, nowDate, nowTime);
            // 如果有更换日期,则将时间设为0000
            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                document.all(timeField).value = '0000';
            }
        }
        
        //假如检查结果为false，须一并重新设定日期
        if(!chkok){
          	getdate = document.all(dateField).value
        }
    }
    return getdate;
}

// 呼叫万年历(for万芳用)
function getDate(value,selType,nowDate,nowTime, inDate, endDate){
  var width=350;
  var hegiht=300;
   var bw=(screen.width-width)/2;
    var chkok = true;
    var getdate;
    while (chkok) {
        getdate = window.showModalDialog(globalDataPath, "", "center:yes;dialogLeft:"+bw+"px;dialogTop:35px;dialogWidth:"+width+"px;dialogHeight:"+hegiht+"px");
        if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        }
        document.all(selType + '.DATE').value = getdate;
        // 若为查询则不检查
        if (selType=="SEARCHB" || selType=="SEARCHE" || selType=="SEARCH") {
            // 若为查询起始日,不得<住院日期
            if (selType == "SEARCHB" && compareDays(inDate, getdate) > 0) getdate = inDate;
            chkok = false;
        }else if(selType=="occurdate"){
			 // 伤口记录目前检核的状态
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //伤口的发生时间的检查，只需检查不可大于系统日期时间
            nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);

            // 排便时间处理完还是要还原其它时间的检核状态
            nurseTools_isCheckDate = old_nurseTools_isCheckDate;
        }else if(selType=="STOOL"){
            // 记录目前检核的状态
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //排便的测量时间的检查，只需检查不可大于系统日期时间
           // nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if(chkok){
            	getdate =nowDate;
            }
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早于住院时间('+inDate+')!');
                // 排便时间处理完还是要还原其它时间的检核状态
                nurseTools_isCheckDate = old_nurseTools_isCheckDate;
                chkok = true;
            }
        }else if(selType.indexOf("Sign")==0){
            //排便的测量时间的检查，只需检查不可大于系统日期时间
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早于医嘱生效时间('+inDate+')!');
                chkok = true;
            }
            if (!chkok && compareDays(endDate, getdate) < 0) {
                alert('不可晚于医嘱结束时间('+inDate+')!');
                chkok = true;
            }
        }else if(selType.indexOf("TRAUMA")==0){//自定义表单记录时间
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
            	alert("【日期时间】不得早于入院日期时间(" + inDate +" " + endDate +")!");
                chkok = true;
            }
            if (!chkok && compareDays(inDate, getdate) == 0) {//传的是入院时间
            	document.all(selType + '.TIME').value = endDate; 
            }
        }else{          
            if(nurseTools_isCheckDate!=1)nurseTools_isCheckDate = 0;            
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            //假如检查结果为false，须一并重新设定日期
            if(chkok){
            	getdate =nowDate;
            }
            chkok=false;
        }
    }	
    return getdate;
}

// 呼叫显示确认页面
function showData(selType) {
    var ifShow = true; 
    // 取得各填写资料内容
    if (selType == "VITALSIGN") {
        ifShow = onVitalSignSubmit();
        if (ifShow)setVitalSignConfirmValue();
    } else if (selType == "COMASCALE") {
        ifShow = onComaScaleSubmit();
        if (ifShow)setComaScaleConfirmValue();
    } else if (selType == "SPEVENT") {// 特殊事件
        ifShow = onSpecialSubmit();
        if (ifShow)setSpecialConfirmValue();
    } else if (selType == "IOutput") {
        document.all("V_INPUT").value = composeVData('INPUT');
        document.all("V_OUTPUT").value = composeVData('OUTPUT');
    } else if (selType == "INPUT" || selType == "OUTPUT") {
        document.all('V_' + selType).value = document.all(selType).value;
        document.all('V_' + selType + '.ID').value = document.all(selType + '.ID').value;
    }else if(selType=='CONSCIOUSNESS'||selType=='PHYSICALACTIVITY'){
        ifShow = onComaScaleSubmit();
        if (ifShow)setComaScaleConfirmValue();
    }else {
        setOthersConfirmValue(selType);
    }
    // 检查都通过后才disabledButton并执行submit
    if (ifShow) {
        disabledButton(ifShow);
        showDataDialog(ifShowModelDialog);
    }
}

//判断弹窗方式
function showDataDialog(ifShowModelDialog){
	if(ifShowModelDialog == '1'){
    	var rwin = window.showModalDialog($("form[name='showDataForm']").attr('action')+'?'+$("form[name='showDataForm']").serialize(), 
    			window, 'width=700,height=300,resizable=0,scrollbars=1,left=200,top=250');
    }else{
    	var rwin = window.open('', 'showDataForm', 'width=700,height=300,resizable=0,scrollbars=1,left=200,top=250');
        rwin.document.body.innerHTML = document.showDataForm.outerHTML;
        rwin.document.showDataForm.target='_self';
        rwin.document.showDataForm.submit();
    }
}

// 变更无法测量原因时处理
function changeReason(selType, selVal, secFlag) {
    // 将画面定为不可直接离开
    document.all('chkClose').value = '1';
    var tmp = '';
    // 如果为体温或脉搏,类型不输入
    if (selVal > 0 && (selType == "BT" || selType == "PULSE")) {
        document.all(selType + '.TYPE').value = '';
        deSelectRadios(document.all(selType + '.VTYPE'));
    }
    if (selType != "NECK" && selType != "WAIST" && selType.indexOf('ARM') < 0 && selType.indexOf('LEG') < 0
            && selType.indexOf('THIGH') < 0 && selType != "ANKLE"
            && selType != "BUTTOCK" && selType != "CHEST" && selType != "GIRTH" && selType != "WEIGHT"
            && selType != "HEIGHT" && selType != "HEAD"){
        document.all(selType + '_TREATMENT_DIV').style.display = 'block';
        document.all(selType + '.TREATMENT').value = '';
        if (secFlag)document.all(selType + '_TREATMENT_DIV2').style.display = 'block';
        // 如果为测不到项目,择需要显示处置
        if (selVal == 1) {
            var textval = document.all(selType + '.TREATMENT').value
            textval += '心跳及呼吸测不到，血压::___/___mmHg，意识状态:E___V___M___，瞳孔大小:___/___(+-±/+-±)，急通知:_______医师并于__:__开始施行心肺复苏术，置入气管内管__Fr.，固定___cm，予氧气(呼吸器:VC/SIMV+PS/PS/PC Mode，TV:____，rate:__次/分，FiO2:__%， PEEP:__，PC:__)，抽痰并保持呼吸道通畅，痰量多/少，___(性质)，___(颜色)，___，密切监测心电图及血压。Bosmin 1支IV st. at____，予N.S. 500cc+Dopamine 2 Amp IVF___gtt/min，心电图：VT，电击___焦耳，续行心肺复苏术。';
            //disabled护理处置栏位
            document.all(selType + '.NURS_TREAT1').disabled = true;
            document.all(selType + '.TREATMENT').value = textval;
        }else if(selVal > 0){
            document.all(selType + '_TREATMENT_DIV').style.display = 'none';
        }
    }
}

// 检查 输入的身高体重腹围资料是否错误
function checkLen(selType, msg, fm) {
    var fieldName = selType + ".VALUE1";
    var retVal = chkNum(fieldName, msg);
    // 是否显示无法测量原因项目
    if (retVal) showReasonItem(selType, 'VALUE1', fm, false);
    return retVal;
}

//选择指定的 Option 值
function selectOptionByValue(fieldName, value){
	var selectObj = document.all(fieldName);
	if(selectObj.options !=null && selectObj.options !='undefined'){
		for (var i = 0; i < selectObj.length; i ++) {
	    	if (value == selectObj.options[i].value) {
	        	selectObj.options[i].selected = true;
	        	break;
	    	}
		}
	}
}

//选择指定的 Radio 值
function selectRadioByValue(fieldName, value){
    var radioObj = document.all(fieldName);
     for (var i = 0; i < radioObj.length; i ++) {
         if (value == radioObj[i].value) {
             radioObj[i].checked=true;
            // break;
         }
     }
}

//选择指定的 Option 栏位值
function selectOptionByInnerText(fieldName, innerText){
    var selectObj = document.all(fieldName);
     for (var i = 0; i < selectObj.length; i ++) {
         if (innerText == selectObj.options[i].innerText) {
             selectObj.options[i].selected = true;
             break;
         }
     }
}

// 取得选取栏位的文字内容
function getSelectedInnerText(fieldName) {
    var selectedInnerText = '';
    var selectObj = document.all(fieldName);
    if (null != selectObj.selectedIndex) {
        selectedInnerText = selectObj[selectObj.selectedIndex].innerText;
    }
    return selectedInnerText;
}

// radio groups 全不选
function deSelectRadios(radioGroup){
    if(radioGroup!=null && radioGroup.length>0){
    	for(var i=0; i<radioGroup.length; i++){
            radioGroup[i].checked = false;
        }
    }
}

//组合VData 字串, selectField: Select 型态栏位
function composeVData(selectField){
    var selectObj = document.all(selectField);
    var vData = '';
    for (var i = 0; i < selectObj.length - 1; i++) {
        vData += "`" + selectObj.options[i].value;
    }
    return vData;
}

/*
*此 function for万芳用
*判断基准为系统时间当日10:00
*若超过此时间，只能输入当日资料
*若为此时间之前，可输入前一日资料
*/
function checkTime(fieldName, DateValue, nowDate, nowTime,inDate,inDateTime) {
    var isValid = true;
    var fieldObj = document.all(fieldName);
    // 有输入值才检查
    if (fieldObj.value != '') {
        // 如果没有输入日期资料则不检查
        if (checkTime.arguments.length == 2 && DateValue.length == 0) {
            fieldObj.value = '';
        } else {
            // 检查长度 & 是否为数值资料
            isValid = chkMinMaxLen(fieldName, 4, 4, "时间资料") && chkNum(fieldName, "时间资料");
            if (isValid) {
                // 检查是否为时间范围资料
                var fieldValue = fieldObj.value;
                var t1 = parseInt(fieldValue.substring(0, 2));
                var t2 = parseInt(fieldValue.substring(2, 4));
                // 取得日期转换为时间值
                var t3 = parseInt(nowTime.substring(0, 2));
                var t4 = parseInt(nowTime.substring(2, 4));
                if ((t1 >= 0 && t1 < 24) && (t2 >= 0 && t2 < 60)) {
                    var d1 = getDateToTime(DateValue);
                    var d2 = getDateToTime(nowDate);
                    //判断护理计划解决日期不得大于诊断开始时间
                    if (fieldName == "userSolveTime") {
                        // 取得诊断开始日期转换为时间值
                        //诊断开始日期
                        var s2 = getDateToTime(document.all("date").value);
                        //诊断开始时间
                        var sh = (document.all("time").value).substring(0, 2);
                        var sm = (document.all("time").value).substring(2, 4);
                        if (sh.substring(0, 1) == "0") sh = sh.substring(1, 2);
                        if (sm.substring(0, 1) == "0") sm = sm.substring(1, 2);
                        var st3 = parseInt(sh);
                        var st4 = parseInt(sm);

                        if ((d1 + (t1 * 60) + t2) <= (s2 + (st3 * 60) + st4)) {
                            alert("【时间资料" + DateValue + " " + fieldValue + "】不得 < 健康问题开始时间!(" + document.all("date").value + " " + document.all("time").value + ")");
                            fieldObj.value = "0000";
                            return false;
                        }
                    }
                    if (fieldName.indexOf("SEARCH") > -1 || nurseTools_isCheckDate == 1 ||fieldName == "TRAUMA.TIME") {
                    	//alert("is "+compareDays(inDate,DateValue));
                    	if(fieldName.indexOf("SEARCH") > -1){
                            return true;
                        }else if(compareDays(nowDate,DateValue)==0){
                            if(parseInt(fieldObj.value.substring(0,2),10)>parseInt(nowTime.substring(0, 2),10)){
                                   alert("【日期时间】不得大于系统日期时间(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            } else if(parseInt(fieldObj.value.substring(0,2),10)==parseInt(nowTime.substring(0, 2),10)
                                       && parseInt(fieldObj.value.substring(2),10)>parseInt(nowTime.substring(2),10)){
                                   alert("【日期时间】不得大于系统日期时间(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            }
                        }else if(fieldName.indexOf("TRAUMA") > -1 && compareDays(inDate,DateValue)>=0){//入院当天 
                        	//alert(3);
                        	if(compareDays(inDate,DateValue)==0){
                        		 if(parseInt(fieldObj.value.substring(0,2),10)<parseInt(inDateTime.substring(0, 2),10)){
                                     alert("【日期时间】不得早于入院日期时间(" + inDate +" " + inDateTime +")!");
                                     document.all("TRAUMA.DATE").value = inDate;
                                     fieldObj.value=inDateTime;
                                     return false;
     	                         } else if(parseInt(fieldObj.value.substring(0,2),10)==parseInt(inDateTime.substring(0, 2),10)
     	                                    && parseInt(fieldObj.value.substring(2),10)<parseInt(inDateTime.substring(2),10)){
     	                                alert("【日期时间】不得早于入院日期时间(" + inDate +" " + inDateTime +")!");
     	                                fieldObj.value=inDateTime;
     	                                document.all("TRAUMA.DATE").value = inDate;
     	                                return false;
     	                         }
                        	}else{
                        		 alert("【日期时间】不得早于入院日期时间(" + inDate +" " + inDateTime +")!");
                                 document.all("TRAUMA.DATE").value = inDate;
                                 fieldObj.value=inDateTime;
                                 return false;
                        	}
                        }
                       return true;
                    }else {
                        var ds = compareDays(nowDate,DateValue);                                        
                        if(ds == 0 ){
                        	//
                        	if(parseInt(fieldObj.value,10)>parseInt(nowTime,10)){
                        		alert("【日期时间】不得大于系统日期时间(" + nowDate +" " + nowTime +")!");
                        		fieldObj.value=nowTime;
                                return false;
                        	}
                        }else if(ds == 1){
                        	//检查系统时间是否为10:00之前
                        	if(parseInt(nowTime,10)<1000){
                        		return true;
                        	}else{
                        		if(fieldName.indexOf("STOOL")>-1||fieldName.indexOf("URINATION")>-1){
                        			
                        		}else{
                        		//	fieldObj.value=nowTime;
                        		}
                              //  return false;
                        	}                        	
                        }else if(ds > 1){
                            //alert("【日期时间】不得小于系统日期时间(" + nowDate +" " + nowTime +")前12小时!");
                            //fieldObj.value=(parseInt(nowTime.substring(0, 2),10))+nowTime.substring(2);
                            //return false;
                        }else{
                            alert("【日期时间】不得大于系统日期时间(" + nowDate +" " + nowTime +")!");
                            fieldObj.value = nowTime;
                            fieldObj.focus();
                            return false;
                        }
                    }
                } else {
                    alert("【时间资料】输入错误!");
                    fieldObj.value = nowTime;
                    fieldObj.focus();
                    isValid = false;
                }
            } else {
                fieldObj.value = nowTime;
                fieldObj.focus();
            }
        }
    } else {
    	fieldObj.value = nowTime;
    }
    return isValid;
}

/**
 设定是否为补输入资料
 是否需要检查日期 0:要检查 1:不检查 2:仅可<系统日一天,但不限系统时间是否<9点
 若为补输入资料,则不做检查
*/
function onChangMend(nowDate,nowTime) {
    nurseTools_isCheckDate = document.all("EVENT.MEND").checked ? 1 : 0;
    if(!document.all("EVENT.MEND").checked){
        alert("你已取消当机补输，所有日期时间将回到现在日期时间!");        
        resetDateTime(nowDate,nowTime);
    }
}

function resetDateTime(nowDate,nowTime){
    for (var i = 0; i < document.all.length; i++) {
        if (document.all(i).type == "text") {
            if((document.all(i).name.toUpperCase()).indexOf("DATE") > -1){
                document.all(i).value=nowDate;    
            }else if((document.all(i).name.toUpperCase()).indexOf("TIME") > -1){
                document.all(i).value=nowTime;    
            }
        }
    }   
}

function spTreatmentChange(dataType,selVal){
    if(selVal==99){
        document.all(dataType+'_SPECIAL_Other_DIV').style.display='block'
    }else {
        document.all(dataType+'_SPECIAL_Other_DIV').style.display='none';
        if(document.all(dataType+'_SPECIAL_TREATMENT.Other')){
            document.all(dataType+'_SPECIAL_TREATMENT.Other').value="";        
        }
    }
}

// 是否显示无法测量原因项目(类型,栏位名,FormName, 是否显示 Treatment)
function showReasonItem(type, tab, formName, showTreat) {
    var show = document.all(type + '.' + tab).value.trim() != '';
    switch (type) {
        case 'CVP':
            return;
            break;
        case 'BP':    // 如果为 BP ,则只要有一个数值输入,便不显示无法测量原因
            show = document.all('BP.VALUE1').value.trim() != '' || document.all('BP.VALUE2').value.trim() != '';
            break;
        case 'ABP':
            show = document.all('ABP.VALUE1').value.trim() != '' || document.all('ABP.VALUE2').value.trim() != '';
            break;
        case 'IABP':
            show = document.all('IABP.VALUE1').value.trim() != '' || document.all('IABP.VALUE2').value.trim() != '';
            break;
        case 'PAP':
            show = document.all('PAP.VALUE1').value.trim() != '' || document.all('PAP.VALUE2').value.trim() != '';
            break;
    }
    if (show) {
        if (type != "STOOL" && type != "URINATION" && type != "ScVO2" && type != "CPP") {
            //将已填的处置资料清除, 如果为呼吸要判断是否有勾呼吸器
            var emptyTreatment = true;
            if (type == "RESPIRATORY") emptyTreatment =getCheckedRespiratory(); //document.all("RESPIRATORY.VALUE2").value == '0';
            if (emptyTreatment && showTreat)document.all(type + '.TREATMENT').value = '';
            if (type != "SPO2")document.all(type + '.NOTATION').value = '';
        }
        if (type != "SPO2") {
            document.all(type + '_REASON_DIV').style.display = 'none';
            document.all(type + '.REASON').value = '0';
        }
    } else {
        document.all(type + '_REASON_DIV').style.display = 'block';
    }
    // 如果是BP 有可能是从 Others 输入,则有第二个项目
    if (type == "BP" && formName == "Others") {
        document.all('BP_REASON_DIV2').style.display = show ? 'none' : 'block';
    }
}

function getCheckedRespiratory(){
    var res=false;
    $("input[name='RESPIRATORY.VALUE2']").each(function(){
        if($(this).attr("checked")){
            res=true;
            return;
        }
    });
    return res;
}
/*
**此 function for万芳用
*检查输入日期
*如果系统时间< 10:00 则可以输入前一日资料
*/
function onDateChange(DateFilde,TimeFilde, nowDate, nowTime) {
    // 是否需要检查日期 0:要检查 1:不检查(不得>系统日) 2:仅可<系统日一天,但不限系统时间是否<10点
    var hh = nowTime.substring(0, 2)
    if (hh.substring(0, 1) == "0") hh = hh.substring(1, 2)
    var intHH = parseInt(hh,10);
    var compareHours= intHH-12;
    //计算日期相差天数
    var DateValue=document.all(DateFilde).value;
    var TimeValue=document.all(TimeFilde).value;
    var ds = compareDays(nowDate, DateValue);
    if (nurseTools_isCheckDate != 1){    	
        //当日
        if(ds == 0 ){
            if(parseInt(TimeValue.substring(0,2),10)>parseInt(hh,10)){
                document.all(TimeFilde).value=nowTime;
                return false;
            }       
        }
        //前一日
        else if(ds == 1){
        	//系统时间小于10:00
        	if(parseInt(nowTime,10)<checktime){
        		return false;
        	}else{
        		//重新设定日期
        		alert("系统日期时间已超过本日 "+checktime+"，不得点选前一日【日期时间】!");
        		document.all(DateFilde).value=nowDate;
        		return true;
        	}
        }
        //二日前
        else if(ds > 1){
            alert("【日期时间】不得小于系统日期时间( " + nowDate +" " + nowTime +" )二日前!");            
            return true;
        }
    }    
    if (ds < 0) {
        alert("【日期】不得大于系统日期(" + nowDate + ")!");
        return true;
    }
}


//呼叫万年历(for肿瘤疼痛用)
function getDatePain(value,selType,nowDate,nowTime, inDate, endDate){
var width=350;
var hegiht=300;
var bw=(screen.width-width)/2;
 var chkok = true;
 var getdate;
 while (chkok) {
     getdate = window.showModalDialog(globalDataPath, "", "center:yes;dialogLeft:"+bw+"px;dialogTop:35px;dialogWidth:"+width+"px;dialogHeight:"+hegiht+"px");
     if (getdate == "undefined" || getdate == null) {
         getdate = (value == null) ? '' : value;
     }
     document.all(selType + '.DATE').value = getdate;
     // 若为查询则不检查
     if (selType=="SEARCHB" || selType=="SEARCHE" || selType=="SEARCH") {
         // 若为查询起始日,不得<住院日期
         if (selType == "SEARCHB" && compareDays(inDate, getdate) > 0) getdate = inDate;
         chkok = false;
     }else if(selType=="occurdate"){
			 // 伤口记录目前检核的状态
         var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
         //伤口的发生时间的检查，只需检查不可大于系统日期时间
         nurseTools_isCheckDate = 1;
         chkok=onDateChangePain(selType + '.DATE',selType + '.TIME',nowDate,nowTime);

         // 排便时间处理完还是要还原其它时间的检核状态
         nurseTools_isCheckDate = old_nurseTools_isCheckDate;
     }else if(selType=="STOOL"){
         // 记录目前检核的状态
         var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
         //排便的测量时间的检查，只需检查不可大于系统日期时间
         nurseTools_isCheckDate = 1;
         chkok=onDateChangePain(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
         if (!chkok && compareDays(inDate, getdate) > 0) {
             alert('不可早于住院时间('+inDate+')!');
             // 排便时间处理完还是要还原其它时间的检核状态
             nurseTools_isCheckDate = old_nurseTools_isCheckDate;
             chkok = true;
         }
     }else if(selType.indexOf("Sign")==0){
         //排便的测量时间的检查，只需检查不可大于系统日期时间
         chkok=onDateChangePain(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
         if (!chkok && compareDays(inDate, getdate) > 0) {
             alert('不可早于医嘱生效时间('+inDate+')!');
             chkok = true;
         }
         if (!chkok && compareDays(endDate, getdate) < 0) {
             alert('不可晚于医嘱结束时间('+inDate+')!');
             chkok = true;
         }
     }else{          
         if(nurseTools_isCheckDate!=1)nurseTools_isCheckDate = 0;            
         chkok=onDateChangePain(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
         //假如检查结果为false，须一并重新设定日期
         if(chkok){
         	getdate =nowDate;
         }
         chkok=false;
     }
 }	
 return getdate;
}


/*
**呼叫万年历时间验证(for肿瘤疼痛用)
*/
function onDateChangePain(DateFilde,TimeFilde, nowDate, nowTime) {
    // 是否需要检查日期 0:要检查 1:不检查(不得>系统日) 2:仅可<系统日一天,但不限系统时间是否<10点
    var hh = nowTime.substring(0, 2)
    if (hh.substring(0, 1) == "0") hh = hh.substring(1, 2)
    var intHH = parseInt(hh,10);
    var compareHours= intHH-12;
    //计算日期相差天数
    var DateValue = document.all(DateFilde).value;
    var hiddenOccurTime = document.all("hiddenOccurTime").value; 
    if(hiddenOccurTime!=null && hiddenOccurTime!=""){
        var ds1 = compareDays(DateValue, hiddenOccurTime);
        if(ds1 < 0){
            alert("【日期】不得小于部位开始日期(" + hiddenOccurTime + ")!");           
            return true;
        }
    }
    var TimeValue=document.all(TimeFilde).value;
    var sysDate = CurentTime();
    var ds2 = compareDays(DateValue, sysDate);
    if (nurseTools_isCheckDate != 1){    	
        //当日
        /*if(ds2 == 0 ){
            if(parseInt(TimeValue.substring(0,2),10)>parseInt(hh,10)){
                document.all(TimeFilde).value=nowTime;
                return false;
            }
        }*/
        
    	//当日
        if(ds2 == 0 ){
            if(parseInt(TimeValue.substring(0,2),10)>parseInt(hh,10)){
                document.all(TimeFilde).value=nowTime;
                return false;
            }       
        }
        //前一日
        else if(ds2 == -1){
        	//系统时间小于10:00
        	if(parseInt(nowTime,10)<checktime){
        		return false;
        	}else{
        		//重新设定日期
        		alert("系统日期时间已超过本日 "+checktime+"，不得点选前一日【日期时间】!");
        		document.all(DateFilde).value=nowDate;
        		return true;
        	}
        }
        //二日前
        else if(ds2 < -1){
            alert("【日期时间】不得小于系统日期时间( " + nowDate +" " + nowTime +" )二日前!");            
            return true;
        }
        
        if(ds2 > 0 ){
            alert("【日期】不得大于系统日期(" + sysDate + ")!");           
            return true;
        }
    }
}

// 比较相差天数(后 - 前)
function compareDays(latter, before){
    return getDateToDays(latter) - getDateToDays(before);
}

function CurentTime() { 
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var clock = year + "/";
    if(month < 10)
        clock += "0";
    clock += month + "/";
    
    if(day < 10)
        clock += "0";
    
    clock += day;
	return clock; 
}

//Issue:5402 检查 日期时间记录是否已存在(主要在多笔输入时才会使用)
//检查 日期时间记录是否已存在(主要在多笔输入时才会使用)
//仅有一般排便/异常排便/CVP/BP/SPO2/PAIN要检查
function chkDataOnly(dataType,type,datetime,funType){
	var ok=false
	if ("CVP,BP,SPO2,PAIN".indexOf(dataType)>-1 || (type.length>0 && "REGULAR,STOOL".indexOf(type)>-1)) {
		var chkData=datetime+"|@|"+type
		var sel=eval("document.all('"+dataType+"')")
		var l=sel.length
		var cont=0
		for (var n=0;n<sel.length;n++) {
			var value=sel.options[n].value
			if(value.indexOf(chkData)>-1) {
				cont++
				if (("ADD"==funType && cont==1) || ("UPDATE"==funType && cont==2)){
					alert("!!该日期时间记录已存在!!")
					ok=true
					break
				}
			} else {
				//如果是一般排便或异常排便要户相检查,才不会造成转排便次数资料问题
				if ("REGULAR"==type || "STOOL"==type) {
					if ("REGULAR"==type) { chkData=datetime+"|@|"+"STOOL" ; }
					else { chkData=datetime+"|@|"+"REGULAR" ; }
					if(value.indexOf(chkData)>-1) {
						alert("!!该日期时间 [一般排便量] 与 [异常排便量] 记录不得同时存在!!")
						ok=true
						break
					}
				}
			}
		} //for (var n=0;n<sel.length;n++)
	}
	return ok
}

/*取得 Radio 物件的选择值*/
function getRadioValue(oRadio) {
    if (oRadio) {
        if (oRadio.length) {
            for (var i = 0; i < oRadio.length; i++) {
                if (oRadio[i].checked) return oRadio[i].value;
            }
        } else if (oRadio.checked) return oRadio.value;
    }
    return '';
}
/**标准值物件*/
function StandardValue(key, highValue1, lowValue1, highValue2, lowValue2) {
	this.key = key ;
	this.highValue1 = highValue1 ;
	this.lowValue1 = lowValue1 ;
	this.highValue2 = highValue2 ;
	this.lowValue2 = lowValue2 ;
}

/**属性值物件*/
function AttributeValue(key, name) {
	this.key = key ;
	this.name = name ;
}