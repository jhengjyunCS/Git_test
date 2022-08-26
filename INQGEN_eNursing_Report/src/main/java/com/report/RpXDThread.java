package com.report;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import javax.servlet.ServletContext;
import com.fto.log.SmartLog;
import com.fto.m2.M2Servlet;
import com.report.unit.DateUtils;


public class RpXDThread extends Thread{

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
	
	//月報表:CTHTelRecord_TOTAL
	private String[] monthReportTemplates ={"CTHServiceRecord_TOTAL.xml","CTHTelRecord_TOTAL.xml"};
	//日報表
	private String[] dayReportTemplates ={"CTHTelTrace_init.xml","CTHTelTrace_TOTAL.xml"};
	//日報表
    private String[] dayReportTemplates0 ={};


	@Override
	public void run() {
		try {
			//服務啟動時延時3分鐘，待服務初始化OK 
			this.sleep(2*60*1000);
			if(start){
				setSmartLog();
				String ymd = "";
				while(true){
					Date now = new Date();
					String yyyyMMddHHmm =DateUtils.format(now,"yyyyMMddHHmm");
					String hhmm = yyyyMMddHHmm.substring(8);
					String dd = yyyyMMddHHmm.substring(6,8);
					String today = yyyyMMddHHmm.substring(0,8);
					if(!ymd.equals(today) && dayTime.equals(hhmm)){//日報表
						slog.println("RpXDThread 日報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastDT = new Date(now.getTime()-24*60*60*1000);
							String lastDay = DateUtils.format(lastDT,"yyyyMMdd");
							HashMap map=new HashMap();
							map.put("day",lastDay);
							//map.put("day","20220310");
							String dir = M2Servlet.getInstance().getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : dayReportTemplates) {
								slog.println("RpXDThread 日報表:前一日["+lastDay+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										slog.println("RpXDThread 日報表:前一日["+lastDay+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							ymd = today;
						}catch(Exception e){
							e.printStackTrace();
							slog.println("RpXDThread 日報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
						}
					}
					if(dayTimeZero.equals(hhmm)){//日報表
						slog.println("RpXDThread 日報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastDT = new Date(now.getTime()-24*60*60*1000);
							String lastDay = DateUtils.format(lastDT,"yyyyMMdd");
							HashMap map=new HashMap();
							map.put("day",lastDay);
							String dir = M2Servlet.getInstance().getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : dayReportTemplates0) {
								slog.println("RpXDThread 日報表:前一日["+lastDay+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										slog.println("RpXDThread 日報表:前一日["+lastDay+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							
						}catch(Exception e){
							e.printStackTrace();
							slog.println("RpXDThread 日報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
						}
					}
					
					if(monthDay.equals(dd) && monthTime.equals(hhmm)){//月報表：傳入上月一號
						slog.println("RpXDThread 月報表:當前時間["+yyyyMMddHHmm+"]");
						try{
							Date lastMonth = DateUtils.processMonth(now,-1);
							String lastMonthFirst = DateUtils.format(lastMonth,"yyyyMM")+"01";
							HashMap map=new HashMap();
							map.put("day",lastMonthFirst);
							String dir = M2Servlet.getInstance().getServletContext().getRealPath("/WEB-INF/reportTemplate/")+"/";
							
							for (String template : monthReportTemplates) {
								slog.println("RpXDThread 月報表:上月首日["+lastMonthFirst+"]["+template+"]");
								ReportThread thread=new  ReportThread(map,dir+template);
								thread.run();
								if(thread.getException()!=null){
									StackTraceElement[] st=thread.getException().getStackTrace();
									for(int i=0;i<st.length;i++){
										slog.println("RpXDThread 月報表:上月首日["+lastMonthFirst+"]["+template+"][exception:"+st[i].toString()+"]");
									}
								}
							}
							
						}catch(Exception e){
							e.printStackTrace();
							slog.println("RpXDThread 月報表:當前時間["+yyyyMMddHHmm+"]Exception:"+e.getMessage());
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
	
	private SmartLog slog;
	
	private String logFile;
	
	public String getLogFile() {
		return logFile;
	}

	public void setLogFile(String logFile) {
		this.logFile = logFile;
	}

	synchronized private void setSmartLog() {
    	if(slog==null){
    		try{
    			ServletContext sc = M2Servlet.getInstance().getServletContext();
        		String path = sc.getRealPath("/WEB-INF");
                File fLog = new File(path,logFile);
                    if(! fLog.getParentFile().exists())
                        fLog.getParentFile().mkdirs();
                
                String path2 = fLog.getAbsolutePath();
                slog = new SmartLog(path2);
    		}catch(Exception e){}
    	}
    }
	
	
	
	


}
