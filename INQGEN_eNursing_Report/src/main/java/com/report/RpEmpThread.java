package com.report;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import javax.servlet.ServletContext;
import com.report.unit.DateUtils;
import com.report.unit.SpringWebApp;


public class RpEmpThread extends Thread{

	//月報表：每月2號，跑上月的
	private String monthDay="02";
	
	//月報表：每月2號晚上2點，跑上月的
	private String monthTime="0200";
	
	//日報表:每天12點，跑前一天的
	private String dayTime="1200";
	
	//日報表:每天0點01分，跑前一天的
	private String dayTimeZero = "0001";
	
	
	//是否打開掃描開關
	private boolean start;
	
	//月報表://RP_EMP_TOTAL.xml
	private String[] monthReportTemplates ={"RP_EMP_NURSPAT_TOTAL.xml","RP_EMP_NEWPAT_TOTAL.xml","RP_EMP_NURS_TOTAL.xml","RP_EMP_NURSLEVEL_MONTH_TOTAL.xml"};
	//日報表
	private String[] dayReportTemplates ={"RP_EMP_PAT_TOTAL.xml"};
	//日報表
    private String[] dayReportTemplates0 ={"RP_EMP_NURSLEVEL_TOTAL.xml"};
	
	@Override
	public void run() {
		try {
			//服務啟動時延時3分鐘，待服務初始化OK 
			this.sleep(3*60*1000);
			if(start){
				//setSmartLog();
					while(true){
					Date now = new Date();
					String yyyyMMddHHmm =DateUtils.format(now,"yyyyMMddHHmm");
					String hhmm = yyyyMMddHHmm.substring(8);
					String dd = yyyyMMddHHmm.substring(6,8);
					if(dayTime.equals(hhmm)){//日報表
						//slog.println("RpEmpThread 日報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastDT = new Date(now.getTime()-24*60*60*1000);
							String lastDay = DateUtils.format(lastDT,"yyyyMMdd");
							HashMap map=new HashMap();
							map.put("day",lastDay);
							String dir =SpringWebApp.getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : dayReportTemplates) {
								//slog.println("RpEmpThread 日報表:前一日["+lastDay+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										//slog.println("RpEmpThread 日報表:前一日["+lastDay+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							
						}catch(Exception e){
							e.printStackTrace();
							//slog.println("RpEmpThread 日報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
						}
					}
					if(dayTimeZero.equals(hhmm)){//日報表
						//slog.println("RpEmpThread 日報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastDT = new Date(now.getTime()-24*60*60*1000);
							String lastDay = DateUtils.format(lastDT,"yyyyMMdd");
							HashMap map=new HashMap();
							map.put("day",lastDay);
							String dir =SpringWebApp.getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : dayReportTemplates0) {
								//slog.println("RpEmpThread 日報表:前一日["+lastDay+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										//slog.println("RpEmpThread 日報表:前一日["+lastDay+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							
						}catch(Exception e){
							e.printStackTrace();
							//slog.println("RpEmpThread 日報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
						}
					}
					
					if(monthDay.equals(dd) && monthTime.equals(hhmm)){//月報表：傳入上月一號
						//slog.println("RpEmpThread 月報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastMonth = DateUtils.processMonth(now,-1);
							String lastMonthFirst = DateUtils.format(lastMonth,"yyyyMM")+"01";
							HashMap map=new HashMap();
							map.put("day",lastMonthFirst);
							String dir = SpringWebApp.getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : monthReportTemplates) {
								//slog.println("RpEmpThread 月報表:上月首日["+lastMonthFirst+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										//slog.println("RpEmpThread 月報表:上月首日["+lastMonthFirst+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							
						}catch(Exception e){
							e.printStackTrace();
							//slog.println("RpEmpThread 月報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
						}
					}
					this.sleep(5*1000);
				}
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}

	public String getMonthDay() {
		return monthDay;
	}

	public void setMonthDay(String monthDay) {
		this.monthDay = monthDay;
	}

	public String getMonthTime() {
		return monthTime;
	}

	public void setMonthTime(String monthTime) {
		this.monthTime = monthTime;
	}

	public String getDayTime() {
		return dayTime;
	}

	public void setDayTime(String dayTime) {
		this.dayTime = dayTime;
	}
	
	

	public String getDayTimeZero() {
		return dayTimeZero;
	}

	public void setDayTimeZero(String dayTimeZero) {
		this.dayTimeZero = dayTimeZero;
	}

	public boolean isStart() {
		return start;
	}

	public void setStart(boolean start) {
		this.start = start;
	}
	
	private String logFile;
	
	public String getLogFile() {
		return logFile;
	}

	public void setLogFile(String logFile) {
		this.logFile = logFile;
	}

	
	
	
	


}
