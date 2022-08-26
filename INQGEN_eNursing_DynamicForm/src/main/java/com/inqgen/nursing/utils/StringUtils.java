package com.inqgen.nursing.utils;

import org.apache.ecs.xhtml.label;

import java.util.UUID;

public class StringUtils extends org.apache.commons.lang.StringUtils {
    //ldap注入
    public static String preventLdapInject(String str){
        if (isNotBlank(str)) {
            return str
                    .replace("\\", "\\5c")
                    .replace("*", "\\2a")
                    .replace("(", "\\28")
                    .replace(")", "\\29")
                    .replace("\\x00", "\\00")
                    ;
        }
        return str;
    }

    public static String generateId(){
        int hashCode = UUID.randomUUID().toString().replaceAll("-", "").hashCode();
        String lHalf = Long.toHexString(Math.abs(hashCode));
        hashCode = String.valueOf(System.currentTimeMillis()).hashCode();
        String rHalf = Long.toHexString(Math.abs(hashCode));
        String uid = UUID.randomUUID().toString().replaceAll("-", "");
        char pad = uid.charAt((int) (Math.random() * uid.length()));
        return StringUtils.leftPad(lHalf + rHalf, 16,pad ).toUpperCase();
    }
    public static String generateLabelId(String label){
        int hashCode = UUID.nameUUIDFromBytes(label.getBytes()).toString().replaceAll("-", "").hashCode();
        String lHalf = Long.toHexString(Math.abs(hashCode));
        return StringUtils.leftPad(lHalf, 9, 'L').toUpperCase();
    }
}
