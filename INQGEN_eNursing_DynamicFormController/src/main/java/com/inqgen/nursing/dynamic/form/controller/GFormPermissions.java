/**
 * 
 */
package com.inqgen.nursing.dynamic.form.controller;

import com.fto.m2.service.auth.BasicPermissions;
import com.fto.m2.service.auth.NameAndComment;

/**
 * @author leo
 *
 */
public class GFormPermissions implements BasicPermissions {

	/** 所屬的應用程式(資源類型) */
	public static final String APP = "app_nursing";
	/** 所屬的應用程式(資源類型)中文 */
	public static final String APP_DESC = "護理作業";

	private NameAndComment RES_NC = null;

	/** 所屬的資源(instance) */
	private String resourceId = null;
	/** 所屬的資源(instance)中文 */
	private String resourceDesc = null;

	private static NameAndComment APP_NC = new NameAndComment(APP, APP_DESC);

	/** 搜尋 */
	public static final String PERM_SEARCH = "search";
	/** 搜尋(中文) */
	public static final String PERM_SEARCH_DESC = "搜尋";

	/** 當機補輸 */
	public static final String PERM_MEND = "mend";
	/** 當機補輸(中文) */
	public static final String PERM_MEND_DESC = "當機補輸";
	private static final NameAndComment[] PERMS_NC = {

		/*new NameAndComment(PERM_ADD, PERM_ADD_DESC),
		new NameAndComment(PERM_EDIT, PERM_EDIT_DESC),
		new NameAndComment(PERM_EDITOTHER, PERM_EDITOTHER_DESC),
		new NameAndComment(PERM_DELETE, PERM_DELETE_DESC),
	    new NameAndComment(PERM_DELETEOTHER, PERM_DELETEOTHER_DESC),
	    new NameAndComment(PERM_PRINT, PERM_PRINT_DESC),*/
	   	// search
	    new NameAndComment(PERM_SEARCH, PERM_SEARCH_DESC),
	   	// mend
	    new NameAndComment(PERM_MEND, PERM_MEND_DESC),
		/*// mob
		new NameAndComment(PERM_MOB, PERM_MOB_DESC),
		new NameAndComment(PERM_TOSIGN, PERM_TOSIGN_DESC)*/

 	};

	/**
	 * CareInfoPermissions 建構子註解。
	 */
	public GFormPermissions() {
		super();
	}

	/**
	 * 取得應用程式(資源類型)的名稱與中文。
	 *
	 * @return com.fto.m2.service.auth.NameAndComment。
	 */
	public NameAndComment getApp() {
		return APP_NC;
	}
	/**
	 * 取得所有權限的名稱與中文。
	 *
	 * @return com.fto.m2.service.auth.NameAndComment[]。
	 */
	public NameAndComment[] getPermissions() {
		 return PERMS_NC;
	}
	/**
	 * 取得資源(instance)的名稱與中文。
	 *
	 * @return com.fto.m2.service.auth.NameAndComment。
	 */
	public NameAndComment getRes() {
		if(RES_NC == null)
			RES_NC=new NameAndComment(resourceId, resourceDesc);
		return RES_NC;
	}

	public String getResourceId() {
		return resourceId;
	}

	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}

	public String getResourceDesc() {
		return resourceDesc;
	}

	public void setResourceDesc(String resourceDesc) {
		this.resourceDesc = resourceDesc;
	}

}
