package com.codewithandrey.kadi.auth;

import com.codewithandrey.kadi.auth.dto.AuthResponse;
import com.codewithandrey.kadi.auth.dto.LoginRequest;
import com.codewithandrey.kadi.auth.dto.RegisterRequest;
import com.codewithandrey.kadi.auth.dto.UserDTO;
import com.codewithandrey.kadi.auth.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private final UserMapper userMapper;

    @GetMapping("me")
    public ResponseEntity<UserDTO> me(Authentication authentication) {
       User user = (User) authentication.getPrincipal();
       return ResponseEntity.ok(userMapper.toDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        String token = jwtUtil.generateToken(request.email());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
