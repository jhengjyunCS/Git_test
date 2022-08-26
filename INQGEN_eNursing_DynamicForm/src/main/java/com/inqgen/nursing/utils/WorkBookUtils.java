package com.inqgen.nursing.utils;

import com.inqgen.nursing.poi.ValueComment;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.text.NumberFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author RainKing
 * @date 2019/11/12 13:19
 */
public class WorkBookUtils {

    private static final int MAX_ROW = 1048575; //0開始

    /**
     * create workbook
     * @param excelType : 可為null，Excel版本，可為2003（.xls）或者2007（.xlsx）,默認為2003版本
     * @return org.apache.poi.ss.usermodel.Workbook
     * @author RainKing
     * @date 2019/11/6 11:39
     */
    public static Workbook createWorkbook(String excelType){
        Workbook workbook;
        /*創建文件*/
        if (excelType == null || excelType.endsWith("xls")) {
            /*操作Excel2003以前（包括2003）的版本，擴展名是.xls */
            workbook = new HSSFWorkbook();
        }else if (excelType.endsWith("xlsx")){
            /*XSSFWorkbook:是操作Excel2007以後的版本，擴展名是.xlsx */
            workbook = new XSSFWorkbook();
        }else {   //默認為2003版本
            /*操作Excel2003以前（包括2003）的版本，擴展名是.xls */
            workbook = new HSSFWorkbook();
        }
        /*Excel文件創建完畢*/
        return workbook;
    }

    /**
     * 新建Excel文件，New Workbook
     * @param sheetName 新建表單名稱
     * @param headList 表頭List集合
     * @return Sheet
     */
    public static Sheet addSheetWithHead(Workbook workbook, CreationHelper createHelper, String sheetName, Map<String,Sheet> sheetMap, List<List<ValueComment<String,String[][]>>> headList, List<CellStyle> headStyles, List<CellStyle> dataStyles,int... defaultCols){
        /*創建表單*/
        Sheet sheet = workbook.createSheet(sheetName != null ? sheetName : "new sheet");
//        Note that sheet name is Excel must not exceed 31 characters（注意sheet的名字的長度不能超過31個字符，若是超過的話，會自動截取前31個字符）
//        and must not contain any of the any of the following characters:（不能包含下列字符）
//        0x0000  0x0003  colon (:)  backslash (\)  asterisk (*)  question mark (?)  forward slash (/)  opening square bracket ([)  closing square bracket (])
//        若是包含的話，會報錯。但有一個解決此問題的方法，
//        就是調用WorkbookUtil的createSafeSheetName(String nameProposal)方法來創建sheet name,
//        若是有如上特殊字符，它會自動用空字符來替換掉，自動過濾。
//        String safeName = WorkbookUtil.createSafeSheetName("[O'Brien's sales*?]"); // returns " O'Brien's sales   "過濾掉上面出現的不合法字符
//        Sheet sheet3 = workbook.createSheet(safeName); //然後就創建成功了
        /*表單創建完畢*/

        /*設置列自動對齊*/
        for (int i =0;i<headList.get(0).size();i++){
//            sheet.autoSizeColumn(i);
            char[] chars = headList.get(0).get(i).getValue().toCharArray();
            float width=0;
            for (Character c : chars) {
                int length = c.toString().getBytes().length;
                switch (length) {
                    case 1:width+=1.5;break;
                    case 2:
                    case 3:
                    case 4:
                        width+=3.5/2*1.5;break;
                }
            }
            sheet.setColumnWidth(i, (int) (256* width +184.47));
            sheet.setDefaultColumnStyle(i,dataStyles.get(i));
        }

        /*創建行Rows及單元格Cells*/
        int colSplit, rowSplit;
        int begCol=0;
        int begRow=0;
        if (defaultCols == null || defaultCols.length == 0) {
            colSplit = 0;
            rowSplit = headList.size();
        }else{
            if (defaultCols.length > 2) {
                begCol = defaultCols[1];
                begRow = defaultCols[2];
                colSplit = begCol+defaultCols[0];
                rowSplit = begRow+headList.size();
            }else{
                colSplit = defaultCols[0];
                rowSplit = headList.size();
            }
        }
//        Drawing<?> patriarch = sheet.createDrawingPatriarch();
//        ClientAnchor anchor = patriarch.createAnchor(0, 0, 0,0, 3, 3, 5, 6);
        for (int j = 0; j < headList.size(); j++) {
            List<ValueComment<String, String[][]>> heads = headList.get(j);
            int rowInd = begRow + j;
            Row headRow = sheet.createRow(rowInd);
            for (int i = 0; i < heads.size(); i++) {
                int cellInd=i+begCol;
                Cell cell = headRow.createCell(cellInd);
                String value = heads.get(i).getValue();
                String[][] comment = heads.get(i).getComment();
                if (comment!=null&&comment.length>0) {
//                    Comment cellComment = patriarch.createCellComment(anchor);
//                    cellComment.setString(createHelper.createRichTextString(comment));
//                    cell.setCellComment(cellComment);
//                    value += "（備選值："+ Arrays.toString(comment)+"）";
                    addValidationData(workbook, sheet, comment, 2, MAX_ROW, cellInd);
                }
                cell.setCellValue(createHelper.createRichTextString(value));  //設置值
                cell.setCellStyle(headStyles.get(i));  //設置樣式
                //設定自動列寬
                sheet.autoSizeColumn(cellInd);
                sheet.setColumnWidth(cellInd,sheet.getColumnWidth(cellInd)*17/10);
            }
        }
        //固定表頭
        sheet.createFreezePane(colSplit,rowSplit);
        sheetMap.put(sheetName, sheet);
        return sheet;
    }

    public static Sheet addDataToSheet(Map<String,Sheet> sheetMap,CreationHelper createHelper, String sheetName, List<List<String>> dataList){
        Sheet sheet=sheetMap.get(sheetName);
        //當前行索引
        int rowIndex = sheet.getLastRowNum();
        if (dataList!=null&&dataList.size()>0) {
            //創建Rows
            for (List<String> rowData : dataList){ //遍曆所有數據
                Row row = sheet.createRow(++rowIndex);
                for (int j = 0;j< rowData.size();j++){  //編譯每一行
                    Cell cell = row.createCell(j);
                    cell.setCellValue(createHelper.createRichTextString(rowData.get(j)));
                    cell.setCellStyle(sheet.getColumnStyle(j));
                }
            }
            /*創建rows和cells完畢*/
        }
        return sheet;
    }

    public static CellStyle getHeadStyle(Workbook workbook) {
        //設置字體
        Font headFont = workbook.createFont();
        headFont.setFontHeightInPoints((short)14);
        headFont.setFontName("Courier New");
        headFont.setItalic(false);
        headFont.setStrikeout(false);
        //設置頭部單元格樣式
        CellStyle headStyle = workbook.createCellStyle();
        headStyle.setBorderBottom(BorderStyle.THICK);  //設置單元格線條
        headStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());   //設置單元格顏色
        headStyle.setBorderLeft(BorderStyle.THICK);
        headStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        headStyle.setBorderRight(BorderStyle.THICK);
        headStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        headStyle.setBorderTop(BorderStyle.THICK);
        headStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        headStyle.setAlignment(HorizontalAlignment.LEFT);    //設置水平對齊方式
        headStyle.setVerticalAlignment(VerticalAlignment.TOP);  //設置垂直對齊方式
//        headStyle.setShrinkToFit(true);  //自動伸縮
        headStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        headStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headStyle.setFont(headFont);  //設置字體
        return headStyle;
    }
    public static CellStyle getDataStyle(Workbook workbook) {
        /*設置數據單元格格式*/
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setBorderBottom(BorderStyle.THIN);  //設置單元格線條
        dataStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());   //設置單元格顏色
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        dataStyle.setBorderRight(BorderStyle.THIN);
        dataStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        dataStyle.setAlignment(HorizontalAlignment.LEFT);    //設置水平對齊方式
        dataStyle.setVerticalAlignment(VerticalAlignment.TOP);  //設置垂直對齊方式
        //dataStyle.setShrinkToFit(true);  //自動伸縮
        return dataStyle;
    }


    /**
     * 單元格添加下拉菜單(不限制菜單可選項個數)<br/>
     * [注意：此方法會添加隱藏的sheet，可調用getDataSheetInDropMenuBook方法獲取用戶輸入數據的未隱藏的sheet]<br/>
     * [待添加下拉菜單的單元格 -> 以下簡稱：目標單元格]
     * @param workbook work book
     * @param tarSheet 目標單元格所在的sheet
     * @param validData 下拉菜單可選項數組
     * @param firstRow 第一個目標單元格所在的行號(2)
     * @param lastRow 最後一個目標單元格所在的行(1048575)
     * @param column 待添加下拉菜單的單元格所在的列(從0開始)
     */
    public static void addValidationData(Workbook workbook, Sheet tarSheet, String[][] validData, int firstRow, int lastRow, int column)
    {
        //必須以字母開頭，最長為31位
        //excel中的"名稱"，用於標記隱藏sheet中的用作菜單下拉項的所有單元格
        Sheet hideSheet = workbook.getSheetAt(0);
        String hiddenSheetName=hideSheet.getSheetName();
        if (!workbook.isSheetHidden(0)) {
            hiddenSheetName = "hiddenSheetToValidData";
            hideSheet = workbook.createSheet(hiddenSheetName);//用於存儲 下拉菜單數據
            workbook.setSheetOrder(hiddenSheetName,0);
            //存儲下拉菜單項的sheet頁不顯示
            workbook.setSheetHidden(0, true);
        }


        //隱藏sheet中添加菜單數據
        int lastCellNum = 0;
        int prevCellNum=0;
        for (int i = 0; i < validData[0].length; i++) {
            Row row = hideSheet.getRow(i);
            if (row == null) {
                row = hideSheet.createRow(i);
            }
            if (i == 0) {
                lastCellNum = Math.max(row.getLastCellNum(),lastCellNum);
            }
            Cell cell = row.createCell(lastCellNum);
            cell.setCellValue(StringUtils.trim(validData[0][i]));
            if (validData.length > 1&&!ArrayUtils.isEmpty(validData[1])&&i>0) {
                String nameName=null;
                for (int j = i - 1; j >=0 ; j--) {
                    if (validData[1][j] != null) {
                        nameName = StringUtils.trim(validData[1][j]);
                        break;
                    }
                }
                String curNameName = StringUtils.trim(validData[1][i]);
                if (nameName!=null&&curNameName!=null&&!nameName.equals(curNameName)) {
                    Name name=workbook.getName(nameName);
                    if (name==null) {
                        name = workbook.createName();//創建"名稱"標簽，用於鏈接
                        name.setNameName(nameName);
                        String col = CellReference.convertNumToColString(lastCellNum);
                        name.setRefersToFormula(hiddenSheetName + "!$"+col+"$"+(prevCellNum+1)+":$"+col+"$" + (i-1+1));
                        prevCellNum = i;
                    }
                }
            }
        }
        String formulaId;
        if (validData.length > 1&& !ArrayUtils.isEmpty(validData[1])){
            formulaId = "INDIRECT($"+CellReference.convertNumToColString(column-1)+((hideSheet instanceof XSSFSheet?firstRow:0)+1)+")";
            String nameName = StringUtils.trim(validData[1][validData[1].length - 1]);
            Name name=workbook.getName(nameName);
            if (name==null) {
                name = workbook.createName();//創建"名稱"標簽，用於鏈接
                name.setNameName(nameName);
                String col = CellReference.convertNumToColString(lastCellNum);
                name.setRefersToFormula(hiddenSheetName + "!$"+col+"$"+(prevCellNum+1)+":$"+col+"$" + validData[0].length);
            }
        }else{
            Name name = workbook.createName();//創建"名稱"標簽，用於鏈接
            formulaId = "from" + UUID.randomUUID().toString().replace("-", "");
            name.setNameName(formulaId);
            String col = CellReference.convertNumToColString(lastCellNum);
            name.setRefersToFormula(hiddenSheetName + "!$"+col+"$1:$"+col+"$" + validData[0].length);
        }

        CellRangeAddressList cellRangeAddressList = new CellRangeAddressList(firstRow, lastRow, column, column);
        DataValidationHelper helper = tarSheet.getDataValidationHelper();
//        長度255限制
//        DataValidationConstraint constraint = helper.createExplicitListConstraint(validData);
        DataValidationConstraint constraint = helper.createFormulaListConstraint(formulaId);
        DataValidation dataValidation = helper.createValidation(constraint, cellRangeAddressList);
        dataValidation.setShowErrorBox(true);
        dataValidation.setEmptyCellAllowed(true);
        dataValidation.setShowPromptBox(true);
        dataValidation.createPromptBox("提示", "只能選擇下拉框裏面的值");
        tarSheet.addValidationData(dataValidation);
    }

    public static String getStringCellValue(Cell cell) {
        if (cell!=null) {
            return getStringCellValue(cell, cell.getCellTypeEnum());
        }
        return StringUtils.EMPTY;
    }

    private static String getStringCellValue(Cell cell, CellType cellType) {
        switch (cellType) {
            case STRING:
                return cell.getStringCellValue();
            case FORMULA:
                return getStringCellValue(cell,cell.getCachedFormulaResultTypeEnum());
            case NUMERIC:
                String format = cell.getCellStyle().getDataFormatString();
                if (DateUtil.isCellDateFormatted(cell)) {
                    Date date = cell.getDateCellValue();
                    return DateFormatUtils.format(date, toJavaDateFormat(format));
                } else {
                    NumberFormat numberFormat = NumberFormat.getNumberInstance();
                    numberFormat.setGroupingUsed(false);
                    return numberFormat.format(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return cell.getBooleanCellValue() + "";
        }
        return StringUtils.EMPTY;
    }

    public static String toJavaDateFormat(String format) {
        format = format.replaceAll("[\\\\;@]", "").replaceAll("h","H");
        Pattern compile = Pattern.compile("((h+)([^hm]+?)(m+))|((s+)([^ms]?)(m+))|((m+)([^ms]?)(s+))",Pattern.CASE_INSENSITIVE);
        Matcher matcher = compile.matcher(format);
        if (matcher.find()) {
            if (matcher.group(1) != null) {
                format = matcher.replaceAll(matcher.group(2) + matcher.group(3) + matcher.group(4).toUpperCase());
            }
            else if (matcher.group(5) != null) {
                format = matcher.replaceAll(matcher.group(6) + matcher.group(7) + matcher.group(8).toUpperCase());
            }
            else if (matcher.group(9) != null) {
                format = matcher.replaceAll(matcher.group(10).toUpperCase() + matcher.group(11) + matcher.group(12));
            }
            return format.replaceAll("m", "@").replaceAll("M","m").replaceAll("@","M");
        }else{
            return format.replaceAll("m","M");
        }
    }

}

