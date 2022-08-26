package com.inqgen.nursing.database.webservice.bean;

import java.util.List;

public class Node {
    public static final String TABLE = "table";
    public static final String COLUMN = "column";
    private String text;
    private String value;
    private String type;
    private String description;
    private List<Node> nodes;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }
}
