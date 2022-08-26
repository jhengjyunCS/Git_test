package com.inqgen.nursing.file.webService;

import com.inqgen.nursing.file.bean.FileStore;

import java.util.List;

public interface FileUploadService {

    /**
     * 上傳文件
     * @param fileStore
     * @return
     * @throws Exception
     */
    public FileStore upload(FileStore fileStore) throws Exception;

    /**
     * 下載文件
     * @param ids
     * @return
     * @throws Exception
     */
    public List<FileStore> download(String ids[]) throws Exception;



    public void deleteFile(String ids[])throws Exception;



}
