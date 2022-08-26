package com.report.unit;

import java.util.List;

import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.util.TablesNamesFinder;

public class SqlParse {
	public  List getSelectTables(String sql) throws Exception{
		try{
			Statement statement = CCJSqlParserUtil.parse(sql);
			TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
			List<String> tableList = tablesNamesFinder.getTableList(statement);
			return  tableList;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
}
