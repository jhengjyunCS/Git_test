package com.report.unit;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.report.unit.sett.jsonMapping.ColumnDetail;
import com.report.unit.sett.jsonMapping.TableDetail;
import com.report.unit.sett.jsonMapping.TableNode;
import com.report.unit.sett.jsonMapping.TableRelationDto;
import com.report.unit.sett.report.*;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.naming.NoNameCoder;
import com.thoughtworks.xstream.io.xml.Xpp3Driver;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author wang
 * @Date 2021/11/15 10:41
 */
public class GenerateXmlUtils {

    private static String testJSONPath = "C:\\Users\\wang\\AppData\\Roaming\\JetBrains\\IntelliJIdea2021.2\\scratches\\test\\testJson.json";

    public static void main(String[] args) {
        List<String> xmlList = generateXml(getTestJson());
    }

    /**
     * 產生 xml
     * @param jsonStr
     */
    public static List<String> generateXml(String jsonStr) {
        List<String> xmlList = new ArrayList<String>();
        List<TableDetail> tableDetailList = null;
        JSONArray array = null;
        Object obj = JSON.parse(jsonStr);
        if (obj instanceof JSONObject) {
            array = new JSONArray();
            array.add(obj);
        } else if (obj instanceof JSONArray) {
            array = (JSONArray) obj;
        }
        if (array != null && array.size() > 0) {
            tableDetailList = array.toJavaList(TableDetail.class);
        }
        if (tableDetailList != null && tableDetailList.size() > 0) {
            for (TableDetail tableDetail : tableDetailList) {
                // 表單
                List<ColumnDetail> formDetail = tableDetail.getForm();
                // 資料表
                List<ColumnDetail> databaseDetail = tableDetail.getDatabase();
                // 表關系
                List<TableNode> tableRelationship = tableDetail.getTableRelationship();

                List<QueryData> mainQueryDatas = new ArrayList<QueryData>();
                List<QueryData> proQueryDatas = new ArrayList<QueryData>();

                if (formDetail != null && formDetail.size() > 0) {
                    for (ColumnDetail detail : formDetail) {
                        List<QueryData> queryDataList = getQueryData(detail, null);
                        proQueryDatas.addAll(queryDataList);
                    }
                }
                if (databaseDetail != null && databaseDetail.size() > 0) {
                    for (ColumnDetail detail : databaseDetail) {
                        List<QueryData> queryDataList = getQueryData(detail, tableRelationship);
                        mainQueryDatas.addAll(queryDataList);
                    }
                }

                String xml = toXml(getReportGenerator(mainQueryDatas, proQueryDatas));
                xmlList.add(xml);
            }
        }
        return xmlList;
    }

    private static List<QueryData> getQueryData(ColumnDetail columnDetail, List<TableNode> tableRelationship) {
        List<QueryData> queryDataList = new ArrayList<QueryData>();
        if (columnDetail != null) {
            if ("form".equals(columnDetail.getType())) { // 表單
                QueryData queryData = new QueryData();
                queryData.setName(columnDetail.getValue());
                queryData.setWhere("SOURCEID = :ID");

                List<Field> fields = new ArrayList<Field>();
                Field field = new Field();
                field.setName("ID");
                field.setValue("getMap(mainFile, \"ID\")");
                fields.add(field);
                queryData.setFields(fields);

                queryDataList.add(queryData);
            } else if ("schema".equals(columnDetail.getType())) {
                List<TableRelationDto> tableRelationDtos = new ArrayList<TableRelationDto>();
                if (tableRelationship != null && tableRelationship.size() > 0) {
                    for (TableNode tableRelation : tableRelationship) {
                        if (tableRelationDtos.size() > 0) {
                            boolean flag = true;
                            for (TableRelationDto relationDto : tableRelationDtos) {
                                List<TableNode> relationList = relationDto.getTableRelationList();
                                if (isTableCross(relationList, tableRelation)) {
                                    relationList.add(tableRelation);
                                    relationDto.setTableRelationList(relationList);
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                tableRelationDtos.add(new TableRelationDto(tableRelation, columnDetail.getValue()));
                            }
                        } else {
                            tableRelationDtos.add(new TableRelationDto(tableRelation, columnDetail.getValue()));
                        }
                    }
                } else {
                    List<TableNode> tableNodeList = columnDetail.getNodes();
                    if (tableNodeList != null && tableNodeList.size() > 0) {
                        for (TableNode tableNode : tableNodeList) {
                            QueryData mainQueryData = new QueryData();
                            mainQueryData.setName(tableNode.getValue());
                            mainQueryData.setDataSource(columnDetail.getValue());
                            String sql = "select " + tableNode.getThisColumns() + " from ${" + columnDetail.getValue() + "}." + tableNode.getValue();
                            mainQueryData.setSql(sql);
                            queryDataList.add(mainQueryData);
                        }
                    }
                }
                if (tableRelationDtos.size() > 0) {
                    for (TableRelationDto relationDto : tableRelationDtos) {
                        relationDto.setTableNames();
                        relationDto.setTablesByTableName(columnDetail.getNodes());
                        if (relationDto.getTables() != null && relationDto.getTables().size() > 0) {
                            String sql = relationDto.getSql();
                            String name = relationDto.getTables().get(0).getValue();

                            QueryData mainQueryData = new QueryData();
                            mainQueryData.setName(name);
                            mainQueryData.setDataSource(columnDetail.getValue());
                            mainQueryData.setSql(sql);
                            queryDataList.add(mainQueryData);
                        }
                    }
                }
            }
        }
        return queryDataList;
    }

    private static boolean isTableCross(List<TableNode> relationList, TableNode tableRelation) {
        boolean flag = false;
        if (relationList != null && relationList.size() > 0 && tableRelation != null) {
            for (TableNode tableNode : relationList) {
                if (tableNode.getTable1().equals(tableRelation.getTable1()) || tableNode.getTable1().equals(tableRelation.getTable2())
                        || tableNode.getTable2().equals(tableRelation.getTable1()) || tableNode.getTable2().equals(tableRelation.getTable2())) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    private static ReportGenerator getReportGenerator(List<QueryData> mainQueryDatas, List<QueryData> proQueryDatas) {
        ReportGenerator reportGenerator = new ReportGenerator();
        Algorithm algorithm = new Algorithm();

        MainFile mainFile = new MainFile();
        mainFile.setQueryDatas(mainQueryDatas);

        ProcessDetail processDetail = new ProcessDetail();
        processDetail.setQueryDatas(proQueryDatas);

        algorithm.setMainFile(mainFile);
        algorithm.setProcessDetails(processDetail);
        reportGenerator.setAlgorithm(algorithm);

        return reportGenerator;
    }

    private static String toXml(ReportGenerator reportGenerator) {
        String xml = null;
        if (reportGenerator != null) {
            XStream xStream = new XStream(new Xpp3Driver(new NoNameCoder()));
            xStream.processAnnotations(new Class[]{
                    com.report.unit.sett.report.ReportGenerator.class,
                    com.report.unit.sett.report.Algorithm.class,
                    com.report.unit.sett.report.Field.class,
                    com.report.unit.sett.report.Key.class,
                    com.report.unit.sett.report.MainFile.class,
                    com.report.unit.sett.report.NewData.class,
                    com.report.unit.sett.report.DeleteData.class,
                    com.report.unit.sett.report.ProcessDetail.class,
                    com.report.unit.sett.report.QueryData.class,
                    com.report.unit.sett.report.ResultTable.class,
                    com.report.unit.sett.report.UpdateData.class,
                    com.report.unit.sett.report.OutputExcel.class,
                    com.report.unit.sett.report.Column.class
            });
            xml = xStream.toXML(reportGenerator);
        }
        return xml;
    }

    private static String getTestJson() {
        FileUtils fileUtils = new FileUtils();
        String txt = null;
        try {
            txt = fileUtils.readFileToString(testJSONPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return txt;
    }

    private static String testJson(){
        return "[\n" +
                "  {\n" +
                "    \"title\": {\n" +
                "      \"pk\": \"9b530bf8-2005-3207-8cea-dcc6118ab30c\",\n" +
                "      \"ts\": \"2021/10/29 12:44:04.621\"\n" +
                "    },\n" +
                "    \"form\": [\n" +
                "      {\n" +
                "        \"text\": \"CICDCCP\",\n" +
                "        \"nodes\": [\n" +
                "          {\n" +
                "            \"text\": \"sourceId\",\n" +
                "            \"value\": \"sourceId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"formId\",\n" +
                "            \"value\": \"formId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"formVersionId\",\n" +
                "            \"value\": \"formVersionId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"evaluationTime\",\n" +
                "            \"value\": \"evaluationTime\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"status\",\n" +
                "            \"value\": \"status\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"單位主管\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"填表人\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"心理功能\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"興趣\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"理解能力\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"溝通方式\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"表達能力\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"社交能力\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"長照資源使用\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"家人互動\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"危險因子共\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"患有可能影響跌倒之疾病:骨質輸送症、中樞神經退化等疾病\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"服用影響易是活動之藥物:利尿劑、止痛劑、輕瀉劑、鎮靜安眠藥、心血管用奧、抗精神病藥物\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"診斷腦中風\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"睡眠障礙\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"視力模糊\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"頭暈、暈眩\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"下肢無力或殘障\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"認知障礙\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"肢體功能障礙(關節炎)\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"不太平衡噌師挑(例如:帕金森氏症…等)\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"近期三個月內有跌倒經驗\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"年齡大於65歲\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒高風險評估\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒後的傷害\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"因為害怕跌倒而減少活動\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"過去一年跌倒與否\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒史\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"藥物過敏\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"其他\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"泌尿系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"內分泌系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"甲狀腺功能\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"肌肉骨骼系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"神經精神系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"消化系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"呼吸系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒地點\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒原因\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"發生時間\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"跌倒次數\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"心血管系統\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疼痛\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"手術\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"醫院\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"是否有手術史\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疾病史\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"急診醫院\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"領藥醫院\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"就診醫院\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"治療醫院\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"程度\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"水腫\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"完整性\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"正常睡眠\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"睡眠\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"避免的食物或藥物\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"有無腹瀉\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"腹瀉\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"灌腸\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"塞劑\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"口服\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"便祕\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"排便\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"排便幾次\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"排便幾天\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"排便\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"輔助方式\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"排尿\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"平均每天\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"戒檳榔年\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"嚼檳榔\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"戒酒幾年\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"飲酒\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"平均每天\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"戒菸幾年\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"吸菸\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"葷素\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"飲水習慣\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"過敏食物\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"禁忌\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"最不喜歡的食物\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"最喜歡的食物\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"飲食性質\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"食慾\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"由口進食\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"途徑\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"咬合\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"牙齒\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ChewTooth1\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"咀嚼功能\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"BMI\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"體重\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"身高\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"右\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"聽力\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"右\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"視力\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"止痛方式\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疼痛相關行為\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疼痛表達方式\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"性質\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"頻率\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疼痛\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"強度\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疼痛\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"協助工具\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"量\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"性質\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"呼吸正常\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"呼吸\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"呼吸欄位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"脈搏正常\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"脈搏\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"脈搏欄位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"血壓\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"體溫\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"評估日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"案號\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"案主姓名\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"分泌物狀況\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"癌\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左右眼\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左右眼\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左右眼\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"左右眼\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"罹患日期\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"新增更新\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"皮膚狀況\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"蒼白\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"蒼白_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"乾燥\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"乾燥_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"潮紅\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"潮紅_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"黃疸\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"黃疸_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"鬆弛\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"鬆弛_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"紅腫\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"紅腫_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"腫塊\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"腫塊_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疹子\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"疹子_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"脫屑\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"脫屑_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"瘀血\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"瘀血_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"水皰\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"水皰_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"斑疹\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"斑疹_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"壓力性損傷\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"級數\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"大小\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"壓力性損傷_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"傷口\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"大小\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"受傷_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"程度\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"部位\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"水腫_group\",\n" +
                "            \"type\": \"item\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"description\": \"個案需求評估\",\n" +
                "        \"value\": \"CICDCCP\",\n" +
                "        \"type\": \"form\"\n" +
                "      },\n" +
                "      {\n" +
                "        \"text\": \"CICDCMeetingReport\",\n" +
                "        \"nodes\": [\n" +
                "          {\n" +
                "            \"text\": \"sourceId\",\n" +
                "            \"value\": \"sourceId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"formId\",\n" +
                "            \"value\": \"formId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"formVersionId\",\n" +
                "            \"value\": \"formVersionId\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"evaluationTime\",\n" +
                "            \"value\": \"evaluationTime\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"status\",\n" +
                "            \"value\": \"status\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Photo\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"結論\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL8\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"會議照片\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL6\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL7\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL2\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案角色關係型態\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL3\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案營養代謝問題建議\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL4\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案疾病及藥物使用建議\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"ItemL5\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"其他照顧注意事項\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案運動活動建議\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"職能治療師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item6\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"營養師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item7\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"藥師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item8\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"照服員\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item9\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"單位主管\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item10\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item5\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"護理師兼中心主任\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"護理師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item1\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item2\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"醫師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item3\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"社工師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Item4\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"物理治療師\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案參與中心活動觀察\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Who\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"與會人員\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Staff\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"記錄\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Sign\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"前次追蹤事項\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Follow\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"個案報告\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Report\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"主席\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Place\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"地點\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"Date\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"時間\",\n" +
                "            \"type\": \"item\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"description\": \"新增更新\",\n" +
                "            \"type\": \"item\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"description\": \"跨團隊會議記錄表\",\n" +
                "        \"value\": \"CICDCMeetingReport\",\n" +
                "        \"type\": \"form\"\n" +
                "      }\n" +
                "    ],\n" +
                "    \"database\": [\n" +
                "      {\n" +
                "        \"text\": \"CICMS\",\n" +
                "        \"nodes\": [\n" +
                "          {\n" +
                "            \"text\": \"TABLE1\",\n" +
                "            \"nodes\": [\n" +
                "              {\n" +
                "                \"text\": \"AAAAA\",\n" +
                "                \"value\": \"AAAAA\",\n" +
                "                \"type\": \"column\"\n" +
                "              },\n" +
                "              {\n" +
                "                \"text\": \"BBBBB\",\n" +
                "                \"value\": \"BBBBB\",\n" +
                "                \"type\": \"column\"\n" +
                "              }\n" +
                "            ],\n" +
                "            \"value\": \"TABLE1\",\n" +
                "            \"type\": \"table\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"TABLE2\",\n" +
                "            \"nodes\": [\n" +
                "              {\n" +
                "                \"text\": \"AAAAA\",\n" +
                "                \"value\": \"AAAAA\",\n" +
                "                \"type\": \"column\"\n" +
                "              },\n" +
                "              {\n" +
                "                \"text\": \"CCCCC\",\n" +
                "                \"value\": \"CCCCC\",\n" +
                "                \"type\": \"column\"\n" +
                "              }\n" +
                "            ],\n" +
                "            \"value\": \"TABLE2\",\n" +
                "            \"type\": \"table\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"TABLE3\",\n" +
                "            \"nodes\": [\n" +
                "              {\n" +
                "                \"text\": \"CCCCC\",\n" +
                "                \"value\": \"CCCCC\",\n" +
                "                \"type\": \"column\"\n" +
                "              },\n" +
                "              {\n" +
                "                \"text\": \"DDDDD\",\n" +
                "                \"value\": \"DDDDD\",\n" +
                "                \"type\": \"column\"\n" +
                "              }\n" +
                "            ],\n" +
                "            \"value\": \"TABLE3\",\n" +
                "            \"type\": \"table\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"TABLE4\",\n" +
                "            \"nodes\": [\n" +
                "              {\n" +
                "                \"text\": \"SSSSS\",\n" +
                "                \"value\": \"SSSSS\",\n" +
                "                \"type\": \"column\"\n" +
                "              },\n" +
                "              {\n" +
                "                \"text\": \"DDDDD\",\n" +
                "                \"value\": \"DDDDD\",\n" +
                "                \"type\": \"column\"\n" +
                "              }\n" +
                "            ],\n" +
                "            \"value\": \"TABLE4\",\n" +
                "            \"type\": \"table\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"text\": \"TABLE5\",\n" +
                "            \"nodes\": [\n" +
                "              {\n" +
                "                \"text\": \"ZZZZZ\",\n" +
                "                \"value\": \"ZZZZZ\",\n" +
                "                \"type\": \"column\"\n" +
                "              },\n" +
                "              {\n" +
                "                \"text\": \"DDDDD\",\n" +
                "                \"value\": \"DDDDD\",\n" +
                "                \"type\": \"column\"\n" +
                "              }\n" +
                "            ],\n" +
                "            \"value\": \"TABLE5\",\n" +
                "            \"type\": \"table\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"value\": \"CICMS\",\n" +
                "        \"type\": \"schema\"\n" +
                "      }\n" +
                "    ],\n" +
                "    \"tableRelationship\": [\n" +
                "      {\n" +
                "        \"column1\": \"TABLE1.AAAAA\",\n" +
                "        \"column2\": \"TABLE2.AAAAA\",\n" +
                "        \"type\": \"3\",\n" +
                "        \"typeStr\": \"一對多\"\n" +
                "      },\n" +
                "      {\n" +
                "        \"column1\": \"TABLE2.CCCCC\",\n" +
                "        \"column2\": \"TABLE3.CCCCC\",\n" +
                "        \"type\": \"3\",\n" +
                "        \"typeStr\": \"多對一\"\n" +
                "      },\n" +
                "      {\n" +
                "        \"column1\": \"TABLE4.DDDDD\",\n" +
                "        \"column2\": \"TABLE5.DDDDD\",\n" +
                "        \"type\": \"3\"\n" +
                "      }\n" +
                "    ]\n" +
                "  }\n" +
                "]";
    }

}
