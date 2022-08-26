package com.report.unit;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.fto.util.DateTool;

public class DateUtils {

    /**
     * yyyyMMdd
     */
    public static final String FORMAT_1 = "yyyyMMdd";
    /**
     * yyyyMMddHHmm
     */
    public static final String FORMAT_2 = "yyyyMMddHHmm";
    /**
     * yyyyMMddHHmmss
     */
    public static final String FORMAT_3 = "yyyyMMddHHmmss";
    /**
     * yyyy/MM/dd
     */
    public static final String FORMAT_4 = "yyyy/MM/dd";
    /**
     * yyyy/MM/dd HH:mm
     */
    public static final String FORMAT_5 = "yyyy/MM/dd HH:mm";
    /**
     * yyyy/MM/dd HH:mm:ss
     */
    public static final String FORMAT_6 = "yyyy/MM/dd HH:mm:ss";
    /**
     * yyyy/MM/ddHHmm
     */
    public static final String FORMAT_7 = "yyyy/MM/ddHHmm";
    /**
     * yyyyMM
     */
    public static final String FORMAT_8 = "yyyyMM";
    /**
     * MM月dd日
     */
    public static final String FORMAT_9 = "MM月dd日";


    public static final String FORMAT_10 = "HHmm";
    /*
     * 因為 SQL Server 只支援查詢到 9999 年 12 月 31 號，所以不能做用 Long.MAX_VALUE
     */
    public static long MAX_SQL_DATE_LONG = Long.parseLong("253402271940000");    
    /**
     * 依格式回傳日期字串
     *
     * @param date   日期
     * @param format 格式
     * @return String 日期字串
     */
    public static String format(Date date, String format) {
        SimpleDateFormat _formatter = new SimpleDateFormat(format);
        _formatter.setLenient(false);
        return _formatter.format(date);
    }

    /**
     * 依格式將字串轉成日期
     *
     * @param date   日期字串
     * @param format 格式
     * @return Date 日期
     * @throws java.text.ParseException
     */
    public static Date parse(String date, String format) throws ParseException {
        SimpleDateFormat _formatter = new SimpleDateFormat(format);
        _formatter.setLenient(false);
        return _formatter.parse(date);
    }

    /**
     * 取得目前系統時間
     *
     * @return
     */
    public static Date getSysDate() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 取得現在系統時間的millisecond
     *
     * @return long
     */
    public static long getNowMillisecond() {
        return getSysDate().getTime();
    }

    /**
     * 轉換 long 為 Date 格式
     *
     * @param time
     * @return Date
     */
    public static Date toDate(long time) {
        return new Date(time);
    }

    /**
     * 將傳入的日期加(減)秒數後回傳日期
     *
     * @param date
     * @param sec  (can b minus value)
     * @return date = date + sec
     */
    public static Date processSec(Date date, int sec) {
        return processDate(date, Calendar.SECOND, sec);
    }

    /**
     * 將傳入的日期加(減)分鐘數後回傳日期
     *
     * @param date
     * @param min  (can b minus value)
     * @return date = date + min
     */
    public static Date processMin(Date date, int min) {
        return processDate(date, Calendar.MINUTE, min);
    }

    /**
     * 將傳入的日期加(減)小時數後回傳日期
     *
     * @param date
     * @param hour (can b minus value)
     * @return date = date + hour
     */
    public static Date processHour(Date date, int hour) {
        return processDate(date, Calendar.HOUR_OF_DAY, hour);
    }

    /**
     * 將傳入的日期加(減)天數後回傳日期
     *
     * @param date
     * @param day  (can b minus value)
     * @return date = date + day
     */
    public static Date processDate(Date date, int day) {
        return processDate(date, Calendar.DATE, day);
    }

    /**
     * 將傳入的日期加(減)月後回傳日期
     *
     * @param date
     * @param month
     * @return Date
     */
    public static Date processMonth(Date date, int month) {
        return processDate(date, Calendar.MONTH, month);
    }

    /**
     * 將傳入的日期加(減)年後回傳日期
     *
     * @param date
     * @param year
     * @return Date
     */
    public static Date processYear(Date date, int year) {
        return processDate(date, Calendar.YEAR, year);
    }

    /**
     * 加減時間
     *
     * @param date
     * @param feild
     * @param processValue
     * @return Date
     */
    private static Date processDate(Date date, int feild, int processValue) {
        Calendar _calendar = Calendar.getInstance();
        _calendar.setTime(date);
        _calendar.add(feild, processValue);
        return _calendar.getTime();
    }

    /**
     * 處理顯示的日期時間格式
     *
     * @param date     日期
     * @param withtime 是否包含時間
     * @return
     */
    public static String processViewDate(Date date, boolean withtime) {
        if (date == null) {
            return "";
        } else {
            try {
                if (withtime) {
                    return DateTool.toTaiwanFormat(date, "yyy/MM/dd HH:mm");
                } else {
                    return DateTool.toTaiwanDateFormat(date);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return "";
            }
        }
    }

    /**
     * 檢視2者是否同一個日期
     *
     * @param date1
     * @param date2
     * @return boolean
     */
    public static boolean isSameDay(Date date1, Date date2) {
        return org.apache.commons.lang.time.DateUtils.isSameDay(date1, date2);
    }

    /**
     * 檢視2個日期是否同一個年月
     *
     * @param date1
     * @param date2
     * @return boolean
     */
    public static boolean isSameMonth(Date date1, Date date2) {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(date1);
        Calendar c2 = Calendar.getInstance();
        c2.setTime(date2);
        return (c1.get(Calendar.YEAR) == c2.get(Calendar.YEAR)) && (c1.get(Calendar.MONTH) == c2.get(Calendar.MONTH));
    }

    /**
     * 計算2日期差幾年
     *
     * @param date1 before
     * @param date2 after
     * @return int 年差
     */
    public static int diffDatesByYear(Date date1, Date date2) throws ParseException {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(date1);
        Calendar c2 = Calendar.getInstance();
        c2.setTime(date2);
        int diffYears = c2.get(Calendar.YEAR) - c1.get(Calendar.YEAR);
        if (c1.get(Calendar.MONTH) > c2.get(Calendar.MONTH)) {
            diffYears -= 1;
        }
        return diffYears;
    }

    /**
     * 計算2日期差幾小時(計算至小數第一位)
     *
     * @param date1 before
     * @param date2 after
     * @return float 小時差
     */
    public static float diffDatesByHour(Date date1, Date date2) {
        float diffTime = date2.getTime() - date1.getTime();
        float diffHours = diffTime / (1000 * 60 * 60);
        /*四捨五入至小數第一位*/
        diffHours = Math.round(diffHours * 10) / 10f;
        return diffHours;
    }

    /**
     * 計算2日期差幾日
     * 注意:只計算依日期的差異天數,非精確時差
     * @param date1 before
     * @param date2 after
     * @return int 日差
     */
    public static int diffDatesByDay(Date date1, Date date2) {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(date1);
        c1.set(Calendar.HOUR_OF_DAY, 0);
        c1.set(Calendar.MINUTE, 0);
        c1.set(Calendar.MILLISECOND, 0);
        Calendar c2 = Calendar.getInstance();
        c2.setTime(date2);
        c2.set(Calendar.HOUR_OF_DAY, 23);
        c2.set(Calendar.MINUTE, 59);
        c2.set(Calendar.MILLISECOND, 59);
        long diffTime = c2.getTimeInMillis() - c1.getTimeInMillis();
        long oneDay = (1000L * 60 * 60 * 24);
        return (int) (diffTime / oneDay);
    }
    
    /**
     * 取得日期的小時數(24小時制)
     *
     * @param date 日期
     * @return int 小時數
     */
    public static int getHourOfDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * 判斷日期是否落在某時間區間
     *
     * @param date  判斷日期
     * @param start 時間區間起
     * @param end   時間區間訖
     * @return boolean
     */
    public static boolean isDateInInterval(Date date, Date start, Date end) {
        return date.compareTo(start) == 0 || date.compareTo(end) == 0 || date.after(start) && date.before(end);
    }

    /**
     * 計算兩個日期的差(By 月份)
     * @param start 啟始日
     * @param end 結束日
     * @return
     */
    public static int getDateDiffByMonth(Date start, Date end) {
        Calendar cstart = Calendar.getInstance();
        cstart.setTime(start);
        Calendar cend = Calendar.getInstance();
        cend.setTime(end);

        int year = (cend.get(Calendar.YEAR) - cstart.get(Calendar.YEAR));
        int month = (cend.get(Calendar.MONTH) - cstart.get(Calendar.MONTH));
        int day = (cend.get(Calendar.DAY_OF_MONTH) - cstart.get(Calendar.DAY_OF_MONTH));

        return year * 12 + month - (day < 0 ? 1 : 0);
    }

    public static Date setTimeOfDate(Date date, int hour24, int min, int sec) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, hour24);
        calendar.set(Calendar.MINUTE, min);
        calendar.set(Calendar.SECOND, sec);
        return calendar.getTime();
    }
}
