package com.inqgen.nursing.permissions;

import com.fto.m2.M2Servlet;
import com.fto.m2.service.auth.AuthorityCheckService;
import com.fto.m2.service.auth.BasicPermissions;
import com.fto.m2.service.auth.NameAndComment;
import com.fto.m2.service.auth.ResourceManageService;
import com.fto.m2.service.org.User;
import com.fto.m2.service.security.MemberConnection;
import com.fto.m2.servlet.RunData;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

public class PermissionsUtils {
	public static Map<String,Boolean> checkPermissions(RunData runData, String permApp, String permRes, BasicPermissions basicPermissions){
		NameAndComment[]perm= basicPermissions.getPermissions();
		Map<String,Boolean> permMap=null;
		try{
			if(perm!=null && perm.length!=0){
				ResourceManageService rms = ResourceManageService.getInstance(runData.getServlet());
				permMap=new HashMap<String, Boolean>();
				String resourceId = rms.convertResNameToResId(permApp,permRes);
				MemberConnection memberConnection = runData.getMemberConnection();
				String userId = memberConnection.getUserId();
				HttpServletRequest request = runData.getRequest();
				HttpSession session = request.getSession();
				for (NameAndComment aPerm : perm) {
					try {
						String key = aPerm.getName() + "_permission";
						String sessionKey = userId + "." + resourceId + ":" + key;
						Object value = session.getAttribute(sessionKey);
						boolean isPermitted;
						if (value == null) {
							isPermitted = memberConnection.checkPermission(resourceId, aPerm.getName());
							session.setAttribute(sessionKey, isPermitted);
						} else {
							isPermitted = (Boolean) value;
						}
						request.setAttribute(key, isPermitted);
						permMap.put(aPerm.getName(), isPermitted);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}

		}catch(Exception e){
			e.printStackTrace();
		}
		return permMap;
	}

	public static Map<String,Boolean> checkPermissionsAppRes(RunData runData, String appName, String resName, String...permissions){
		try{
			Map<String,Boolean> permMap=null;
			if(permissions!=null && permissions.length!=0){
				ResourceManageService rms = ResourceManageService.getInstance(runData.getServlet());
				String resourceId= rms.convertResNameToResId(appName,resName);
				permMap=new HashMap<String, Boolean>();
				processPermission(runData, resourceId, permMap, permissions);
			}
			return permMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}

	public static Boolean checkPermissionsAppResForOnePermission(RunData runData, String appName, String resName, String permission) {

		return checkPermissionsAppRes(runData, appName, resName, permission).get(permission);
	}
	public static Map<String,Boolean> checkPermissionsAppRes(RunData runData, String appName, String resName, Map<String, String> permissionsMap) {
		Map<String, Boolean> permMap = null;
		try {
			if (permissionsMap != null && permissionsMap.size() != 0) {
				ResourceManageService rms = ResourceManageService.getInstance(runData.getServlet());
				String resourceId = rms.convertResNameToResId(appName, resName);
				permMap=checkPermissionsResourceId(runData, resourceId, permissionsMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return permMap;
	}
	public static Map<String,Boolean> checkPermissionsResourceId(RunData runData, String resourceId, Map<String, String> permissionsMap){
		try{
			Map<String,Boolean> permMap=null;
			if(permissionsMap!=null && permissionsMap.size()!=0){
				permMap=new HashMap<String, Boolean>();
				MemberConnection memberConnection = runData.getMemberConnection();
				String userId = memberConnection.getSelf().getId();
				HttpServletRequest request = runData.getRequest();
				HttpSession session = request.getSession();
				for(Map.Entry<String,String> permissions:permissionsMap.entrySet()){
					try {
						String key = permissions.getKey() + "_permission";
						Object value = session.getAttribute(userId+"."+resourceId+":"+key);
						boolean isPermitted;
						if (value == null) {
							isPermitted = memberConnection.checkPermission(resourceId, permissions.getKey());
							session.setAttribute(userId+"."+resourceId+":"+key, isPermitted);
						}else{
							isPermitted=(Boolean) value;
						}
						request.setAttribute(permissions.getValue(), isPermitted);
						permMap.put(permissions.getValue(), isPermitted);
					}catch (Exception e){
						e.printStackTrace();
					}
				}
			}
			return permMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	public static Map<String,Boolean> checkPermissionsResourceId(RunData runData, String resourceId, String...permissions){
		try{
			Map<String,Boolean> permMap=null;
			if(permissions!=null && permissions.length!=0){
				permMap=new HashMap<String, Boolean>();
				processPermission(runData, resourceId, permMap, permissions);
			}
			return permMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	public static Boolean checkPermissions(M2Servlet servlet, String appName, String resName, String userId, String...permissions){
		try{// 取得ResourceManageService的唯一instance
			ResourceManageService rms = ResourceManageService.getInstance(servlet);
			// 將Resource Name轉換為Resource ID
			String resourceId = rms.convertResNameToResId(appName, resName);
			AuthorityCheckService checkService = AuthorityCheckService.getInstance(servlet);
			for (String permission : permissions) {
				if (permission == null)
					continue;
				String key = permission + "_permission";
				String sessionKey = userId + "." + resourceId + ":" + key;
				Object value = servlet.getServletContext().getAttribute(sessionKey);
				boolean isPermitted;
				if (value == null) {
					isPermitted = checkService.checkPermission(userId,resourceId, permission);
					servlet.getServletContext().setAttribute(sessionKey, isPermitted);
				} else {
					isPermitted = (Boolean) value;
				}
				if (isPermitted)
					return true;
			}
			return false;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}

	private static void processPermission(RunData runData, String resourceId, Map<String, Boolean> permMap, String[] permissions) {
		MemberConnection memberConnection = runData.getMemberConnection();
		String userId = memberConnection.getSelf().getId();
		HttpServletRequest request = runData.getRequest();
		HttpSession session = request.getSession();
		for (String permission : permissions) {
			try {
				String key = permission + "_permission";
				String sessionKey = userId + "." + resourceId + ":" + key;
				Object value = session.getAttribute(sessionKey);
				boolean isPermitted;
				if (value == null) {
					isPermitted = memberConnection.checkPermission(resourceId, permission);
					session.setAttribute(sessionKey, isPermitted);
				} else {
					isPermitted = (Boolean) value;
				}
				request.setAttribute(key, isPermitted);
				permMap.put(permission, isPermitted);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
