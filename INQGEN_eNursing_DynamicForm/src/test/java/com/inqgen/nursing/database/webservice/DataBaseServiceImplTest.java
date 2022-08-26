package com.inqgen.nursing.database.webservice;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.inqgen.nursing.database.webservice.bean.BaseData;
import com.inqgen.nursing.database.webservice.bean.Schema;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.junit.Test;

import java.util.*;

public class DataBaseServiceImplTest extends DataBaseServiceImpl{

    @Test
    public void convertBaseData(){
        String params = "{\n" +
                "    \"database\": [\n" +
                "        {\n" +
                "            \"schema\": \"HIS021\",\n" +
                "            \"tables\": [\n" +
                "                {\n" +
                "                    \"table\": \"PAT_ADM_CASE\",\n" +
                "                    \"where\": \"HCASENO='10504260118'\"\n" +
                "                }\n" +
                "            ]\n" +
                "        },\n" +
                "        {\n" +
                "            \"schema\": \"NIS_DP_CTH\",\n" +
                "            \"tables\": [\n" +
                "                {\n" +
                "                    \"table\": \"CICCASE\",\n" +
                "                    \"columns\": [\n" +
                "                        \"\"\n" +
                "                    ],\n" +
                "                    \"join\": [\n" +
                "                        \"PAT_ADM_CASE.HCASENO,CICCASE.PCASENO\"\n" +
                "                    ],\n" +
                "                    \"where\": \"\",\n" +
                "                    \"order\": \"CICCASE.CASESTATUS DESC\"\n" +
                "                },\n" +
                "                {\n" +
                "                    \"table\": \"CICNOTEREASON\",\n" +
                "                    \"join\": [\n" +
                "                        \"CICCASE.PHISTNUM,CICNOTEREASON.PHISTNUM\"\n" +
                "                    ],\n" +
                "                    \"where\": \"\",\n" +
                "                    \"order\": \"\"\n" +
                "                },\n" +
                "                {\n" +
                "                    \"table\": \"CICRCASE\",\n" +
                "                    \"join\": [\n" +
                "                        \"CICCASE.PCASENO,CICRCASE.PCASENO\"\n" +
                "                    ],\n" +
                "                    \"where\": \"\",\n" +
                "                    \"order\": \"\"\n" +
                "                }\n" +
                "            ]\n" +
                "        }\n" +
                "    ],\n" +
                "    \"form\": [\n" +
                "        {\n" +
                "            \"schema\": \"\",\n" +
                "            \"tables\": [\n" +
                "                {\n" +
                "                    \"table\": \"CTHNOTEAPPLY\",\n" +
                "                    \"join\": [\n" +
                "                        \"CICCASE.ID,CTHNOTEAPPLY.sourceId\"\n" +
                "                    ],\n" +
                "                    \"where\": \"STATUS='Y'\",\n" +
                "                    \"order\": \"\"\n" +
                "                }\n" +
                "            ]\n" +
                "        }\n" +
                "    ]\n" +
                "}";
        {
            Map<String, List<Schema>> baseData = JSON.parseObject(params, new TypeReference<LinkedHashMap<String, List<Schema>>>() {
            }.getType());
            System.out.println(baseData.get("database").get(0).getName());
        }
        {
            BaseData baseData = JSON.parseObject(params, BaseData.TYPE);
            System.out.println(baseData.get("database").get(0).getName());
        }
    }

    @Test
    public void test(){
        String ex;
        try {
            Integer a=0;
            System.out.println(1/a);
        } catch (Exception e) {
            ex=ExceptionUtils.getFullStackTrace(e);
            String sp = "\r\n\t";
            int exIndB = ex.indexOf(sp)+sp.length();
            int exIndE = ex.indexOf(sp,exIndB);
            String de = ex.substring(exIndB,exIndE);
            boolean error = de.matches("at\\s([^\r\n]+):\\d+\\)");
            System.out.println(de);
            System.out.println(error);
            System.out.println(ex);
        }
    }
    @Test
    public void testJson(){
        System.out.println(JSON.toJSONString(new ArrayList<Map<String,Object>>()));
    }

    @Test
    public void testMap(){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("a","a");
        map.put("b","b");
        map.put("c","c");
        map.put("d","d");
        System.out.println(JSON.toJSONString(map));
        map.put("a","c");
        map.put("b","1");
        map.put("c",null);
        map.put("d","kk");
        System.out.println(JSON.toJSONString(map));
    }

    @Test
    public void testList(){
        ArrayList<String> list = new ArrayList<String>();
        list.add("a");
        list.add("b");
        list.add("c");
        list.add("d");
        for (int i = 0; i < list.size(); i++) {
            if(list.get(i).equals("b")){
                list.remove(i--);
            }else{
                System.out.println(list.get(i));
            }
        }
    }

}


/**
 多路英文单词查找树
 */
class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
        root.wordEnd = false;
    }

    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            Character c = word.charAt(i);
            if (!node.childdren.containsKey(c)) {
                node.childdren.put(c, new TrieNode());
            }
            node = node.childdren.get(c);
        }
        node.wordEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            Character c = word.charAt(i);
            if (!node.childdren.containsKey(c)) {
                return false;
            }
            node = node.childdren.get(c);
        }
        return node.wordEnd;
    }

}

class TrieNode {
    Map<Character, TrieNode> childdren;
    boolean wordEnd;

    public TrieNode() {
        childdren = new HashMap<Character, TrieNode>();
        wordEnd = false;
    }
}

/**
 编码表
 */
class Output {
    private Integer index;
    private Character character;

    Output(Integer index, Character character) {
        this.index = index;
        this.character = character;
    }

    public Integer getIndex() {
        return index;
    }

    public Character getCharacter() {
        return character;
    }

    @Override
    public String toString() {
        return "Output{" +
                "index=" + index +
                ", character=" + character +
                '}';
    }
}

class LZencode {
    interface Encode {
        List<Output> encode(String message);
    }

    /**
     构建多路搜索树
     */
    static Trie buildTree(Set<String> keys) {
        Trie trie = new Trie();
        for (String key : keys) {
            trie.insert(key);
        }
        return trie;
    }

    public static final Encode ENCODE = new Encode() {
        public List<Output> encode(String message){
            // 构建压缩后的编码表
            List<Output> outputs = new ArrayList<Output>();
            Map<String, Integer> treeDict = new HashMap<String,Integer>();
            int mLen = message.length();
            int i = 0;

            while (i < mLen) {
                Set<String> keySet = treeDict.keySet();
                // 生成多路搜索树
                Trie trie = buildTree(keySet);
                char messageI = message.charAt(i);
                String messageIStr = String.valueOf(messageI);
                // 使用多路树进行搜索
                if (!trie.search(messageIStr)) {
                    outputs.add(new Output(0, messageI));
                    treeDict.put(messageIStr, treeDict.size() + 1);
                    i++;
                } else if (i == mLen - 1) {
                    outputs.add(new Output(treeDict.get(messageIStr), ' '));
                    i++;
                } else {
                    for (int j = i + 1; j < mLen; j++) {
                        String substring = message.substring(i, j + 1);
                        String str = message.substring(i, j);
                        // 使用多路树进行搜索
                        if (!trie.search(substring)) {
                            outputs.add(new Output(treeDict.get(str), message.charAt(j)));
                            treeDict.put(substring, treeDict.size() + 1);
                            i = j + 1;
                            break;
                        }
                        if (j == mLen - 1) {
                            outputs.add(new Output(treeDict.get(substring), ' '));
                            i = j + 1;
                        }
                    }
                }
            }
            return outputs;
        }
    } ;
}
class LZdecode {


    interface Decode {
        /**
         @param outputs 编码表
         @return 解码后的字符串
         */
        String decode(List<Output> outputs);
    }

    /**
     根据编码表进行解码
     */
    public static final Decode DECODE = new Decode() {
        @Override
        public String decode(List<Output> outputs) {
            {
                StringBuilder unpacked = new StringBuilder();
                Map<Integer, String> treeDict = new HashMap<Integer, String>();

                for (Output output : outputs) {
                    Integer index = output.getIndex();
                    Character character = output.getCharacter();
                    if (index == 0) {
                        unpacked.append(character);
                        treeDict.put(treeDict.size() + 1, character.toString());
                        continue;
                    }
                    String term = "" + treeDict.get(index) + character;
                    unpacked.append(term);
                    treeDict.put(treeDict.size() + 1, term);

                }

                return unpacked.toString();
            }
        }
    };
}

class LZpack {


    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.println("Please input text ");
        String input = scanner.nextLine();

        LZencode.Encode encode = LZencode.ENCODE;
        List<Output> outputs = encode.encode(input);
        System.out.println("input size:"+input.length());
        System.out.println("LZ78 encode result: " + outputs);
        System.out.println("LZ78 encode result.size: " + outputs.size());
        System.out.println("LZ78 decode result: " + LZdecode.DECODE.decode(outputs));
    }
}