package com.inqgen.nursing.file.dao;

import com.inqgen.nursing.file.bean.FileStore;

import java.util.Map;
import java.util.List;

public interface FileDao {

    void addFileStore(FileStore fileStore);

    List<FileStore> selectFileStore(Map<String, Object> map);

    FileStore selectFileStoreSet(Map<String, Object> map);

    List<Map<String,String>> selectFileStoreSetProps(Map<String, Object> map);

    void deleteFileStore(Map<String, Object> map);

}
