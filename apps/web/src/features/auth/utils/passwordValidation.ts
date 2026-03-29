export type PasswordValidation = {
    isValid: boolean;
    minLength: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
};

export function validatePassword(password: string): PasswordValidation {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        isValid: minLength && hasNumber && hasSpecialChar,
        minLength,
        hasNumber,
        hasSpecialChar,
    };
}
