package com.inqgen.nursing.utils;


import org.apache.poi.ss.usermodel.*;
import org.junit.Test;

import java.io.File;

public class WorkBookUtilsTest {

    @Test
    public void getStringCellValue() {
        try {
            Workbook workbook = WorkbookFactory.create(new File("E:\\RainKing\\Desktop\\1.xlsx"));
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                for (int j = sheet.getFirstRowNum(); j <= sheet.getLastRowNum(); j++) {
                    Row row = sheet.getRow(j);
                    for (int k = row.getFirstCellNum(); k < row.getLastCellNum(); k++) {
                        Cell cell = row.getCell(k);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}