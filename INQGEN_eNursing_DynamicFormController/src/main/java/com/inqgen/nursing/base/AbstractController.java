package com.inqgen.nursing.base;

import com.fto.log.SmartLog;
import com.fto.m2.controller.Controller;
import com.fto.m2.controller.UnsupportedMimeTypeException;
import com.fto.m2.module.*;
import com.fto.m2.service.org.User;
import com.fto.m2.servlet.RunData;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;

public abstract class AbstractController extends Controller {

	/**
	 * default mime type for process
	 */
	private static final String defaultMimeType = "text/html";

	/**
	 * default constructor
	 */
	public AbstractController() {
		super();
	}

	/**
	 * 提供共同的簡便方法產生 M2 forward 實體
	 *
	 * @param runData
	 * @param jspPath
	 * @return
	 */
	protected Output createForward(RunData runData, String jspPath) {
		return new Forward(runData, jspPath);
	}

	/**
	 * 提供共通的簡便方法產生 M2 Jsp頁面回應(JspComponent) 實體
	 *
	 * @param runData
	 *            JSP頁面路徑，It means Web Context Path
	 * @param invoker
	 *            invoker name, it will represent the caller's name while
	 *            exception occurrs.
	 * @return
	 * @throws UnsupportedMimeTypeException
	 */
	protected Output createStringComponent(RunData runData, String result, String invoker) throws UnsupportedMimeTypeException {
		// 取得適合的 MimeType
		String mimeType = getPreferredMimeType(runData);
		if (defaultMimeType.equals(mimeType)) {
			// 設定字元集
			String charset = runData.getDefaultCharset();
			HttpServletResponse response = runData.getResponse();
			response.setCharacterEncoding(charset);
			response.setContentType("text/html" + (charset == null ? "" : "; charset=" + charset));
			return new StringComponent(result);
		} else {
			throw new UnsupportedMimeTypeException(mimeType, invoker);
		}
	}
	/**
	 * 提供共通的簡便方法產生 M2 Jsp頁面回應(JspComponent) 實體
	 *
	 * @param runData
	 * @param path
	 *            JSP頁面路徑，It means Web Context Path
	 * @param invoker
	 *            invoker name, it will represent the caller's name while
	 *            exception occurrs.
	 * @return
	 * @throws UnsupportedMimeTypeException
	 */
	protected Output createJspComponent(RunData runData, String path, String invoker) throws UnsupportedMimeTypeException {
		// 取得適合的 MimeType
		String mimeType = getPreferredMimeType(runData);
		if (defaultMimeType.equals(mimeType)) {
			// 設定字元集
			String chset = runData.getDefaultCharset();
			HttpServletResponse response= runData.getResponse();
			response.setCharacterEncoding(chset);
			response.setContentType(defaultMimeType + (chset == null ? "" : ("; charset=" + chset)));
			return new JspComponent(runData, path);
		} else {
			throw new UnsupportedMimeTypeException(mimeType, invoker);
		}
	}

	/**
	 * 提供共同的簡便方法產生 M2 redirect 實體
	 *
	 * @param jspPath
	 * @return
	 */
	protected Output createRedirect(String jspPath) {
		return new Redirect(jspPath);
	}

	protected Output createRedirect(RunData runData, String jspPath, String invoker) throws UnsupportedMimeTypeException{
		// 取得適合的 MimeType
		String mimeType = getPreferredMimeType(runData);
		if (defaultMimeType.equals(mimeType)) {
			// 設定字元集
			String charset = runData.getDefaultCharset();
			HttpServletResponse response = runData.getResponse();
			response.setCharacterEncoding(charset);
			response.setContentType("text/html" + (charset == null ? "" : "; charset=" + charset));
			return new Redirect(jspPath);
		} else {
			throw new UnsupportedMimeTypeException(mimeType, invoker);
		}

	}

	/**
	 * 使用指定的串流陣列 以及指定的content-type，產生一個下載檔案的回應動作
	 *
	 * @param runData
	 * @param reportBytes
	 *            要給client下載的串流陣列
	 * @param contentType
	 *            下載的串流陣列的 content-type 字串
	 * @return
	 * @throws IOException
	 */
	protected Output createDownload(RunData runData, byte[] reportBytes, final String contentType) throws IOException {
		// write to response
		runData.setContentType(contentType);
		runData.getResponse().setContentType(contentType);
		runData.getResponse().setContentLength(reportBytes.length);
		OutputStream ros = runData.getResponse().getOutputStream();
		ros.write(reportBytes);
		ros.flush();
		ros.close();

		return new Download();
	}

	private String logFile = null;
	private int logLevel = 9;
	private SmartLog smartLog = null;

	/**
	 * Returns the logFile.
	 *
	 * @return String
	 */
	public String getLogFile() {
		return logFile;
	}

	/**
	 * Returns the logLevel.
	 *
	 * @return int
	 */
	public int getLogLevel() {
		return logLevel;
	}

	/**
	 * Sets the logFile.
	 *
	 * @param logFile
	 *            The logFile to set
	 */
	public void setLogFile(String logFile) {
		this.logFile = logFile;
	}

	/**
	 * Sets the logLevel.
	 *
	 * @param logLevel
	 *            The logLevel to set
	 */
	public void setLogLevel(int logLevel) {
		this.logLevel = logLevel;
	}

	/**
	 * 取得SmartLog的instance
	 *
	 * @return com.fto.log.SmartLog
	 */
	public SmartLog log() {
		if (smartLog == null) {
			if (logFile == null)
				logFile = getClass().getName().substring(getClass().getName().lastIndexOf('.') + 1) + "-{yyyy-MM-dd}.log";
			File fLog = new File(servlet().getServletContext().getRealPath("/WEB-INF"), logFile);
			if (!fLog.getParentFile().exists())
				fLog.getParentFile().mkdirs();

			smartLog = new SmartLog(fLog.getAbsolutePath());
			smartLog.setLevel(logLevel);
		}

		return smartLog;
	}


    /**
     * 判斷是否可以異動(有當機補輸權限時，只能修改/刪除自己的記錄)
     * @param d
     * @param now
     * @param updateFlag
     * @param mendFlag 當機補輸
     * @param logUser
     * @param idUser
     * @param isObsoleted
     * @return
     */
    protected boolean allowFunction(Date d, Date now, boolean updateFlag, boolean mendFlag, String logUser, String idUser, boolean isObsoleted) {
    	try {
            // 如果為已刪除注記者,則不得執行更新或刪除
            if (d == null || isObsoleted){
                return false;
            } else if(updateFlag){
                return true;
            } else if(mendFlag && logUser.equals(idUser)) {
            	return true;
    		} else if(logUser.equals(idUser)){
                java.util.Calendar c= java.util.Calendar.getInstance();
                c.setTime(now);
                c.add(java.util.Calendar.HOUR_OF_DAY,-12);
                if(d.before(c.getTime())){
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        } catch (Throwable e) {
            return false;
        }
    }

    /**
     * 取得目前登入者帳號
     * @param runData RunData
     * @return String 登入者帳號
     */
    protected User getUser(RunData runData) {
        return runData.getMemberConnection().getSelf();
    }



	/**
	 * 使用指定的串流陣列 以及指定的content-type，產生一個下載檔案的回應動作
	 *
	 * @param runData
	 * @param reportBytes
	 *            要給client下載的串流陣列
	 * @param contentType
	 *            下載的串流陣列的 content-type 字串
	 * @return
	 * @throws IOException
	 */
	protected Output createDownload(RunData runData, byte[] reportBytes, final String contentType, boolean inline, String filename) throws IOException {
		// write to response
		runData.setContentType(contentType);
		runData.getResponse().setContentType(contentType);
		runData.getResponse().setContentLength(reportBytes.length);
		if(filename != null)
			runData.getResponse().setHeader( "Content-Disposition", (inline?"inline":"attachment")+";filename="+correctFileName( filename));
		OutputStream ros = runData.getResponse().getOutputStream();
		ros.write(reportBytes);
		ros.flush();
		ros.close();

		return new Output() {
			public void doOutput(ServletContext context, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
				
			}
		};
	}
	
	private static final String FILE_CHARS="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_~$-.";
	
    /**
     * 修正檔案名稱, 因為某些檔案名稱若為中文可能會有問題
     * @return java.lang.String
     * @param filename java.lang.String
     */
    public static String correctFileName(String filename){
    	if (filename==null)
    		return null;
    	StringBuffer sb=new StringBuffer();
    	for (int i=0;i<filename.length();i++) {
    		char c=filename.charAt(i);
    		if (FILE_CHARS.indexOf(c)!=-1)
    			sb.append(c);
    		else
    			sb.append('_');
    	}
    	return sb.toString();
    }
}
