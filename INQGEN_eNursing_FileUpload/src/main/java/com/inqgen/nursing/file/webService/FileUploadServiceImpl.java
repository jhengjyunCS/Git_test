package com.inqgen.nursing.file.webService;

import com.inqgen.nursing.file.base.SpringWebApp;
import com.inqgen.nursing.file.bean.FileStore;
import com.inqgen.nursing.file.dao.impl.FileDaoImpl;
import com.inqgen.nursing.file.utils.FileUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class FileUploadServiceImpl implements  FileUploadService {

    @Override
    public FileStore upload(FileStore fileStore) throws Exception {
        FileDaoImpl fileDao= SpringWebApp.getObjectFromName("fileDao");
        HashMap<String ,Object> map=new HashMap<String, Object>();
        map.put("sysModel",fileStore.getSysModel());
        FileStore fileStoreSet =fileDao.selectFileStoreSet(map);
        if(fileStoreSet!=null){
            String type= fileStoreSet.getStoreType();
            fileStore.setFileStoreSetId(  fileStoreSet.getFileStoreSetId() );
            fileStore.setId(UUID.randomUUID().toString());
            /*database*/
            if("1".equals(type)){
                fileDao.addFileStore(fileStore);
            }else
            /*network share*/
            if("2".equals(type)){
                map.put("fileStoreSetId", fileStoreSet.getFileStoreSetId());
                List<Map<String, String>> attrs = fileDao.selectFileStoreSetProps(map);
                Map<String, String> prop = new HashMap<String, String>();
                for (Map<String, String> attr : attrs) {
                    String key = attr.get("attr");
                    String value = attr.get("attrValue");
                    prop.put(key, value);
                }
                fileStore.setRootPath(prop.get("rootPath"));
                fileStore.setPath(prop.get("path"));
                FileUtils.writeSmbFile(fileStore);
                fileDao.addFileStore(fileStore);
                fileStore.setRootPath(null);
                fileStore.setPath(null);
            }else if("3".equals(type)){

            }else if("4".equals(type)){

            }
        }else{
            if("1".equals(fileStore.getStoreType())){
                fileStore.setId(UUID.randomUUID().toString());
                fileStore.setFileStoreSetId(fileStore.getId());
                fileDao.addFileStore(fileStore);
            }
        }
        fileStore.setContent(null);
        return fileStore;
    }

    @Override
    public List<FileStore> download(String[] ids) throws Exception {
        FileDaoImpl fileDao= SpringWebApp.getObjectFromName("fileDao");
        HashMap<String ,Object> map=new HashMap<String, Object>();
        map.put("ids",ids);
        List<FileStore> fileStores = fileDao.selectFileStore(map);
        for (FileStore fileStore : fileStores) {
            String storeType = fileStore.getStoreType();
            /*network share*/
            if ("2".equals(storeType)) {
                FileUtils.readSmbFile(fileStore);
                fileStore.setRootPath(null);
                fileStore.setPath(null);
            }
            else
            if ("3".equals(storeType)) {

            }
        }
        return fileStores;

    }

    @Override
    public void deleteFile(String[] ids) throws Exception {
        FileDaoImpl fileDao= SpringWebApp.getObjectFromName("fileDao");
        HashMap<String ,Object> map=new HashMap<String, Object>();
        map.put("ids",ids);
        map.put("states","N");
        fileDao.deleteFileStore(map);
    }
}
