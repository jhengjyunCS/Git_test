package com.report.unit;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;

import java.io.*;

public class FileUtils {

    public  String readFileToString(String path) throws IOException {
        StringBuilder content=new StringBuilder();
        BufferedReader reader = null;
        try{
            File file = new File(path);
            reader = new BufferedReader(new FileReader(file));
            String temp;
            while((temp = reader.readLine()) != null){
                content.append(temp);
            }
        }catch(IOException e){
            throw new IOException("read content failure! PATH="+path);
        }finally{
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException ignored) {
            }
        }
        return content.toString();
    }

    public  void writeStringToFile(String path,String data) {
        if(StringUtils.isNotBlank(path)) {
            try {
                File file = new File(FilenameUtils.normalize(path));
                if (!file.exists()) {
                    file.createNewFile();
                }
                FileWriter writer = null;

                try {
                    writer = new FileWriter(file, true);
                    writer.write(data);
                } finally {
                    try {
                        if (writer != null) {
                            writer.close();
                        }
                    } catch (IOException ignored) {
                    }
                }
            }catch (IOException e){
                e.printStackTrace();
            }
        }
    }
}
