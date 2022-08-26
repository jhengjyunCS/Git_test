/*
取得 Nurse Event 各种对照说明
function getTypeName(selVal)         取得 大分类项目说明
function getSubTypeName(selVal)      取得 子项目说明 EVENT_TYPE
function getBP_PoseName(selVal)      取得 血压 POSE 说明
function getBP_RegionName(selVal)    取得 血压 REGION 说明
function getINPUT_RegionName(selVal) 取得 输出量 REGION 说明
function getSpTreatName(selVal)      取得 特殊治疗说明(SPECIAL_TREATMENT)
function getStoolName(selVal)        取得 排便性状说明
*/

// 取得 大分类项目说明
function getTypeName(selVal)
{
	var v=""
	if (selVal=="BT") v="体温"
	if (selVal=="PULSE") v="脉搏"
	if (selVal=="RESPIRATORY") v="呼吸"
	if (selVal=="BP") v="血压"
	if (selVal=="STOOL") v="排便"
	if (selVal=="URINATION") v="排尿"
	return v
}

// 取得子项目说明 EVENT_TYPE
function getSubTypeName(selVal)
{
	var v=""
	// Vital Sign
	if (selVal=="EAR") v="耳温"
	if (selVal=="ORAL") v="口温"
	if (selVal=="AXILLARY") v="腋温"
	if (selVal=="FOREHEAD") v="额温"
	if (selVal=="RECTAL") v="肛温"
	if (selVal=="PULSE") v="脉搏"
	if (selVal=="HEART.BEAT") v="心率"
	if (selVal=="PACEMAKER") v="使用起搏器"
	if (selVal=="CONSTIPATION") v="便秘"
	if (selVal=="DIARRHOEA") v="腹泻"
	if (selVal=="STOOL.NORMAL") v="自解"
	if (selVal=="STOOL.COLOSTOMY") v="人工肛门"
    if (selVal=="STOOL.ENEMA") v="灌肠"
    if (selVal=="STOOL.ENEMAORAL") v="口服灌肠"
	if (selVal=="STOOL.DULCOLAX") v="塞剂"
	if (selVal=="STOOL.DIGITAL") v="指挖"
	if (selVal=="STOOL.INCONTINENCE")v="失禁"
	if (selVal=="SOILING") v="渗便"
	if (selVal=="NBP") v="NBP"
	if (selVal=="ABP") v="ABP"

	if (selVal=="SELF") v="自解"
	if (selVal=="INCONTINENCE") v="失禁"
	if (selVal=="TUBE") v="导尿"
	if (selVal=="CYSTOSTOMY") v="膀胱造瘘"
	if (selVal=="UCST") v="输尿管皮肤造口"
		
	// INPUT
	if (selVal=="INPUT.DRANK.SOLID")  v="饮食量_固体类　"
	if (selVal=="INPUT.DRANK.FLUID")  v="饮食量_液体(药)"
	if (selVal=="INPUT.INJECT.LVP")   v="注射量_静脉输液"
	if (selVal=="INPUT.BLOOD")        v="注射量_输血量　"
	if (selVal=="INPUT.CAPD.INPUT") v="CAPD输入量　　"
	if (selVal=="INPUT.LAVAGE")       v="灌洗入量　　　"
	// OUTPUT	
	if (selVal=="OUTPUT.URINE.SELF")          v="尿量_自解量"
	if (selVal=="OUTPUT.URINE.CATHETER")      v="尿量_导尿量"
	if (selVal=="OUTPUT.URINE.URECCHYSIS")           v="尿量_渗尿量"
	if (selVal=="OUTPUT.VOMIT")               v="呕吐量　　 "
	if (selVal=="OUTPUT.DRAINAGE")		      v="引流量"
	if (selVal=="OUTPUT.DRAINAGE.CHEST")      v="引流量_胸管"
	if (selVal=="OUTPUT.DRAINAGE.WOUND")      v="引流量_伤口"
	if (selVal=="OUTPUT.DRAINAGE.ABDOMINAL")  v="引流量_腹部"
	if (selVal=="OUTPUT.BLOOD.LOSE")          v="失血量　　 "
	if (selVal=="OUTPUT.LAVAGE")              v="灌洗出量　"
	if (selVal=="OUTPUT.CAPD.OUTPUT")         v="CAPD输出量 "
	if (selVal=="OUTPUT.REGULAR")             v="排便量 "
	if (selVal=="OUTPUT.ENTERIC.OSTOMY")      v="肠造口 "	
	if (selVal=="OUTPUT.OTHER.OSTOMY")      v="其它造口"	
	if (selVal=="OUTPUT.DRAINAGE.TAPPING")      v="放液量 "	
	
	return v
}

// 取得 血压POSE 说明
function getBP_PoseName(selVal)
{
	var v=""
	if (selVal==1) v="卧"
	if (selVal==2) v="坐"
	if (selVal==3) v="立"
	return v
}

// 取得 血压 REGION 说明
function getBP_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="左上肢"
	if (selVal==2) v="右上肢"
	if (selVal==3) v="左下肢"
	if (selVal==4) v="右下肢"
	return v
}

// 取得输出量 REGION 说明
function getINPUT_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="上"
	if (selVal==2) v="下"
	if (selVal==3) v="左"
	if (selVal==4) v="右"
	if (selVal==5) v="中间"
	if (selVal==6) v="左上"
	if (selVal==7) v="右上"
	if (selVal==8) v="左下"
	if (selVal==9) v="右下"
	return v
}

// 取得特殊治疗说明(SPECIAL_TREATMENT)
function getSpTreatName(selVal)
{
	var v=""
	if (selVal==0) v="无特殊治疗"
	if (selVal==1) v="cath"
	if (selVal==2) v="胃镜"
	if (selVal==3) v="减痛分娩"
	if (selVal==4) v="Bronchoscopy"
	if (selVal==5) v="OP"
	if (selVal==6) v="Liver biopsy"
	if (selVal==7) v="ECT"
	if (selVal==8) v="H/D"	
	if (selVal==9) v="Renal Biopsy"
	if (selVal==10) v="CT guide biopsy"
	if (selVal==11) v="TAE"
	if (selVal==12) v="Angiography"
	if (selVal==99) v="其他"			
	return v
}

// 取得排便性状说明
//function getStoolName(selVal)
//{
//	var v=""
//	if (selVal==1) v="硬便"
//	if (selVal==2) v="粪石"
//	if (selVal==3) v="水便"
//	if (selVal==4) v="糊便"
//	if (selVal==5) v="黏液便"
//	if (selVal==6) v="血便"
//	if (selVal==7) v="柏油便"
//	if (selVal==8) v="恶臭便"
//	if (selVal==9) v="松散、不成形便"
//	if (selVal==10) v="颗粒便"
//	if (selVal==11) v="条状便"
//	if (selVal==12) v="松散成形便"
//	if (selVal==13) v="泥稀便"
//	if (selVal==14) v="水、液状便"
//	if (selVal==15) v="未解便"
//	if (selVal==16) v="Colostomy"
//	if (selVal==17) v="Ileostomy"
//	if (selVal==18) v="条状成形"
//	if (selVal==19) v="软便"
//	return v
//}

// 取得 疼痛部位1 说明
function getPAIN_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="左"
	if (selVal==2) v="右"
	return v
}

// 取得 疼痛部位2 说明
function getPAIN_PoseName(selVal)
{
	var v=""
	if (selVal==1) v="上"
	if (selVal==2) v="下"
	return v
}

function get_Reason_Name(selVal){
	var v=""
	if (selVal=='1') v="测不到";
	if (selVal=='2') v="送手术";
	if (selVal=='3') v="送检查";
	if (selVal=='4') v="送治疗";
	if (selVal=='5') v="入睡中";
	if (selVal=='6') v="拒绝";
	if (selVal=='7') v="请假";
	if (selVal=='8') v="送会诊";
	if (selVal=='9') v="哭闹";
	if (selVal=='99') v="其他";	
	return v;
}
