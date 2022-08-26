package com.inqgen.nursing.file.utils;

import com.inqgen.nursing.file.bean.FileStore;
import org.junit.Test;

import java.util.UUID;

public class FileUtilsTest extends FileUtils{
    @Test
    public void writeFile(){
        FileStore fileStore = new FileStore();
        fileStore.setRootPath("smb://cs:1qaz2wsx@192.168.0.11/pacs");
        fileStore.setPath("fileStore");

        byte[] content=new byte[1024];
        for (int i = 0; i < content.length; i++) {
            content[i]= (byte) (Math.random()*129);
        }
        fileStore.setFileName(UUID.randomUUID().toString());
        fileStore.setContent(content);
        try {
            writeSmbFile(fileStore);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(getRealPath(fileStore));
        try {
            readSmbFile(fileStore);
            System.out.println("read file done");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Test
    public void batchWriteFile(){
        for (int i = 0; i < 202; i++) {
            writeFile();
        }
    }

    @Test
    public void test(){
        System.out.println(1L+1+"0");
    }
}