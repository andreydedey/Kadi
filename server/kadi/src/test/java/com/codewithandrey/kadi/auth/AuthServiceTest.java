package com.codewithandrey.kadi.auth;

import com.codewithandrey.kadi.auth.dto.AuthResponse;
import com.codewithandrey.kadi.auth.dto.RegisterRequest;
import com.codewithandrey.kadi.auth.dto.UpdatePasswordRequest;
import com.codewithandrey.kadi.auth.dto.UpdateProfileRequest;
import com.codewithandrey.kadi.auth.dto.UserDTO;
import com.codewithandrey.kadi.auth.mapper.UserMapper;
import com.codewithandrey.kadi.exception.ForbiddenException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("encoded-password");

        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void currentUser_returnsUserFromSecurityContext() {
        User result = authService.currentUser();

        assertThat(result).isEqualTo(user);
    }

    @Test
    void updateProfile_updatesUsernameAndDefaultCurrency_returnsDTO() {
        UpdateProfileRequest request = new UpdateProfileRequest("newUsername", "EUR");
        UserDTO expectedDTO = new UserDTO(user.getId(), "newUsername", user.getEmail(), "EUR");
        when(userMapper.toDTO(user)).thenReturn(expectedDTO);

        UserDTO result = authService.updateProfile(request);

        assertThat(user.getUsername()).isEqualTo("newUsername");
        assertThat(user.getDefaultCurrency()).isEqualTo("EUR");
        verify(userRepository).save(user);
        assertThat(result).isEqualTo(expectedDTO);
    }

    @Test
    void updatePassword_throwsForbiddenException_whenCurrentPasswordDoesNotMatch() {
        UpdatePasswordRequest request = new UpdatePasswordRequest("wrongPassword", "newPassword");
        when(passwordEncoder.matches("wrongPassword", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> authService.updatePassword(request))
                .isInstanceOf(ForbiddenException.class)
                .hasMessage("Current password is incorrect");

        verify(userRepository, never()).save(any());
    }

    @Test
    void updatePassword_encodesAndSavesNewPassword_whenCurrentPasswordMatches() {
        UpdatePasswordRequest request = new UpdatePasswordRequest("currentPassword", "newPassword");
        when(passwordEncoder.matches("currentPassword", "encoded-password")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("new-encoded-password");

        authService.updatePassword(request);

        assertThat(user.getPassword()).isEqualTo("new-encoded-password");
        verify(userRepository).save(user);
    }

    @Test
    void register_encodesPasswordSavesUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("newuser", "new@example.com", "rawPassword");
        User newUser = new User();
        newUser.setEmail("new@example.com");
        when(userMapper.toEntity(request)).thenReturn(newUser);
        when(passwordEncoder.encode("rawPassword")).thenReturn("encoded-raw");
        when(jwtUtil.generateToken("new@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(newUser.getPassword()).isEqualTo("encoded-raw");
        verify(userRepository).save(newUser);
        assertThat(response.token()).isEqualTo("jwt-token");
    }
}
