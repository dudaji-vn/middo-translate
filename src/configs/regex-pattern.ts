export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const DOMAIN_PATTERN = /^(http|https):\/\/[^ "]*$/ ;
//  9 -> 12 digits
export const PHONE_PATTERN = /^\d{9,12}$/;

// At least {num} characters
export function patternMinLength(num: number) : RegExp {
    return new RegExp(`^.{${num},}$`);
}

// At least 1 capitalize letter
export const CAPS_PATTERN = /^(?=.*[A-Z]).{1,}$/;