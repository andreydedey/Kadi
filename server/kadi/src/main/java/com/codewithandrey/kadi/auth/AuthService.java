package com.codewithandrey.kadi.auth;

import com.codewithandrey.kadi.auth.dto.AuthResponse;
import com.codewithandrey.kadi.auth.dto.RegisterRequest;
import com.codewithandrey.kadi.auth.dto.UpdatePasswordRequest;
import com.codewithandrey.kadi.auth.dto.UpdateProfileRequest;
import com.codewithandrey.kadi.auth.dto.UserDTO;
import com.codewithandrey.kadi.auth.mapper.UserMapper;
import com.codewithandrey.kadi.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public UserDTO updateProfile(UpdateProfileRequest updateProfileRequest) {
        User user = currentUser();
        user.setUsername(updateProfileRequest.username());
        user.setDefaultCurrency(updateProfileRequest.defaultCurrency());
        userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public void updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        User user = currentUser();
        if (!passwordEncoder.matches(updatePasswordRequest.currentPassword(), user.getPassword())) {
            throw new ForbiddenException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(updatePasswordRequest.newPassword()));
        userRepository.save(user);
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        User user = userMapper.toEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(registerRequest.password()));

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}
