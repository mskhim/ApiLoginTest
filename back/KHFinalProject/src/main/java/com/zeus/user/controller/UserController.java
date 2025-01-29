package com.zeus.user.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zeus.common.config.JwtUtil;
import com.zeus.user.domain.User;
import com.zeus.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserService service;
    @Autowired
    private JwtUtil JwtUtil;
    
    // 네이버 로그인 URL 반환
    @PostMapping("/insert")
    public ResponseEntity<?> insert(@RequestBody User user) {
    	log.info(user+"");
        try {
        	if (user.getId() == null) {
        	    user.setId("default_id"); // 기본값 설정
        	}
        	if (user.getPwd() == null) {
        	    user.setPwd("default_password");
        	}
            boolean isInserted = service.insert(user);
            
            if (isInserted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "회원가입이 완료되었습니다."));
            } else {
                return ResponseEntity.status(400).body(Map.of("success", false, "message", "회원가입에 실패했습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "서버 오류가 발생했습니다.", "error", e.getMessage()));
        }
    }
    
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
        String provider ="naver";
        User user = new User();

     // JSON 파싱을 통해 사용자 정보를 User 객체에 매핑
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(userInfo);
            JsonNode responseNode = rootNode.get("response"); // "response" 키 접근
            if (responseNode != null) {
                // 필요한 필드 추출
                String userId = responseNode.get("id").asText(); // 유저 ID
                String email = responseNode.get("email").asText(); // 이메일
                String name = responseNode.get("name").asText(); // 이름
                String gender = responseNode.get("gender").asText(); // 성별 (M or F)
                String birthyear = responseNode.get("birthyear").asText(); // 출생년도
                String birthday = responseNode.get("birthday").asText(); // 생일 (MM-DD 형식)
                String mobile = responseNode.get("mobile").asText(); // 휴대폰 번호

                // User 객체에 값 할당
                user.setId(userId);
                user.setProvider(provider);
                user.setPhone(mobile);
                user.setGender(gender.charAt(0)); // 'M' 또는 'F'만 추출
                user.setBirth(LocalDate.parse(birthyear + "-" + birthday, DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                user.setProvider(provider);//naver provider 추가
                user.setRole(2);
                // 필요한 경우 추가적인 정보 설정
                log.info("User 정보: {}", user);
            }
        } catch (Exception e) {
            log.error("JSON 파싱 중 오류 발생:", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to parse user info"));
        }
    
        // 사용자 등록 여부 확인
        boolean isRegist = service.checkRegist(user);
        
        
        // Access Token과 사용자 정보를 JSON으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken); // 엑세스 토큰
        response.put("userInfo", userInfo); // 사용자 정보 (원래 JSON 문자열 그대로 전달)
        response.put("isRegist", isRegist); // 사용자 등록 여부 추가
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
        log.info(userInfo);
        String userId = null;
        String provider= "kakao";
        User user = new User();
     // JSON 파싱을 통해 카카오 사용자 정보 추출
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(userInfo);
            // 사용자 고유 ID 추출
            JsonNode idNode = rootNode.get("id");
            log.info("Parsed rootNode: {}", rootNode);
            if (idNode != null) {
                userId = idNode.asText();
            }

            // kakao_account에서 추가 정보 추출
            JsonNode accountNode = rootNode.get("kakao_account");
            if (accountNode != null) {
                String email = accountNode.get("email").asText("");
                String gender = accountNode.get("gender").asText("");
                String birthyear = accountNode.get("birthyear").asText("");
                String birthday = accountNode.get("birthday").asText("");

                // User 객체에 값 설정
                user.setId(userId);
                user.setProvider(provider);
                user.setPhone(accountNode.get("phone_number").asText("").replace("+82 ", "010-")); // 국제번호 제거
                user.setGender(gender.equals("male") ? 'M' : 'F'); // 성별 변환
                user.setBirth(LocalDate.parse(birthyear + "-" + birthday.substring(0, 2) + "-" + birthday.substring(2), 
                                DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                user.setRole(2);
            }
        } catch (Exception e) {
            log.error("JSON 파싱 중 오류 발생:", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to parse user info"));
        }

        // 사용자 등록 여부 확인
        
        log.info(user.getId());
        boolean isRegist = service.checkRegist(user);
        log.info(isRegist+"isRegist");
        
        // Access Token과 사용자 정보를 JSON으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken); // 엑세스 토큰
        response.put("userInfo", userInfo); // 사용자 정보 (원래 JSON 문자열 그대로 전달)
        response.put("isRegist", isRegist); // 사용자 등록 여부 추가
        return ResponseEntity.ok(response); // JSON 응답

    }
    //로그인 처리
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        // DB에서 사용자 확인
    	log.info("/login이 받는 유저아이디"+user.getId());
        User user2 = service.getUserByIdAndProvider(user);

        if (user2 == null) {
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "message", "등록되지 않은 사용자입니다. 회원가입이 필요합니다."
            ));
        }
        // JWT 생성
        String userJwt = JwtUtil.getJwt(user2);
        log.info("✅ JWT 생성 완료: {}", userJwt);

        // 응답 데이터 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그인 성공!");
        response.put("userJwt", userJwt);
        response.put("user", user2);

        return ResponseEntity.ok(response);
    }
}
