package com.inqgen.nursing.file.dao.impl;

import com.inqgen.nursing.file.bean.FileStore;
import com.inqgen.nursing.file.dao.FileDao;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.util.List;
import java.util.Map;

public class FileDaoImpl extends SqlMapClientDaoSupport implements FileDao {

    @Override
    public void addFileStore(FileStore fileStore) {
        getSqlMapClientTemplate().insert("com.inqgen.nursing.file.dao.FileDao.addFileStore", fileStore);
    }

    @Override
    public List<FileStore> selectFileStore(Map<String, Object> map) {
        return  getSqlMapClientTemplate().queryForList("com.inqgen.nursing.file.dao.FileDao.selectFileStore",map);
    }

    @Override
    public FileStore selectFileStoreSet(Map<String, Object> map) {
        return (FileStore) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.file.dao.FileDao.selectFileStoreSet",map);
    }

    public List<Map<String,String>> selectFileStoreSetProps(Map<String, Object> map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.file.dao.FileDao.selectFileStoreSetProps",map);
    }

    @Override
    public void deleteFileStore(Map<String, Object> map) {
         getSqlMapClientTemplate().update("com.inqgen.nursing.file.dao.FileDao.deleteFileStore",map);
    }

}
