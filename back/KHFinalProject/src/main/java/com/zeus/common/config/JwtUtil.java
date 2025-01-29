package com.zeus.common.config;

import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.zeus.user.domain.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    @Value("${jwt.secret}") // application.properties에서 비밀키 읽기
    private String secretKey;
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 60분
    // ================== JWT 관련 ==================
    // JWT 검증 및 Claims 반환v
    public Claims validateToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public String getJwt(User user) {
        String birthDate = (user.getBirth() != null) 
            ? user.getBirth().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) 
            : "N/A"; // null일 경우 기본값 설정

        return Jwts.builder()
                .setSubject("userRegister")
                .claim("id", user.getId())
                .claim("role", "ROLE_"+user.getRole())
                .claim("provider", user.getProvider())
                .claim("phone", user.getPhone())
                .claim("gender", String.valueOf(user.getGender()))
                .claim("birth", birthDate) // 수정된 부분
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))    
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
    // JWT에서 Role 추출
    public String getRoleFromToken(String token) {
        return validateToken(token).get("role", String.class);
    }
    
    //  JWT 만료 여부 확인
    public   boolean isTokenExpired(String token) {
        Claims claims = validateToken(token);
        return claims.getExpiration().before(new Date()); // 만료 시간이 현재보다 이전이면 true 반환
    }
}
