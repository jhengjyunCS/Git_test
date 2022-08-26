package com.inqgen.nursing.file.bean;


/**
 * 文件存取交換表
 */
public class FileStore {

    /**
     * 流水號
     */
    private String id ;

    /**
     * 設定檔案的ID
     */
    private String fileStoreSetId ;

    /**
     * 文件名
     */
    private String fileName ;

    /**
     * 根盤位置
     */
    private String rootPath ;

    /**
     * 相對位置
     */
    private String path ;
    /**
     * 二進制文件
     */
    private byte[] content ;
    /**
     * 狀態
     * Y：有效
     * N：無效
     */
    private String states ;
    /**
     * 系統模塊
     */
    private String sysModel ;

    /**
     * 存儲類型
     * 1:數據庫二進存取
     * 2:本地文件存取
     * 3:共享磁盤存取
     * 4:雲盤存取
     */
    private String storeType ;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileStoreSetId() {
        return fileStoreSetId;
    }

    public void setFileStoreSetId(String fileStoreSetId) {
        this.fileStoreSetId = fileStoreSetId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getRootPath() {
        return rootPath;
    }

    public void setRootPath(String rootPath) {
        this.rootPath = rootPath;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getStates() {
        return states;
    }

    public void setStates(String states) {
        this.states = states;
    }

    public String getSysModel() {
        return sysModel;
    }

    public void setSysModel(String sysModel) {
        this.sysModel = sysModel;
    }

    public String getStoreType() {
        return storeType;
    }

    public void setStoreType(String storeType) {
        this.storeType = storeType;
    }
}
