package com.zeus.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zeus.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserService service;

    // 네이버 로그인 URL 반환
    @GetMapping("/naver/auth-url")
    public ResponseEntity<String> getAuthUrl() {
        return ResponseEntity.ok(service.getNaverAuthUrl());
    }

    // 네이버 콜백 처리
    @GetMapping("/naver/callback")
    public ResponseEntity<Map<String, Object>> callback(@RequestParam String code, @RequestParam String state) {
        log.info("네이버 엑세스 토큰 생성 시작");

        // Access Token 요청
        String accessToken = service.getNaverAccessToken(code, state);
        log.info("네이버 엑세스 토큰 생성 완료");

        // 사용자 정보 요청
        String userInfo = service.getNaverUserInfo(accessToken);
        String userId = null;

        // JSON 파싱을 통해 userId 추출
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(userInfo);
            JsonNode responseNode = rootNode.get("response"); // "response" 키 접근
            if (responseNode != null) {
                userId = responseNode.get("id").asText(); // "id" 값 추출
            }
        } catch (Exception e) {
            log.error("JSON 파싱 중 오류 발생:", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to parse user info"));
        }

        // JWT 생성
        String userJwt = service.getJwt(userId);
        log.info(userJwt);

        // Access Token과 사용자 정보를 JSON으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken); // 엑세스 토큰
        response.put("userInfo", userInfo); // 사용자 정보 (원래 JSON 문자열 그대로 전달)
        response.put("userJwt", userJwt); // 생성된 사용자 JWT

        return ResponseEntity.ok(response); // JSON 응답
    }

    // ============================ 카카오 로그인 추가 ============================

    // 카카오 로그인 URL 반환
    @GetMapping("/kakao/auth-url")
    public ResponseEntity<String> getKakaoAuthUrl() {
        return ResponseEntity.ok(service.getKakaoAuthUrl());
    }

    // 카카오 콜백 처리
    @GetMapping("/kakao/callback")
    public ResponseEntity<Map<String, Object>> kakaoCallback(@RequestParam String code) {
        log.info("카카오 엑세스 토큰 생성 시작");

        // Access Token 요청
        String accessToken = service.getKakaoAccessToken(code);
        log.info("카카오 엑세스 토큰 생성 완료");

        // 사용자 정보 요청
        String userInfo = service.getKakaoUserInfo(accessToken);
        String userId = null;

        // JSON 파싱을 통해 userId 추출
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(userInfo);
            JsonNode idNode = rootNode.get("id"); // "id" 키 접근
            if (idNode != null) {
                userId = idNode.asText(); // "id" 값 추출
            }
        } catch (Exception e) {
            log.error("JSON 파싱 중 오류 발생:", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to parse user info"));
        }

        // JWT 생성
        String userJwt = service.getJwt(userId);
        log.info(userJwt);

        // Access Token과 사용자 정보를 JSON으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken); // 엑세스 토큰
        response.put("userInfo", userInfo); // 사용자 정보 (원래 JSON 문자열 그대로 전달)
        response.put("userJwt", userJwt); // 생성된 사용자 JWT

        return ResponseEntity.ok(response); // JSON 응답
    }
}
