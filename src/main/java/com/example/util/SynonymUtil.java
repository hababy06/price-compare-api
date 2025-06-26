package com.example.util;

import java.util.Map;

public class SynonymUtil {
    private static final Map<String, String[]> SYNONYMS = Map.of(
        "鮮乳", new String[]{"鮮乳", "鮮奶", "牛奶", "牛乳"},
        "鮮奶", new String[]{"鮮乳", "鮮奶", "牛奶", "牛乳"},
        "牛奶", new String[]{"鮮乳", "鮮奶", "牛奶", "牛乳"},
        "牛乳", new String[]{"鮮乳", "鮮奶", "牛奶", "牛乳"}
    );

    public static String[] getSynonyms(String keyword) {
        return SYNONYMS.getOrDefault(keyword, new String[]{keyword});
    }
} 