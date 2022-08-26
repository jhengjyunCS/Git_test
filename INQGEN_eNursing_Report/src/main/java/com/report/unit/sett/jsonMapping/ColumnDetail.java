package com.report.unit.sett.jsonMapping;

import java.util.List;

/**
 * @Author wang
 * @Date 2021/11/15 13:37
 */
public class ColumnDetail {

    public String text;

    public List<TableNode> nodes;

    public String description;

    public String value;

    public String type;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<TableNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<TableNode> nodes) {
        this.nodes = nodes;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
