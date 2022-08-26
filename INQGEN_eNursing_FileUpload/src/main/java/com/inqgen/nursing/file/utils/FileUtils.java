package com.inqgen.nursing.file.utils;

import com.inqgen.nursing.file.bean.FileStore;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import jcifs.smb.SmbFileOutputStream;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.util.FileCopyUtils;

import java.io.Closeable;

public class FileUtils {

    final static long secMax=100;
    final static long thrMax=100;
    public static void writeSmbFile(FileStore fileStore) throws Exception {
        /*set file props*/
        String rootPath = fileStore.getRootPath();
        String path = fileStore.getPath();
        SmbFile root = new SmbFile(rootPath + "/");
        SmbFile smbFile = new SmbFile(root, path + "/");
        if (!smbFile.exists()) {
            smbFile.mkdirs();
        }
        SmbFile parent=null;
        SmbFile[] firFiles = smbFile.listFiles();
        if (ArrayUtils.isEmpty(firFiles)) {
            parent = new SmbFile(smbFile, "0/0/");
            parent.mkdirs();
        }else{
            SmbFile firFile = maxNameFile(firFiles);
            SmbFile[] secFiles = firFile.listFiles();
            if (ArrayUtils.isEmpty(secFiles)) {
                parent = new SmbFile(smbFile, "0/");
                parent.mkdirs();
            }else{
                SmbFile secFile = maxNameFile(secFiles);
                SmbFile[] thrFiles = secFile.listFiles();
                if (thrFiles.length >= thrMax) {
                    if (secFiles.length>=secMax) {
                        parent=new SmbFile(smbFile, fileToNext(firFile)+"/0/");
                        parent.mkdirs();
                    }else{
                        parent=new SmbFile(firFile, fileToNext(secFile)+"/");
                        parent.mkdirs();
                    }
                }else{
                    parent = secFile;
                }
            }
        }
        fileStore.setRootPath(root.toString());
        fileStore.setPath(parent.toString().replace(root.toString(),""));
        writeSmbFile(new SmbFile(parent,fileStore.getFileName()),fileStore.getContent());
        fileStore.setContent(null);
    }

    private static SmbFile maxNameFile(SmbFile[] firFiles) {
        SmbFile maxNameFile=firFiles[0];
        for (int i = 1; i < firFiles.length; i++) {
            SmbFile file = firFiles[i];
            if (fileToNum(file) > fileToNum(maxNameFile)) {
                maxNameFile = file;
            }
        }
        return maxNameFile;
    }

    private static long fileToNext(SmbFile file) {
        return fileToNum(file)+1;
    }
    private static long fileToNum(SmbFile file) {
        String dirName = file.getName().replace("/", "");
        return NumberUtils.toLong(dirName);
    }

    public static void writeSmbFile(SmbFile file, byte[] content) throws Exception {
        SmbFileOutputStream smbFileOutputStream = new SmbFileOutputStream(file);
        FileCopyUtils.copy(content, smbFileOutputStream);
    }

    public static void readSmbFile(FileStore fileStore) throws Exception {
        byte[] content = readSmbFile(getRealPath(fileStore));
        fileStore.setContent(content);
    }

    public static String getRealPath(FileStore fileStore) {
        return fileStore.getRootPath()+fileStore.getPath()+fileStore.getFileName();
    }

    public static byte[] readSmbFile(String file) throws Exception {
        SmbFileInputStream smbFileInputStream = new SmbFileInputStream(file);
        return FileCopyUtils.copyToByteArray(smbFileInputStream);
    }

    public static void close(Closeable... streams) {
        if (streams != null) {
            for (Closeable stream : streams) {
                close(stream);
            }
        }
    }

    public static void close(Closeable stream) {
        if (stream != null) {
            try {
                stream.close();
            } catch (Exception ignore) {
            }
        }
    }
}
