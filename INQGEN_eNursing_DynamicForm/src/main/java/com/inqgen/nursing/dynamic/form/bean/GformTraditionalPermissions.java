/**
 *
 */
package com.inqgen.nursing.dynamic.form.bean;

import com.fto.m2.service.auth.NameAndComment;

public class GformTraditionalPermissions extends GformPermissions {

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

    /** 查詢 */
    public static final String PERM_SEARCH = "search";
    /** 查詢(中文) */
    public static final String PERM_SEARCH_DESC = "查詢";
    /** 新增 */
    public static final String PERM_ADD = "add";
    /** 新增(中文) */
    public static final String PERM_ADD_DESC = "新增";
    /** 更新 */
    public static final String PERM_UPDATE = "update";
    /** 更新(中文) */
    public static final String PERM_UPDATE_DESC = "更新";
    /** 刪除 */
    public static final String PERM_DELETE = "delete";
    /** 刪除(中文) */
    public static final String PERM_DELETE_DESC = "刪除";
    /** 上傳 */
    public static final String PERM_UPLOAD = "upload";
    /** 上傳(中文) */
    public static final String PERM_UPLOAD_DESC = "上傳";
    /** 下載 */
    public static final String PERM_DOWNLOAD = "download";
    /** 下載(中文) */
    public static final String PERM_DOWNLOAD_DESC = "下載";
    /** 導入 */
    public static final String PERM_IMPORT = "import";
    /** 導入(中文) */
    public static final String PERM_IMPORT_DESC = "導入";
    /** 導出 */
    public static final String PERM_EXPORT = "export";
    /** 導出(中文) */
    public static final String PERM_EXPORT_DESC = "導出";
    /** 查詢他人 */
    public static final String PERM_SEARCH_OTHER = "search.other";
    /** 查詢他人(中文) */
    public static final String PERM_SEARCH_OTHER_DESC = "查詢他人資料";
    /** 新增他人 */
    public static final String PERM_ADD_OTHER = "add.other";
    /** 新增他人(中文) */
    public static final String PERM_ADD_OTHER_DESC = "新增他人資料";
    /** 更新他人 */
    public static final String PERM_UPDATE_OTHER = "update.other";
    /** 更新他人(中文) */
    public static final String PERM_UPDATE_OTHER_DESC = "更新他人資料";
    /** 刪除他人 */
    public static final String PERM_DELETE_OTHER = "delete.other";
    /** 刪除他人(中文) */
    public static final String PERM_DELETE_OTHER_DESC = "刪除他人資料";
    /** 上傳他人 */
    public static final String PERM_UPLOAD_OTHER = "upload.other";
    /** 上傳他人(中文) */
    public static final String PERM_UPLOAD_OTHER_DESC = "上傳他人資料";
    /** 下載他人 */
    public static final String PERM_DOWNLOAD_OTHER = "download.other";
    /** 下載他人(中文) */
    public static final String PERM_DOWNLOAD_OTHER_DESC = "下載他人資料";
    /** 導入他人 */
    public static final String PERM_IMPORT_OTHER = "import.other";
    /** 導入他人(中文) */
    public static final String PERM_IMPORT_OTHER_DESC = "導入他人資料";
    /** 導出他人 */
    public static final String PERM_EXPORT_OTHER = "export.other";
    /** 導出他人(中文) */
    public static final String PERM_EXPORT_OTHER_DESC = "導出他人資料";
    /** 取消 */
    public static final String PERM_CANCEL = "cancel";
    /** 取消(中文) */
    public static final String PERM_CANCEL_DESC = "取消";
    /** 當機補輸 */
    public static final String PERM_MEND = "mend";
    /** 當機補輸(中文) */
    public static final String PERM_MEND_DESC = "當機補輸";

    private static final NameAndComment[] PERMS_NC = {
            new NameAndComment(PERM_SEARCH, PERM_SEARCH_DESC),
            new NameAndComment(PERM_ADD, PERM_ADD_DESC),
            new NameAndComment(PERM_UPDATE, PERM_UPDATE_DESC),
            new NameAndComment(PERM_DELETE, PERM_DELETE_DESC),
            new NameAndComment(PERM_UPLOAD, PERM_UPLOAD_DESC),
            new NameAndComment(PERM_DOWNLOAD, PERM_DOWNLOAD_DESC),
            new NameAndComment(PERM_IMPORT, PERM_IMPORT_DESC),
            new NameAndComment(PERM_EXPORT, PERM_EXPORT_DESC),
            new NameAndComment(PERM_MEND, PERM_MEND_DESC),
            new NameAndComment(PERM_SEARCH_OTHER, PERM_SEARCH_OTHER_DESC),
            new NameAndComment(PERM_ADD_OTHER, PERM_ADD_OTHER_DESC),
            new NameAndComment(PERM_UPDATE_OTHER, PERM_UPDATE_OTHER_DESC),
            new NameAndComment(PERM_DELETE_OTHER, PERM_DELETE_OTHER_DESC),
            new NameAndComment(PERM_UPLOAD_OTHER, PERM_UPLOAD_OTHER_DESC),
            new NameAndComment(PERM_DOWNLOAD_OTHER, PERM_DOWNLOAD_OTHER_DESC),
            new NameAndComment(PERM_IMPORT_OTHER, PERM_IMPORT_OTHER_DESC),
            new NameAndComment(PERM_EXPORT_OTHER, PERM_EXPORT_OTHER_DESC),
            new NameAndComment(PERM_CANCEL, PERM_CANCEL_DESC),
    };

    /**
     * CareInfoPermissions 建構子註解。
     */
    public GformTraditionalPermissions() {
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
